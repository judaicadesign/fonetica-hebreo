import sys,unicodedata
sys.path.insert(0,'.')
from taamim_stress import *
VOW_FULL_NO_HOLAM=VOW_FULL-{0x05B9}
def predict(word,maq=False):
    """devuelve (índice de letra con meteg esperado | None, motivo)"""
    ls=letters(word); nu=nuclei(ls,furtive=True); s=stress_index(ls)
    if maq: return None,'maqqef'
    if s is None or not nu: return None,'no concluyente'
    if s not in nu:
        nxt=[k for k in nu if k>s]; s=nxt[0] if nxt else nu[-1]
    if nu.index(s)==len(nu)-1: return None,'final'
    if ls[s][0]=='ו' and s>0 and not (ls[s][1]&VOW_FULL_NO_HOLAM): s-=1
    return s,'milel'
def mark(word,idx):
    ls=letters(word);out=[]
    for i,(c,m) in enumerate(ls):
        out.append(c+''.join(chr(x) for x in sorted(m) if x not in TAAM and x!=METEG)+('ֽ' if i==idx else ''))
    return unicodedata.normalize('NFC',''.join(out))
if __name__=='__main__':
    W=load_wlc();ch=int(sys.argv[1])
    for v,w,maq in W[ch]:
        i,why=predict(w,maq)
        print(v,mark(w,i) if i is not None else unicodedata.normalize('NFC',''.join(c+''.join(chr(x) for x in sorted(m) if x not in TAAM and x!=METEG) for c,m in letters(w))),'' if i is None else '<-- meteg',why)
