export function random(seed){return()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
export function forestPond(cx,cz){if(cx>=-1&&cx<=1&&cz>=-1&&cz<=0)return null;const roll=random((cx*83492791)^(cz*297121507)^7163);if(roll()>.48&&!(cx===0&&cz===1))return null;return{x:(cx+.5)*32,z:(cz+.5)*32,rx:5+roll()*4,rz:4+roll()*3};}
// The same continuous depth field drives the ground mesh, swimming and camera.
export function waterDepth(x,z){const lake=Math.hypot((x-24)/15,(z+17)/11);let d=lake<1?5.8*Math.min(1,(1-lake)*4):0;if(z<-24&&z>-119&&Math.abs(x-24)<5.5){const edge=Math.min((5.5-Math.abs(x-24))/2,(z+119)/3,(-24-z)/2);d=Math.max(d,4.8*Math.min(1,edge));}const p=forestPond(Math.floor(x/32),Math.floor(z/32));if(p){const radius=Math.hypot((x-p.x)/p.rx,(z-p.z)/p.rz);if(radius<1)d=Math.max(d,3.6*Math.min(1,(1-radius)*3));}return Math.max(0,d);}
export const waterAt=(x,z)=>waterDepth(x,z)>.12;
