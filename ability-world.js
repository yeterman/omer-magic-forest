import * as T from './vendor/three.module.js';
import {abilities,barriers,chambers,claimAbilityTreasure} from './abilities.js?v=abilities-17';
export function createAbilityWorld(scene){
  const group=new T.Group();scene.add(group);
  const bark=new T.MeshStandardMaterial({color:'#86614b',roughness:1});
  const rock=new T.MeshStandardMaterial({color:'#718e91',roughness:.95});
  const glow=new T.MeshStandardMaterial({color:'#ffd68a',emissive:'#c58a32',emissiveIntensity:.65});
  for(const b of barriers){const m=new T.Mesh(new T.BoxGeometry(b.sx,b.sy,b.sz),b.chamber==='fish'?rock:bark);m.position.set(b.x,b.y,b.z);group.add(m);}
  for(const c of chambers){const ring=new T.Mesh(new T.TorusGeometry(.53,.07,6,16),glow);ring.position.set(c.x,c.y,c.z+1.56);group.add(ring);}
  const treasures=new Map();
  for(const [id,a] of Object.entries(abilities)){const root=new T.Group();root.position.fromArray(a.target);const jewel=new T.Mesh(new T.OctahedronGeometry(.27),glow);root.add(jewel);group.add(root);treasures.set(id,{root,jewel});}
  const trail=new T.Group();group.add(trail);
  for(let i=0;i<26;i++){const t=i/25,x=-5-13*t,z=6-7*t+Math.sin(t*Math.PI)*2;
    for(const side of [-1,1]){const paw=new T.Mesh(new T.CircleGeometry(.12,7),glow);paw.rotation.x=-Math.PI/2;paw.position.set(x+side*.16,.035,z+(side===1?.18:0));trail.add(paw);}}
  let current=null;
  return {
    update(state,position,time){
      trail.visible=state.form==='fox'&&!state.abilityTreasures?.includes('fox');current=null;let best=1.8;
      for(const [id,{root,jewel}]of treasures){root.visible=state.form===id&&!state.abilityTreasures?.includes(id);jewel.rotation.y=time*.8;
        if(root.visible){const d=root.position.distanceTo(position);if(d<best){best=d;current=id;}}}
      return current;
    },
    interact(state,position){if(!current||!claimAbilityTreasure(state,current,position))return null;const id=current;current=null;return abilities[id].title;}
  };
}
