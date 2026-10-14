// Salmo 1 con "Hebreo con meteg y rafe": las 12 marcas de ArtScroll (10 meteg + 2 rafe), derivadas por reglas desde el hebreo sin marcas.
// Incluye los tres casos que fallaban: מָֽיִם, וָלָֽיְלָה (penúltima -ַיִם / -ָיְלָה) y רוּחַ (monosílaba con pataj furtivo: sin meteg).
import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
import {extractEngine} from '../scripts/extract-engine.mjs';
const stub=`const document={getElementById(){return {value:'rabbinic',addEventListener(){},focus(){},select(){}}},createElement(){return {appendChild(){},addEventListener(){},replaceChildren(){}}}};const window={addEventListener(){}};const navigator={clipboard:{}};const requestAnimationFrame=f=>f();`;
const api=vm.runInNewContext(stub+extractEngine(fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'))+';({applyVisualMarks,stripVisualMarks,phonetize});');
const verses={
 1:'אַשְׁרֵי הָאִישׁ אֲשֶׁר לֹא הָלַךְ בַּעֲצַת רְשָׁעִים, וּבְדֶרֶךְ חַטָּאִים לֹא עָמָד, וּבְמוֹשַׁב לֵצִים לֹא יָשָׁב.',
 2:'כִּי אִם בְּתוֹרַת יְיָ חֶפְצוֹ, וּבְתוֹרָתוֹ יֶהְגֶּה יוֹמָם וָלָיְלָה.',
 3:'וְהָיָה כְּעֵץ שָׁתוּל עַל פַּלְגֵי מָיִם, אֲשֶׁר פִּרְיוֹ יִתֵּן בְּעִתּוֹ, וְעָלֵהוּ לֹא יִבּוֹל, וְכֹל אֲשֶׁר יַעֲשֶׂה יַצְלִיחַ.',
 4:'לֹא כֵן הָרְשָׁעִים, כִּי אִם כַּמֹּץ אֲשֶׁר תִּדְּפֶנּוּ רוּחַ.',
 5:'עַל כֵּן לֹא יָקֻמוּ רְשָׁעִים בַּמִּשְׁפָּט וְחַטָּאִים בַּעֲדַת צַדִּיקִים.',
 6:'כִּי יוֹדֵעַ יְיָ דֶּרֶךְ צַדִּיקִים, וְדֶרֶךְ רְשָׁעִים תֹּאבֵד.'};
const expectedMeteg=['וּבְדֶֽרֶךְ','וָלָֽיְלָה','מָֽיִם','וְעָלֵֽהוּ','יַצְלִֽיחַ','תִּדְּפֶֽנּוּ','יָקֻֽמוּ','יוֹדֵֽעַ','דֶּֽרֶךְ','וְדֶֽרֶךְ'];
const expectedRafe=['הָרְֿשָׁעִים','תִּדְּֿפֶנּוּ'];
const pos=w=>{const r={m:[],r:[]};let k=-1;for(const ch of w.normalize('NFD')){if(/[א-ת]/.test(ch))k++;else if(ch==='ֽ')r.m.push(k);else if(ch==='ֿ')r.r.push(k);}return r;};
const m=[],r=[];
for(const v of Object.values(verses)){
  const out=api.applyVisualMarks(api.stripVisualMarks(v),{meteg:true,rafe:true});
  for(const w of out.split(/[\s־]+/)){const p=pos(w);if(p.m.length)m.push(w.replace(/[^֑-ׇא-ת]/g,''));if(p.r.length)r.push(w.replace(/[^֑-ׇא-ת]/g,''));}
  assert.equal(api.phonetize(out),api.phonetize(v),'la fonética no cambia con las marcas');
}
const same=(a,b,key)=>a.length===b.length&&a.every((w,i)=>JSON.stringify(pos(w)[key])===JSON.stringify(pos(b[i])[key])&&w.replace(/[ֽֿ]/g,'')===b[i].replace(/[ֽֿ]/g,''));
assert.ok(same(m,expectedMeteg,'m'),'meteg distinto de ArtScroll: '+m.join(' '));
assert.ok(same(r,expectedRafe,'r'),'rafe distinto de ArtScroll: '+r.join(' '));
assert.equal(api.phonetize('רוּחַ'),'Rúaj'); assert.ok(!/ֽ/.test(api.applyVisualMarks('רוּחַ',{meteg:true})),'רוּחַ no lleva meteg');
for(const w of ['יוֹדֵעַ','יַצְלִיחַ','פּוֹתֵחַ','וּמַשְׂבִּיעַ'])assert.ok(/ֽ/.test(api.applyVisualMarks(w,{meteg:true})),w+' sí lleva meteg');
for(const [w,ph] of [['מָיִם','Máyim'],['מִצְרַיִם','Mitsráyim'],['וָלָיְלָה','Valayla']]){assert.equal(api.phonetize(w),ph);assert.ok(/ֽ/.test(api.applyVisualMarks(w,{meteg:true})),w+' lleva meteg');}
console.log('PASS: Salmo 1 con 12 de 12 marcas de ArtScroll (10 meteg + 2 rafe), רוּחַ sin meteg, מָֽיִם/מִצְרַֽיִם/וָלָֽיְלָה con meteg');
