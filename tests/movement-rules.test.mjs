import assert from 'node:assert/strict';
import {GROUND_WADING_DEPTH,canEnterWater,resolveTreeMove,escapeTrees,treeTypeAt} from '../movement-rules.js';

assert.equal(canEnterWater('ground',GROUND_WADING_DEPTH),true);
assert.equal(canEnterWater('ground',GROUND_WADING_DEPTH+.01),false);
assert.equal(canEnterWater('air',9),true);
assert.equal(canEnterWater('water',9),true);
const trees=[{x:1,z:0,radius:.6}];
assert.deepEqual(resolveTreeMove({x:0,y:0,z:0},{x:1,y:0,z:1},trees),{x:0,y:0,z:1});
const escaped=escapeTrees({x:1,y:0,z:0},trees);
assert(escaped.x>2);
const types=new Set();
for(let x=-84;x<=84;x+=28)for(let z=-84;z<=84;z+=28)types.add(treeTypeAt(x,z));
assert.deepEqual([...types].sort(),[0,1,2,3]);
assert.equal(treeTypeAt(56,-28),treeTypeAt(56,-28));
console.log('PASS: shoreline gate, air/water passage, tree sliding, overlap escape and four deterministic tree regions.');
