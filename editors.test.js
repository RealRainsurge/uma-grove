import test from 'node:test';
import assert from 'node:assert/strict';
import {SPARKS} from './spark-data.js';
import {canonicalSpark,isSkillSpark,moveItem} from './editors.js';
test('white spark choices exclude learned gold, unique, negative and upgraded skills',()=>{
 for(const name of ['Triumphant Pulse','Professor of Curvature','Right-Handed ×','Right-Handed ◎','G1 Averseness','Made up skill'])assert.equal(isSkillSpark(name),false,name);
 for(const name of ['Head-On','Groundwork','Right-Handed ○','Racing Spirit: Stamina'])assert.equal(isSkillSpark(name),true,name);
 assert.equal(new Set(SPARKS.map(s=>s.name)).size,SPARKS.length);
 assert.ok(SPARKS.some(s=>s.name==='URA Finale'&&s.kind==='scenario'));
 assert.equal(isSkillSpark('URA Finale'),false);
 assert.equal(canonicalSpark('J. D. Derby'),'J.D. Derby');
});
test('priority moves preserve every entry and respect boundaries',()=>{
 const original=['Head-On','Tail Held High','Groundwork'];
 assert.deepEqual(moveItem(original,1,-1),['Tail Held High','Head-On','Groundwork']);
 assert.deepEqual(moveItem(original,0,-1),original);
 assert.deepEqual(moveItem(original,2,1),original);
 assert.deepEqual(original,['Head-On','Tail Held High','Groundwork']);
});
