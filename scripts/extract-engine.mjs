// Find the inline phonetic engine independently of other scripts in the page.
export function extractEngine(html){
  const matches=[...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)]
    .filter(x=>x[1].includes('function phonetize('));
  if(matches.length!==1)throw Error('Expected one inline phonetic engine');
  return matches[0][1];
}
