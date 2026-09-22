// EventFlow Calendar v34 — substitui os seletores nativos de data/hora.
(function(g){
  'use strict';
  var active=null,popup=null,viewDate=null,chosenDate=null,hour=9,minute=0;
  var MONTHS=['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
  var WEEK=['seg','ter','qua','qui','sex','sáb','dom'];
  var valueDescriptor=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value');
  function pad(n){return String(n).padStart(2,'0')}
  function parts(value){
    var m=String(value||'').match(/^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?/);
    if(!m)return null;
    return {y:+m[1],m:+m[2]-1,d:+m[3],h:+(m[4]||0),i:+(m[5]||0)};
  }
  function isoDate(d){return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())}
  function formatValue(input){
    var p=parts(valueDescriptor.get.call(input));
    if(!p)return '';
    var base=pad(p.d)+'/'+pad(p.m+1)+'/'+p.y;
    return input.dataset.efCalendarType==='datetime-local'?base+' às '+pad(p.h)+':'+pad(p.i):base;
  }
  function sync(input){if(input&&input._efCalendarMirror)input._efCalendarMirror.value=formatValue(input)}
  function setValue(input,value,notify){
    valueDescriptor.set.call(input,value||'');sync(input);
    if(notify){input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}))}
  }
  function icon(){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4M3 10h18"/></svg>'}
  function enhance(input){
    if(!input||input.dataset.efCalendarReady==='1')return;
    var type=input.getAttribute('type');if(type!=='date'&&type!=='datetime-local')return;
    input.dataset.efCalendarReady='1';input.dataset.efCalendarType=type;input.dataset.efWasRequired=input.required?'1':'0';
    var wrap=document.createElement('span');wrap.className='ef-cal-field';
    var mirror=document.createElement('input');mirror.type='text';mirror.readOnly=true;mirror.autocomplete='off';mirror.className=(input.className?input.className+' ':'')+'ef-cal-display';mirror.placeholder=type==='date'?'dd/mm/aaaa':'dd/mm/aaaa às hh:mm';mirror.setAttribute('aria-label',input.getAttribute('aria-label')||'Selecionar '+(type==='date'?'data':'data e hora'));mirror.setAttribute('aria-haspopup','dialog');
    if(input.style.cssText)mirror.style.cssText=input.style.cssText;
    var trigger=document.createElement('button');trigger.type='button';trigger.className='ef-cal-trigger';trigger.setAttribute('aria-label','Abrir calendário');trigger.innerHTML=icon();
    input.parentNode.insertBefore(wrap,input);wrap.appendChild(input);wrap.appendChild(mirror);wrap.appendChild(trigger);
    input.type='hidden';input.required=false;input._efCalendarMirror=mirror;input._efCalendarWrap=wrap;
    try{Object.defineProperty(input,'value',{configurable:true,get:function(){return valueDescriptor.get.call(this)},set:function(v){valueDescriptor.set.call(this,v);sync(this)}})}catch(e){}
    sync(input);
    mirror.addEventListener('click',function(){open(input)});trigger.addEventListener('click',function(){open(input)});
    mirror.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '||e.key==='ArrowDown'){e.preventDefault();open(input)}});
    if(input.id){var label=document.querySelector('label[for="'+input.id.replace(/"/g,'\\"')+'"]');if(label)label.addEventListener('click',function(e){e.preventDefault();open(input)})}
  }
  function options(max,selected,step){var out='';for(var n=0;n<=max;n+=step){out+='<option value="'+n+'"'+(n===selected?' selected':'')+'>'+pad(n)+'</option>'}return out}
  function ensurePopup(){
    if(popup)return;
    popup=document.createElement('div');popup.className='ef-cal-popover';popup.setAttribute('role','dialog');popup.setAttribute('aria-modal','false');popup.setAttribute('aria-label','Escolher data');popup.hidden=true;document.body.appendChild(popup);
    popup.addEventListener('click',function(e){
      var b=e.target.closest('[data-cal]');if(!b)return;var action=b.dataset.cal;
      if(action==='prev'||action==='next'){viewDate=new Date(viewDate.getFullYear(),viewDate.getMonth()+(action==='prev'?-1:1),1);render();return}
      if(action==='day'){chosenDate=new Date(+b.dataset.y,+b.dataset.m,+b.dataset.d);viewDate=new Date(chosenDate.getFullYear(),chosenDate.getMonth(),1);if(active.dataset.efCalendarType==='date'){commit()}else render();return}
      if(action==='today'||action==='tomorrow'||action==='week'){var d=new Date();d.setHours(0,0,0,0);if(action==='tomorrow')d.setDate(d.getDate()+1);if(action==='week')d.setDate(d.getDate()+7);chosenDate=d;viewDate=new Date(d.getFullYear(),d.getMonth(),1);if(active.dataset.efCalendarType==='date')commit();else render();return}
      if(action==='clear'){setValue(active,'',true);close();return}if(action==='apply'){commit()}
    });
    popup.addEventListener('change',function(e){if(e.target.id==='ef-cal-hour')hour=+e.target.value;if(e.target.id==='ef-cal-minute')minute=+e.target.value});
  }
  function open(input){
    ensurePopup();active=input;var p=parts(valueDescriptor.get.call(input)),now=new Date();
    chosenDate=p?new Date(p.y,p.m,p.d):new Date(now.getFullYear(),now.getMonth(),now.getDate());
    viewDate=new Date(chosenDate.getFullYear(),chosenDate.getMonth(),1);hour=p?p.h:now.getHours();minute=p?p.i:Math.round(now.getMinutes()/5)*5;if(minute===60){minute=0;hour=(hour+1)%24}
    popup.hidden=false;render();position();setTimeout(function(){var x=popup.querySelector('.ef-cal-day.selected')||popup.querySelector('.ef-cal-day');if(x)x.focus()},0);
  }
  function isDisabled(d){var day=isoDate(d),min=(active.getAttribute('min')||'').slice(0,10),max=(active.getAttribute('max')||'').slice(0,10);return !!((min&&day<min)||(max&&day>max))}
  function render(){
    if(!active)return;var y=viewDate.getFullYear(),m=viewDate.getMonth(),first=new Date(y,m,1),offset=(first.getDay()+6)%7,start=new Date(y,m,1-offset),days='';
    for(var n=0;n<42;n++){var d=new Date(start);d.setDate(start.getDate()+n);var out=d.getMonth()!==m,today=isoDate(d)===isoDate(new Date()),selected=isoDate(d)===isoDate(chosenDate);days+='<button type="button" class="ef-cal-day'+(out?' out':'')+(today?' today':'')+(selected?' selected':'')+'" data-cal="day" data-y="'+d.getFullYear()+'" data-m="'+d.getMonth()+'" data-d="'+d.getDate()+'"'+(isDisabled(d)?' disabled':'')+'>'+d.getDate()+'</button>'}
    var time=active.dataset.efCalendarType==='datetime-local'?'<div class="ef-cal-time"><div class="ef-cal-time-field"><label for="ef-cal-hour">Hora</label><select id="ef-cal-hour">'+options(23,hour,1)+'</select></div><div class="ef-cal-colon">:</div><div class="ef-cal-time-field"><label for="ef-cal-minute">Minuto</label><select id="ef-cal-minute">'+options(59,minute,1)+'</select></div></div>':'';
    popup.innerHTML='<div class="ef-cal-head"><button type="button" class="ef-cal-nav" data-cal="prev" aria-label="Mês anterior">‹</button><div class="ef-cal-title">'+MONTHS[m]+' de '+y+'</div><button type="button" class="ef-cal-nav" data-cal="next" aria-label="Próximo mês">›</button></div><div class="ef-cal-week">'+WEEK.map(function(w){return'<span>'+w+'</span>'}).join('')+'</div><div class="ef-cal-days">'+days+'</div>'+time+'<div class="ef-cal-quick"><button type="button" data-cal="today">Hoje</button><button type="button" data-cal="tomorrow">Amanhã</button><button type="button" data-cal="week">+7 dias</button><button type="button" class="danger" data-cal="clear">Limpar</button>'+(active.dataset.efCalendarType==='datetime-local'?'<button type="button" class="apply" data-cal="apply">Aplicar data e hora</button>':'')+'</div><div class="ef-cal-caption">Use as setas para trocar o mês. As datas são exibidas no formato brasileiro.</div>';
  }
  function commit(){
    if(!active||!chosenDate)return;var value=isoDate(chosenDate);if(active.dataset.efCalendarType==='datetime-local')value+='T'+pad(hour)+':'+pad(minute);
    var min=active.getAttribute('min'),max=active.getAttribute('max');if((min&&value<min)||(max&&value>max))return;
    setValue(active,value,true);close();
  }
  function position(){
    if(!active||!popup||popup.hidden)return;if(innerWidth<=620){popup.style.left='8px';popup.style.top='auto';return}
    var r=active._efCalendarWrap.getBoundingClientRect(),w=popup.offsetWidth,h=popup.offsetHeight,left=Math.min(Math.max(12,r.left),innerWidth-w-12),top=r.bottom+8;if(top+h>innerHeight-12)top=Math.max(12,r.top-h-8);popup.style.left=left+'px';popup.style.top=top+'px';popup.style.bottom='auto';
  }
  function close(){if(popup)popup.hidden=true;active=null}
  function scan(root){(root||document).querySelectorAll('input[type="date"],input[type="datetime-local"]').forEach(enhance)}
  function init(){scan(document);new MutationObserver(function(list){list.forEach(function(x){x.addedNodes.forEach(function(n){if(n.nodeType!==1)return;if(n.matches&&n.matches('input[type="date"],input[type="datetime-local"]'))enhance(n);scan(n)})})}).observe(document.body,{childList:true,subtree:true});
    document.addEventListener('click',function(e){if(active&&popup&&!popup.contains(e.target)&&!active._efCalendarWrap.contains(e.target))close()});
    document.addEventListener('keydown',function(e){if(e.key==='Escape')close()});
    document.addEventListener('submit',function(e){var missing=Array.prototype.find.call(e.target.querySelectorAll('input[data-ef-was-required="1"]'),function(x){return !x.value});if(missing){e.preventDefault();e.stopImmediatePropagation();open(missing)}},true);
    document.addEventListener('reset',function(e){setTimeout(function(){e.target.querySelectorAll('input[data-ef-calendar-ready="1"]').forEach(sync)},0)},true);
    addEventListener('resize',position);addEventListener('scroll',position,true);
  }
  g.EFCalendar={scan:scan,refresh:sync,open:open};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})(window);
