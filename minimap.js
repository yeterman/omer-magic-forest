export function mapPoint(origin,point,radius,size){
  const scale=(size/2-12)/radius,dx=point.x-origin.x,dz=point.z-origin.z,length=Math.hypot(dx,dz),limit=Math.max(0,radius-3),factor=length>limit?limit/length:1;
  return{x:size/2+dx*factor*scale,y:size/2+dz*factor*scale,clamped:length>limit,distance:length};
}

export function createMiniMap({canvas,button,player,friends,getTarget,hidden=false,onToggle=()=>{}}){
  const context=canvas.getContext('2d'),size=180,radius=55;
  canvas.width=size*2;canvas.height=size*2;context.scale(2,2);
  let stopped=false,last=0,isHidden=hidden;
  function setHidden(value){isHidden=value;canvas.hidden=value;button.textContent=value?'◉ מפה':'× מפה';button.setAttribute('aria-expanded',String(!value));onToggle(value);}
  button.onclick=()=>setHidden(!isHidden);canvas.hidden=isHidden;button.textContent=isHidden?'◉ מפה':'× מפה';button.setAttribute('aria-expanded',String(!isHidden));
  function marker(point,color,label,shape='circle'){
    const p=mapPoint(player.position,point,radius,size);context.fillStyle=color;context.strokeStyle='#17383c';context.lineWidth=2;
    context.beginPath();if(shape==='diamond'){context.moveTo(p.x,p.y-6);context.lineTo(p.x+6,p.y);context.lineTo(p.x,p.y+6);context.lineTo(p.x-6,p.y);}else context.arc(p.x,p.y,shape==='home'?6:4,0,Math.PI*2);context.closePath();context.fill();context.stroke();
    context.font='600 10px Heebo, Arial';context.textAlign='center';context.fillStyle='#fff8dc';context.fillText(label,p.x,p.y-9);
  }
  function draw(now){
    if(stopped)return;if(!isHidden&&now-last>100){last=now;context.clearRect(0,0,size,size);context.fillStyle='#183b3ddd';context.beginPath();context.arc(size/2,size/2,size/2-2,0,Math.PI*2);context.fill();context.strokeStyle='#dcefc355';context.lineWidth=2;context.stroke();
      context.strokeStyle='#ffffff18';context.lineWidth=1;for(const r of [20,40]){context.beginPath();context.arc(size/2,size/2,r/radius*(size/2-12),0,Math.PI*2);context.stroke();}
      marker({x:0,z:3},'#e5d8a1','בית','home');for(const f of friends)marker(f.root.position,'#d7a5c9',f.icon||'חיה');
      const target=getTarget();if(target)marker({x:target.target[0],z:target.target[2]},'#ffd16c','יעד','diamond');
      context.save();context.translate(size/2,size/2);context.rotate(-player.rotation.y);context.fillStyle='#f7fff0';context.strokeStyle='#17383c';context.lineWidth=2;context.beginPath();context.moveTo(0,-9);context.lineTo(6,7);context.lineTo(0,4);context.lineTo(-6,7);context.closePath();context.fill();context.stroke();context.restore();
    }requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);return{setHidden,stop(){stopped=true;}};
}
