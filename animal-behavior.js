import {waterDepth} from './water-map.js';

// Each friend stays close to its quest location. All clocks advance only during play.
export function createAnimalBehavior(friend, animation, rng = Math.random) {
  const {root, id} = friend;
  const home = root.position.clone();
  let time = 0, timer = 1 + rng() * 3, mode = 'rest', target = null;
  let fleeTime = 0, cooldown = 0, moving = false;
  const radius = id === 'fish' ? 5 : id === 'fox' ? 4 : 3;
  function valid(x, z) {
    if (Math.hypot(x - home.x, z - home.z) > radius) return false;
    return id === 'fish' ? waterDepth(x, z) > 2 : waterDepth(x, z) === 0;
  }
  function chooseTarget(away) {
    for (let i = 0; i < 12; i++) {
      const angle = away === undefined ? rng() * Math.PI * 2 : away + (rng() - .5) * .8;
      const distance = 1 + rng() * 2;
      const x = root.position.x + Math.sin(angle) * distance;
      const z = root.position.z + Math.cos(angle) * distance;
      if (valid(x, z)) return {x, z};
    }
    return null;
  }
  return {
    get mode() { return mode; },
    update(dt, player, {paused = false, playerSpeed = 0, calm = false} = {}) {
      if (paused || root.position.distanceToSquared(player) > 55 * 55) return;
      time += dt;
      cooldown = Math.max(0, cooldown - dt);
      const distance = root.position.distanceTo(player);
      if (id === 'parrot') {
        root.position.y = home.y + Math.sin(time * 1.7) * .08;
        root.rotation.y = Math.sin(time * .6) * .35;
        animation.update(dt, false, time);
        return;
      }
      // A quick approach startles the deer once; a quiet approach always allows talking.
      if (id === 'deer' && !calm && cooldown === 0 && distance < 5 && playerSpeed > 2) {
        target = chooseTarget(Math.atan2(root.position.x - player.x, root.position.z - player.z));
        if (target) { mode = 'flee'; fleeTime = .9; cooldown = 9; }
      }
      if (mode === 'flee') fleeTime -= dt;
      const talking = id !== 'fish' && distance < 3.5 && (mode !== 'flee' || calm);
      moving = false;
      if (talking) {
        mode = 'rest'; target = null; timer = 2;
        root.rotation.y += Math.atan2(Math.sin(Math.atan2(player.x-root.position.x,player.z-root.position.z)-root.rotation.y),Math.cos(Math.atan2(player.x-root.position.x,player.z-root.position.z)-root.rotation.y)) * Math.min(1,dt*4);
      } else {
        timer -= dt;
        if (mode === 'flee' && fleeTime <= 0) { mode = 'rest'; target = null; timer = 2; }
        if (timer <= 0 && !target) {
          target = chooseTarget();
          mode = target ? 'walk' : 'rest';
          timer = 2 + rng() * 4;
        }
        if (target) {
          const dx = target.x-root.position.x, dz = target.z-root.position.z;
          const length = Math.hypot(dx,dz);
          const step = Math.min(length,dt*(mode === 'flee' ? 2.6 : id === 'fish' ? 1 : .65));
          const x=root.position.x+(length ? dx/length*step : 0), z=root.position.z+(length ? dz/length*step : 0);
          if (length < .08 || !valid(x,z)) {
            target=null; mode='rest'; timer=id === 'fish' ? .15 : 2+rng()*3;
          } else {
            root.position.x=x; root.position.z=z; moving=true;
            const angle=Math.atan2(dx,dz);
            root.rotation.y+=Math.atan2(Math.sin(angle-root.rotation.y),Math.cos(angle-root.rotation.y))*Math.min(1,dt*5);
          }
        }
      }
      if (id === 'fish') root.position.y = Math.max(-waterDepth(root.position.x,root.position.z)+.6,home.y+Math.sin(time*.8)*.35);
      // A gentle head-down pose conveys grazing without changing the FBX skeleton.
      const grazing=id === 'deer' && !moving && !talking;
      root.rotation.x += ((grazing ? .16+Math.sin(time*2)*.025 : 0)-root.rotation.x)*Math.min(1,dt*3);
      animation.update(dt,moving,time);
    }
  };
}
