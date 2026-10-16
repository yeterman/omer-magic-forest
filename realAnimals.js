import * as T from './vendor/three.module.js';
import {GLTFLoader} from './vendor/GLTFLoader.js';
const horsePromise=new GLTFLoader().loadAsync('./models/horse.glb');
horsePromise.catch(()=>{});
function body(sections,material){const profile=new T.CatmullRomCurve3(sections.map(s=>new T.Vector3(s[0],s[1],s[2])),false,'catmullrom',.3);const center=new T.CatmullRomCurve3(sections.map(s=>new T.Vector3(s[0],s[3],0)),false,'catmullrom',.3);sections=Array.from({length:121},(_,i)=>{const p=profile.getPoint(i/120),c=center.getPoint(i/120);return[p.x,Math.max(.003,p.y),Math.max(.003,p.z),c.y];});const p=[],uv=[],indices=[],rings=40;for(let j=0;j<sections.length;j++){const [z,rx,ry,cy]=sections[j];for(let i=0;i<=rings;i++){const a=i/rings*Math.PI*2;p.push(Math.cos(a)*rx,cy+Math.sin(a)*ry,z);uv.push(i/rings,j/(sections.length-1));if(j<sections.length-1&&i<rings){const n=j*(rings+1)+i;indices.push(n,n+rings+1,n+1,n+1,n+rings+1,n+rings+2);}}}const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(p,3));geo.setAttribute('uv',new T.Float32BufferAttribute(uv,2));geo.setIndex(indices);geo.computeVertexNormals();const mesh=new T.Mesh(geo,material);mesh.castShadow=true;return mesh;}
const eyeMaterial=new T.MeshStandardMaterial({color:'#101a1b',roughness:.14});
function ellipsoid(g,m,x,y,z,sx,sy,sz){const mesh=new T.Mesh(new T.SphereGeometry(1,24,16),m);mesh.position.set(x,y,z);mesh.scale.set(sx,sy,sz);mesh.castShadow=true;g.add(mesh);return mesh;}
function fin(g,points,material){const shape=new T.Shape();shape.moveTo(...points[0]);for(let i=1;i<points.length;i++)shape.lineTo(...points[i]);shape.closePath();const mesh=new T.Mesh(new T.ExtrudeGeometry(shape,{depth:.035,bevelEnabled:true,bevelSegments:3,bevelSize:.025,bevelThickness:.02}),material);mesh.castShadow=true;g.add(mesh);return mesh;}
// Fine feather vanes are painted once and reused by the flight feathers.
const featherCanvas=document.createElement('canvas');featherCanvas.width=128;featherCanvas.height=512;const fc=featherCanvas.getContext('2d');
for(let y=8;y<498;y+=2){const width=Math.sin((y-5)/500*Math.PI)**.7*54;fc.strokeStyle=y%8?'#66513a':'#b19a76';fc.lineWidth=2;for(const sign of [-1,1]){fc.beginPath();fc.moveTo(64,y+10);fc.lineTo(64+sign*width,y-12);fc.stroke();}}
fc.strokeStyle='#cab18b';fc.lineWidth=2;fc.beginPath();fc.moveTo(64,10);fc.lineTo(64,510);fc.stroke();
const featherMap=new T.CanvasTexture(featherCanvas);featherMap.colorSpace=T.SRGBColorSpace;
const featherMaterial=new T.MeshStandardMaterial({map:featherMap,alphaTest:.28,side:T.DoubleSide,roughness:.9});
function flightFeather(g,x,z,length,width,angle){const geo=new T.PlaneGeometry(width,length,2,12);const a=geo.attributes.position;for(let i=0;i<a.count;i++){const t=(a.getY(i)+length/2)/length;a.setZ(i,Math.sin(t*Math.PI)*.04);}geo.computeVertexNormals();const f=new T.Mesh(geo,featherMaterial);f.rotation.set(-Math.PI/2,0,angle);f.position.set(x,-.015,z);f.castShadow=true;g.add(f);return f;}
export function upgradeAnimal(avatar,form,fallback){let active=true,mixer=null,motion=null;const flightWings=[];const ready=form==='horse'?horsePromise:Promise.resolve(null);
ready.then(gltf=>{if(!active)return;const model=new T.Group();
if(form==='horse'){const horse=gltf.scene.clone(true);horse.traverse(o=>{if(o.isMesh){o.geometry=o.geometry.clone();o.geometry.computeVertexNormals();o.material=new T.MeshStandardMaterial({color:'#997153',roughness:.8,vertexColors:false});o.castShadow=true;o.receiveShadow=true;}});const bounds=new T.Box3().setFromObject(horse),size=bounds.getSize(new T.Vector3());const scale=2.45/size.y;horse.scale.setScalar(scale);horse.position.y=-bounds.min.y*scale;horse.rotation.y=0;model.add(horse);mixer=new T.AnimationMixer(horse);if(gltf.animations[0])mixer.clipAction(gltf.animations[0]).setDuration(.8).play();}
else if(form==='eagle'){
const brown=new T.MeshStandardMaterial({color:'#493a2a',roughness:.9}),neck=new T.MeshStandardMaterial({color:'#b69a69',roughness:.95}),beakMat=new T.MeshStandardMaterial({color:'#a39253',roughness:.65});
model.add(body([[-.8,.01,.02,.38],[-.6,.12,.15,.42],[-.25,.25,.28,.48],[.12,.26,.3,.5],[.4,.17,.20,.54],[.64,.13,.15,.61],[.77,.05,.06,.59]],brown));
ellipsoid(model,neck,0,.65,.53,.15,.19,.21);
const hooked=new T.Shape();hooked.moveTo(0,0);hooked.bezierCurveTo(.08,.07,.28,.04,.3,-.1);hooked.lineTo(.22,-.18);hooked.quadraticCurveTo(.24,-.06,.1,-.05);hooked.lineTo(0,-.05);hooked.closePath();const bill=new T.Mesh(new T.ExtrudeGeometry(hooked,{depth:.09,bevelEnabled:true,bevelSize:.014,bevelThickness:.012,bevelSegments:3,curveSegments:18}),beakMat);bill.rotation.y=-Math.PI/2;bill.position.set(.045,.64,.7);model.add(bill);
for(const side of [-1,1]){ellipsoid(model,new T.MeshStandardMaterial({color:'#bc943c'}),side*.13,.70,.65,.035,.04,.035);ellipsoid(model,eyeMaterial,side*.151,.705,.667,.018,.023,.018);const brow=ellipsoid(model,brown,side*.13,.743,.65,.052,.022,.065);brow.rotation.z=side*.18;
const wing=new T.Group();wing.position.set(side*.19,.54,.04);model.add(wing);flightWings.push(wing);
ellipsoid(wing,brown,side*.48,0,-.03,.65,.065,.29);
for(let j=0;j<13;j++){const x=side*(.18+j*.085);flightFeather(wing,x,-.18-j*.016,.62+j*.013,.15,side*(.02+j*.015));}
for(let j=0;j<8;j++){const x=side*(1.03+j*.115);flightFeather(wing,x,-.17+j*.03,.68-j*.037,.16,side*(.12+j*.09));}
for(let row=0;row<3;row++)for(let j=0;j<12;j++){flightFeather(wing,side*(.17+j*.085),.12-row*.11,.28,.13,side*.04);}
for(let j=0;j<3;j++){const toe=new T.Mesh(new T.CylinderGeometry(.012,.015,.15,8),beakMat);toe.position.set(side*.11+(j-1)*.035,.2,.01+j*.015);toe.rotation.x=.7;model.add(toe);}}
for(let j=0;j<9;j++)flightFeather(model,(j-4)*.045,-.75,.48,.1,(j-4)*.035);
for(let j=0;j<16;j++){const a=j*2.4;const tuft=ellipsoid(model,neck,Math.sin(a)*.12,.62+(j%4)*.035,.40+Math.cos(a)*.08,.035,.08,.025);tuft.rotation.x=.5;}
}
else if(form==='dolphin'){
const skin=new T.MeshStandardMaterial({color:'#617f91',roughness:.24,metalness:.03});skin.onBeforeCompile=s=>{s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 animalPosition;').replace('#include <begin_vertex>','#include <begin_vertex>\nanimalPosition=position;');s.fragmentShader=s.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 animalPosition;').replace('#include <color_fragment>','#include <color_fragment>\nfloat belly=1.0-smoothstep(0.13,0.37,animalPosition.y);diffuseColor.rgb=mix(diffuseColor.rgb,vec3(0.72,0.78,0.77),belly*.7);');};
model.add(body([[-1.4,.025,.025,.3],[-1.15,.09,.09,.32],[-.9,.17,.16,.35],[-.6,.26,.26,.38],[-.25,.34,.34,.4],[.15,.35,.35,.4],[.45,.30,.32,.42],[.68,.25,.28,.43],[.81,.2,.21,.4],[.9,.13,.12,.29],[1.15,.10,.08,.27],[1.38,.045,.035,.27],[1.4,.005,.005,.27]],skin));
const dorsal=fin(model,[[0,0],[.18,.1],[.4,.65],[.23,.57],[.08,.32],[-.3,0]],skin);dorsal.rotation.y=Math.PI/2;dorsal.position.set(-.02,.62,-.3);
for(const s of [-1,1]){ellipsoid(model,eyeMaterial,s*.231,.44,.73,.028,.033,.033);const flipper=fin(model,[[0,0],[s*.15,-.06],[s*.62,-.32],[s*.68,-.25],[s*.35,.03]],skin);flipper.rotation.x=Math.PI/2;flipper.position.set(s*.23,.19,.22);}
motion=new T.Group();motion.position.set(0,.3,-1.35);model.add(motion);for(const s of [-1,1]){const fluke=fin(motion,[[0,0],[s*.30,.12],[s*.65,.06],[s*.46,-.17],[s*.12,-.2]],skin);fluke.rotation.x=Math.PI/2;}
const mouth=new T.Line(new T.BufferGeometry().setFromPoints([new T.Vector3(-.09,.235,1.12),new T.Vector3(0,.23,1.36),new T.Vector3(.09,.235,1.12)]),new T.LineBasicMaterial({color:'#3b555b'}));model.add(mouth);
}else{return;}
while(avatar.children.length){const child=avatar.children[0];child.traverse(o=>{if(o.isMesh)o.geometry.dispose();});avatar.remove(child);}avatar.add(model);
}).catch(e=>console.warn('Animal model fallback:',e.message));
return {dispose(){active=false;if(mixer)mixer.stopAllAction();},update(dt,moving,time){if(mixer)mixer.update(dt*(moving?1:.08));if(motion)motion.rotation.x=Math.sin(time*6)*.23;flightWings.forEach((w,i)=>{w.rotation.z=Math.sin(time*(moving?4.5:2.2))*(moving?.18:.045)*(i?1:-1);w.rotation.x=Math.sin(time*2)*.025;});}};
}
