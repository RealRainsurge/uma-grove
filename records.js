import {RANKS} from './rank-data.js';
export function rankForScore(score){
 if(!Number.isInteger(score)||score<0)return '';
 const rank=RANKS.find(r=>score>=r.min_value&&score<=r.max_value);if(!rank)return '';
 const early=['G','G+','F','F+','E','E+','D','D+','C','C+','B','B+','A','A+','S','S+','SS','SS+'];
 if(rank.id<=18)return early[rank.id-1];
 const n=rank.id-19,tier=['UG','UF','UE','UD','UC','UB','UA','US'][Math.floor(n/10)];return tier?tier+(n%10||''):'';
}
export const friendlyCharacter=c=>c?c.name+' ('+(c.outfit||'Original')+')':'Unknown character';
export const sameCopyGroup=(a,b)=>a.characterId&&b.characterId?a.characterId===b.characterId:a.name===b.name&&a.variant===b.variant;
export function orderedCopies(db,r){return db.runs.filter(x=>sameCopyGroup(x,r)).sort((a,b)=>(a.copyOrder??db.runs.indexOf(a))-(b.copyOrder??db.runs.indexOf(b))||db.runs.indexOf(a)-db.runs.indexOf(b));}
export const copyNumber=(db,r)=>orderedCopies(db,r).findIndex(x=>x.id===r.id)+1;
export function deletionImpact(db,id){
 const descendants=new Set();let changed=true;while(changed){changed=false;for(const r of db.runs){if(r.id!==id&&!descendants.has(r.id)&&r.parents.some(p=>p===id||descendants.has(p))){descendants.add(r.id);changed=true;}}for(const t of db.trees)for(const e of t.entries)if(e.runId!==id&&!descendants.has(e.runId)&&(e.previous===id||descendants.has(e.previous))){descendants.add(e.runId);changed=true;}}
 return {descendants:[...descendants],directChildren:db.runs.filter(r=>r.parents.includes(id)).map(r=>r.id),groves:db.trees.filter(t=>t.entries.some(e=>e.runId===id)).map(t=>t.id)};
}
export function removeVeteran(db,id){
 const next=structuredClone(db),impact=deletionImpact(next,id),affected=new Set(impact.descendants);
 next.runs=next.runs.filter(r=>r.id!==id);
 for(const r of next.runs){r.parents=r.parents.map(p=>p===id?null:p);if(r.forecast?.parents)r.forecast.parents=[...r.parents];if(affected.has(r.id))r.status='archived';}
 for(const t of next.trees){const removed=t.entries.find(e=>e.runId===id);t.entries=t.entries.filter(e=>e.runId!==id);for(const e of t.entries)if(e.previous===id)e.previous=null;}
 return next;
}
