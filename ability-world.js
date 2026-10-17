import * as T from './vendor/three.module.js';
import {abilities,barriers,chambers,claimAbilityTreasure} from './abilities.js?v=abilities-17';
import {rescue,rescueStage,advanceRescue} from './rescue-quest.js?v=rescue-18';
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
  const clue=new T.Mesh(new T.OctahedronGeometry(.2),glow);clue.position.fromArray(rescue.clue);group.add(clue);
  const cub=new T.Group();cub.position.fromArray(rescue.animal);group.add(cub);
  const orange=new T.MeshStandardMaterial({color:'#c86f3f',roughness:.9});
  const cream=new T.MeshStandardMaterial({color:'#f0d0a0',roughness:.9});
  const body=new T.Mesh(new T.SphereGeometry(.35,10,8),orange);body.scale.set(.8,.8,1.25);cub.add(body);
  const head=new T.Mesh(new T.SphereGeometry(.27,10,8),orange);head.position.set(0,.35,.28);cub.add(head);
  for(const x of [-.15,.15]){const ear=new T.Mesh(new T.ConeGeometry(.1,.25,4),cream);ear.position.set(x,.62,.28);cub.add(ear);}
  const tail=new T.Mesh(new T.ConeGeometry(.12,.65,7),orange);tail.rotation.x=-1.1;tail.position.set(0,.12,-.55);cub.add(tail);
  let current=null;
  return {
    update(state,position,time){
      const rescueActive=Object.entries(state.quests||{}).filter(([id])=>id!=='rescue').every(([,done])=>done);
      trail.visible=state.form==='fox'&&(!state.abilityTreasures?.includes('fox')||(rescueActive&&rescueStage(state)==='track'));current=null;let best=1.8;
      clue.visible=rescueActive&&rescueStage(state)==='track'&&state.form==='fox';
      cub.visible=rescueActive&&rescueStage(state)==='reach';cub.rotation.y=Math.sin(time*.8)*.2;
      for(const [id,{root,jewel}]of treasures){root.visible=state.form===id&&!state.abilityTreasures?.includes(id);jewel.rotation.y=time*.8;
        if(root.visible){const d=root.position.distanceTo(position);if(d<best){best=d;current=id;}}}
      return current;
    },
    interact(state,position){
      const rescueResult=advanceRescue(state,state.form,position);
      if(rescueResult){state.rescueNotice=rescueResult==='clue'?'מצאת את הריח! עכשיו הפכי לתוכי ועופי אל הצמרות ✧':'הגורה ניצלה! קיבלת 4 זרעים ו־4 נוצות ♡';return rescueResult==='clue'?'ריח הגורה':'גורת השועל';}
      if(!current||!claimAbilityTreasure(state,current,position))return null;const id=current;current=null;return abilities[id].title;
    }
  };
}
