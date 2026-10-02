/* Judaica Design: full-master engine smoke tests, not editorial certification.
 * Validates that both complete Hebrew source sections can be processed
 * deterministically and without corruption. Never modifies the masters.
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import {fileURLToPath} from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const html=fs.readFileSync(path.join(root,"index.html"),"utf8");
const start=html.lastIndexOf("<script>"),end=html.lastIndexOf("</script>");
if(start<0||end<=start)throw Error("Motor inline no encontrado");
const stub=`
const elements=new Map();
function el(id){
 if(!elements.has(id))elements.set(id,{id,value:"",textContent:"",className:"",style:{},dataset:{},children:[],scrollHeight:100,clientHeight:50,scrollTop:0,selectionStart:0,selectionEnd:0,
 addEventListener(){},appendChild(){},replaceChildren(){},focus(){},select(){},setSelectionRange(){}});
 return elements.get(id);
}
const document={getElementById:el,createElement(){return {style:{},dataset:{},children:[],appendChild(){},replaceChildren(){},addEventListener(){}}},execCommand(){return true}};
const window={addEventListener(){}};
const navigator={clipboard:{writeText:async()=>{},readText:async()=>""}};
const requestAnimationFrame=fn=>fn();
`;
const api=vm.runInNewContext(stub+html.slice(start+8,end)+"\n;({phonetize})",{}, {timeout:20000});
const specs=[
 ["Ashkenaz","ASHKENAZ__HEBREO_FONETICA__EN_REVISION.txt"],
 ["Sefaradi","SEFARADI__HEBREO_FONETICA__EN_REVISION.txt"]
];
let failed=0;
for(const [name,file] of specs){
 const full=fs.readFileSync(path.join(root,"masters/bircat-hamazon",file),"utf8");
 const marker=full.indexOf("\nFONETICA");
 if(marker<0)throw Error(name+": no FONETICA section");
 const hebrew=full.slice(0,marker),golden=full.slice(marker+1);
 const lines=hebrew.split(/\r?\n/).filter(x=>/[\u05d0-\u05ea]/u.test(x));
 const words=(hebrew.match(/[\u05d0-\u05ea][\u0591-\u05c7\u05d0-\u05ea]*/gu)||[]).length;
 const output=api.phonetize(hebrew);
 const again=api.phonetize(hebrew);
 const errors=[];
 if(output!==again)errors.push("salida no determinista");
 if(/[\u05d0-\u05ea]/u.test(output))errors.push("quedó hebreo en salida");
 if(/\b(?:undefined|null|NaN)\b/u.test(output))errors.push("valor inválido");
 if(output.length<hebrew.length*0.35)errors.push("salida demasiado corta");
 if(!/\bamjá\b/iu.test(golden))errors.push("falta amjá aprobado en golden");
 if(!/\bule'amjá\b/iu.test(golden))errors.push("falta ule'amjá aprobado en golden");
 if(!/\bamjá\b/iu.test(output))errors.push("motor no emite amjá en contexto");
 if(!/\bule'amjá\b/iu.test(output))errors.push("motor no emite ule'amjá en contexto");
 console.log(name+": "+lines.length+" líneas hebreas, "+words+" tokens; fonética "+output.length+" caracteres; "+(errors.length?"FAIL":"PASS"));
 for(const e of errors){console.error(name+": "+e);failed++;}
}
if(failed)process.exitCode=1;
console.log("NOTA: prueba de procesamiento integral, NO comparación editorial palabra por palabra ni aprobación de los golden.");
