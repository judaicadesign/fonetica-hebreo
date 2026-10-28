import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Public entry screens only; authenticated application behavior is a separate scope.
const pages=[
 ['access','https://judaicadesign.github.io/judaica-design-system/?ui=20261028'],
 ['tools','https://judaicadesign.github.io/portal/herramientas/?ui=20261028'],
 ['pdf','https://judaicadesign.github.io/portal/herramientas/pdf/?ui=20261028'],
 ['booklet','https://judaicadesign.github.io/portal/herramientas/cuadernillo/?ui=20261028'],
 ['leaflets','https://judaicadesign.github.io/portal/herramientas/folletos/?ui=20261028']
];
for(const [name,url] of pages)for(const width of [320,390,768,1366]){
 test(`Public ${name} at ${width}px`,async({page},info)=>{
  await page.setViewportSize({width,height:900});
  await page.goto(url.replace('ui=20261028','ui=20261028-final'));
  await expect(page.locator('h1')).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  const audit=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  console.log('PUBLIC_TIMING',name,width,await page.evaluate(()=>({domReady:performance.getEntriesByType('navigation')[0]?.domContentLoadedEventEnd,resources:performance.getEntriesByType('resource').length})));
  await info.attach('accessibility.json',{body:JSON.stringify(audit.violations,null,2),contentType:'application/json'});
  console.log('PUBLIC_AUDIT',name,width,JSON.stringify(audit.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))));
  expect(audit.violations).toEqual([]);
  await page.screenshot({path:info.outputPath(`${name}-${width}.png`),fullPage:true});
 });
}
