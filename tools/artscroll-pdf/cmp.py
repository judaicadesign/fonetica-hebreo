import json,sys,unicodedata,difflib,re
sys.path.insert(0,'.')
from recon2 import page_lines,norm
M=json.load(open('/home/claude/judaicadesign/judaica-design-system/masters/tehilim/tehilim.json'))
def master(ch):
    c=[x for x in M['items'] if x['chapter']==ch][0]
    return ' '.join(v['hebrew'] for v in c['verses'])
def pdf(pi):
    ls=page_lines(pi)[1:] if pi in(0,) else page_lines(pi)
    return ' '.join(s for k,s,u in ls)
def show(w):
    return ''.join(c if not unicodedata.combining(c) else '{%04X}'%ord(c) for c in unicodedata.normalize('NFD',w))
def cmp(a,b,la='MASTER',lb='PDF'):
    A=a.split();B=b.split()
    sm=difflib.SequenceMatcher(None,A,B,autojunk=False)
    n=0
    for op,i1,i2,j1,j2 in sm.get_opcodes():
        if op=='equal': continue
        n+=1
        print(op,la,' '.join(A[i1:i2]),'|',lb,' '.join(B[j1:j2]))
        for x,y in zip(A[i1:i2],B[j1:j2]):
            if len(x)>0 and len(y)>0:
                print('   ',show(x),'<>',show(y))
    print('diffs',n,'words',len(A),len(B))
if __name__=='__main__':
    ch=int(sys.argv[1]);pi=int(sys.argv[2])
    m=master(ch).replace('יְיָ','יהוה')
    p=norm(pdf(pi))
    cmp(unicodedata.normalize('NFD',m),p)
