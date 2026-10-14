"""Entrena el árbol de acento tradicional (milel/milrá) con los Tehilim con teamim y lo valida en ArtScroll.
Uso (desde la raíz del repo):
  node tools/stress_features.mjs tools/stress_tree/psalms_labels.jsonl  /tmp/ps.csv
  node tools/stress_features.mjs tools/stress_tree/artscroll_bh_labels.jsonl /tmp/as.csv
  python3 tools/stress_tree/train.py /tmp/ps.csv /tmp/as.csv tools/stress_tree/tree.json
Luego: node tools/stress_tree/inject.mjs   (escribe el árbol dentro de index.html)
"""
import sys,json,numpy as np,pandas as pd
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import GroupKFold
tr=pd.read_csv(sys.argv[1]);te=pd.read_csv(sys.argv[2])
feat=[c for c in tr.columns if c not in('word','y','src')]
X=tr[feat].values;y=(tr.y=='milel').values
m=DecisionTreeClassifier(max_depth=8,min_samples_leaf=5,random_state=0).fit(X,y)
acc=[];
for a,b in GroupKFold(5).split(X,y,tr.src.values):
    acc.append(DecisionTreeClassifier(max_depth=8,min_samples_leaf=5,random_state=0).fit(X[a],y[a]).score(X[b],y[b]))
t=m.tree_
out={'features':feat,
 'f':[int(x) for x in t.feature],'t':[round(float(x),4) for x in t.threshold],
 'l':[int(x) for x in t.children_left],'r':[int(x) for x in t.children_right],
 'v':[int(np.argmax(v)) for v in t.value.reshape(t.node_count,-1)],
 'metrics':{'train_psalms':round(m.score(X,y),4),'cv_by_psalm':round(float(np.mean(acc)),4),
            'artscroll_bircat_hamazon':round(m.score(te[feat].values,(te.y=='milel').values),4),
            'n_train':int(len(tr)),'n_test':int(len(te))}}
json.dump(out,open(sys.argv[3],'w'))
print(out['metrics'])
