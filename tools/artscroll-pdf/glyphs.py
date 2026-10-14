import pikepdf, hashlib, json, sys
PDF='/root/.claude/uploads/a03a97e9-49ab-580e-981b-94c21ef4a8f3/bf5d3c8a-ArtScroll_-_ashkenaz_bircat_hamazon_Interlinear_Benching.pdf'
def mul(a,b):
    return [a[0]*b[0]+a[1]*b[2],a[0]*b[1]+a[1]*b[3],a[2]*b[0]+a[3]*b[2],a[2]*b[1]+a[3]*b[3],a[4]*b[0]+a[5]*b[2]+b[4],a[4]*b[1]+a[5]*b[3]+b[5]]
def page_glyphs(pdf,pi):
    pg=pdf.pages[pi]
    fonts=pg.Resources.Font
    info={}
    for name,f in fonts.items():
        if f.get('/Subtype')!='/Type3': 
            info[name]=None; continue
        fm=[float(x) for x in f.FontMatrix]
        fc=int(f.FirstChar); W=[float(x) for x in f.Widths]
        cps={}
        enc=f.Encoding.Differences if '/Encoding' in f and '/Differences' in f.Encoding else None
        code2name={}
        if enc is not None:
            c=0
            for it in enc:
                if isinstance(it,int): c=it
                else: code2name[c]=str(it); c+=1
        procs={}
        for code,nm in code2name.items():
            cp=f.CharProcs.get(nm)
            if cp is not None: procs[code]=hashlib.sha1(cp.read_bytes()).hexdigest()[:10]
        info[name]=dict(fm=fm,fc=fc,W=W,procs=procs)
    out=[]
    ctm=[1,0,0,1,0,0]; stack=[]
    tm=[1,0,0,1,0,0]; tlm=[1,0,0,1,0,0]
    font=None; size=1; leading=0; tc=0; tw=0; th=1; trise=0
    for ins in pikepdf.parse_content_stream(pg):
        op=str(ins.operator); a=ins.operands
        if op=='q': stack.append(ctm[:])
        elif op=='Q': ctm=stack.pop()
        elif op=='cm': ctm=mul([float(x) for x in a],ctm)
        elif op=='BT': tm=[1,0,0,1,0,0]; tlm=tm[:]
        elif op=='Tf': font=str(a[0]); size=float(a[1])
        elif op=='Tc': tc=float(a[0])
        elif op=='Tw': tw=float(a[0])
        elif op=='Tz': th=float(a[0])/100
        elif op=='TL': leading=float(a[0])
        elif op=='Ts': trise=float(a[0])
        elif op=='Td': tlm=mul([1,0,0,1,float(a[0]),float(a[1])],tlm); tm=tlm[:]
        elif op=='TD': leading=-float(a[1]); tlm=mul([1,0,0,1,float(a[0]),float(a[1])],tlm); tm=tlm[:]
        elif op=='Tm': tm=[float(x) for x in a]; tlm=tm[:]
        elif op=='T*': tlm=mul([1,0,0,1,0,-leading],tlm); tm=tlm[:]
        elif op in ('Tj','TJ',"'",'"'):
            if op=="'": tlm=mul([1,0,0,1,0,-leading],tlm); tm=tlm[:]; items=[a[0]]
            elif op=='"': tc=float(a[1]); tw=float(a[0]); tlm=mul([1,0,0,1,0,-leading],tlm); tm=tlm[:]; items=[a[2]]
            elif op=='Tj': items=[a[0]]
            else: items=list(a[0])
            fi=info.get(font)
            for it in items:
                if isinstance(it,(int,float)) or (not isinstance(it,pikepdf.String) and not isinstance(it,bytes)):
                    try: v=float(it)
                    except: continue
                    tm=mul([1,0,0,1,-v/1000*size*th,0],tm); continue
                bs=bytes(it)
                for code in bs:
                    if fi is None: continue
                    w=(fi['W'][code-fi['fc']] if 0<=code-fi['fc']<len(fi['W']) else 0)*fi['fm'][0]
                    trm=mul([size*th,0,0,size,0,trise],mul(tm,ctm))
                    out.append(dict(x=trm[4],y=trm[5],font=font,code=code,size=size*ctm[0]*tm[0] if False else size,adv=w*size*th,sx=trm[0],hash=fi['procs'].get(code),w=w))
                    tx=(w*size+tc+(tw if code==32 else 0))*th
                    tm=mul([1,0,0,1,tx,0],tm)
    return out
if __name__=='__main__':
    pdf=pikepdf.open(PDF)
    res={}
    for pi in range(len(pdf.pages)):
        res[pi]=page_glyphs(pdf,pi)
        print(pi,len(res[pi]))
    json.dump(res,open('pdf/allglyphs.json','w'))
