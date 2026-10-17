import * as T from './vendor/three.module.js';
import {abilities,barriers,chambers,claimAbilityTreasure} from './abilities.js?v=abilities-17';
import {rescue,rescueStage,advanceRescue} from './rescue-quest.js?v=rescue-18';
import {melodyStones,playMelodyStone} from './melody-quest.js?v=melody-21';
import {waterDepth} from './water-map.js';
import {worldQuestObjects,handleWorldQuest} from './world-quests.js?v=world-22';
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
  const stoneRoots=melodyStones.map((def,index)=>{const root=new T.Group();root.position.set(def.x,-waterDepth(def.x,def.z)+.75,def.z);group.add(root);const material=new T.MeshStandardMaterial({color:def.color,emissive:def.color,emissiveIntensity:.75,roughness:.65});const stone=new T.Mesh(new T.DodecahedronGeometry(.55),material);stone.scale.y=1.35;root.add(stone);const ring=new T.Mesh(new T.TorusGeometry(.8,.08,8,24),material);ring.rotation.x=Math.PI/2;root.add(ring);return{root,stone,index};});
  const questMaterial=new T.MeshStandardMaterial({color:'#f5cf86',emissive:'#9f6b28',emissiveIntensity:.45,roughness:.8});
  const makeMarker=(position,kind,index=0)=>{const root=new T.Group();root.position.fromArray(position);group.add(root);const shape=kind==='branch'?new T.CylinderGeometry(.12,.16,1.4,7):kind==='duckling'?new T.SphereGeometry(.32,10,8):new T.OctahedronGeometry(.36);const mesh=new T.Mesh(shape,questMaterial);if(kind==='branch')mesh.rotation.z=Math.PI/2;if(kind==='duckling')mesh.scale.set(1,.8,1.2);root.add(mesh);return{root,mesh,kind,index};};
  const worldEntries=[
    ...worldQuestObjects.beaver.branches.map((p,i)=>makeMarker(p,'branch',i)),
    makeMarker(worldQuestObjects.beaver.home,'beaver'),
    makeMarker(worldQuestObjects.mail.bag,'mailBag'),
    ...worldQuestObjects.mail.recipients.map((p,i)=>makeMarker(p,'recipient',i)),
    ...worldQuestObjects.ducks.ducklings.map((p,i)=>makeMarker(p,'duckling',i))
  ];
  const duckTrails=new T.Group();group.add(duckTrails);for(const p of worldQuestObjects.ducks.ducklings){for(let i=0;i<7;i++){const paw=new T.Mesh(new T.CircleGeometry(.1,7),glow);paw.rotation.x=-Math.PI/2;paw.position.set(p[0]+i*.65,.04,p[2]+Math.sin(i)*.3);duckTrails.add(paw);}}
  const cub=new T.Group();cub.position.fromArray(rescue.animal);group.add(cub);
  const orange=new T.MeshStandardMaterial({color:'#c86f3f',roughness:.9});
  const cream=new T.MeshStandardMaterial({color:'#f0d0a0',roughness:.9});
  const body=new T.Mesh(new T.SphereGeometry(.35,10,8),orange);body.scale.set(.8,.8,1.25);cub.add(body);
  const head=new T.Mesh(new T.SphereGeometry(.27,10,8),orange);head.position.set(0,.35,.28);cub.add(head);
  for(const x of [-.15,.15]){const ear=new T.Mesh(new T.ConeGeometry(.1,.25,4),cream);ear.position.set(x,.62,.28);cub.add(ear);}
  const tail=new T.Mesh(new T.ConeGeometry(.12,.65,7),orange);tail.rotation.x=-1.1;tail.position.set(0,.12,-.55);cub.add(tail);
  let current=null,currentStone=null,currentWorld=null;
  return {
    update(state,position,time){
      const rescueActive=Object.entries(state.quests||{}).filter(([id])=>!['rescue','melody','beaver','mail','ducklings'].includes(id)).every(([,done])=>done);
      trail.visible=state.form==='fox'&&(!state.abilityTreasures?.includes('fox')||(rescueActive&&rescueStage(state)==='track'));current=null;currentStone=null;currentWorld=null;let best=1.8;
      clue.visible=rescueActive&&rescueStage(state)==='track'&&state.form==='fox';
      cub.visible=rescueActive&&rescueStage(state)==='reach';cub.rotation.y=Math.sin(time*.8)*.2;
      for(const [id,{root,jewel}]of treasures){root.visible=state.form===id&&!state.abilityTreasures?.includes(id);jewel.rotation.y=time*.8;
        if(root.visible){const d=root.position.distanceTo(position);if(d<best){best=d;current=id;}}}
      const melodyActive=state.quests?.rescue&&!state.quests?.melody;
      for(const entry of stoneRoots){entry.root.visible=melodyActive;entry.stone.rotation.y=time*.65+entry.index;if(entry.root.visible){const d=entry.root.position.distanceTo(position);if(d<best){best=d;current=null;currentStone=entry.index;}}}
      const beaverActive=state.quests?.melody&&!state.quests?.beaver,mailActive=state.quests?.beaver&&!state.quests?.mail,duckActive=state.quests?.mail&&!state.quests?.ducklings;
      duckTrails.visible=duckActive&&state.form==='fox';
      for(const entry of worldEntries){entry.root.visible=(entry.kind==='branch'&&beaverActive&&!state.beaverBranches?.includes(entry.index))||(entry.kind==='beaver'&&beaverActive)||(entry.kind==='mailBag'&&mailActive&&!state.mailStarted)||(entry.kind==='recipient'&&mailActive&&state.mailStarted&&!state.mailDelivered?.includes(entry.index))||(entry.kind==='duckling'&&duckActive&&!state.ducklingsFound?.includes(entry.index));entry.mesh.rotation.y=time*.7+entry.index;if(entry.root.visible){const d=entry.root.position.distanceTo(position);if(d<best){best=d;current=null;currentStone=null;currentWorld=entry;}}}
      return current;
    },
    interact(state,position){
      if(currentStone!==null){const result=playMelodyStone(state,currentStone,state.form);state.rescueNotice=result.message;currentStone=null;return 'אבני הצליל';}
      if(currentWorld){const entry=currentWorld,result=handleWorldQuest(state,entry.kind,entry.index,state.form);state.rescueNotice=result.message;currentWorld=null;return result.discovery||({branch:'ענפי הסכר',beaver:'משפחת הבונים',mailBag:'תיק הדואר',recipient:'מכתב שנמסר',duckling:'גור ברווז'}[entry.kind]);}
      const rescueResult=advanceRescue(state,state.form,position);
      if(rescueResult){state.rescueNotice=rescueResult==='clue'?'מצאת את הריח! עכשיו הפכי לתוכי ועופי אל הצמרות ✧':'הגורה ניצלה! קיבלת 4 זרעים ו־4 נוצות ♡';return rescueResult==='clue'?'ריח הגורה':'גורת השועל';}
      if(!current||!claimAbilityTreasure(state,current,position))return null;const id=current;current=null;return abilities[id].title;
    }
  };
}
