import assert from 'node:assert/strict';
import {melodyQuest,playMelodyStone} from '../melody-quest.js';

const makeState=()=>({quests:{melody:false},melodyProgress:[],melodyRewarded:false,inventory:{pearl:0}});
let state=makeState();
assert.equal(playMelodyStone(state,1,'dolphin').ok,false);
assert.deepEqual(state.melodyProgress,[]);
assert.equal(playMelodyStone(state,0,'fish').reset,true);
assert.deepEqual(state.melodyProgress,[]);
assert.equal(playMelodyStone(state,1,'fish').ok,true);
assert.equal(melodyQuest(state).target[0],20);
assert.equal(playMelodyStone(state,0,'fish').ok,true);
assert.equal(playMelodyStone(state,2,'fish').complete,true);
assert.equal(state.quests.melody,true);
assert.equal(state.inventory.pearl,6);
playMelodyStone(state,2,'fish');
assert.equal(state.inventory.pearl,6);
console.log('PASS: fish gate, ordered melody, reset, dynamic target, completion and single reward.');
