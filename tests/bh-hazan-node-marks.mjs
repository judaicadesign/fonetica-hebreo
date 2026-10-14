// Bircat Hamazón (ArtScroll Interlinear): las bendiciones הַזָּן y נוֹדֶה coinciden marca por marca (meteg y rafe) con el motor, incluido מִצְרַֽיִם.
import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
import {extractEngine} from '../scripts/extract-engine.mjs';
const stub=`const document={getElementById(){return {value:'rabbinic',addEventListener(){},focus(){},select(){}}},createElement(){return {appendChild(){},addEventListener(){},replaceChildren(){}}}};const window={addEventListener(){}};const navigator={clipboard:{}};const requestAnimationFrame=f=>f();`;
const api=vm.runInNewContext(stub+extractEngine(fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'))+';({applyVisualMarks});');
const pos=w=>{const r={m:[],r:[]};let k=-1;for(const ch of w.normalize('NFD')){if(/[א-ת]/.test(ch))k++;else if(ch==='ֽ')r.m.push(k);else if(ch==='ֿ')r.r.push(k);}return r;};
const L=fs.readFileSync(new URL('./fixtures/artscroll-bircat-hamazon-pdf.txt',import.meta.url),'utf8').split('\n');
const find=s=>L.findIndex(l=>l.startsWith(s));
const blocks={hazan:[find('הַזָּן אֶת הָעוֹלָם'),find('אֶת הַכֹּל. אָמֵן.')],node:[find('נוֹדֶה לְּךָ'),find('נוֹדֶה לְּךָ')+7]};
const out={};
for(const [name,[a,b]] of Object.entries(blocks)){
  let m=0,r=0,n=0;const bad=[];
  for(const ln of L.slice(a,b+1))for(const t of ln.split(/[\s־]+/)){ if(!/[א-ת]/.test(t))continue;
    const tok=t.normalize('NFD').replace(/[^֑-ׇא-ת]/g,'').normalize('NFC'); if(tok.normalize('NFD').includes('ְֶ'))continue;
    const act=pos(tok),pred=pos(api.applyVisualMarks(tok,{meteg:true,rafe:true}));n++;m+=act.m.length;r+=act.r.length;
    if(JSON.stringify(act)!==JSON.stringify(pred))bad.push(tok);}
  assert.equal(bad.length,0,name+' difiere de ArtScroll: '+bad.join(' '));
  out[name]={n,m,r};
}
assert.ok(pos(api.applyVisualMarks('מִצְרַיִם',{meteg:true})).m[0]===2,'מִצְרַֽיִם: meteg en la resh-patáj');
assert.equal(out.node.r,2,'נוֹדֶה: 2 rafe'); assert.ok(out.hazan.m>=8&&out.node.m>=15);
console.log('PASS: הַזָּן',JSON.stringify(out.hazan),'· נוֹדֶה',JSON.stringify(out.node),'idénticos a ArtScroll');
