import sys,re,unicodedata,difflib
sys.path.insert(0,'.')
from recon2 import page_lines,norm
from cmp import show
RAF='ֿ'
pdf=[]
for pi in range(2,19):
    for k,s,u in page_lines(pi,minsx=9):
        if s.strip()=='ברכת המזון': continue
        pdf.append(s)
P=norm(' '.join(pdf)).replace('יהוה','יְיָ')
P=unicodedata.normalize('NFD',P.replace('יהוה','יי'))
M=open('/home/claude/judaicadesign/judaica-design-system/masters/bircat-hamazon/ASHKENAZ_HEBREO_METEG_EN_REVISION.txt').read()
M=unicodedata.normalize('NFD',M)
def clean(s,strip_raf):
    s=s.replace('׃',':')
    if strip_raf: s=s.replace(RAF,'')
    return s
def words(s):
    return [w for w in re.split(r'[\s|/]+',s) if w]
def strip_marks(w): return ''.join(c for c in w if not unicodedata.combining(c))
def run(strip_raf):
    A=words(clean(M,strip_raf));B=words(clean(P,strip_raf))
    sm=difflib.SequenceMatcher(None,A,B,autojunk=False)
    res=[]
    for op,i1,i2,j1,j2 in sm.get_opcodes():
        if op!='equal': res.append((op,A[i1:i2],B[j1:j2]))
    return A,B,res
if __name__=='__main__':
    A,B,res=run(True)
    print(len(A),len(B),len(res))
    for op,a,b in res:
        print(op,'MASTER:',' '.join(a),'| PDF:',' '.join(b))
        if op=='replace' and len(a)==len(b):
            for x,y in zip(a,b):
                if x!=y: print('     ',show(x),'<>',show(y))
