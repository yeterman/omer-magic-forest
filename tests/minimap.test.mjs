import assert from 'node:assert/strict';
import {mapPoint} from '../minimap.js';
const origin={x:10,z:-5};
assert.deepEqual(mapPoint(origin,{x:10,z:-5},50,180),{x:90,y:90,clamped:false,distance:0});
const east=mapPoint(origin,{x:20,z:-5},50,180);assert(east.x>90);assert.equal(east.y,90);assert.equal(east.clamped,false);
const north=mapPoint(origin,{x:10,z:-25},50,180);assert(north.y<90);
const far=mapPoint(origin,{x:1010,z:-5},50,180);assert.equal(far.clamped,true);assert(far.x<180&&far.x>160);
console.log('PASS: minimap projection, direction and edge clamping.');
