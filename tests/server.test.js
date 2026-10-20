import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';

const temp=await mkdtemp(path.join(os.tmpdir(),'streambay-test-'));
const port=31000+Math.floor(Math.random()*10000);
const child=spawn(process.execPath,['server.js'],{cwd:new URL('..',import.meta.url),env:{...process.env,PORT:String(port),SESSION_SECRET:'test-secret-long-random-string',DATA_DIR:temp},stdio:'ignore'});
const base=`http://127.0.0.1:${port}`;
async function waitServer(){for(let i=0;i<60;i++){try{const r=await fetch(base+'/api/health');if(r.ok)return}catch{}await delay(100)}throw new Error('Server did not start')}
async function call(p,options={}){return fetch(base+p,options)}
test('health, registration, login and channel subscription routes work',async t=>{t.after(async()=>{child.kill('SIGTERM');await Promise.race([once(child,'exit'),delay(1000)]);await rm(temp,{recursive:true,force:true})});await waitServer();let r=await call('/api/health');assert.equal(r.status,200);assert.equal((await r.json()).ok,true);
r=await call('/api/auth/register',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({name:'Avery Creator',handle:'averycreator',email:'avery@example.com',password:'correct-horse-battery'})});assert.equal(r.status,201);const a=await r.json();assert.ok(a.token);assert.equal(a.user.handle,'averycreator');
r=await call('/api/auth/login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({login:'avery@example.com',password:'correct-horse-battery'})});assert.equal(r.status,200);const b=await r.json();assert.ok(b.token);
r=await call('/api/auth/login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({login:'avery@example.com',password:'wrong-password'})});assert.equal(r.status,401);
r=await call('/api/me',{headers:{authorization:'Bearer '+a.token}});assert.equal(r.status,200);
r=await call('/api/videos');assert.equal(r.status,200);assert.deepEqual((await r.json()).videos,[]);
});
