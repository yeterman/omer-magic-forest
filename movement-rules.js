export const GROUND_WADING_DEPTH=.48;
export const treeTypeAt=(x,z)=>Math.abs(Math.floor(x/28)*3+Math.floor(z/28)*5)%4;
export function canEnterWater(kind,depth){return kind!=='ground'||depth<=GROUND_WADING_DEPTH;}
export function resolveTreeMove(current,next,trees,clearance=.46){
  const blocked=(x,z)=>trees.some(t=>(x-t.x)**2+(z-t.z)**2<(t.radius+clearance)**2);
  if(!blocked(next.x,next.z))return next;
  if(!blocked(next.x,current.z))return{...next,z:current.z};
  if(!blocked(current.x,next.z))return{...next,x:current.x};
  return{...current};
}
export function escapeTrees(position,trees,clearance=.46){
  const safe={...position};
  for(const t of trees){const dx=safe.x-t.x,dz=safe.z-t.z,min=t.radius+clearance,d=Math.hypot(dx,dz);if(d<min){const ux=d>.001?dx/d:1,uz=d>.001?dz/d:0;safe.x=t.x+ux*min;safe.z=t.z+uz*min;}}
  return safe;
}
