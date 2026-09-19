/* EventFlow UI System — v3
   Single source of truth for navigation, keyboard UX and consistent shell. */
(function(){
  'use strict';

  var EF_UI = window.EF_UI = window.EF_UI || {};

  function icon(name){
    var paths={
      dashboard:'<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',
      agenda:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/>',
      estoque:'<path d="M21 8l-9 5-9-5 9-5 9 5Z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5"/>',
      clientes:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
      vendas:'<path d="M3 3v18h18"/><path d="m7 16 4-5 4 3 5-7"/>',
      chat:'<path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z"/>',
      notas:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8M8 17h6"/>',
      som:'<path d="M4 12v4M8 9v10M12 5v14M16 8v11M20 11v5"/>',
      luz:'<path d="M9 18h6M10 22h4"/><path d="M8.5 14.5A7 7 0 1 1 15.5 14.5c-1 .8-1.5 1.5-1.5 3h-4c0-1.5-.5-2.2-1.5-3Z"/>',
      video:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m10 9 5 3-5 3Z"/>',
      estrutura:'<path d="M4 21V3M20 21V3M4 7h16M4 13h16M4 19h16"/>',
      internet:'<path d="M5 12.55a11 11 0 0 1 14 0M8.5 16a6 6 0 0 1 7 0M12 20h.01M2 9a16 16 0 0 1 20 0"/>',
      ceno:'<path d="M3 21h18M5 21V8l7-5 7 5v13M9 21v-7h6v7"/>',
      extras:'<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>',
      servicos:'<path d="M14.7 6.3a4 4 0 0 0-5 5L3 18l3 3 6.7-6.7a4 4 0 0 0 5-5l-2.3 2.3-3-3 2.3-2.3Z"/>',
      logistica:'<path d="M3 6h11v11H3zM14 10h4l3 3v4h-7z"/><circle cx="7" cy="19" r="2"/><circle cx="18" cy="19" r="2"/>',
      descricao:'<path d="M4 4h16v16H4zM8 8h8M8 12h8M8 16h5"/>',
      os:'<path d="M9 5h6M9 9h6M9 13h4"/><path d="M6 3h12a2 2 0 0 1 2 2v16H4V5a2 2 0 0 1 2-2Z"/>',
      catalogo:'<path d="M4 4h16v16H4zM4 9h16M9 4v16"/>',
      usuarios:'<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M20 8v6M23 11h-6"/>',
      logout:'<path d="M10 17l5-5-5-5M15 12H3"/><path d="M14 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5"/>'
    };
    return '<svg class="ef-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">'+(paths[name]||paths.extras)+'</svg>';
  }

  function roleLabel(role){
    return {owner:'Administrador',gerencia:'Gerência',producao:'Produção',estoque:'Estoque'}[role] || role || 'Usuário';
  }

  var NAV=[
    ['Principal',[
      ['dashboard.html','Dashboard','dashboard'],['agenda.html','Agenda','agenda'],['estoque.html','Estoque','estoque'],
      ['clientes.html','Clientes','clientes','finance'],['vendas.html','Vendas','vendas','finance'],['chat.html','Chat','chat'],['notas.html','Notas','notas']
    ]],
    ['Projeto',[
      ['calculadora-som.html','Som','som','areas'],['calculadora-luz.html','Luz','luz','areas'],['video.html','Vídeo','video','areas'],['estrutura.html','Estrutura','estrutura','areas'],
      ['internet.html','Internet','internet','areas'],['cenografia.html','Cenografia','ceno','areas'],
      ['extras.html','Extras','extras','areas'],['servicos.html','Serviços','servicos','areas'],['logistica.html','Logística','logistica','areas'],
      ['descritivo-geral.html','Descritivo geral','descricao','areas'],['ordem-servico.html','Ordem de serviço','os','areas']
    ]],
    ['Sistema',[
      ['especificacoes-equipamento.html','Catálogo de equipamentos','catalogo','areas'],['usuarios-permissoes.html','Usuários e permissões','usuarios','users']
    ]]
  ];

  function canShow(scope){
    if(!scope || !window.EF || !EF.profile) return true;
    if(scope==='finance') return EF.canSeeFinance ? EF.canSeeFinance() : false;
    if(scope==='areas') return EF.canSeeAreas ? EF.canSeeAreas() : false;
    if(scope==='users') return EF.canSeeUsuarios ? EF.canSeeUsuarios() : false;
    return true;
  }

  function canonicalSidebar(){
    var current=(location.pathname.split('/').pop()||'dashboard.html').split('?')[0];
    if(window.EF && EF.profile && EF.isOwner && EF.isOwner()) {
      return '<div class="ef-side-top"><a class="ef-brand" href="plataforma.html"><span class="ef-brand-mark">EF</span><span><b>EventFlow</b><small>Administração</small></span></a></div>'+
        '<nav class="ef-nav"><div class="ef-nav-section"><div class="ef-nav-label">Plataforma</div><a class="ef-nav-item ef-nav-active" href="plataforma.html">'+icon('dashboard')+'<span>Empresas e acessos</span></a></div></nav>'+
        '<div class="ef-user"><div class="ef-avatar" id="user-initials" data-ef-user-initials>··</div><div class="ef-user-copy"><strong id="user-name" data-ef-user-name>Carregando…</strong><small id="user-role" data-ef-user-role>Administrador</small></div><button class="ef-logout" id="logout" type="button" data-ef-logout title="Sair">'+icon('logout')+'</button></div>';
    }
    var html='<div class="ef-side-top"><a class="ef-brand" href="dashboard.html"><span class="ef-brand-mark">EF</span><span><b>EventFlow</b><small>Operações</small></span></a></div><nav class="ef-nav" aria-label="Navegação principal">';
    NAV.forEach(function(group){
      var visible=group[1].filter(function(i){return canShow(i[3]);});
      if(!visible.length) return;
      html+='<div class="ef-nav-section"><div class="ef-nav-label">'+group[0]+'</div>';
      visible.forEach(function(i){
        html+='<a class="ef-nav-item'+(i[0]===current?' ef-nav-active':'')+'" href="'+i[0]+'">'+icon(i[2])+'<span>'+i[1]+'</span></a>';
      });
      html+='</div>';
    });
    html+='</nav><div class="ef-user"><div class="ef-avatar" id="user-initials" data-ef-user-initials>··</div><div class="ef-user-copy"><strong id="user-name" data-ef-user-name>Carregando…</strong><small id="user-role" data-ef-user-role>—</small></div><button class="ef-logout" id="logout" type="button" data-ef-logout title="Sair">'+icon('logout')+'</button></div>';
    return html;
  }

  function setupShell(){
    if(document.body.classList.contains('ef-public')) return;
    var shell=document.body.firstElementChild;
    if(!shell || shell.tagName!=='DIV') return;
    shell.classList.add('ef-app-shell');
    var side=shell.children[0], main=shell.children[1];
    if(side){
      side.className='ef-sidebar';
      side.removeAttribute('style');
      side.innerHTML=canonicalSidebar();
      side.querySelectorAll('a').forEach(function(a){a.addEventListener('click',closeMenu);});
      var lo=side.querySelector('[data-ef-logout]');
      if(lo) lo.addEventListener('click',function(){ if(window.EF && EF.logout) EF.logout(); });
    }
    if(main){ main.classList.add('ef-main'); main.removeAttribute('style'); }
    syncUser();
    if(!document.querySelector('.ef-mobile-menu')){
      var menu=document.createElement('button'); menu.className='ef-mobile-menu'; menu.type='button'; menu.setAttribute('aria-label','Abrir menu'); menu.innerHTML=icon('dashboard'); document.body.appendChild(menu); menu.addEventListener('click',toggleMenu);
    }
    if(!document.querySelector('.ef-backdrop')){
      var back=document.createElement('div'); back.className='ef-backdrop'; document.body.appendChild(back); back.addEventListener('click',closeMenu);
    }
  }

  function toggleMenu(){var s=document.querySelector('.ef-sidebar');if(!s)return;s.classList.toggle('ef-open');var b=document.querySelector('.ef-backdrop');if(b)b.classList.toggle('ef-open');}
  function closeMenu(){var s=document.querySelector('.ef-sidebar');if(s)s.classList.remove('ef-open');var b=document.querySelector('.ef-backdrop');if(b)b.classList.remove('ef-open');}

  function syncUser(){
    if(!window.EF || !EF.profile) return;
    var p=EF.profile,name=p.nome||p.email||'Usuário',first=name.trim().split(/\s+/)[0]||name;
    var initials=name.trim().split(/\s+/).filter(Boolean).slice(0,2).map(function(x){return x[0].toUpperCase();}).join('')||'··';
    document.querySelectorAll('[data-ef-user-name],#user-name').forEach(function(e){e.textContent=name;});
    document.querySelectorAll('[data-ef-user-role],#user-role,#role-inline').forEach(function(e){e.textContent=roleLabel(p.role);});
    document.querySelectorAll('[data-ef-user-first],#greet-name').forEach(function(e){e.textContent=first;});
    document.querySelectorAll('[data-ef-user-initials],#user-initials').forEach(function(e){e.textContent=initials;});
    document.documentElement.dataset.role=p.role||'';
  }

  function applyPermissions(){
    if(document.querySelector('.ef-sidebar')) setupShell();
    syncUser();
  }

  function candidateAddButton(container){
    if(!container) return null;
    var buttons=Array.prototype.slice.call(container.querySelectorAll('button,[role="button"],input[type="submit"]'));
    return buttons.find(function(b){
      var t=((b.id||'')+' '+(b.textContent||'')+' '+(b.value||'')).toLowerCase();
      return !b.disabled && (/adicionar|incluir|salvar|criar|add-item|btn-add|serv-add|avulso-add/.test(t));
    }) || null;
  }

  function setupEnterToAdd(){
    document.addEventListener('keydown',function(e){
      if(e.key!=='Enter' || e.shiftKey || e.ctrlKey || e.metaKey || e.altKey) return;
      var t=e.target;
      if(!t || t.tagName==='TEXTAREA' || t.isContentEditable) return;
      if(t.tagName==='BUTTON' || t.type==='submit') return;
      var card=t.closest('.add-form-card, form, [data-ef-enter-add]');
      if(!card) return;
      var btn=candidateAddButton(card);
      if(!btn) return;
      e.preventDefault(); btn.click();
    });
  }

  function normalizeText(s){return (s||'').toString().normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();}

  function enhanceSelect(select){
    if(!select || select.dataset.efSearchReady || select.multiple || select.size>1) return;
    if(select.id && /endereco|tipo|categoria|status|unidade|role|nivel|modo/i.test(select.id)) return;
    select.dataset.efSearchReady='1';
    var wrap=document.createElement('div'); wrap.className='ef-smart-select';
    var search=document.createElement('input'); search.type='search'; search.className='ef-select-search'; search.placeholder='Pesquisar item…'; search.autocomplete='off'; search.setAttribute('aria-label','Pesquisar opções');
    select.parentNode.insertBefore(wrap,select); wrap.appendChild(search); wrap.appendChild(select);
    var source=[], internalChange=false;
    function sync(){ source=Array.prototype.slice.call(select.options).map(function(o){return {value:o.value,text:o.text,disabled:o.disabled};}); search.style.display=source.length>=5?'block':'none'; }
    function filter(){
      var q=normalizeText(search.value); var current=select.value; internalChange=true; select.innerHTML='';
      source.forEach(function(o,idx){ if(!q || idx===0 || normalizeText(o.text).indexOf(q)!==-1){ var el=new Option(o.text,o.value,false,o.value===current); el.disabled=o.disabled; select.add(el); }});
      if(q && select.options.length===2 && !select.value) select.selectedIndex=1;
      setTimeout(function(){internalChange=false;},0);
    }
    search.addEventListener('input',filter);
    search.addEventListener('keydown',function(e){ if(e.key==='ArrowDown'){e.preventDefault();select.focus();} });
    var ob=new MutationObserver(function(){ if(internalChange)return; sync(); });
    ob.observe(select,{childList:true,subtree:false});
    select.addEventListener('change',function(){ var opt=select.options[select.selectedIndex]; if(opt && opt.value) search.value=opt.text.replace(/\s*\([^)]*dispon[ií]vel[^)]*\)\s*$/i,''); });
    sync();
  }

  function setupSearchableAdds(){
    function run(root){
      (root||document).querySelectorAll('.add-form-card select').forEach(enhanceSelect);
    }
    run(document);
    new MutationObserver(function(muts){muts.forEach(function(m){m.addedNodes.forEach(function(n){if(n.nodeType===1){if(n.matches&&n.matches('.add-form-card select')) enhanceSelect(n);run(n);}});});}).observe(document.body,{childList:true,subtree:true});
  }

  function polishTables(){
    document.querySelectorAll('.ef-main table').forEach(function(t){
      if(t.dataset.efPolished) return; t.dataset.efPolished='1';
      var p=t.parentElement; if(p && !p.classList.contains('ef-table-scroll')){ var w=document.createElement('div'); w.className='ef-table-scroll'; p.insertBefore(w,t); w.appendChild(t); }
    });
  }

  function init(){
    setupShell(); setupEnterToAdd(); setupSearchableAdds(); polishTables(); syncUser();
    window.addEventListener('resize',function(){if(window.innerWidth>900)closeMenu();});
  }

  document.addEventListener('DOMContentLoaded',init);
  EF_UI.roleLabel=roleLabel; EF_UI.syncUser=syncUser; EF_UI.applyPermissions=applyPermissions; EF_UI.closeMenu=closeMenu; EF_UI.refreshShell=setupShell;
})();
