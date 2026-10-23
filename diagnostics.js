export function createDiagnostics({canvas,renderer,isMobile,version}){
  if(!new URLSearchParams(location.search).has('diagnostics'))return{update(){}};
  const panel=document.createElement('output');
  panel.id='diagnostics';
  panel.dir='ltr';
  panel.setAttribute('aria-live','polite');
  panel.style.cssText='position:fixed;right:8px;bottom:8px;z-index:30;background:#102522e8;color:#e8f4de;padding:8px 10px;border-radius:10px;font:12px/1.45 ui-monospace,monospace;pointer-events:none;white-space:pre';
  document.body.append(panel);
  const errors=[];
  addEventListener('error',event=>errors.push(event.message||'error'));
  addEventListener('unhandledrejection',event=>errors.push(String(event.reason||'promise error')));
  let last=0;
  return{update(now,position,form){
    if(now-last<1000)return;last=now;
    panel.textContent=[
      version,
      `profile: ${isMobile?'mobile':'desktop'} · touch: ${navigator.maxTouchPoints||0}`,
      `fps: ${canvas.dataset.fps||'…'} · calls: ${renderer.info.render.calls}`,
      `triangles: ${renderer.info.render.triangles}`,
      `form: ${form} · depth: ${Math.max(0,-position.y).toFixed(1)}m`,
      `errors: ${errors.length}`
    ].join('\n');
  }};
}
