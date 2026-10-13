import sys,collections,json
sys.path.insert(0,'.')
from taamim_stress import *
W=load_wlc();M=load_master()
APPROVED=[1,2,3,4,5,6,7,14,126,137]
def run(chs,verbose=False):
    C=collections.Counter();rows=[]
    for ch in chs:
        pairs,_,_=align(W[ch],M[ch])
        for i,j in pairs:
            v,w,maq=W[ch][i]; ls=letters(w)
            ml=letters(M[ch][j][1])
            nu=nuclei(ls,furtive=True); s=stress_index(ls)
            mm=[k for k,(c,m) in enumerate(ml) if METEG in m]
            if maq: C['maqqef (se omite)']+=1; continue
            if s is None: 
                C['teamim no concluyente']+=1; continue
            if not nu:
                C['sin núcleo']+=1; continue
            if s not in nu:
                nxt=[k for k in nu if k>s]
                s=nxt[0] if nxt else nu[-1]
            milel = nu.index(s)<len(nu)-1
            # ArtScroll pone el meteg en la consonante que precede a la vav-mater (shuruk / jolam jaser escrito con vav)
            if ls[s][0]=='ו' and s>0 and not (ls[s][1]&(VOW_FULL-{0x05B9})) : s=s-1
            if milel:
                if mm==[s]: C['milel + meteg en la tónica OK']+=1
                elif mm: C['milel + meteg en otra letra']+=1; rows.append((ch,v,M[ch][j][1],'meteg-otra',s,mm))
                else: C['milel SIN meteg']+=1; rows.append((ch,v,M[ch][j][1],'milel-sin-meteg',s,mm))
            else:
                if not mm: C['milra sin meteg OK']+=1
                else: C['milra CON meteg']+=1; rows.append((ch,v,M[ch][j][1],'milra-con-meteg',s,mm))
    return C,rows
if __name__=='__main__':
    C,rows=run(APPROVED)
    for k,v in sorted(C.items(),key=lambda x:-x[1]): print('%5d %s'%(v,k))
    json.dump([(a,b,unicodedata.normalize('NFC',c),d,e,f) for a,b,c,d,e,f in rows],open('discrep.json','w'),ensure_ascii=False)
    kinds=collections.Counter(r[3] for r in rows);print(kinds)
    for r in rows[:60]: print(r[0],r[1],unicodedata.normalize('NFC',r[2]),r[3],'tónica=',r[4],'meteg=',r[5])
