import assert from 'node:assert/strict';
import {waterAt,waterDepth,swimFloorY} from '../water-map.js';

assert(waterDepth(24,-17)>=9.4,'the lake center should support a deep dive');
assert(waterDepth(24,-60)>=6.3,'the river should contain a deeper channel');
assert.equal(waterAt(24,-17),true);
assert.equal(waterAt(0,0),false);
assert.equal(swimFloorY(24,-17),-waterDepth(24,-17)+1.1);

let largestStep=0;
for(let x=9;x<=39;x+=.1){largestStep=Math.max(largestStep,Math.abs(waterDepth(x+.1,-17)-waterDepth(x,-17)));}
assert(largestStep<.16,`lake slope should stay continuous; step was ${largestStep}`);

for(const [x,z] of [[24,-17],[24,-60],[22,-15],[26,-19]]){
  const floor=-waterDepth(x,z);
  assert(swimFloorY(x,z)>floor,'swimmer must remain above the terrain');
  assert(swimFloorY(x,z)<=.05,'swim floor must not rise above the surface');
}

console.log('PASS: deep lake and river, continuous slopes, shared swim floor and terrain clearance.');
