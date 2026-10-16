export const questDefinitions=[
{id:'rabbit',title:'חברה קטנה צריכה עזרה',text:'ארנבת מחכה ליד הפרחים, משמאל לבית. אספי צמח מרפא וחזרי אליה.',target:[-8,0,-8]},
{id:'nest',title:'סוד בין הצמרות',text:'הפכי לעיט ועופי אל הקן שבעץ הסגול, מעבר לארנבת. התקרבי ולחצי פעולה.',target:[-16,10,-21]},
{id:'lake',title:'הקסם שמתחת למים',text:'האגם נמצא מימין לבית. הפכי לדולפין, צללי ואספי את פרח המים.',target:[29,-3.6,-18]},
{id:'reef',title:'אוצרות הקרקעית',text:'צללי לאגם כדולפין ואספי שלושה צדפים שונים מקרקעית האגם. ↓ לצלילה, ↑ לעלייה.',target:[24,-4,-17]},
{id:'garden',title:'בית מרקחת של היער',text:'אספי שלושה צמחי מרפא שונים למשימת ההמשך. חפשי אותם בשולי היער.',target:[-13,0,8]},
{id:'lookout',title:'פרח מעל היער',text:'הפכי לעיט ועלי אל פרח הרוח הזוהר שבין הצמרות ליד הבית. התקרבי ואספי אותו.',target:[12,12,-35]}
];
export function activeQuest(state){return questDefinitions.find(q=>!state.quests[q.id])||{id:null,title:'המסע שלך ממשיך',text:'כל שש המשימות הושלמו! חזרי לקשט את הבית, לטפל בארנבת או לחקור מקומות חדשים.',target:[0,0,3]};}
export function registerQuestItem(state,item,form,y){const q=activeQuest(state);state.bonusCollected??={reef:[],garden:[]};if(q.id==='reef'&&item.type==='shell'&&form==='dolphin'&&y< -1){if(!state.bonusCollected.reef.includes(item.id))state.bonusCollected.reef.push(item.id);if(state.bonusCollected.reef.length>=3)return'reef';}if(q.id==='garden'&&item.type==='herb'){if(!state.bonusCollected.garden.includes(item.id))state.bonusCollected.garden.push(item.id);if(state.bonusCollected.garden.length>=3)return'garden';}if(q.id==='lookout'&&item.type==='windflower'&&form==='eagle')return'lookout';return null;}
