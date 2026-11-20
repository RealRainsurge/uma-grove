export const APTITUDES=['Turf','Dirt','Sprint','Mile','Medium','Long','Front Runner','Pace Chaser','Late Surger','End Closer'];
export const STATS=['Speed','Stamina','Power','Guts','Wit'];
export const grades=['G','F','E','D','C','B','A','S'];
export const blueStars=value=>value<600?[.9,.1,0]:value<1100?[.5,.45,.05]:[.2,.7,.1];
export const whiteStars=score=>score<6500?null:score<17500?[.5,.45,.05]:[.2,.7,.1];
export const generation=(copies,kind='white',method='empirical')=>{const b=kind==='gold'?.4:kind==='double'?.25:.2;return Math.min(1,method==='linear'?b+copies*(kind==='gold'?.05:.025):b*1.1**copies);};
export const startBoost=stars=>stars===0?0:Math.min(4,1+Math.floor((stars-1)/3));
export function startingAptitudes(base,slots){return base.map((grade,i)=>{const matches=slots.filter(r=>r?.pink?.name===APTITUDES[i]);const known=matches.reduce((n,r)=>n+(r.pink.stars||0),0),unknown=slots.some(r=>!r||!r.pink||r.pink.stars===null);return {name:APTITUDES[i],base:grade,stars:known,grade:grades[Math.min(6,grades.indexOf(grade)+startBoost(known))],uncertain:unknown};});}
export function skillProc(slots,name,affinities,starsFor,base=[.03,.06,.09]){let miss=1,unknown=false;slots.forEach((r,i)=>{const stars=starsFor(r,name);if(stars===undefined)return;if(stars===null||affinities[i]===null){unknown=true;return;}miss*=1-Math.min(1,base[stars-1]*(1+affinities[i]/100));});return {chance:1-miss**2,unknown};}
export function affinity(catalog,trainee,slots){const groups=new Map();for(const m of catalog.relationMembers){if(!groups.has(m.chara_id))groups.set(m.chara_id,new Set());groups.get(m.chara_id).add(m.relation_type);}const points=new Map(catalog.relations.map(r=>[r.relation_type,r.relation_point]));const char=r=>catalog.characters.find(c=>c.id===r?.characterId)?.characterId;const target=catalog.characters.find(c=>c.id===trainee)?.characterId;
 const shared=(...ids)=>{if(ids.some(x=>!x))return null;if(new Set(ids).size!==ids.length)return 0;return [...(groups.get(ids[0])||[])].filter(k=>ids.slice(1).every(id=>groups.get(id)?.has(k))).reduce((n,k)=>n+(points.get(k)||0),0);};
 const race=(a,b)=>new Set((a?.g1Wins||[]).filter(id=>(b?.g1Wins||[]).includes(id))).size*3;
 const result=[];for(const side of [0,3]){const p=slots[side],g1=slots[side+1],g2=slots[side+2],other=slots[side===0?3:0];const values=[shared(target,char(p)),shared(char(p),char(other)),shared(char(p),char(g1)),shared(char(p),char(g2))];result.push(values.some(v=>v===null)?null:values.reduce((a,b)=>a+b,0)+race(p,other)+race(p,g1)+race(p,g2));for(const g of [g1,g2]){const value=shared(target,char(p),char(g));result.push(value===null?null:value+race(p,g));}}
 return {values:result,incomplete:slots.some(r=>!r?.g1Complete)};
}
export function potentialAptitudes(start,slots,affinities){return start.map(a=>{const proc=skillProc(slots,a.name,affinities,(r,name)=>r?.pink?.name===name?r.pink.stars:undefined,[.01,.03,.05]);return {...a,proc};});}
export function weightedPink(start){const eligible=start.filter(a=>['A','S'].includes(a.grade));return eligible.map(a=>({name:a.name,chance:1/eligible.length,stars:[.2,.7,.1].map(p=>p/eligible.length)}));}
