import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {extractEngine} from '../scripts/extract-engine.mjs';
const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const source=extractEngine(html);
function harness(){
  const nodes=new Map(),events=new Map(),requests=[];
  const el=id=>{
    if(!nodes.has(id)) nodes.set(id,{value:id==='nakdanGenre'?'rabbinic':'',checked:true,className:'',textContent:'',children:[],selectionStart:0,
      addEventListener(type,fn){events.set(id+':'+type,fn)},replaceChildren(){this.children=[]},appendChild(n){this.children.push(n)},focus(){},select(){},setSelectionRange(){}});
    return nodes.get(id);
  };
  let respond;
  const context={document:{getElementById:el,createElement:()=>({appendChild(){},addEventListener(){}})},window:{addEventListener(){}},navigator:{clipboard:{}},AbortController,setTimeout,clearTimeout,requestAnimationFrame:fn=>fn(),fetch:async(url,options)=>{requests.push(JSON.parse(options.body));return {ok:true,json:async()=>respond()}}};
  const api=vm.runInNewContext(source+';({run,vocalizeUnpointed,reconcileWordState,prepareNakdanSource,phonetize});',context);
  return {api,el,events,requests,context,setResponse(fn){respond=fn}};
}
const tests=[];
tests.push(['Manual meteg edit stays fixed',async()=>{
  const {api}=harness();const old='שָׁלוֹם',edited='שָׁלֽוֹם';
  const state=api.reconcileWordState(old,[{origin:'nakdan',sourceWord:'שלום',renderedWord:old}],edited);
  assert.equal(api.prepareNakdanSource(edited,state),edited);
}]);
tests.push(['Alternatives after a two-word label target the right word',async()=>{
  const {api,setResponse}=harness();setResponse(()=>[{word:'JD_LABEL_0_JD',sep:true},{word:' ',sep:true},{word:'שלום',options:[['שָׁלוֹם'],['שְׁלוֹם']],fconfident:false}]);
  const result=await api.vocalizeUnpointed('המזמן אומר שלום');assert.equal(result.choices[0].wordIndex,2);
}]);
tests.push(['Genre change immediately refreshes automatic nikud',async()=>{
  const h=harness();h.setResponse(()=>[{word:'שלום',options:[[h.el('nakdanGenre').value==='modern'?'שְׁלוֹם':'שָׁלוֹם']]}]);
  h.el('hebrew').value='שלום';await h.api.run();h.el('nakdanGenre').value='modern';await h.events.get('nakdanGenre:change')();
  assert.equal(h.requests.length,2);assert.equal(h.el('hebrew').value,'שְׁלוֹם');
}]);
tests.push(['Automatic nikud off makes no network request and preserves supplied marks',async()=>{
  const h=harness();h.el('autoNikud').checked=false;h.el('hebrew').value='שָׁלוֹם עולם';await h.api.run();
  assert.equal(h.requests.length,0);assert.equal(h.el('hebrew').value,'שָׁלוֹם עולם');assert.match(h.el('motorStatus').textContent,/ח|parcial|sin nikud/i);
}]);
tests.push(['Changing input immediately clears stale phonetics',async()=>{
  const h=harness();h.el('output').value='Viejo';h.el('hebrew').value='חדש';h.events.get('hebrew:input')();
  assert.equal(h.el('output').value,'');h.events.get('clear:click')();
}]);
tests.push(['Incomplete vocalization is reported as partial',async()=>{
  const h=harness();h.setResponse(()=>[{word:'שלום',options:[]}]);h.el('hebrew').value='שלום';await h.api.run();
  assert.match(h.el('motorStatus').textContent,/parcial/);assert.equal(h.el('hebrew').value,'שלום');
}]);
tests.push(['Service failure preserves user nikud and produces an explicit warning',async()=>{
  const h=harness();h.context.fetch=async()=>{throw Error('network unavailable')};h.el('hebrew').value='שָׁלוֹם עולם';await h.api.run();
  assert.equal(h.el('hebrew').value,'שָׁלוֹם עולם');assert.match(h.el('motorStatus').textContent,/parcial/);
}]);
let failures=0;for(const [name,test] of tests){try{await test();console.log('PASS',name)}catch(e){failures++;console.error('FAIL',name,e.message)}}
try{
  assert.equal(extractEngine(html+'<script src="another.js"></script><script>console.log("other")</script>'),source);
  console.log('PASS Audit extraction with trailing external and inline scripts');
  const h=harness(),pending=[];
  h.context.fetch=(url,{signal})=>new Promise((resolve,reject)=>{
    pending.push(resolve);signal.addEventListener('abort',()=>reject(new Error('aborted')),{once:true});
  });
  h.el('hebrew').value='ישן';const old=h.api.run();
  h.el('hebrew').value='חדש';const current=h.api.run();
  pending[1]({ok:true,json:async()=>[{word:'חדש',options:[['חָדָשׁ']]}]});
  await Promise.all([old,current]);assert.equal(h.el('hebrew').value,'חָדָשׁ');
  assert.equal(h.el('copy').disabled,false);
  console.log('PASS Late response cannot overwrite newer input');
  const samples=['','   ','123 — 😀','שָׁלוֹם\n\nHello 123','בָּרוּךְ אַתָּה יְיָ','שָׁלוֹם'.normalize('NFD'),'שָׁלוֹם'.normalize('NFC'),'\u200fשָׁלוֹם\u200e','שָׁלוֹם־עוֹלָם','שָׁלוֹם'.repeat(10000)];
  for(const s of samples){assert.equal(typeof h.api.phonetize(s),'string');}
  console.log('PASS Empty, mixed scripts, Unicode, maqaf and 60,000-character input');
}catch(e){failures++;console.error('FAIL Stress checks',e.message)}
process.exitCode=failures?1:0;
