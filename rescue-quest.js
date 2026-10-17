export const rescue={id:'rescue',title:'בעקבות הגורה האבודה',clue:[-18,.4,-1],animal:[-28,9,-35]};

export function rescueStage(state){
  if(state.quests?.rescue)return'done';
  return state.rescueStage==='reach'?'reach':'track';
}

export function rescueQuest(state){
  if(rescueStage(state)==='done')return null;
  if(!state.quests?.rabbit||!state.quests?.nest)return{id:'rescue',title:rescue.title,text:'עזרי קודם לארנבת וגלי את הקן כדי לפתוח את צורות השועל והתוכי.',target:[0,0,3]};
  return rescueStage(state)==='track'
    ?{id:'rescue',title:rescue.title,text:'הפכי לשועל ועקבי אחר העקבות הזהובות משמאל לבית. בקצה השביל לחצי פעולה כדי להריח את הרמז.',target:rescue.clue}
    :{id:'rescue',title:'הגורה בין הצמרות',text:'הריח מוביל לצמרות מצפון־מערב. הפכי לתוכי, עופי אל גורת השועל ולחצי פעולה כדי לחלץ אותה.',target:rescue.animal};
}

export function advanceRescue(state,form,position){
  const stage=rescueStage(state),target=stage==='track'?rescue.clue:rescue.animal,required=stage==='track'?'fox':'parrot';
  const ready=['rabbit','nest','lake','reef','garden','lookout'].every(id=>state.quests?.[id]);
  if(!ready||state.quests?.rescue||form!==required||Math.hypot(position.x-target[0],position.y-target[1],position.z-target[2])>2)return null;
  if(stage==='track'){state.rescueStage='reach';return'clue';}
  state.quests.rescue=true;state.rescueStage='done';
  if(!state.rescueRewarded){state.inventory.seed+=4;state.inventory.feather+=4;state.rescueRewarded=true;}
  return'done';
}
