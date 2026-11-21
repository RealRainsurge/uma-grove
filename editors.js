import {SPARKS} from './spark-data.js';
export const GROVE_ICONS={grove:'♧',leaf:'❧',star:'✦',flower:'✿',moon:'☾',sun:'☀'};
export const BLUE_TYPES=['Speed','Stamina','Power','Guts','Wit'];
export const PINK_TYPES=['Turf','Dirt','Sprint','Mile','Medium','Long','Front Runner','Pace Chaser','Late Surger','End Closer'];
export function coloredEditor(field,types){
 const [original,count]=field.value.split('|').map(s=>s.trim());field.hidden=true;
 const host=document.createElement('div');host.className='colored-editor';field.after(host);
 const type=document.createElement('select');type.setAttribute('aria-label',field.name+' spark type');
 for(const name of ['',...types,...(original&&!types.includes(original)?[original]:[])]){const o=document.createElement('option');o.value=name;o.textContent=name||'Not recorded';type.append(o);}type.value=original||'';
 const stars=document.createElement('select');stars.setAttribute('aria-label',field.name+' spark stars');
 for(const n of ['?','1','2','3']){const o=document.createElement('option');o.value=n;o.textContent=n==='?'?'Stars unknown':'★'.repeat(Number(n));stars.append(o);}stars.value=count||'?';
 function sync(){field.value=type.value?type.value+' | '+stars.value:'';stars.disabled=!type.value;}
 type.onchange=stars.onchange=sync;host.append(type,stars);sync();
}
export const canonicalSpark=name=>SPARKS.find(s=>s.name===name||s.aliases.includes(name))?.name||({'J. D. Derby':'J.D. Derby','M. C. Nambu Hai':'M.C. Nambu Hai'}[name])||null;
export const isSkillSpark=name=>SPARKS.some(s=>s.kind==='skill'&&s.name===name);
export function moveItem(list,index,offset){const next=[...list],target=index+offset;if(target>=0&&target<next.length)[next[index],next[target]]=[next[target],next[index]];return next;}
// Native controls work with keyboard and touch; the hidden field only serializes the selection.
export function sparkEditor(field,{skillsOnly=false,ranked=false,stars=false,allowed=()=>true}={}){
 const selected=field.value.split('\n').filter(Boolean).map(line=>{const [name,count]=line.split('|').map(s=>s.trim());return {name:canonicalSpark(name)||name,stars:count||'?'};});
 field.hidden=true;field.required=false;
 const host=document.createElement('div');host.className='spark-editor';field.parentElement.after(host);
 const help=document.createElement('p');help.className='hint';help.textContent=ranked?'Highest priority first. Use the arrows to reorder.':'Choose recorded sparks from the catalog.';host.append(help);
 const search=document.createElement('input');search.type='search';search.placeholder='Filter spark names';search.setAttribute('aria-label','Filter spark names');host.append(search);
 const picker=document.createElement('select');picker.setAttribute('aria-label','Spark to add');host.append(picker);
 const add=document.createElement('button');add.type='button';add.className='secondary';add.textContent='Add spark';host.append(add);
 const rows=document.createElement('div');host.append(rows);
 function sync(){field.value=selected.map(s=>s.name+(stars?' | '+s.stars:'')).join('\n');field.dispatchEvent(new Event('change',{bubbles:true}));}
 function choices(){picker.replaceChildren();for(const s of SPARKS.filter(s=>(!skillsOnly||s.kind==='skill')&&allowed(s.name)&&!selected.some(x=>x.name===s.name)&&s.name.toLowerCase().includes(search.value.toLowerCase()))){const o=document.createElement('option');o.value=s.name;o.textContent=s.name+(s.kind==='skill'?'':' · '+s.kind);picker.append(o);}add.disabled=!picker.options.length;}
 function draw(){rows.replaceChildren();selected.forEach((s,i)=>{const row=document.createElement('div');row.className='spark-edit-row';const name=document.createElement('span');name.textContent=(ranked?(i+1)+'. ':'')+s.name;row.append(name);if(!canonicalSpark(s.name)){const warning=document.createElement('small');warning.textContent='Unrecognized imported entry — remove or replace';row.append(warning);}if(stars){const select=document.createElement('select');select.setAttribute('aria-label',s.name+' stars');for(const v of ['?','1','2','3']){const option=document.createElement('option');option.value=v;option.textContent=v==='?'?'Stars unknown':'★'.repeat(Number(v));select.append(option);}select.value=s.stars;select.onchange=()=>{s.stars=select.value;sync();};row.append(select);}for(const [text,action,disabled] of [...(ranked?[['↑',()=>{selected.splice(0,selected.length,...moveItem(selected,i,-1));draw();},i===0],['↓',()=>{selected.splice(0,selected.length,...moveItem(selected,i,1));draw();},i===selected.length-1]]:[]),['Remove',()=>{selected.splice(i,1);draw();},false]]){const b=document.createElement('button');b.type='button';b.textContent=text;b.disabled=disabled;b.className='quiet';b.setAttribute('aria-label',text+' '+s.name);b.onclick=action;row.append(b);}rows.append(row);});sync();choices();}
 search.oninput=choices;add.onclick=()=>{if(picker.value){selected.push({name:picker.value,stars:'?'});draw();}};draw();
}
