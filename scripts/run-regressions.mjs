// Run every independent check, then fail the job if any check failed.
// A first failure must not hide the remaining diagnostics.
import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
const files=['jasar-regression','reverential-caps-regression','tehilim-artscroll-five','tehilim-reviewed-regression','artscroll-app-sheva','artscroll-app-second-batch','artscroll-app-third-batch','artscroll-second-review','nakdan-workflow'];
const results=files.map(name=>{const file='tests/'+name+'.mjs';const run=spawnSync(process.execPath,[file],{encoding:'utf8',timeout:120000});process.stdout.write(run.stdout||'');process.stderr.write(run.stderr||'');if(run.error)console.error(run.error.message);return {file,passed:run.status===0,exitCode:run.status};});
fs.mkdirSync('audit-results',{recursive:true});fs.writeFileSync('audit-results/regressions.json',JSON.stringify(results,null,2)+'\n');
console.log('REGRESSIONS '+results.filter(r=>r.passed).length+'/'+results.length+' passed');
if(results.some(r=>!r.passed))process.exitCode=1;
