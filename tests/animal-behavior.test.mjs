import assert from 'node:assert/strict';
import {Group,Vector3} from '../vendor/three.module.js';
import {createAnimalBehavior} from '../animal-behavior.js';
import {waterDepth,random} from '../water-map.js';

for (const [id,x,y,z,radius] of [['fox',-10,0,5,4],['deer',-19,0,12,3],['fish',24,-2.5,-17,5]]) {
  const root=new Group();root.position.set(x,y,z);
  const home=root.position.clone();let ticks=0,movingTicks=0;
  const behavior=createAnimalBehavior({id,root},{update(dt,moving){ticks++;if(moving)movingTicks++;}},random(42));
  const player=new Vector3(0,0,5);
  for(let i=0;i<18000;i++) {
    behavior.update(1/60,player);
    assert(Math.hypot(root.position.x-x,root.position.z-z)<=radius+1e-8);
    if(id==='fish') {assert(waterDepth(root.position.x,root.position.z)>2);assert(root.position.y<0);assert(root.position.y>-waterDepth(root.position.x,root.position.z));}
    else assert.equal(waterDepth(root.position.x,root.position.z),0);
  }
  assert(movingTicks>0,`${id} should move`);
  assert(root.position.distanceTo(home)>.01);
  const position=root.position.clone(),rotation=root.rotation.clone(),before=ticks;
  behavior.update(1,new Vector3(0,0,5),{paused:true});
  behavior.update(1,new Vector3(1000,0,1000));
  assert(root.position.equals(position));assert(root.rotation.equals(rotation));assert.equal(ticks,before);
}
const deer=new Group();deer.position.set(-19,0,12);
const behavior=createAnimalBehavior({id:'deer',root:deer},{update(){}},random(7));
const close=new Vector3(-19,0,10);
behavior.update(.05,close,{playerSpeed:6});assert.equal(behavior.mode,'flee');
behavior.update(.05,close,{playerSpeed:6,calm:true});assert.equal(behavior.mode,'rest');
const before=deer.position.clone();for(let i=0;i<300;i++)behavior.update(1/60,close,{playerSpeed:0});
assert(deer.position.equals(before),'quiet approach must allow interaction');
console.log('PASS: five-minute simulations for fox, deer and fish; habitat bounds, swimming depth, pause, distance culling, startle and calm interaction.');
