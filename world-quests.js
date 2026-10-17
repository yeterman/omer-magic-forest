export const worldQuestObjects={
  beaver:{home:[-30,0,28],branches:[[-36,0,23],[-43,0,31],[-49,1.2,25]]},
  mail:{bag:[-16,10,-21],recipients:[[-19,1,12],[-30,1,28],[8,11,-38]]},
  ducks:{mother:[24,0,-31],ducklings:[[15,0,-39],[34,0,-46],[24,0,-58]]}
};

export function beaverQuest(state){
  const found=state.beaverBranches||[];
  const target=found.length<3?worldQuestObjects.beaver.branches.find((_,i)=>!found.includes(i)):worldQuestObjects.beaver.home;
  return{id:'beaver',title:'תיקון הסכר של משפחת הבונים',text:found.length<3?`אספי שלושה ענפים והביאי אותם לבונה. נמצאו ${found.length}/3.`:'כל הענפים נאספו. חזרי אל הבונה ליד הבריכה.',target};
}
export function mailQuest(state){
  const delivered=state.mailDelivered||[];
  if(!state.mailStarted)return{id:'mail',title:'הדואר המעופף של התוכי',text:'עופי כתוכי אל הקן ואספי את תיק הדואר.',target:worldQuestObjects.mail.bag};
  const target=worldQuestObjects.mail.recipients.find((_,i)=>!delivered.includes(i))||worldQuestObjects.mail.bag;
  return{id:'mail',title:'הדואר המעופף של התוכי',text:`מסרי מכתבים לשלוש החיות. נמסרו ${delivered.length}/3.`,target};
}
export function duckQuest(state){
  const found=state.ducklingsFound||[];
  const target=worldQuestObjects.ducks.ducklings.find((_,i)=>!found.includes(i))||worldQuestObjects.ducks.mother;
  return{id:'ducklings',title:'גורי הברווזים שאיבדו את הדרך',text:`הפכי לשועל ועקבי אחר העקבות אל שלושת הגורים. נמצאו ${found.length}/3.`,target};
}

export function handleWorldQuest(state,kind,index,form){
  if(kind==='branch'){
    state.beaverBranches??=[];
    if(index===2&&form!=='deer')return{ok:false,message:'הענף האחרון נמצא מעבר לגזע. האייל יכול לקפוץ אליו.'};
    if(!state.beaverBranches.includes(index))state.beaverBranches.push(index);
    return{ok:true,message:`אספת ענף ✦ ${state.beaverBranches.length}/3`};
  }
  if(kind==='beaver'){
    if((state.beaverBranches?.length||0)<3)return{ok:false,message:'הבונה עדיין מחכה לשלושה ענפים.'};
    state.quests.beaver=true;if(!state.beaverRewarded){state.beaverRewarded=true;state.inventory.seed+=6;}
    return{ok:true,complete:true,discovery:'הסכר המתוקן',message:'הסכר תוקן! קיבלת 6 זרעים ✧'};
  }
  if(kind==='mailBag'){
    if(form!=='parrot')return{ok:false,message:'רק התוכי יכול לשאת את תיק הדואר בין הצמרות.'};
    state.mailStarted=true;return{ok:true,message:'תיק הדואר מוכן. שלושה מכתבים מחכים למסירה ✉'};
  }
  if(kind==='recipient'){
    if(form!=='parrot')return{ok:false,message:'צריך להגיע כתוכי כדי למסור את המכתב.'};
    state.mailDelivered??=[];if(!state.mailDelivered.includes(index))state.mailDelivered.push(index);
    if(state.mailDelivered.length<3)return{ok:true,message:`המכתב נמסר ✉ ${state.mailDelivered.length}/3`};
    state.quests.mail=true;if(!state.mailRewarded){state.mailRewarded=true;state.inventory.feather+=6;}
    return{ok:true,complete:true,discovery:'הדואר המעופף',message:'כל המכתבים נמסרו! קיבלת 6 נוצות ✧'};
  }
  if(kind==='duckling'){
    if(form!=='fox')return{ok:false,message:'רק השועל יכול לראות את העקבות ולהרגיע את הגור.'};
    state.ducklingsFound??=[];if(!state.ducklingsFound.includes(index))state.ducklingsFound.push(index);
    if(state.ducklingsFound.length<3)return{ok:true,message:`הגור חזר לאמא ♡ ${state.ducklingsFound.length}/3`};
    state.quests.ducklings=true;if(!state.duckRewarded){state.duckRewarded=true;state.inventory.seed+=4;state.inventory.feather+=4;}
    return{ok:true,complete:true,discovery:'משפחת הברווזים',message:'כל הגורים חזרו! קיבלת 4 זרעים ו־4 נוצות ♡'};
  }
  return null;
}
