import re,sys,unicodedata,collections,json
SH='ְ';RF='ֿ';MT='ֽ';DG='ּ'
VOW={'ֱ':'hatef-segol','ֲ':'hatef-patah','ֳ':'hatef-qamats','ִ':'hiriq','ֵ':'tsere','ֶ':'segol','ַ':'patah','ָ':'qamats','ֹ':'holam','ֺ':'holam','ֻ':'qubuts','ׇ':'qamats-katan'}
def clusters(w):
    out=[]
    for ch in unicodedata.normalize('NFD',w):
        if 'א'<=ch<='ת': out.append([ch,set()])
        elif out and '֑'<=ch<='ׇ': out[-1][1].add(ch)
    return out
def words(path):
    pg=0
    for ln in open(path,encoding='utf8'):
        m=re.match(r'=== PDF pág\. (\d+)',ln)
        if m: pg=int(m.group(1)); continue
        if ln.startswith('#'): continue
        for tok in re.split(r'[\s־]+',ln.strip()):
            if tok and any('א'<=c<='ת' for c in tok): yield pg,tok
def rows(path):
    for pg,tok in words(path):
        cs=clusters(tok)
        n=len(cs)
        for i,(b,m) in enumerate(cs):
            if SH not in m and not (m&{'ֱ','ֲ','ֳ'}): continue
            if SH not in m: continue
            prev=cs[i-1] if i else None
            pv=None
            if prev:
                for x in prev[1]:
                    if x in VOW: pv=VOW[x]
                if prev[0]=='ו' and DG in prev[1] and not pv: pv='shuruk'
                if prev[0]=='ו' and 'ֹ' in prev[1]: pv='holam'
                if pv is None and i>=2 and prev[0] in 'וי' and not (prev[1]&set(VOW)): pv='matres:'+cs[i-2][0]
            yield dict(pg=pg,word=tok,i=i,n=n,b=b,rafe=RF in m,dag=DG in m,
              prev=pv,prevmeteg=bool(prev and MT in prev[1]),prevdag=bool(prev and DG in prev[1]),
              prevsh=bool(prev and SH in prev[1]),nextsh=bool(i+1<n and SH in cs[i+1][1]),
              nextsame=bool(i+1<n and cs[i+1][0]==b),last=i==n-1,pen=i==n-2,nextb=cs[i+1][0] if i+1<n else None,
              nextv=[VOW[x] for x in (cs[i+1][1] if i+1<n else []) if x in VOW])
if __name__=='__main__':
    R=list(rows(sys.argv[1]))
    print(len(R),sum(r['rafe'] for r in R))
    c=collections.Counter()
    for r in R:
        c[(r['i']==0, r['prevsh'] or r['dag'] or r['nextsame'], r['prev'] if r['i'] else '-', r['last'] or (r['pen'] and False), r['rafe'])]+=1
    for k,v in sorted(c.items(),key=lambda x:str(x)): print(k,v)
