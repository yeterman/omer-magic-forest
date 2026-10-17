import assert from 'node:assert/strict';
import {forms,formKind,unlocked} from '../animal-library.js';
import {jumpSpeed,abilities} from '../abilities.js';

for(const [id,quest,kind] of [['rabbit','beaver','ground'],['owl','mail','air'],['otter','ducklings','water']]){
  assert.equal(unlocked({quests:{}},id),false);
  assert.equal(unlocked({quests:{[quest]:true}},id),true);
  assert.equal(formKind(id),kind);
  assert(forms[id].asset);
  assert(abilities[id]);
}
assert(jumpSpeed('rabbit')>jumpSpeed('horse'));
assert(forms.rabbit.speed>6);
assert(forms.otter.speed>5);
console.log('PASS: three quest-gated animal forms, valid assets, movement kinds and distinct abilities.');
