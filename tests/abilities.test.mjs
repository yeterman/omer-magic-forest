import assert from 'node:assert/strict';
import {abilities,jumpSpeed,canMove,claimAbilityTreasure} from '../abilities.js';
// Horse cannot clear the log. Deer can cross at its jump apex.
assert(5*5/24<1.6);assert(jumpSpeed('deer')**2/24>1.8);
assert.equal(canMove('horse',{x:-15,y:1,z:15}),false);
assert.equal(canMove('deer',{x:-15,y:2.4,z:15}),true);
for(const [id,other] of [['parrot','eagle'],['fish','dolphin']]){
 const [x,y,z]=abilities[id].target;
 for(let k=0;k<=20;k++){const p={x,y,z:z+2-k*.1};assert(canMove(id,p),'small form passes through doorway');}
 assert.equal(canMove(other,{x,y,z:z+1.5}),false,'large form cannot enter');
 assert.equal(canMove(id,{x:x+1.4,y,z}),false,'small form still hits walls');
 const state={form:id,inventory:{seed:0,feather:0,pearl:0}};
 assert.equal(claimAbilityTreasure(state,id,{x,y,z:z+1.7}),false,'cannot collect through doorway');
}
for(const [id,a]of Object.entries(abilities)){
 const [x,y,z]=a.target,p={x,y,z};
 const state={form:'horse',inventory:{seed:0,feather:0,pearl:0}};
 assert.equal(claimAbilityTreasure(state,id,p),false);
 state.form=id;
 assert.equal(claimAbilityTreasure(state,id,{x:x+10,y,z}),false);
 assert.equal(claimAbilityTreasure(state,id,p),true);
 const restored=JSON.parse(JSON.stringify(state));
 assert.equal(claimAbilityTreasure(restored,id,p),false);
 assert.equal(Object.values(restored.inventory).reduce((a,b)=>a+b,0),3);
}
console.log('PASS: jump clearance, narrow entry, wall collisions, correct-form rewards, distance and persisted single-use treasure.');
