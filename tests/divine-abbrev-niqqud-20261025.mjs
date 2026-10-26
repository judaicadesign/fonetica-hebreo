/** 25/10/2026 (aprobado por el titular): el Nombre abreviado יי escrito a mano sin nikud recibe יְיָ, con prefijo vocalizado. */
import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
import {extractEngine} from '../scripts/extract-engine.mjs';
for(const page of ['../index.html','../beta/index.html']){
  const source=extractEngine(fs.readFileSync(new URL(page,import.meta.url),'utf8'));
  const nodes=new Map(),requests=[];
  const el=id=>{if(!nodes.has(id))nodes.set(id,{value:id==='nakdanGenre'?'rabbinic':'',checked:true,className:'',textContent:'',children:[],
    addEventListener(){},replaceChildren(){},appendChild(){},focus(){},select(){},setSelectionRange(){}});return nodes.get(id);};
  const ctx={document:{getElementById:el,createElement:()=>({appendChild(){},addEventListener(){}})},window:{addEventListener(){}},navigator:{clipboard:{}},
    AbortController,setTimeout,clearTimeout,requestAnimationFrame:f=>f(),fetch:async(u,o)=>{requests.push(o);throw Error('sin red en la prueba')}};
  const api=vm.runInNewContext(source+';({run,pointDivineAbbrev,phonetize});',ctx);
  const cases=[['יי','יְיָ'],['ליי','לַיְיָ'],['ביי','בַּיְיָ'],['כיי','כַּיְיָ'],['מיי','מֵיְיָ'],['ויי','וַיְיָ'],['וליי','וְלַיְיָ'],['וביי','וּבַיְיָ'],
    ['יְיָ','יְיָ'],['לַיְיָ','לַיְיָ'],['בִּכְיִי','בִּכְיִי'],['חיי','חיי'],['שיי','שיי']];
  for(const [a,b] of cases)assert.equal(api.pointDivineAbbrev(a),b,page+' '+a);
  assert.equal(api.pointDivineAbbrev('בָּרוּךְ יי אֱלֹהֵינוּ'),'בָּרוּךְ יְיָ אֱלֹהֵינוּ');
  // Caso del titular: escrito a mano, con el nikud automático apagado y prendido.
  for(const auto of [false,true]){
    el('autoNikud').checked=auto;el('hebrew').value='בָּרוּךְ יי';requests.length=0;
    await api.run();
    assert.equal(el('hebrew').value,'בָּרוּךְ יְיָ',page+' auto='+auto);
    assert.equal(requests.length,0,'no hace falta Nakdan para el Nombre');
    assert.match(el('output').value,/^Baruj Ad-nai/);
  }
  assert.equal(api.phonetize('הוֹדוּ לַיְיָ'),api.phonetize(api.pointDivineAbbrev('הוֹדוּ ליי')));
}
console.log('divine-abbrev-niqqud-20261025 OK');
