export const CORE=['Nimble Navigator','Uma Stan','Groundwork','Racing Spirit: Stamina'];
export const uid=()=>crypto.randomUUID();
export const empty=()=>({format:'uma-grove',version:1,trees:[],runs:[]});
export const currentCore=t=>t?.revisions.at(-1)?.skills||[];
export const spark=(r,s)=>r?.sparks.find(x=>x.name===s);
export const presence=(r,s)=>!r||r.status==='planned'?'unknown':spark(r,s)?'present':r.complete||r.absent?.includes(s)?'absent':'unknown';
export const record=(db,id)=>db.runs.find(r=>r.id===id);
export const branchSlots=(db,r)=>[r,...(r?.parents||[null,null]).map(id=>record(db,id))];
export const pairingSlots=(db,a,b)=>[...branchSlots(db,record(db,a)),...branchSlots(db,record(db,b))];
export const pedigreeSlots=(db,r)=>[r,...pairingSlots(db,...(r?.parents||[null,null]))];
export function coverage(slots,skills){return skills.map(name=>({name,present:slots.filter(r=>presence(r,name)==='present').length,unknown:slots.filter(r=>presence(r,name)==='unknown').length,total:slots.length}));}
export const foundation=(db,r,skills)=>skills.length>0&&coverage(branchSlots(db,r),skills).every(x=>x.present===3);
export function coreStage(db,r,skills){
 const covered=slots=>skills.length>0&&coverage(slots,skills).every(x=>x.present===slots.length);
 return {own:covered([r]),branch:covered(branchSlots(db,r)),pairing:covered(pairingSlots(db,...(r?.parents||[null,null]))),pedigree:covered(pedigreeSlots(db,r))};
}
export function priorityChange(previous,next,priority){
 const gained=priority.filter(s=>presence(next,s)==='present'&&presence(previous,s)==='absent');
 const lost=priority.filter(s=>presence(previous,s)==='present'&&presence(next,s)==='absent');
 const uncertain=priority.filter(s=>presence(previous,s)==='unknown'||presence(next,s)==='unknown');
 return {gained,lost,uncertain,net:gained.length-lost.length};
}
export function delta(a,b){return priorityChange(a,b,[...new Set([...(a?.sparks||[]),...(b?.sparks||[])].map(s=>s.name))]);}
export function validate(input){
 const fail=m=>{throw Error(m)};
 if(!input||input.format!=='uma-grove'||input.version!==1)fail('This is not a supported Uma Grove v1 save.');
 if(!Array.isArray(input.runs)||!Array.isArray(input.trees)||input.runs.length>10000||input.trees.length>200)fail('Invalid collection size.');
 const text=(v,n=500)=>typeof v==='string'&&v.length<=n;
 const safeId=v=>text(v,100)&&/^[a-zA-Z0-9_-]+$/.test(v);
 const list=(v,predicate,max=500)=>Array.isArray(v)&&v.length<=max&&v.every(predicate);
 const ids=new Set();
 for(const r of input.runs){if(!r||!safeId(r.id)||ids.has(r.id)||!text(r.name,200)||!r.name.trim())fail('Every run needs a unique ID and name.');ids.add(r.id);
 if(!['main','side','archived','planned','source'].includes(r.status)||!Array.isArray(r.parents)||r.parents.length!==2||!Array.isArray(r.sparks)||r.sparks.length>500)fail('Invalid run structure.');
 if(r.sparks.some(s=>!s||!text(s.name,150)||!s.name.trim()||!(s.stars===null||[1,2,3].includes(s.stars)))||new Set(r.sparks.map(s=>s.name)).size!==r.sparks.length)fail('Invalid or duplicate sparks.');
 if(r.score!=null&&(!Number.isInteger(r.score)||r.score<0||r.score>99999))fail('Invalid score.');
 if(!text(r.rank||'',20)||r.rank&&!/^(?:[GFEDCBAS]\+?|SS\+?|U[GFEDCBAS][1-9]?)$/.test(r.rank))fail('Invalid rank.');
 if(r.copyOrder!=null&&(!Number.isInteger(r.copyOrder)||r.copyOrder<0))fail('Invalid copy order.');
 if(r.characterId!=null&&!Number.isInteger(r.characterId))fail('Invalid character ID.');
 if(r.role&&!['loop','parent','source','experiment','planned','final'].includes(r.role))fail('Invalid veteran role.');
 if(r.borrowed!=null&&typeof r.borrowed!=='boolean')fail('Invalid ownership.');
 if(r.availability&&!['available','unavailable'].includes(r.availability))fail('Invalid availability.');
 if(r.g1Wins&&!list(r.g1Wins,Number.isInteger))fail('Invalid race wins.');
 if(r.g1Complete!=null&&typeof r.g1Complete!=='boolean')fail('Invalid race completeness.');
 if(r.forecast){const f=r.forecast;if(!Number.isInteger(f.characterId)||!list(f.stats,n=>[0,600,1100].includes(n),5)||f.stats.length!==5||!list(f.supports,n=>n===null||Number.isInteger(n),6)||f.supports.length!==6||!list(f.finalAptitudes,g=>['','G','F','E','D','C','B','A','S'].includes(g),10)||f.finalAptitudes.length!==10||!list(f.gold,x=>text(x,150))||!list(f.double,x=>text(x,150))||!list(f.schedule,x=>text(x,100))||!list(f.affinities,n=>n===null||Number.isFinite(n)&&n>=0&&n<=1000,6)||f.affinities.length!==6||![0,6500,17500].includes(f.score)||![1,2,3,4,5].includes(f.awakening)||!['empirical','linear'].includes(f.method)||!text(f.name||'',200))fail('Invalid forecast.');}
 if(typeof r.complete!=='boolean'||!text(r.notes||'',20000)||!text(r.variant||'',200)||!text(r.tag||'',100)||!text(r.provenance||'',5000))fail('Invalid run details.');
 if(r.absent&&(!Array.isArray(r.absent)||r.absent.some(s=>!text(s,150))))fail('Invalid absence list.');
 for(const key of ['blue','pink'])if(r[key]&&(!text(r[key].name,100)||!(r[key].stars===null||[1,2,3].includes(r[key].stars))))fail('Invalid colored spark.');
 }
 const treeIds=new Set();for(const t of input.trees){if(t?.icon&&!['grove','leaf','star','flower','moon','sun'].includes(t.icon))fail('Invalid grove icon.');if(!t||!safeId(t.id)||treeIds.has(t.id)||!text(t.name,200)||!t.name.trim()||!text(t.description||'',1000)||t.priority&&!list(t.priority,x=>text(x,150))||!Array.isArray(t.revisions)||!t.revisions.length||t.revisions.length>100)fail('Invalid tree.');if(t.priorityLevels&&(typeof t.priorityLevels!=='object'||Array.isArray(t.priorityLevels)||Object.entries(t.priorityLevels).some(([k,v])=>!text(k,150)||!['high','normal','situational'].includes(v))))fail('Invalid priority levels.');treeIds.add(t.id);for(const v of t.revisions)if(!v||!text(v.id,100)||!Array.isArray(v.skills)||!v.skills.length||v.skills.length>12||v.skills.some(s=>!text(s,150)||!s.trim())||new Set(v.skills).size!==v.skills.length)fail('Invalid core revision.');if(!Array.isArray(t.entries)||t.entries.length>10000||new Set(t.entries.map(e=>e?.runId)).size!==t.entries.length)fail('Invalid tree entries.');for(const e of t.entries){if(!e||!ids.has(e.runId)||!t.revisions.some(v=>v.id===e.revisionId)||(e.previous&&!t.entries.some(x=>x.runId===e.previous)))fail('Invalid progression reference.');}}
 for(const r of input.runs)for(const p of r.parents)if(p!==null&&!ids.has(p))fail('Missing ancestor record.');
 const checkCycles=(nodes,links)=>{const done=new Set(),active=new Set();function visit(id,depth=0){if(depth>500)fail('Lineage is too deep.');if(active.has(id))fail('A lineage cannot contain a cycle.');if(done.has(id))return;active.add(id);for(const p of links(id).filter(Boolean))visit(p,depth+1);active.delete(id);done.add(id);}nodes.forEach(id=>visit(id));};
 checkCycles([...ids],id=>record(input,id).parents);for(const t of input.trees)checkCycles(t.entries.map(e=>e.runId),id=>[t.entries.find(e=>e.runId===id)?.previous]);
 return JSON.parse(JSON.stringify(input));
}
export function mergeSaves(a,b){validate(b);const out=structuredClone(a),map=new Map(b.runs.map(r=>[r.id,uid()]));for(const r of b.runs)out.runs.push({...r,id:map.get(r.id),parents:r.parents.map(id=>map.get(id)||null),...(r.forecast?{forecast:{...r.forecast,parents:r.parents.map(id=>map.get(id)||null)}}:{})});for(const t of b.trees)out.trees.push({...t,id:uid(),entries:t.entries.map(e=>({...e,runId:map.get(e.runId),previous:map.get(e.previous)||null}))});return validate(out);}
