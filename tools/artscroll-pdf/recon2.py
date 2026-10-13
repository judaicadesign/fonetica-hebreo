import json,sys,collections,unicodedata,re
sys.path.insert(0,'.')
from labels import L
g=json.load(open('allglyphs.json'))
so=json.load(open('shape_order.json'))
h2id={s['hash']:s['id'] for s in so}
HOL=82
def page_lines(pi,minsx=10):
    rows=collections.defaultdict(list)
    for x in g[str(pi)]:
        if x['sx']>minsx:
            x=dict(x); x['id']=h2id[x['hash']]; x['w']=x['adv']*x['sx']; rows[round(x['y']/3)].append(x)
    res=[]
    for k in sorted(rows,reverse=True):
        gl=sorted(rows[k],key=lambda t:-t['x'])
        kind=lambda t:L.get(t['id'],('?','X'))[1]
        letters=[t for t in gl if kind(t)=='L']
        marks=[t for t in gl if kind(t)=='M' and L[t['id']][0]!="'"]
        puncts=[t for t in gl if kind(t)=='P']
        unk=[t['id'] for t in gl if t['id'] not in L]
        att=collections.defaultdict(str)
        for m in marks:
            if m['id']==HOL:
                cands=[l for l in letters if l['x']>m['x']-1.0]
                best=min(cands,key=lambda l:l['x']-m['x']) if cands else None
            else:
                cx=m['x']+m['w']/2;best=None;bd=1e9
                for l in letters:
                    d=0 if l['x']-0.4<=cx<=l['x']+l['w']+0.4 else min(abs(cx-l['x']),abs(cx-l['x']-l['w']))
                    if d<bd: bd=d;best=l
            if best is not None: att[id(best)]+=L[m['id']][0]
        items=sorted(letters+puncts,key=lambda t:-t['x'])
        s='';prev=None
        for t in items:
            if prev is not None and kind(t)=='L' and kind(prev)=='L':
                if prev['x']-(t['x']+t['w'])>2.2: s+=' '
            elif prev is not None and kind(prev)=='P' and kind(t)=='L': s+=' '
            s+=L[t['id']][0]+(att[id(t)] if kind(t)=='L' else '')
            prev=t
        res.append((k,s,unk))
    return res
def norm(s):
    s=unicodedata.normalize('NFD',s)
    # hataf composition
    s=s.replace('ְֶ','ֱ').replace('ְֶ','ֱ').replace('ְַ','ֲ').replace('ְַ','ֲ').replace('ְָ','ֳ').replace('ְָ','ֳ')
    s=unicodedata.normalize('NFD',s)
    return s
if __name__=='__main__':
    for k,s,u in page_lines(int(sys.argv[1])): print(k,s,u)
