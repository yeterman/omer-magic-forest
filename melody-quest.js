export const melodyOrder=[1,0,2];
export const melodyStones=[
  {x:20,z:-16,tone:'נמוך',color:'#78d8f0'},
  {x:25,z:-20,tone:'אמצעי',color:'#d5a7ff'},
  {x:29,z:-15,tone:'גבוה',color:'#ffe69a'}
];

export function melodyQuest(state){
  const progress=state.melodyProgress||[];
  const next=melodyStones[melodyOrder[progress.length]??melodyOrder[0]];
  return{
    id:'melody',
    title:'מנגינת האבנים שמתחת לאגם',
    text:progress.length
      ? `נגני את הרצף לפי האורות: סגול, כחול, זהב. התקדמות ${progress.length}/3.`
      :'הפכי לדג וצללי לעומק האגם. נגני באבנים לפי האורות: סגול, כחול, זהב.',
    target:[next.x,-4,next.z]
  };
}

export function playMelodyStone(state,index,form){
  state.melodyProgress??=[];
  if(form!=='fish')return{ok:false,message:'רק דג קטן יכול לעבור בין הסלעים ולנגן באבנים.'};
  const expected=melodyOrder[state.melodyProgress.length];
  if(index!==expected){
    state.melodyProgress=[];
    return{ok:false,reset:true,message:'הצלילים התבלבלו. האורות מבקשים להתחיל שוב: סגול, כחול, זהב.'};
  }
  state.melodyProgress.push(index);
  if(state.melodyProgress.length<melodyOrder.length)return{ok:true,message:`צליל נכון ✦ ${state.melodyProgress.length}/3`};
  state.quests.melody=true;
  if(!state.melodyRewarded){
    state.melodyRewarded=true;
    state.inventory.pearl=(state.inventory.pearl||0)+6;
  }
  return{ok:true,complete:true,message:'המנגינה העתיקה התעוררה! קיבלת 6 פנינים ✧'};
}
