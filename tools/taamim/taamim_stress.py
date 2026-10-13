"""Acento tónico objetivo a partir de los teamim del Leningrad Codex (OSHB/morphhb) y comparación con el meteg de ArtScroll."""
import re,json,unicodedata,sys,collections,difflib
WLC='/home/claude/openscriptures/morphhb/wlc/Ps.xml'
MASTER='/home/claude/judaicadesign/judaica-design-system/masters/tehilim/tehilim.json'
TAAM=set(range(0x0591,0x05B0))
METEG=0x05BD; RAFE=0x05BF
# teamim que NO marcan la sílaba tónica (se escriben al inicio o al final de la palabra)
PREPOS={0x059A,0x05A0,0x05AD,0x05AB,0x059D}  # yetiv, telishá guedolá, dehi, ole, guerésh mukdam (preceden a la tónica)
POSTPOS={0x0592,0x0598,0x0599,0x05A9,0x05AE}  # segolta, zarká, pashtá, telishá ketaná, zinor
VOW_FULL={0x05B4,0x05B5,0x05B6,0x05B7,0x05B8,0x05B9,0x05BA,0x05BB,0x05C7}
HATAF={0x05B1,0x05B2,0x05B3}
SHEVA=0x05B0; DAGESH=0x05BC
def letters(word):
    """lista de (consonante, set(marcas)) en orden lógico"""
    word=unicodedata.normalize('NFD',word)
    out=[]
    for c in word:
        o=ord(c)
        if 0x05D0<=o<=0x05EA: out.append([c,set()])
        elif out and (0x0591<=o<=0x05C7): out[-1][1].add(o)
    return out
def skeleton(word): return ''.join(c for c,_ in letters(word))
def nuclei(ls,furtive=False):
    """índices de letras que son núcleo silábico"""
    n=[]
    L=len(ls)
    for i,(c,m) in enumerate(ls):
        full=bool(m&VOW_FULL)
        shuruk=(c=='ו' and DAGESH in m and not full and i>0 or (c=='ו' and DAGESH in m and not full and i==0))
        if shuruk and i>0 and (ls[i-1][1]&{SHEVA}) and False: pass
        if full or shuruk:
            # patáj furtivo
            if i==L-1 and c in 'חעה' and (m&{0x05B7}) and i>0 and not furtive: continue
            n.append(i)
    return n
def stress_index(ls):
    """índice de letra tónica según teamim, o None si no es concluyente"""
    cand=[]
    for i,(c,m) in enumerate(ls):
        for t in m:
            if t in TAAM and t!=METEG and t!=0x05AF and t not in PREPOS and t not in POSTPOS: cand.append(i)
    if cand: return cand[0]
    # pashtá/zarká… duplicados: la primera aparición es la tónica
    cnt=collections.defaultdict(list)
    for i,(c,m) in enumerate(ls):
        for t in m:
            if t in POSTPOS: cnt[t].append(i)
    for t,ix in cnt.items():
        if len(ix)>=2: return ix[0]
    return None
def meteg_index(ls):
    return [i for i,(c,m) in enumerate(ls) if METEG in m]
def load_wlc():
    s=open(WLC,encoding='utf8').read()
    chapters={}
    for ch in re.finditer(r'<chapter osisID="Ps\.(\d+)">(.*?)</chapter>',s,re.S):
        n=int(ch.group(1)); words=[]
        for v in re.finditer(r'<verse osisID="Ps\.\d+\.(\d+)">(.*?)</verse>',ch.group(2),re.S):
            body=v.group(2)
            for m in re.finditer(r'<w [^>]*>([^<]+)</w>(\s*<seg type="x-maqqef">)?',body):
                words.append((int(v.group(1)),m.group(1).replace('/',''),bool(m.group(2))))
        chapters[n]=words
    return chapters
def load_master():
    d=json.load(open(MASTER))
    out={}
    for it in d['items']:
        ws=[]
        for v in it['verses']:
            h=v['hebrew'].replace('־',' ').replace('־',' ')
            for w in h.split():
                w2=''.join(c for c in w if 0x0591<=ord(c)<=0x05EA)
                if skeleton(w2): ws.append((v['verse'],w2))
        out[it['chapter']]=ws
    return out
def align(wl,ms):
    A=[skeleton(w) for _,w,_ in wl]; B=[skeleton(w) for _,w in ms]
    sm=difflib.SequenceMatcher(None,A,B,autojunk=False)
    pairs=[]
    for op,i1,i2,j1,j2 in sm.get_opcodes():
        if op=='equal':
            for k in range(i2-i1): pairs.append((i1+k,j1+k))
    return pairs,len(A),len(B)
