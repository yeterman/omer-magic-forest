export const abilities={
  fox:{title:'אף של בלש',hint:'עקבות זהובות נראות רק כשועל. עקבי אחריהן משמאל לבית עד האוצר.',target:[-18,.6,-1]},
  deer:{title:'קפיצת אייל',hint:'רווח או ↑ לקפיצה גבוהה. דלגי מעל הגזע בחצר האיילה, משמאל לבית.',target:[-15,.6,18]},
  parrot:{title:'כנפיים קטנות',hint:'עופי אל התא שבצמרות מצפון לבית. רק תוכי יכול לעבור בפתח הקטן.',target:[-8,9.5,-25]},
  fish:{title:'מעבר בין סלעים',hint:'צללי אל התא הסלעי בדרום האגם. רק דג קטן יכול לעבור בפתח.',target:[26,-3,-21]},
  rabbit:{title:'זינוק מהיר',hint:'הארנבת רצה מהר וקופצת גבוה. חפשי אוצר ליד הסכר המתוקן.',target:[-33,.6,25]},
  owl:{title:'מעוף שקט',hint:'הינשוף עף בשקט ובשליטה. חפשי אוצר מעל צמרות הנהר.',target:[24,14,-48]},
  otter:{title:'שחיית זרם',hint:'הלוטרה שוחה מהר במים עמוקים. חפשי אוצר בערוץ הנהר.',target:[24,-4,-62]}
};
export const jumpSpeed=form=>form==='deer'?8.5:form==='rabbit'?7.4:5;
export const chambers=[{id:'parrot',x:-8,y:9.5,z:-25},{id:'fish',x:26,y:-3,z:-21}];
// Match the visible walls, including a small body clearance around every wall.
export const barriers=[
  {x:-15,y:.8,z:15,sx:8,sy:1.6,sz:.7},
  {x:-19,y:1,z:18,sx:.4,sy:2,sz:6},
  {x:-11,y:1,z:18,sx:.4,sy:2,sz:6},
  {x:-15,y:1,z:21,sx:8,sy:2,sz:.4}
];
for(const c of chambers){
  for(const [dx,dy,dz,sx,sy,sz]of [[-1.4,0,0,.25,2.8,3],[1.4,0,0,.25,2.8,3],[0,0,-1.4,2.8,2.8,.25],[0,1.4,0,2.8,.25,3],[0,-1.4,0,2.8,.25,3],[-1,0,1.4,.8,2.8,.25],[1,0,1.4,.8,2.8,.25]])barriers.push({x:c.x+dx,y:c.y+dy,z:c.z+dz,sx,sy,sz,chamber:c.id});
}
function inside(p,b,margin=.16){return Math.abs(p.x-b.x)<b.sx/2+margin&&Math.abs(p.y-b.y)<b.sy/2+margin&&Math.abs(p.z-b.z)<b.sz/2+margin;}
export function canMove(form,p){
  if(barriers.some(b=>inside(p,b)))return false;
  // Larger forms cannot fit through the narrow door; small forms still collide with its walls.
  return !chambers.some(c=>form!==c.id&&inside(p,{...c,sx:2.8,sy:2.8,sz:3}));
}
export function claimAbilityTreasure(state,id,position){
  const a=abilities[id];
  if(!a||state.form!==id||state.abilityTreasures?.includes(id)||Math.hypot(position.x-a.target[0],position.y-a.target[1],position.z-a.target[2])>(id==='parrot'||id==='fish'?.9:1.8))return false;
  state.abilityTreasures??=[];state.abilityTreasures.push(id);
  const key=['fish','otter'].includes(id)?'pearl':['parrot','owl'].includes(id)?'feather':'seed';
  state.inventory[key]+=3;
  return true;
}
