const T=window.MOMENTS_TEAMS;
const P=window.MOMENTS_PLAYERS||[];
const refs={
 startBtn:document.getElementById('startBtn'),teamGrid:document.getElementById('teamGrid'),hubTeam:document.getElementById('hubTeam'),roundLabel:document.getElementById('roundLabel'),fixtureCard:document.getElementById('fixtureCard'),playBtn:document.getElementById('playBtn'),table:document.getElementById('table'),homeBox:document.getElementById('homeBox'),awayBox:document.getElementById('awayBox'),clock:document.getElementById('clock'),score:document.getElementById('score'),momentCount:document.getElementById('momentCount'),commentary:document.getElementById('commentary'),decision:document.getElementById('decision'),momentType:document.getElementById('momentType'),momentTitle:document.getElementById('momentTitle'),momentText:document.getElementById('momentText'),choices:document.getElementById('choices'),actorName:document.getElementById('actorName'),actorInfo:document.getElementById('actorInfo'),chainStep:document.getElementById('chainStep'),qte:document.getElementById('qte'),qteTitle:document.getElementById('qteTitle'),qteHint:document.getElementById('qteHint'),qteBtn:document.getElementById('qteBtn'),needle:document.getElementById('needle'),qteTiming:document.getElementById('qteTiming'),qteSequence:document.getElementById('qteSequence'),qteAim:document.getElementById('qteAim'),qteReaction:document.getElementById('qteReaction'),qteHold:document.getElementById('qteHold'),powerFill:document.getElementById('powerFill'),holdBtn:document.getElementById('holdBtn'),swipeArena:document.getElementById('swipeArena'),swipeCue:document.getElementById('swipeCue'),seqDisplay:document.getElementById('seqDisplay'),seqProgress:document.getElementById('seqProgress'),goalTarget:document.getElementById('goalTarget'),aimZone:document.getElementById('aimZone'),aimReticle:document.getElementById('aimReticle'),aimBtn:document.getElementById('aimBtn'),reactionSignal:document.getElementById('reactionSignal'),resultRound:document.getElementById('resultRound'),resultScore:document.getElementById('resultScore'),resultSummary:document.getElementById('resultSummary'),continueBtn:document.getElementById('continueBtn'),canvas:document.getElementById('matchCanvas'),cameraLabel:document.getElementById('cameraLabel'),qteFlash:document.getElementById('qteFlash'),qteFlashTitle:document.getElementById('qteFlashTitle'),qteFlashSub:document.getElementById('qteFlashSub'),outcomeBreakdown:document.getElementById('outcomeBreakdown'),outcomeTitle:document.getElementById('outcomeTitle'),outcomeFactors:document.getElementById('outcomeFactors'),outcomeEquation:document.getElementById('outcomeEquation'),receiverOverlay:document.getElementById('receiverOverlay'),receiverHint:document.getElementById('receiverHint'),stopControl:document.getElementById('stopControl'),prematchOverlay:document.getElementById('prematchOverlay'),prematchCompetition:document.getElementById('prematchCompetition'),prematchTitle:document.getElementById('prematchTitle'),prematchTeams:document.getElementById('prematchTeams'),prematchSub:document.getElementById('prematchSub'),tvHomeCode:document.getElementById('tvHomeCode'),tvAwayCode:document.getElementById('tvAwayCode'),lowerThirdTitle:document.getElementById('lowerThirdTitle'),qteSetPiece:document.getElementById('qteSetPiece'),kickArrow:document.getElementById('kickArrow'),setPieceStep:document.getElementById('setPieceStep'),setPieceBtn:document.getElementById('setPieceBtn'),setPiecePower:document.getElementById('setPiecePower'),spNeedle:document.getElementById('spNeedle'),setPiecePowerBtn:document.getElementById('setPiecePowerBtn')
};
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const rand=(a,b)=>a+Math.random()*(b-a);
const playersByTeam=Object.fromEntries(T.map(t=>[t.id,P.filter(p=>p.teamId===t.id)]));
let state={team:null,round:0,fixtures:[],table:{},current:null,moment:0,totalMoments:4,homeGoals:0,awayGoals:0,events:[],qte:null,activeMoment:null,usedKinds:[],chain:null};
function show(id){document.querySelectorAll('.screen').forEach(x=>x.classList.remove('active'));document.getElementById(id).classList.add('active');window.scrollTo(0,0);if(id==='screenMatch')setTimeout(()=>S9Scene.start(),20);else S9Scene.stop()}
function crest(t){return `<img src="${t.crest}" alt=""><div><b>${t.name}</b><small>${t.season}</small></div>`}
function initTable(){T.forEach(t=>state.table[t.id]={p:0,w:0,d:0,l:0,gf:0,ga:0,pts:0})}
function schedule(){let arr=[...T],rounds=[];for(let r=0;r<arr.length-1;r++){let games=[];for(let i=0;i<arr.length/2;i++){let a=arr[i],b=arr[arr.length-1-i];games.push(r%2?[b,a]:[a,b])}rounds.push(games);arr=[arr[0],arr[arr.length-1],...arr.slice(1,-1)]}return rounds}
function teamPick(){refs.teamGrid.innerHTML=T.map(t=>`<div class="team-card" data-id="${t.id}">${crest(t)}<div>FORZA ${t.strength}</div></div>`).join('');document.querySelectorAll('.team-card').forEach(c=>c.onclick=()=>{state.team=T.find(t=>t.id===c.dataset.id);initTable();state.fixtures=schedule();state.round=0;save();renderHub();show('screenHub')})}
function getUserFixture(){return state.fixtures[state.round].find(g=>g[0].id===state.team.id||g[1].id===state.team.id)}
function renderHub(){refs.hubTeam.textContent=state.team.name+' '+state.team.season;refs.roundLabel.textContent='GIORNATA '+(state.round+1);let [h,a]=getUserFixture();refs.fixtureCard.innerHTML=`<div class="club">${crest(h)}</div><div class="vs">VS</div><div class="club">${crest(a)}</div>`;renderTable()}
function renderTable(){let rows=T.map(t=>[t,state.table[t.id]]).sort((a,b)=>b[1].pts-a[1].pts||(b[1].gf-b[1].ga)-(a[1].gf-a[1].ga)||b[1].gf-a[1].gf);refs.table.innerHTML='<table><tr><th>#</th><th>SQUADRA</th><th>G</th><th>DR</th><th>PT</th></tr>'+rows.map((x,i)=>`<tr class="${x[0].id===state.team.id?'me':''}"><td>${i+1}</td><td>${x[0].name}</td><td>${x[1].p}</td><td>${x[1].gf-x[1].ga}</td><td><b>${x[1].pts}</b></td></tr>`).join('')+'</table>'}

const MOMENTS=[
 {type:'ATTACCO',kind:'counter',title:'CONTROPIEDE 3 CONTRO 2',text:'Recupero palla e campo aperto. Scegli come attaccare lo spazio.',actor:'attack',opponent:'defense',stages:[
  {choices:[
   {label:'FILTRANTE',risk:'mid',qte:'timing',stat:'passing',base:.57,next:'finish',desc:'Più difficile, ma può liberare subito un uomo.'},
   {label:'ALLARGA',risk:'low',qte:'timing',stat:'passing',base:.66,next:'finish',desc:'Scelta sicura: allarghi il campo e mantieni il vantaggio.'},
   {label:'VAI DA SOLO',risk:'high',qte:'sequence',stat:'dribbling',base:.48,next:'finish',desc:'Salti l’uomo: rischio alto, occasione migliore se riesce.'}
  ]},
  {id:'finish',text:'Hai creato spazio. Come chiudi l’azione?',choices:[
   {label:'TIRO INCROCIATO',risk:'mid',qte:'aim',stat:'shooting',base:.56,shot:true,shotBonus:.02,desc:'Conclusione equilibrata.'},
   {label:'ASSIST AL CENTRO',risk:'mid',qte:'timing',stat:'passing',base:.60,shot:true,shotBonus:.08,desc:'Rinunci al tiro per servire il compagno meglio piazzato.'},
   {label:'POTENZA',risk:'high',qte:'hold',stat:'shooting',base:.48,shot:true,shotBonus:.06,desc:'Più difficile da indirizzare, ma il portiere ha meno tempo.'}
  ]}
 ]},
 {type:'ATTACCO',kind:'duel',title:'UNO CONTRO UNO',text:'Il difensore arretra e ti concede pochi metri.',actor:'attack',opponent:'defense',stages:[
  {choices:[
   {label:'DRIBBLING',risk:'high',qte:'sequence',stat:'dribbling',base:.50,next:'finish',desc:'Se lo salti guadagni una conclusione pulita.'},
   {label:'FINTA E RIENTRO',risk:'mid',qte:'reaction',stat:'technique',base:.58,next:'finish',desc:'Leggi il movimento del difensore e rientra sul piede forte.'},
   {label:'SCARICO E TAGLIO',risk:'low',qte:'timing',stat:'passing',base:.67,next:'finish',desc:'Soluzione meno spettacolare ma più sicura.'}
  ]},
  {id:'finish',text:'Sei arrivato al limite dell’area. Devi decidere adesso.',choices:[
   {label:'TIRO RASOTERRA',risk:'low',qte:'aim',stat:'shooting',base:.62,shot:true,shotBonus:-.01,desc:'Preciso ma più leggibile dal portiere.'},
   {label:'SECONDO PALO',risk:'mid',qte:'aim',stat:'shooting',base:.55,shot:true,shotBonus:.04,desc:'Più angolato e più difficile.'},
   {label:'PALLONETTO',risk:'high',qte:'timing',stat:'technique',base:.43,shot:true,shotBonus:.10,desc:'Alta ricompensa, margine d’errore minimo.'}
  ]}
 ]},
 {type:'PIAZZATO',kind:'freekick',title:'PUNIZIONE DAL LIMITE',text:'Posizione invitante. La barriera è già sistemata.',actor:'freekick',opponent:'gk',stages:[
  {choices:[
   {label:'GIRO SOPRA LA BARRIERA',risk:'mid',qte:'setpiece',stat:'technique',base:.52,shot:true,shotBonus:.05,desc:'Tecnica e precisione.'},
   {label:'POTENZA',risk:'high',qte:'setpiece',stat:'shooting',base:.45,shot:true,shotBonus:.08,desc:'La palla viaggia forte ma è meno controllabile.'},
   {label:'SCHEMA CORTO',risk:'low',qte:'timing',stat:'passing',base:.68,next:'finish',desc:'Muovi la barriera e cerchi un tiro da posizione diversa.'}
  ]},
  {id:'finish',text:'Lo schema apre una linea di tiro laterale.',choices:[
   {label:'TIRO DI PRIMA',risk:'mid',qte:'aim',stat:'shooting',base:.58,shot:true,shotBonus:.03,desc:'Tiri prima che la difesa si ricomponga.'},
   {label:'CROSS SUL SECONDO',risk:'mid',qte:'timing',stat:'crossing',base:.62,shot:true,shotBonus:.04,desc:'Cerchi la deviazione sul secondo palo.'}
  ]}
 ]},
 {type:'PIAZZATO',kind:'penalty',title:'CALCIO DI RIGORE',text:'Undici metri. Tu contro il portiere.',actor:'attack',opponent:'gk',stages:[
  {choices:[
   {label:'CALCIA IL RIGORE',risk:'mid',qte:'setpiece',stat:'shooting',base:.60,shot:true,shotBonus:.10,desc:'Scegli direzione e potenza con la visuale da dietro.'}
  ]}
 ]},
 {type:'ATTACCO',kind:'loose',title:'PALLA VAGANTE IN AREA',text:'La palla resta viva dopo una respinta.',actor:'attack',opponent:'gk',stages:[
  {choices:[
   {label:'VOLÉE',risk:'high',qte:'hold',stat:'shooting',base:.43,shot:true,shotBonus:.09,desc:'Difficile da coordinare, molto pericolosa se pulita.'},
   {label:'STOP E TIRO',risk:'mid',qte:'sequence',stat:'technique',base:.57,next:'finish',desc:'Ti prendi mezzo secondo per controllarla.'},
   {label:'APPOGGIA DIETRO',risk:'low',qte:'timing',stat:'passing',base:.70,next:'finish',desc:'Rimetti la palla al limite per una conclusione più pulita.'}
  ]},
  {id:'finish',text:'La seconda palla torna disponibile al limite.',choices:[
   {label:'TIRO PIAZZATO',risk:'low',qte:'aim',stat:'shooting',base:.62,shot:true,shotBonus:0,desc:'Cerchi l’angolo senza forzare.'},
   {label:'BOTTA DA FUORI',risk:'high',qte:'hold',stat:'shooting',base:.46,shot:true,shotBonus:.07,desc:'Rischi di più, ma il portiere vede tardi la palla.'}
  ]}
 ]},
 {type:'DIFESA',kind:'defend',title:'AVVERSARIO IN AREA',text:'L’attaccante entra in area con la palla sotto controllo.',def:true,actor:'defense',opponent:'attack',threat:.47,stages:[
  {choices:[
   {label:'TACKLE',risk:'high',qte:'reaction',stat:'defending',base:.49,stop:true,desc:'Se arrivi in ritardo concedi una conclusione ravvicinata.'},
   {label:'ACCOMPAGNA FUORI',risk:'low',qte:'timing',stat:'positioning',base:.68,stop:true,desc:'Riduci progressivamente l’angolo di tiro.'},
   {label:'CHIUDI IL TIRO',risk:'mid',qte:'reaction',stat:'defending',base:.60,stop:true,desc:'Aggredisci la linea di conclusione.'}
  ],emergency:true}
 ]},
 {type:'DIFESA',kind:'cross',title:'CROSS PERICOLOSO',text:'La palla sta entrando nell’area piccola.',def:true,actor:'defense',opponent:'attack',threat:.43,stages:[
  {choices:[
   {label:'ANTICIPA',risk:'mid',qte:'reaction',stat:'positioning',base:.58,stop:true,desc:'Attacchi la traiettoria prima dell’attaccante.'},
   {label:'MARCA L’UOMO',risk:'low',qte:'timing',stat:'defending',base:.66,stop:true,desc:'Rimani a contatto e ne sporchi il colpo di testa.'},
   {label:'LASCIA AL PORTIERE',risk:'high',qte:'reaction',stat:'positioning',base:.48,stop:true,gkHelp:true,desc:'Se il portiere legge bene il cross può uscire e bloccare.'}
  ],emergency:true}
 ]}
];

function teamPlayers(id){return playersByTeam[id]||[]}
function bestPlayer(teamId,mode){let arr=teamPlayers(teamId);if(!arr.length)return {name:'Giocatore',pos:'?',overall:75,stats:{shooting:75,passing:75,dribbling:75,technique:75,defending:75,positioning:75,crossing:75}};let score=p=>p.overall||70;if(mode==='attack')score=p=>(p.stats.shooting*.30+p.stats.dribbling*.25+p.stats.technique*.2+p.stats.positioning*.1+p.overall*.15)+(p.pos==='FW'||p.pos==='ST'?12:p.pos==='AM'?6:0);if(mode==='freekick')score=p=>p.stats.shooting*.38+p.stats.technique*.34+p.stats.crossing*.18+p.stats.passing*.1;if(mode==='defense')score=p=>p.stats.defending*.45+p.stats.positioning*.35+p.stats.physical*.12+p.overall*.08+(p.pos==='DF'?10:0);if(mode==='gk')score=p=>(p.pos==='GK'?100:0)+p.stats.positioning*.45+p.overall*.55;return [...arr].sort((a,b)=>score(b)-score(a))[0]}
function actorStat(p,key){return p?.stats?.[key]??p?.overall??75}
function userIsHome(){return state.current.h.id===state.team.id}
function userTeam(){return userIsHome()?state.current.h:state.current.a}
function oppTeam(){return userIsHome()?state.current.a:state.current.h}
function updateScore(){refs.score.textContent=`${state.homeGoals} - ${state.awayGoals}`}

function startMatch(){let [h,a]=getUserFixture();state.current={h,a};state.homeGoals=0;state.awayGoals=0;state.moment=0;state.events=[];state.usedKinds=[];state.chain=null;state.totalMoments=3+Math.floor(Math.random()*2);refs.homeBox.innerHTML=`<div class="club">${crest(h)}</div>`;refs.awayBox.innerHTML=`<div class="club">${crest(a)}</div>`;refs.tvHomeCode.textContent=h.name.slice(0,3).toUpperCase();refs.tvAwayCode.textContent=a.name.slice(0,3).toUpperCase();refs.score.textContent='0 - 0';refs.clock.textContent="0'";refs.momentCount.textContent=`MOMENTO 0/${state.totalMoments}`;refs.commentary.textContent=`${h.name} - ${a.name}. Collegamento in diretta.`;refs.decision.classList.add('hidden');refs.qte.classList.add('hidden');refs.outcomeBreakdown.classList.add('hidden');show('screenMatch');S9Scene.setTeams(h,a).then(()=>{S9Scene.reset();runTVIntro(h,a)})}
function runTVIntro(h,a){
 refs.prematchOverlay.classList.remove('hidden');
 refs.prematchTeams.textContent=`${h.name} ${h.season}  ·  ${a.name} ${a.season}`;
 refs.prematchCompetition.textContent='SERIEA 9000 · CAMPIONATO';
 refs.prematchTitle.textContent='MATCH DAY';refs.prematchSub.textContent='COLLEGAMENTO DALLO STADIO';
 refs.lowerThirdTitle.textContent='S9 TV';refs.commentary.textContent='Le squadre stanno per entrare in campo.';
 setTimeout(()=>{refs.prematchTitle.textContent='IN CABINA';refs.prematchSub.textContent='TELECRONACA · COMMENTO TECNICO';refs.commentary.textContent='Tutto pronto. Tra poco si gioca.'},1050);
 setTimeout(()=>{refs.prematchTitle.textContent='LANCIO DELLA MONETA';refs.prematchSub.textContent=Math.random()<.5?`${h.name.toUpperCase()} SCEGLIE IL CAMPO`:`${a.name.toUpperCase()} SCEGLIE IL CAMPO`;refs.commentary.textContent='I capitani raggiungono l’arbitro a centrocampo.';S9Scene.coinToss?.()},2200);
 setTimeout(()=>{refs.prematchTitle.textContent='CALCIO D’INIZIO';refs.prematchSub.textContent='SI PARTE';refs.lowerThirdTitle.textContent='TELECRONACA';refs.commentary.textContent=`${h.name} - ${a.name}. Fischio dell’arbitro.`},3300);
 setTimeout(()=>{refs.prematchOverlay.classList.add('hidden');refs.commentary.textContent='Palla in gioco. Le squadre iniziano a costruire.';S9Scene.kickoffSequence(userIsHome()).then(()=>setTimeout(nextMoment,550))},4050)
}
function ambientSim(minute){let me=state.team.strength,opp=oppTeam().strength;let deficit=userIsHome()?state.homeGoals-state.awayGoals:state.awayGoals-state.homeGoals;let base=.075+clamp((opp-me)/180,-.025,.04);if(deficit>0)base+=.012;if(minute>70)base+=.015;if(Math.random()<base){if(userIsHome())state.awayGoals++;else state.homeGoals++;state.events.push(`${minute}' Gol ${oppTeam().name} (simulato)`);updateScore();refs.commentary.textContent='GOL AVVERSARIO durante la fase simulata.'}else if(Math.random()<.06+clamp((me-opp)/200,-.02,.03)){if(userIsHome())state.homeGoals++;else state.awayGoals++;state.events.push(`${minute}' Gol ${state.team.name} (simulato)`);updateScore();refs.commentary.textContent='La tua squadra trova il gol durante la fase simulata.'}else refs.commentary.textContent=`${minute}' Il gioco scorre. Le squadre si ridispongono...`}
function weightedMoment(minute){let deficit=userIsHome()?state.homeGoals-state.awayGoals:state.awayGoals-state.homeGoals;let pool=MOMENTS.filter(m=>!state.usedKinds.includes(m.kind));if(!pool.length)pool=MOMENTS;let weighted=[];for(const m of pool){let w=1;if(minute>65&&deficit<0&&!m.def)w+=1.4;if(minute>65&&deficit>0&&m.def)w+=1.1;if(m.type==='PIAZZATO')w=m.kind==='penalty'?.28:.72;for(let i=0;i<Math.ceil(w*4);i++)weighted.push(m)}return weighted[Math.floor(Math.random()*weighted.length)]}

// V13 — il passaggio e la ricezione diventano parte dell'azione 3D.
function routePlayers(){
 let arr=teamPlayers(state.team.id).filter(p=>p.pos!=='GK');
 let rank=p=>(p.stats?.passing||70)*.25+(p.stats?.technique||70)*.22+(p.stats?.positioning||70)*.18+(p.stats?.speed||70)*.12+(p.overall||70)*.23;
 arr=[...arr].sort((a,b)=>rank(b)-rank(a));
 let used=new Set(),pick=(pred)=>{let p=arr.find(x=>!used.has(x.id)&&pred(x));if(!p)p=arr.find(x=>!used.has(x.id));if(p)used.add(p.id);return p};
 let left=pick(p=>p.pos==='MF'||p.pos==='AM'||p.pos==='FW'||p.pos==='ST');
 let centre=pick(p=>p.pos==='FW'||p.pos==='ST'||p.pos==='AM');
 let right=pick(p=>true);
 return [
  {num:1,sceneIndex:8,lane:'left',player:left,foot:'L'},
  {num:2,sceneIndex:10,lane:'centre',player:centre,foot:'R'},
  {num:3,sceneIndex:6,lane:'right',player:right,foot:'R'}
 ].filter(x=>x.player);
}
function shouldUseReceiverPhase(m){return !m.def&&(m.kind==='counter'||m.kind==='duel')}
function showReceiverSelection(){
 let opts=routePlayers();state.chain.receiverOptions=opts;refs.decision.classList.add('hidden');refs.qte.classList.add('hidden');refs.outcomeBreakdown.classList.add('hidden');
 refs.chainStep.textContent='LEGGI I MOVIMENTI';refs.momentText.textContent='I compagni si stanno muovendo. Scegli una linea di passaggio disponibile.';
 refs.lowerThirdTitle.textContent=state.chain.actor?.name?.toUpperCase()||'POSSESSO';refs.commentary.textContent='Guarda il campo: 1, 2 o 3 indicano i compagni realmente servibili.';refs.receiverHint.textContent='PASSAGGIO · 1 / 2 / 3';refs.receiverHint.classList.remove('hidden');
 S9Scene.beginReceiverSelection(opts,opt=>{refs.receiverHint.classList.add('hidden');onReceiverChosen(opt)});
}
function onReceiverChosen(opt){
 state.chain.receiver=opt;state.chain.actor=opt.player;refs.actorName.textContent=opt.player.name;refs.actorInfo.textContent=`${opt.player.pos} · OVR ${opt.player.overall}`;
 refs.commentary.textContent=`Passaggio verso ${opt.player.name}...`;refs.chainStep.textContent='PASSAGGIO IN CORSA';
 S9Scene.passToReceiver(opt).then(result=>{
   if(result.intercepted){return triggerTurnover('ANTICIPO: il difensore legge la linea di passaggio e riparte.');}
   refs.commentary.textContent=`La palla arriva a ${opt.player.name}. CONTROLLALA!`;refs.chainStep.textContent='RICEZIONE · TEMPO DELLO STOP';
   S9Scene.beginFirstTouch(opt,onFirstTouch);
 });
}
function onFirstTouch(result){
 if(result.grade==='ERROR'){return triggerTurnover('STOP SBAGLIATO: palla lunga, l’avversario anticipa e parte in contropiede.');}
 state.chain.firstTouch=result;let label=result.grade==='PERFECT'?'STOP PERFETTO':result.grade==='GOOD'?'BUON CONTROLLO':'CONTROLLO SPORCO';
 refs.commentary.textContent=`${label}. Ora la posizione del ricevente determina le opzioni.`;flashQte(result.grade==='PERFECT'?'PERFETTO':result.grade==='GOOD'?'BUONO':'NORMALE');
 setTimeout(()=>showRouteChoices(state.chain.receiver,result),420);
}
function triggerTurnover(text){
 refs.receiverHint.classList.add('hidden');S9Scene.cancelReceiverSelection();refs.stopControl.classList.add('hidden');refs.commentary.textContent=text;refs.chainStep.textContent='TRANSIZIONE NEGATIVA';
 state.events.push(`${refs.clock.textContent} Palla persa: contropiede avversario`);
 S9Scene.startCounterattack().then(()=>{
   let m=MOMENTS.find(x=>x.kind==='defend');state.activeMoment=m;state.chain.actor=bestPlayer(state.team.id,'defense');state.chain.opponent=bestPlayer(oppTeam().id,'attack');
   refs.momentType.textContent='MOMENTO CHIAVE · DIFESA';refs.momentTitle.textContent='CONTROPIEDE DOPO LA PALLA PERSA';refs.momentText.textContent='Il tuo errore ha aperto il campo. Devi fermare l’azione.';refs.actorName.textContent=state.chain.actor.name;refs.actorInfo.textContent=`${state.chain.actor.pos} · OVR ${state.chain.actor.overall}`;
   showDefenderSelection();
 });
}
function contextualRouteChoices(opt){
 let ctx=S9Scene.getReceiverContext(opt),wide=ctx.wide,natural=(opt.lane==='left'&&opt.foot==='L')||(opt.lane==='right'&&opt.foot==='R');
 let choices=[];
 if(ctx.zone==='COSTRUZIONE'){
  choices=[
   {label:'APPOGGIA E RICOMINCIA',risk:'low',qte:'timing',stat:'passing',base:.72,sceneAction:'support',continueBuild:true,desc:'Scarico semplice: mantieni il possesso e fai salire la squadra.'},
   {label:'CAMBIO GIOCO',risk:'mid',qte:'timing',stat:'passing',base:.60,sceneAction:'switch',continueBuild:true,desc:'Cerchi il lato debole prima che il pressing scivoli.'},
   {label:'PORTA PALLA',risk:'mid',qte:'sequence',stat:'dribbling',base:.61,sceneAction:'carry',continueBuild:true,desc:'Guadagni metri se davanti a te c’è spazio.'}
  ];
 }else if(ctx.zone==='CENTROCAMPO'){
  choices=wide?[
   {label:'GIOCA DENTRO',risk:'low',qte:'timing',stat:'passing',base:.69,sceneAction:'inside',continueBuild:true,desc:'Trovi un compagno tra le linee.'},
   {label:'SOVRAPPOSIZIONE',risk:'mid',qte:'timing',stat:'passing',base:.61,sceneAction:'overlap',continueBuild:true,desc:'Aspetti il movimento esterno e lo servi sulla corsa.'},
   {label:'CONDUCI',risk:'mid',qte:'sequence',stat:'dribbling',base:.60,sceneAction:'carry',continueBuild:true,desc:'Porti palla finché il difensore non deve uscire.'}
  ]:[
   {label:'APRI SULLA FASCIA',risk:'low',qte:'timing',stat:'passing',base:.70,sceneAction:'switch',continueBuild:true,desc:'Allarghi il campo e costringi la difesa a scivolare.'},
   {label:'GIOCA TRA LE LINEE',risk:'mid',qte:'timing',stat:'passing',base:.61,sceneAction:'inside',continueBuild:true,desc:'Cerchi il compagno alle spalle del centrocampo.'},
   {label:'PORTA PALLA',risk:'mid',qte:'sequence',stat:'dribbling',base:.59,sceneAction:'carry',continueBuild:true,desc:'Avanzi palla al piede senza forzare una conclusione.'}
  ];
 }else if(ctx.zone==='TREQUARTI'){
  choices=wide?[
   {label:'VAI SUL FONDO',risk:'mid',qte:'sequence',stat:'dribbling',base:.58,sceneAction:'overlap',continueBuild:true,desc:'Attacchi il lato esterno per guadagnare il fondo.'},
   {label:'PASSAGGIO DENTRO',risk:'low',qte:'timing',stat:'passing',base:.66,sceneAction:'inside',continueBuild:true,desc:'Servi chi si muove tra terzino e centrale.'},
   {label:natural?'TAGLIA DENTRO':'RIENTRA SUL PIEDE FORTE',risk:'mid',qte:'sequence',stat:'technique',base:.58,sceneAction:'carry',continueBuild:true,desc:'Porti la palla verso una zona più pericolosa.'}
  ]:[
   {label:'SPONDA',risk:'low',qte:'timing',stat:'passing',base:.68,sceneAction:'support',continueBuild:true,desc:'Fai proseguire l’azione a chi arriva fronte alla porta.'},
   {label:'FILTRANTE',risk:'high',qte:'timing',stat:'passing',base:.54,sceneAction:'through',continueBuild:true,desc:'Attacchi lo spazio alle spalle della linea.'},
   {label:'PUNTA IL DIFENSORE',risk:'mid',qte:'sequence',stat:'dribbling',base:.57,sceneAction:'carry',continueBuild:true,desc:'Costringi il centrale a scegliere se uscire.'}
  ];
 }else{
  choices=wide?[
   {label:'CROSS TESO',risk:'mid',qte:'timing',stat:'crossing',base:.60,sceneAction:'cross',desc:'Palla forte dentro l’area.'},
   {label:'PALLA DIETRO',risk:'low',qte:'timing',stat:'passing',base:.67,sceneAction:'ground',desc:'Cerchi chi arriva a rimorchio.'},
   {label:natural?'ATTACCA IL PRIMO PALO':'RIENTRA E CALCIA',risk:'high',qte:'aim',stat:'shooting',base:.52,shot:true,shotBonus:.03,desc:natural?'Conclusione da posizione stretta.':'Rientri sul piede forte e cerchi l’angolo lontano.'}
  ]:[
   {label:'SPONDA DI PRIMA',risk:'low',qte:'timing',stat:'passing',base:.68,sceneAction:'ground',desc:'Scarico per il compagno che arriva.'},
   {label:'GIRATI E CALCIA',risk:'mid',qte:'aim',stat:'shooting',base:.58,shot:true,shotBonus:.02,desc:'Se riesci a girarti hai subito la porta davanti.'},
   {label:'ULTIMO PASSAGGIO',risk:'high',qte:'timing',stat:'passing',base:.54,sceneAction:'through',desc:'Cerchi il taglio dentro l’area.'}
  ];
 }
 return {ctx,choices};
}
function showRouteChoices(opt,touch){
 let {ctx,choices}=contextualRouteChoices(opt);state.chain.buildCount=(state.chain.buildCount||0)+1;
 state.activeMoment={...state.activeMoment,stages:[{choices}]};state.chain.stage=0;
 refs.chainStep.textContent=`${ctx.zone} · ${Math.round(ctx.distanceToGoal)} M DALLA PORTA`;
 const pressure=ctx.pressure<4?'sotto pressione':ctx.pressure<7?'con un avversario vicino':'con spazio';
 refs.momentTitle.textContent=ctx.zone==='AREA'?'ULTIMA GIOCATA':ctx.zone==='TREQUARTI'?'ATTACCO POSIZIONALE':'COSTRUZIONE';
 refs.momentText.textContent=`${opt.player.name} riceve ${pressure}. Scegli una soluzione coerente con la posizione.`;
 refs.lowerThirdTitle.textContent=opt.player.name.toUpperCase();
 refs.commentary.textContent=ctx.zone==='AREA'?'È una zona da cui si può fare male.':ctx.zone==='TREQUARTI'?'La difesa deve decidere se uscire.':'La manovra continua: niente forzature.';
 refs.choices.innerHTML=choices.map((c,i)=>`<button class="choice risk-${c.risk}" data-i="${i}">${String.fromCharCode(65+i)} · ${c.label}<small>${c.desc}</small><span class="choice-meta">${String(c.stat).toUpperCase()} ${Math.round(actorStat(opt.player,c.stat))}</span></button>`).join('');
 refs.decision.classList.remove('hidden');document.querySelectorAll('.choice').forEach(b=>b.onclick=()=>choose(+b.dataset.i));
}

function showFinalBallFinish(kind){
 let fin=bestPlayer(state.team.id,'attack');state.chain.actor=fin;refs.actorName.textContent=fin.name;refs.actorInfo.textContent=`${fin.pos} · OVR ${fin.overall}`;refs.chainStep.textContent='ULTIMO TOCCO';refs.momentText.textContent=kind==='cross'?'Il cross arriva nella zona calda. Devi finalizzare.':'La palla bassa attraversa la difesa. Arriva il compagno.';
 let choices=[
  {label:kind==='cross'?'COLPO AL VOLO':'TIRO DI PRIMA',risk:'mid',qte:'aim',stat:'shooting',base:.58,shot:true,shotBonus:.03,desc:'Conclusione immediata sulla traiettoria.'},
  {label:'CONTROLLO E TIRO',risk:'low',qte:'hold',stat:'technique',base:.63,shot:true,shotBonus:0,desc:'Un tocco in più per preparare la conclusione.'}
 ];state.activeMoment={...state.activeMoment,stages:[{choices}]};state.chain.stage=0;refs.choices.innerHTML=choices.map((c,i)=>`<button class="choice risk-${c.risk}" data-i="${i}">${String.fromCharCode(65+i)} · ${c.label}<small>${c.desc}</small></button>`).join('');refs.decision.classList.remove('hidden');document.querySelectorAll('.choice').forEach(b=>b.onclick=()=>choose(+b.dataset.i));
}


function defenderOptions(){
 let arr=[...teamPlayers(state.team.id)].filter(p=>p.pos!=='GK').sort((a,b)=>(b.stats?.defending||0)-(a.stats?.defending||0));
 let picks=[arr[0],arr[1],arr.find(p=>p.pos==='MF'||p.pos==='DM')||arr[2]].filter(Boolean);
 return picks.slice(0,3).map((p,i)=>({num:i+1,player:p,sceneIndex:[2,3,6][i],role:i===0?'CENTRALE':i===1?'ESTERNO':'MEDIANO'}));
}
function showDefenderSelection(){
 let opts=defenderOptions();state.chain.defenderOptions=opts;refs.decision.classList.add('hidden');refs.qte.classList.add('hidden');refs.outcomeBreakdown.classList.add('hidden');refs.chainStep.textContent='CHI ROMPE LA LINEA?';refs.momentText.textContent='Scegli il difensore che esce sul portatore: gli altri dovranno coprire lo spazio lasciato.';refs.lowerThirdTitle.textContent='FASE DIFENSIVA';refs.commentary.textContent='L’avversario punta la porta. Decidi chi esce e chi resta in copertura.';refs.receiverHint.textContent='CHI ESCE? · 1 / 2 / 3';refs.receiverHint.classList.remove('hidden');S9Scene.beginDefenderSelection(opts,opt=>{refs.receiverHint.classList.add('hidden');onDefenderChosen(opt)})
}
function onDefenderChosen(opt){
 state.chain.actor=opt.player;refs.actorName.textContent=opt.player.name;refs.actorInfo.textContent=`${opt.player.pos} · OVR ${opt.player.overall}`;let kind=state.activeMoment.kind;let fit=kind==='cross'?(opt.role==='ESTERNO'?8:opt.role==='CENTRALE'?4:-2):(opt.role==='CENTRALE'?8:opt.role==='MEDIANO'?4:-9);state.chain.defenseShape=fit;refs.commentary.textContent=fit<0?'ATTENZIONE: l’uscita apre un corridoio alle spalle.':'La linea scivola e copre l’uscita.';S9Scene.commitDefender(opt,fit).then(()=>showStage(0))
}
function nextMoment(){if(state.moment>=state.totalMoments)return finishMatch();state.moment++;let minute=Math.round(7+state.moment*(74/(state.totalMoments+1))+Math.random()*6);refs.clock.textContent=minute+"'";refs.momentCount.textContent=`MOMENTO ${state.moment}/${state.totalMoments}`;ambientSim(Math.max(1,minute-4));let m=state.moment===1?MOMENTS.find(x=>x.kind==='counter'):weightedMoment(minute);state.usedKinds.push(m.kind);state.activeMoment=m;state.chain={stage:0,quality:0,actor:null,opponent:null,firstChoice:null};let actorTeam=m.def?state.team.id:state.team.id;let oppId=oppTeam().id;state.chain.actor=bestPlayer(actorTeam,m.actor);state.chain.opponent=bestPlayer(oppId,m.opponent);refs.momentType.textContent='MOMENTO CHIAVE · '+m.type;refs.momentTitle.textContent=m.title;refs.momentText.textContent=m.text;refs.actorName.textContent=state.chain.actor.name;refs.actorInfo.textContent=`${state.chain.actor.pos} · OVR ${state.chain.actor.overall}`;refs.chainStep.textContent=m.stages.length>1?'FASE 1 / 2':'FASE DECISIVA';refs.decision.classList.add('hidden');refs.qte.classList.add('hidden');refs.outcomeBreakdown.classList.add('hidden');refs.cameraLabel.textContent='CAMERA · LIVE';refs.lowerThirdTitle.textContent='TELECRONACA';refs.commentary.textContent='La manovra prende forma...';S9Scene.playLeadIn(m,userIsHome()).then(()=>{refs.cameraLabel.textContent='CAMERA · FREEZE';refs.commentary.textContent=m.def?'Pericolo: devi leggere l’uscita giusta.':'Si apre una possibilità: ora la scelta è tua.';if(m.def)showDefenderSelection();else if(shouldUseReceiverPhase(m))showReceiverSelection();else showStage(0)})}
function riskName(r){return r==='low'?'BASSA':r==='high'?'ALTA':'MEDIA'}
function showStage(index){let m=state.activeMoment,stage=m.stages[index];state.chain.stage=index;refs.momentText.textContent=stage.text||m.text;refs.chainStep.textContent=m.stages.length>1?`FASE ${index+1} / ${m.stages.length}`:(stage.emergency?'FASE DIFENSIVA':'FASE DECISIVA');refs.choices.innerHTML=stage.choices.map((c,i)=>{let st=actorStat(state.chain.actor,c.stat);return `<button class="choice risk-${c.risk||'mid'}" data-i="${i}">${String.fromCharCode(65+i)} · ${c.label}<small>${c.desc||''}</small><span class="choice-meta">${String(c.stat||'abilità').toUpperCase()} ${Math.round(st)} · DIFFICOLTÀ ${riskName(c.risk)}</span></button>`}).join('');refs.decision.classList.remove('hidden');document.querySelectorAll('.choice').forEach(b=>b.onclick=()=>choose(+b.dataset.i))}
function hideQteModes(){[refs.qteTiming,refs.qteSequence,refs.qteAim,refs.qteReaction,refs.qteHold,refs.qteSetPiece].forEach(x=>x&&x.classList.add('hidden'))}
function choose(i){let stage=state.activeMoment.stages[state.chain.stage],c=stage.choices[i];refs.decision.classList.add('hidden');state.qte={choice:c,type:c.qte,quality:0,timing:'NORMALE',raf:0,pos:0,dir:1};state.chain.currentChoice=c;if(state.chain.stage===0)state.chain.firstChoice=c;refs.qte.classList.remove('hidden');hideQteModes();S9Scene.commitChoice(state.activeMoment,c.label);if(c.qte==='setpiece')startSetPieceQte();else if(c.qte==='sequence')startSwipeQte();else if(c.qte==='aim')startAimQte();else if(c.qte==='reaction')startReactionQte();else if(c.qte==='hold')startHoldQte();else startTimingQte()}
function flashQte(timing){
 const cls=timing==='PERFETTO'?'perfect':timing==='BUONO'?'good':timing==='NORMALE'?'normal':'bad';
 refs.qteFlashTitle.textContent=timing==='SBAGLIATO'?'ERRORE!':timing+'!';
 refs.qteFlashSub.textContent=timing==='PERFETTO'?'ESECUZIONE PULITA':timing==='BUONO'?'BUONA GIOCATA':timing==='NORMALE'?'AZIONE SPORCA':'TEMPO O DIREZIONE ERRATA';
 refs.qteFlash.className='qte-flash '+cls;
 clearTimeout(state.flashTimer); state.flashTimer=setTimeout(()=>refs.qteFlash.classList.add('hidden'),650);
}
function finishQte(timing,quality){if(!state.qte)return;flashQte(timing);state.qte.timing=timing;state.qte.quality=quality;setTimeout(resolveQte,260)}
function pressureFactor(){let min=parseInt(refs.clock.textContent)||45;let deficit=userIsHome()?state.homeGoals-state.awayGoals:state.awayGoals-state.homeGoals;return clamp((min>75?.05:0)+(deficit<0?.04:0),0,.08)}
function difficultyFromStat(stat){return clamp((82-stat)/220,-.05,.08)}
function startTimingQte(){let c=state.chain.currentChoice,stat=actorStat(state.chain.actor,c.stat);refs.qteTitle.textContent='TEMPO!';refs.qteHint.textContent=`${state.chain.actor.name}: ferma il cursore nella finestra utile.`;refs.qteTiming.classList.remove('hidden');let q=state.qte;q.pos=0;q.dir=1;q.speed=.72+difficultyFromStat(stat)*1.8+pressureFactor()*1.2;function frame(){q.pos+=q.dir*q.speed;if(q.pos>=99||q.pos<=0)q.dir*=-1;refs.needle.style.left=q.pos+'%';q.raf=requestAnimationFrame(frame)}q.raf=requestAnimationFrame(frame)}
function stopTimingQte(){let q=state.qte;if(!q||q.type!=='timing')return;cancelAnimationFrame(q.raf);let timing=q.pos>=43&&q.pos<=57?'PERFETTO':(q.pos>=32&&q.pos<=68?'BUONO':(q.pos>=18&&q.pos<=82?'NORMALE':'SBAGLIATO'));let quality=timing==='PERFETTO'?.11:timing==='BUONO'?.05:timing==='NORMALE'?-.03:-.14;finishQte(timing,quality)}
const DIRS=['LEFT','UP','RIGHT','DOWN'],ARROW={LEFT:'←',UP:'↑',RIGHT:'→',DOWN:'↓'};
function startSwipeQte(){
 let c=state.chain.currentChoice,stat=actorStat(state.chain.actor,c.stat);refs.qteTitle.textContent='DRIBBLING';refs.qteHint.textContent=`${state.chain.actor.name}: un solo gesto deciso. Trascina nella direzione che vuoi saltare l’uomo.`;refs.qteSequence.classList.remove('hidden');let q=state.qte;q.type='sequence';q.swipeStart=null;q.swipeDeadline=performance.now()+clamp(2600+(stat-80)*18,2400,3200);refs.swipeCue.textContent='SCORRI';refs.seqProgress.textContent='UN SOLO GESTO · HAI TEMPO';refs.swipeArena.classList.add('active');q.seqTimer=setTimeout(()=>{refs.swipeArena.classList.remove('active');finishQte('SBAGLIATO',-.14)},q.swipeDeadline-performance.now())
}
function handleSequence(dir,mag=1){let q=state.qte;if(!q||q.type!=='sequence')return;clearTimeout(q.seqTimer);refs.swipeArena.classList.remove('active');let elapsed=Math.max(0,q.swipeDeadline-performance.now());let timing=elapsed>1500?'PERFETTO':elapsed>700?'BUONO':'NORMALE';let quality=(timing==='PERFETTO'?.11:timing==='BUONO'?.05:-.01)+clamp((mag-1)*.02,-.02,.02);refs.swipeCue.textContent=dir==='LEFT'?'STERZATA A SINISTRA':dir==='RIGHT'?'STERZATA A DESTRA':dir==='UP'?'ACCELERAZIONE':'STOP E RIENTRO';finishQte(timing,quality)}
function startHoldQte(){let c=state.chain.currentChoice,stat=actorStat(state.chain.actor,c.stat);refs.qteTitle.textContent='POTENZA';refs.qteHint.textContent=`${state.chain.actor.name}: tieni premuto e rilascia nella zona ideale.`;refs.qteHold.classList.remove('hidden');let q=state.qte;q.type='hold';q.power=0;q.holding=false;q.holdStart=0;q.raf=0;refs.powerFill.style.width='0%'}
function beginHold(){let q=state.qte;if(!q||q.type!=='hold'||q.holding)return;q.holding=true;q.holdStart=performance.now();refs.holdBtn.classList.add('pressed');function f(){if(!q.holding)return;let ms=performance.now()-q.holdStart;q.power=clamp(ms/1700*100,0,100);refs.powerFill.style.width=q.power+'%';if(q.power>=100)return endHold();q.raf=requestAnimationFrame(f)}q.raf=requestAnimationFrame(f)}
function endHold(){let q=state.qte;if(!q||q.type!=='hold'||!q.holding)return;q.holding=false;cancelAnimationFrame(q.raf);refs.holdBtn.classList.remove('pressed');let p=q.power,timing=p>=68&&p<=85?'PERFETTO':p>=55&&p<=92?'BUONO':p>=38&&p<=98?'NORMALE':'SBAGLIATO';finishQte(timing,timing==='PERFETTO'?.11:timing==='BUONO'?.05:timing==='NORMALE'?-.02:-.15)}
function startSetPieceQte(){
 let c=state.chain.currentChoice,stat=actorStat(state.chain.actor,c.stat);refs.qteTitle.textContent=state.activeMoment.kind==='penalty'?'RIGORE':'CALCIO PIAZZATO';refs.qteHint.textContent=`${state.chain.actor.name}: blocca prima la direzione, poi la potenza.`;refs.qteSetPiece.classList.remove('hidden');refs.setPiecePower.classList.add('hidden');refs.setPieceBtn.classList.remove('hidden');refs.setPieceStep.textContent='1 · BLOCCA LA DIREZIONE';let q=state.qte;q.type='setpiece';q.spPhase='direction';q.dirPos=50;q.dirVel=clamp(0.55+(88-stat)*.012,0.42,0.92);q.dirMove=1;function f(){if(!state.qte||q.spPhase!=='direction')return;q.dirPos+=q.dirVel*q.dirMove;if(q.dirPos>=96||q.dirPos<=4)q.dirMove*=-1;let ang=-37+(q.dirPos/100)*74;refs.kickArrow.style.transform=`rotate(${ang}deg)`;q.raf=requestAnimationFrame(f)}q.raf=requestAnimationFrame(f)
}
function lockSetPieceDirection(){let q=state.qte;if(!q||q.type!=='setpiece'||q.spPhase!=='direction')return;cancelAnimationFrame(q.raf);q.spPhase='power';q.setpieceDirection=q.dirPos;refs.setPieceBtn.classList.add('hidden');refs.setPiecePower.classList.remove('hidden');refs.setPieceStep.textContent='2 · BLOCCA LA POTENZA';q.powerPos=0;q.powerMove=1;let stat=actorStat(state.chain.actor,state.chain.currentChoice.stat);q.powerVel=clamp(.72+(88-stat)*.012,.58,1.08);function f(){if(!state.qte||q.spPhase!=='power')return;q.powerPos+=q.powerVel*q.powerMove;if(q.powerPos>=100||q.powerPos<=0)q.powerMove*=-1;refs.spNeedle.style.left=q.powerPos+'%';q.raf=requestAnimationFrame(f)}q.raf=requestAnimationFrame(f)}
function lockSetPiecePower(){let q=state.qte;if(!q||q.type!=='setpiece'||q.spPhase!=='power')return;cancelAnimationFrame(q.raf);q.setpiecePower=q.powerPos;let edge=Math.abs(q.setpieceDirection-50);let dirScore=edge>=24&&edge<=42?96:edge>=16?82:64;let p=q.setpiecePower,powerScore=p>=68&&p<=84?96:p>=55&&p<=92?82:p>=42&&p<=97?64:30;let avg=(dirScore+powerScore)/2;let timing=avg>=94?'PERFETTO':avg>=80?'BUONO':avg>=58?'NORMALE':'SBAGLIATO';finishQte(timing,(avg-64)/290)}
function startAimQte(){let c=state.chain.currentChoice,stat=actorStat(state.chain.actor,c.stat);refs.qteTitle.textContent='SCEGLI DOVE TIRARE';refs.qteHint.textContent=`${state.chain.actor.name}: indica direttamente il punto della porta. Nessuna attesa.`;refs.qteAim.classList.remove('hidden');let q=state.qte;q.ax=50;q.ay=55;q.aimStat=stat;refs.aimZone.style.display='none';refs.aimReticle.style.left=q.ax+'%';refs.aimReticle.style.top=q.ay+'%'}
function setAimFromPointer(e){let q=state.qte;if(!q||q.type!=='aim')return;let r=refs.goalTarget.getBoundingClientRect();q.ax=clamp((e.clientX-r.left)/r.width*100,4,96);q.ay=clamp((e.clientY-r.top)/r.height*100,5,95);refs.aimReticle.style.left=q.ax+'%';refs.aimReticle.style.top=q.ay+'%'}
function stopAimQte(){let q=state.qte;if(!q||q.type!=='aim')return;let edge=Math.abs(q.ax-50),vertical=Math.abs(q.ay-52);q.aimX=q.ax;q.aimY=q.ay;let timing=(edge>=27&&edge<=43&&vertical<39)?'PERFETTO':(edge>=18&&vertical<43)?'BUONO':(edge<47&&vertical<46)?'NORMALE':'SBAGLIATO';let skill=(q.aimStat||80);let quality=timing==='PERFETTO'?.10:timing==='BUONO'?.05:timing==='NORMALE'?-.01:-.14;quality+=clamp((skill-80)/500,-.02,.04);finishQte(timing,quality)}
function startReactionQte(){let c=state.chain.currentChoice,stat=actorStat(state.chain.actor,c.stat);refs.qteTitle.textContent="LEGGI L'AVVERSARIO";refs.qteHint.textContent=`${state.chain.actor.name}: aspetta il movimento e scegli il lato.`;refs.qteReaction.classList.remove('hidden');refs.reactionSignal.textContent='ATTENDI IL MOVIMENTO...';refs.reactionSignal.className='reaction-signal wait';let q=state.qte;q.ready=false;q.reactionDir=Math.random()<.5?'LEFT':'RIGHT';q.reactionDelay=setTimeout(()=>{q.ready=true;q.reactionStart=performance.now();refs.reactionSignal.textContent=q.reactionDir==='LEFT'?'ATTACCA A SINISTRA':'ATTACCA A DESTRA';refs.reactionSignal.className='reaction-signal';let timeout=clamp(1500+(stat-80)*10,1400,1850);q.reactionTimeout=setTimeout(()=>finishQte('SBAGLIATO',-.15),timeout)},850+Math.random()*850)}
function handleReaction(dir){let q=state.qte;if(!q||q.type!=='reaction')return;if(!q.ready){clearTimeout(q.reactionDelay);refs.reactionSignal.textContent='TROPPO PRESTO';refs.reactionSignal.className='reaction-signal fail';return setTimeout(()=>finishQte('SBAGLIATO',-.16),180)}clearTimeout(q.reactionTimeout);let ms=performance.now()-q.reactionStart;if(dir!==q.reactionDir){refs.reactionSignal.textContent='DIREZIONE ERRATA';refs.reactionSignal.className='reaction-signal fail';return setTimeout(()=>finishQte('SBAGLIATO',-.15),160)}let timing=ms<520?'PERFETTO':ms<950?'BUONO':'NORMALE';refs.reactionSignal.textContent='OK';refs.reactionSignal.className='reaction-signal ok';setTimeout(()=>finishQte(timing,timing==='PERFETTO'?.11:timing==='BUONO'?.05:-.01),120)}
function qteScore(q){return q.timing==='PERFETTO'?96:q.timing==='BUONO'?82:q.timing==='NORMALE'?64:30}
function choiceSuccess(c,q){
 let actor=state.chain.actor,opp=state.chain.opponent;
 let stat=Math.round(actorStat(actor,c.stat));
 let oppStat=Math.round(state.activeMoment.def?actorStat(opp,'shooting'):actorStat(opp,'defending'));
 if(state.activeMoment.opponent==='gk')oppStat=Math.round(actorStat(opp,'positioning'));
 let qs=qteScore(q),tactical=Math.round((c.base||.55)*100),chainPts=Math.round(state.chain.quality*38);
 let shapePts=state.activeMoment.def?Math.round(state.chain.defenseShape||0):0;let execution=Math.round(stat*.45+qs*.35+tactical*.20+chainPts+shapePts);
 let riskPenalty=c.risk==='high'?10:c.risk==='low'?0:5;
 let threshold=Math.round(55+oppStat*.25+riskPenalty+(state.activeMoment.type==='PIAZZATO'?2:0));
 execution=clamp(execution,20,99);threshold=clamp(threshold,55,92);
 return {ok:execution>=threshold,execution,threshold,stat,oppStat,qs,tactical,chainPts,riskPenalty,shapePts};
}
function shotOutcome(c,q){
 let shooter=state.chain.actor,gk=bestPlayer(oppTeam().id,'gk');
 let shooting=Math.round(actorStat(shooter,'shooting')),technique=Math.round(actorStat(shooter,'technique')),keeper=Math.round(actorStat(gk,'positioning')*.56+gk.overall*.44),qs=qteScore(q);
 let chainPts=Math.round(state.chain.quality*30),bonus=Math.round((c.shotBonus||0)*100);
 let shotScore=Math.round(shooting*.43+technique*.17+qs*.30+shooter.overall*.10+chainPts+bonus);if(q.type==='aim'){let edge=Math.abs((q.aimX??50)-50);shotScore+=edge>=28?5:edge<12?-5:1;keeper-=edge>=28?5:0;}if(q.type==='setpiece'){let edge=Math.abs((q.setpieceDirection??50)-50),pow=q.setpiecePower??70;shotScore+=Math.round((edge>=24&&edge<=42?7:edge<10?-7:2)+(pow>=66&&pow<=86?5:pow<42?-8:0));}
 let situation=state.activeMoment.kind==='freekick'?5:state.activeMoment.kind==='loose'?-2:0;
 let keeperTarget=Math.round(keeper*.72+28+situation);
 shotScore=clamp(shotScore,25,99);keeperTarget=clamp(keeperTarget,58,96);
 let goal=shotScore>=keeperTarget;
 let margin=shotScore-keeperTarget;
 let miss;
 if(goal) miss='';
 else if(state.activeMoment.kind==='freekick' && q.type==='setpiece' && (q.setpiecePower??70)<56) miss='BARRIERA';
 else if(qs<50 || margin<=-14) miss='TIRO FUORI';
 else if(margin>=-3) miss='PALO';
 else miss='PARATA DEL PORTIERE';
 return {goal,shotScore,keeperTarget,miss,gk,shooting,technique,keeper,qs,chainPts,bonus};
}
function opponentShotOutcome(){
 let att=bestPlayer(oppTeam().id,'attack'),gk=bestPlayer(state.team.id,'gk');
 let attack=Math.round(actorStat(att,'shooting')*.58+att.overall*.42),keeper=Math.round(actorStat(gk,'positioning')*.55+gk.overall*.45);
 let threat=Math.round((state.activeMoment.threat||.44)*100);
 let shotScore=Math.round(attack*.58+threat*.42);
 let target=Math.round(keeper*.72+27);
 return {goal:shotScore>=target,shotScore,target,attack,keeper,att,gk};
}
function factorRow(label,value){value=Math.round(clamp(value,0,100));return `<div class="factor-row"><span>${label}</span><b>${value}</b><span class="factor-track"><span class="factor-fill" style="width:${value}%"></span></span></div>`}
function showOutcome(title,kind,factors,equation){refs.outcomeTitle.textContent=title;refs.outcomeTitle.className='outcome-title '+kind;refs.outcomeFactors.innerHTML=factors.map(x=>factorRow(x[0],x[1])).join('');refs.outcomeEquation.innerHTML=equation;refs.outcomeBreakdown.classList.add('hidden')}
function explainChoice(res,c,q){let f=[[c.stat.toUpperCase(),res.stat],['QTE '+q.timing,res.qs],['QUALITÀ SCELTA',res.tactical],['PRESSIONE AVVERSARIA',res.oppStat]];if(state.activeMoment.def)f.push(['STRUTTURA DIFENSIVA',clamp(70+(res.shapePts||0)*3,20,99)]);showOutcome(res.ok?'GIOCATA RIUSCITA':'GIOCATA FALLITA',res.ok?'ok':'fail',f,`Valore azione <b>${res.execution}</b> · soglia richiesta <b>${res.threshold}</b>. ${res.ok?'Hai superato la soglia.':'Non hai raggiunto la soglia.'}`)}
function explainShot(out,q){showOutcome(out.goal?'GOL':'CONCLUSIONE RESPINTA',''+(out.goal?'ok':'neutral'),[['TIRO',out.shooting],['TECNICA',out.technique],['QTE '+q.timing,out.qs],['PORTIERE',out.keeper]],`Qualità conclusione <b>${out.shotScore}</b> · valore da battere <b>${out.keeperTarget}</b>. ${out.goal?'La conclusione supera il portiere.':out.miss+'.'}`)}
function explainOpponentShot(out){showOutcome(out.goal?'GOL SUBITO':'PORTA SALVA',out.goal?'fail':'ok',[['ATTACCANTE',out.attack],['PERICOLOSITÀ',Math.round((state.activeMoment.threat||.44)*100)],['TUO PORTIERE',out.keeper]],`Qualità tiro avversario <b>${out.shotScore}</b> · soglia portiere <b>${out.target}</b>.`)}
function resolveQte(){let q=state.qte;if(!q)return;refs.qte.classList.add('hidden');hideQteModes();let c=state.chain.currentChoice,m=state.activeMoment,minute=refs.clock.textContent,res=choiceSuccess(c,q);state.chain.quality=clamp(state.chain.quality+q.quality+(res.ok?.05:-.07),-.18,.20);explainChoice(res,c,q);
 if(m.def){
   if(res.ok){S9Scene.resolveMoment(m,'defended',true).then(()=>{refs.commentary.textContent=`${state.chain.actor.name} chiude bene e spegne l’azione.`;state.events.push(`${minute} ${state.chain.actor.name}: intervento difensivo riuscito`);state.qte=null;setTimeout(nextMoment,2200)})}
   else{
     refs.commentary.textContent=`L’uscita non basta: l’attaccante entra ancora più vicino alla porta.`;
     state.qte=null;setTimeout(()=>showEmergencyDefense(),650)
   }
   return;
 }
 if(c.sceneAction&&res.ok){
   S9Scene.resolveRoute(c.sceneAction).then(()=>{
    refs.commentary.textContent=`${state.chain.actor.name} esegue la giocata.`;state.qte=null;
    if(c.continueBuild){setTimeout(()=>showReceiverSelection(),520)}
    else setTimeout(()=>showFinalBallFinish(c.sceneAction==='cross'?'cross':'ground'),420)
   });return
 }
 if(c.sceneAction&&!res.ok){
   S9Scene.loseRoute(c.sceneAction).then(()=>{refs.commentary.textContent=`La difesa legge ${c.label.toLowerCase()} e recupera palla.`;state.qte=null;triggerTurnover('PASSAGGIO INTERCETTATO: l’avversario riparte.')} );return
 }
 if(c.shot){
   if(!res.ok){S9Scene.resolveMoment(m,'miss',false).then(()=>{refs.commentary.textContent=`✗ ${q.timing} · ${c.label}: la giocata si sporca e non arriva una vera conclusione.`;state.events.push(`${minute} Occasione sfumata`);state.qte=null;setTimeout(nextMoment,2200)});return}
   let out=shotOutcome(c,q);explainShot(out,q);S9Scene.resolveMoment(m,out.goal?'goal':(out.miss==='PARATA DEL PORTIERE'?'saved':out.miss==='PALO'?'post':out.miss==='BARRIERA'?'defended':'wide'),false).then(()=>{if(out.goal){if(userIsHome())state.homeGoals++;else state.awayGoals++;updateScore();refs.commentary.textContent=`★ ${q.timing} · ${state.chain.actor.name}: GOOOL!`;state.events.push(`${minute} GOL ${state.chain.actor.name}`)}else{refs.commentary.textContent=`◼ ${q.timing} · ${state.chain.actor.name}: ${out.miss}.`;state.events.push(`${minute} ${out.miss}`)}state.qte=null;setTimeout(nextMoment,2300)});return
 }
 if(res.ok){
   let nextIndex=state.chain.stage+1;
   if(nextIndex<m.stages.length){S9Scene.resolveIntermediate(m,c.label).then(()=>{refs.commentary.textContent=`✓ ${q.timing} · ${c.label}: azione riuscita, si apre una seconda scelta.`;state.qte=null;setTimeout(()=>showStage(nextIndex),450)})}
   else{S9Scene.resolveMoment(m,'advance',false).then(()=>{refs.commentary.textContent=`✓ ${q.timing} · ${c.label}: giocata riuscita.`;state.events.push(`${minute} Azione completata`);state.qte=null;setTimeout(nextMoment,2100)})}
 }else{S9Scene.resolveMoment(m,'miss',false).then(()=>{refs.commentary.textContent=`✗ ${q.timing} · ${c.label}: la giocata non riesce. Possesso perso.`;state.events.push(`${minute} Azione offensiva fallita`);state.qte=null;setTimeout(nextMoment,2100)})}
}
function showEmergencyDefense(){let m=state.activeMoment;refs.chainStep.textContent='EMERGENZA · ULTIMA CHIUSURA';refs.momentText.textContent='La prima scelta non ha fermato l’azione. Hai un ultimo intervento prima del tiro.';let opts=[
 {label:'SCIVOLATA DISPERATA',risk:'high',qte:'reaction',stat:'defending',base:.40,stop:true,desc:'Puoi salvare tutto, ma basta un attimo di ritardo.'},
 {label:'COPRI IL PRIMO PALO',risk:'mid',qte:'timing',stat:'positioning',base:.56,stop:true,desc:'Costringi l’attaccante a cercare l’angolo più difficile.'},
 {label:'AFFIDATI AL PORTIERE',risk:'low',qte:'reaction',stat:'positioning',base:.48,stop:true,gkHelp:true,desc:'Chiudi la linea centrale e lasci la conclusione al portiere.'}
 ];
 state.activeMoment.stages=[{choices:opts}];state.chain.stage=0;refs.choices.innerHTML=opts.map((c,i)=>`<button class="choice risk-${c.risk}" data-i="${i}">${String.fromCharCode(65+i)} · ${c.label}<small>${c.desc}</small></button>`).join('');refs.decision.classList.remove('hidden');document.querySelectorAll('.choice').forEach(b=>b.onclick=()=>chooseEmergency(+b.dataset.i,opts))}
function chooseEmergency(i,opts){let c=opts[i];refs.decision.classList.add('hidden');state.chain.currentChoice=c;state.qte={choice:c,type:c.qte,quality:0,timing:'NORMALE',raf:0,pos:0,dir:1,emergency:true};refs.qte.classList.remove('hidden');hideQteModes();if(c.qte==='reaction')startReactionQte();else startTimingQte();let oldResolve=resolveQte;state.qte.emergencyResolver=true}
// intercept emergency at end of QTE by wrapping finishQte result through a small check
const baseFinishQte=finishQte;
finishQte=function(timing,quality){if(!state.qte)return;let emergency=state.qte.emergencyResolver;state.qte.timing=timing;state.qte.quality=quality;if(!emergency)return resolveQte();resolveEmergency()}
function resolveEmergency(){let q=state.qte,c=state.chain.currentChoice;refs.qte.classList.add('hidden');hideQteModes();let res=choiceSuccess(c,q),minute=refs.clock.textContent;explainChoice(res,c,q);if(res.ok){S9Scene.resolveMoment(state.activeMoment,'defended',true).then(()=>{refs.commentary.textContent=`✓ ${q.timing}: recupero disperato riuscito. Pericolo sventato.`;state.events.push(`${minute} Chiusura d'emergenza riuscita`);state.qte=null;setTimeout(nextMoment,2200)})}else{let oppOut=opponentShotOutcome();explainOpponentShot(oppOut);let concede=oppOut.goal;S9Scene.resolveMoment(state.activeMoment,concede?'goal':'miss',true).then(()=>{if(concede){if(userIsHome())state.awayGoals++;else state.homeGoals++;updateScore();refs.commentary.textContent=`✗ ${q.timing}: l'avversario riesce comunque a concludere e SEGNA.`;state.events.push(`${minute} Gol subito nel momento chiave`)}else{refs.commentary.textContent=`! ${q.timing}: il tiro parte, ma non entra.`;state.events.push(`${minute} Occasione avversaria fallita`)}state.qte=null;setTimeout(nextMoment,2300)})}}

function simulateOtherGame(h,a){let edge=(h.strength-a.strength)/20;let hg=Math.max(0,Math.round(rand(0,.95)+Math.max(0,edge)*.45+Math.random()*.85));let ag=Math.max(0,Math.round(rand(0,.85)+Math.max(0,-edge)*.45+Math.random()*.80));return [hg,ag]}
function applyResult(h,a,hg,ag){let H=state.table[h.id],A=state.table[a.id];H.p++;A.p++;H.gf+=hg;H.ga+=ag;A.gf+=ag;A.ga+=hg;if(hg>ag){H.w++;A.l++;H.pts+=3}else if(ag>hg){A.w++;H.l++;A.pts+=3}else{H.d++;A.d++;H.pts++;A.pts++}}
function finishMatch(){refs.clock.textContent="90'";for(let [h,a] of state.fixtures[state.round]){if(h.id===state.current.h.id&&a.id===state.current.a.id)applyResult(h,a,state.homeGoals,state.awayGoals);else{let [hg,ag]=simulateOtherGame(h,a);applyResult(h,a,hg,ag)}}refs.resultRound.textContent='GIORNATA '+(state.round+1);refs.resultScore.textContent=`${state.current.h.name} ${state.homeGoals} - ${state.awayGoals} ${state.current.a.name}`;refs.resultSummary.innerHTML=`Momenti giocati: <b>${state.totalMoments}</b><br>${state.events.slice(-7).join('<br>')||'Partita senza eventi registrati.'}`;state.round++;save();show('screenResult')}
function save(){localStorage.setItem('s9moments3d_v18',JSON.stringify({team:state.team?.id,round:state.round,table:state.table}))}

const S9Scene=(()=>{
 const G=window.S9Football3D,canvas=refs.canvas,ctx=canvas.getContext('2d');let raf=0,last=0,homeKit={shirt:'#173f86',shorts:'#111',socks:'#173f86'},awayKit={shirt:'#eee',shorts:'#222',socks:'#eee'};let players=[],ball={x:52.5,z:34,y:.28},targetBall={x:52.5,z:34,y:.28},cam={x:52.5,z:34,attackDir:1,tight:1},moment=null,choice=null,anim=null,receiverSelect=null,stopState=null,lastProjection=null;
 const formations={home:[[5,34],[22,10],[22,27],[22,41],[22,58],[43,12],[43,27],[43,42],[63,18],[63,34],[63,50]],away:[[100,34],[83,10],[83,27],[83,41],[83,58],[62,12],[62,27],[62,42],[42,18],[42,34],[42,50]]};
 function reset(){players=[];['home','away'].forEach(side=>formations[side].forEach((p,i)=>players.push({side,i,x:p[0],z:p[1],tx:p[0],tz:p[1],phase:Math.random()*6,angle:side==='home'?Math.PI/2:-Math.PI/2,role:i===0?'GK':'P'})));ball={x:52.5,z:34,y:.28};targetBall={...ball};cam={x:52.5,z:34,attackDir:1,tight:1};moment=null;choice=null;anim=null;receiverSelect=null;stopState=null;refs.receiverOverlay.classList.add('hidden');refs.receiverOverlay.innerHTML='';refs.stopControl.classList.add('hidden')}
 async function setTeams(h,a){homeKit=await G.loadKit(h.homeKit);awayKit=await G.loadKit(a.homeKit)}
 function resize(){const r=canvas.getBoundingClientRect(),d=Math.min(window.devicePixelRatio||1,1.5),w=Math.max(640,Math.round(r.width*d)),h=Math.max(360,Math.round(r.height*d));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h}}
 function start(){if(!raf){last=performance.now();raf=requestAnimationFrame(frame)}}function stop(){if(raf)cancelAnimationFrame(raf);raf=0}
 function setPlayerTarget(side,i,x,z){const p=players.find(p=>p.side===side&&p.i===i);if(p){p.tx=clamp(x,2,103);p.tz=clamp(z,2,66)}}
 function configureMoment(m,userHome,lead=false){moment={...m,userHome};choice=null;const attackSide=m.def?(userHome?'away':'home'):(userHome?'home':'away'),defendSide=attackSide==='home'?'away':'home',dir=attackSide==='home'?1:-1;cam.attackDir=dir;cam.tight=1;players.forEach(p=>{const f=formations[p.side][p.i];p.tx=f[0];p.tz=f[1]});const set=(side,i,x,z)=>setPlayerTarget(side,i,x,z);
  if(m.kind==='counter'){const bx=attackSide==='home'?(lead?58:69):(lead?47:36),bz=34;targetBall={x:bx,z:bz,y:.28};set(attackSide,9,bx-dir*1.5,bz);set(attackSide,8,bx-dir*8,bz-12);set(attackSide,10,bx-dir*8,bz+12);set(defendSide,2,bx+dir*8,bz-5);set(defendSide,3,bx+dir*10,bz+6);cam.tight=1.30}
  else if(m.kind==='duel'){const bx=attackSide==='home'?(lead?70:80):(lead?35:25),bz=31;targetBall={x:bx,z:bz,y:.28};set(attackSide,9,bx-dir*1.2,bz);set(defendSide,2,bx+dir*5,bz);set(attackSide,10,bx-dir*10,bz+10);set(defendSide,3,bx+dir*10,bz+8);cam.tight=1.48}
  else if(m.kind==='freekick'||m.kind==='penalty'){const bx=m.kind==='penalty'?(attackSide==='home'?94:11):(attackSide==='home'?81:24),bz=34;targetBall={x:bx,z:bz,y:.28};set(attackSide,9,bx-dir*3,bz);set(attackSide,8,bx-dir*7,bz-6);set(attackSide,10,bx-dir*7,bz+7);if(m.kind==='freekick'){for(let j=1;j<=4;j++)set(defendSide,j,bx+dir*7,24+j*4)}else{for(let j=1;j<=4;j++)set(defendSide,j,bx+dir*18,18+j*9)}set(defendSide,0,attackSide==='home'?101:4,34);cam.tight=m.kind==='penalty'?1.75:1.58}
  else if(m.kind==='defend'){const bx=attackSide==='home'?(lead?83:91):(lead?22:14),bz=32;targetBall={x:bx,z:bz,y:.28};set(attackSide,9,bx-dir*1.3,bz);set(attackSide,10,bx-dir*7,bz+9);set(defendSide,2,bx+dir*3,bz-3);set(defendSide,3,bx+dir*5,bz+5);set(defendSide,0,attackSide==='home'?101:4,34);cam.tight=1.72}
  else if(m.kind==='cross'){const bx=attackSide==='home'?88:17,bz=attackSide==='home'?10:58;targetBall={x:bx,z:bz,y:lead?.35:.9};set(attackSide,8,bx-dir*1,bz);set(attackSide,9,attackSide==='home'?94:11,31);set(attackSide,10,attackSide==='home'?91:14,41);set(defendSide,2,attackSide==='home'?92:13,30);set(defendSide,3,attackSide==='home'?93:12,40);set(defendSide,0,attackSide==='home'?101:4,34);cam.tight=1.52}
  else{const bx=attackSide==='home'?92:13,bz=35;targetBall={x:bx,z:bz,y:.35};set(attackSide,9,bx-dir*2,bz);set(attackSide,10,bx-dir*7,bz+8);set(defendSide,2,bx+dir*3,bz-4);set(defendSide,3,bx+dir*4,bz+5);set(defendSide,0,attackSide==='home'?101:4,34);cam.tight=1.78}
 }
 function playLeadIn(m,userHome){
  configureMoment(m,userHome,true);
  ball={...targetBall};targetBall={...ball};
  if(m.kind==='freekick'||m.kind==='penalty')return new Promise(resolve=>setTimeout(()=>{configureMoment(m,userHome,false);setTimeout(resolve,900)},520));
  return new Promise(resolve=>setTimeout(async()=>{
    const startPos={...ball};configureMoment(m,userHome,false);const dest={...targetBall};ball={...startPos};targetBall={...startPos};
    await runBallAnim(dest,m.kind==='counter'?1850:1650,m.kind==='cross'?1.25:.16);targetBall={...dest};setTimeout(resolve,420)
  },520))
 }
 function kickoffSequence(userHome){
  moment=null;choice=null;receiverSelect=null;cam.x=52.5;cam.z=34;cam.attackDir=1;cam.tight=1.08;
  players.forEach(p=>{const f=formations[p.side][p.i];p.tx=f[0];p.tz=f[1]});
  const kickSide=Math.random()<.5?'home':'away',dir=kickSide==='home'?1:-1,opp=kickSide==='home'?'away':'home';cam.attackDir=dir;
  const p9=playerFor(kickSide,9),p10=playerFor(kickSide,10),mid=playerFor(kickSide,6);if(p9){p9.tx=52.5-dir*.8;p9.tz=33}if(p10){p10.tx=52.5-dir*2.4;p10.tz=35}if(mid){mid.tx=52.5-dir*10;mid.tz=29}
  ball={x:52.5,z:34,y:.28};targetBall={...ball};
  return new Promise(async resolve=>{await new Promise(r=>setTimeout(r,650));let a={x:52.5-dir*3.2,z:35,y:.28};await runBallAnim(a,520,.08);if(p10){p10.tx=a.x;p10.tz=a.z}players.filter(p=>p.side===kickSide&&p.i!==0).forEach((p,i)=>{p.tx=clamp(p.tx+dir*(2.5+(i%3)),2,103)});await new Promise(r=>setTimeout(r,380));let b={x:52.5-dir*11,z:29,y:.28};await runBallAnim(b,760,.10);if(mid){mid.tx=b.x;mid.tz=b.z}await new Promise(r=>setTimeout(r,700));resolve()})
 }
 function getReceiverContext(opt){
  const side=moment?.userHome?'home':'away',pl=playerFor(side,opt.sceneIndex),dir=side==='home'?1:-1,goalX=side==='home'?105:0;
  const x=pl?.x??ball.x,z=pl?.z??ball.z,distanceToGoal=Math.abs(goalX-x),wide=z<21||z>47;
  let zone=distanceToGoal>62?'COSTRUZIONE':distanceToGoal>40?'CENTROCAMPO':distanceToGoal>22?'TREQUARTI':'AREA';
  let defenders=players.filter(p=>p.side!==side&&p.i!==0),pressure=defenders.length?Math.min(...defenders.map(d=>Math.hypot(d.x-x,d.z-z))):10;
  return {x,z,dir,goalX,distanceToGoal,wide,zone,pressure};
 }
 function commitChoice(m,c){choice=c;const attackSide=m.def?(moment.userHome?'away':'home'):(moment.userHome?'home':'away'),dir=attackSide==='home'?1:-1;let carrier=players.find(p=>p.side===attackSide&&p.i===9);if(carrier){carrier.tx=targetBall.x-dir*1.2;carrier.tz=targetBall.z}targetBall.y=.32}
 function resolveIntermediate(m,c){return new Promise(resolve=>{const attackSide=m.def?(moment.userHome?'away':'home'):(moment.userHome?'home':'away'),dir=attackSide==='home'?1:-1;let from={...ball},to={x:clamp(ball.x+dir*9,3,102),z:clamp(ball.z+(Math.random()-.5)*10,5,63),y:.32};anim={start:performance.now(),duration:650,from,to,done:()=>{targetBall={...to};resolve()}}})}
 function runBallAnim(to,duration=800,arc=1.2){return new Promise(resolve=>{anim={start:performance.now(),duration,from:{...ball},to:{...to},arc,done:resolve}})}
 function playerFor(side,i){return players.find(p=>p.side===side&&p.i===i)}
 function distToSegment(px,pz,ax,az,bx,bz){let vx=bx-ax,vz=bz-az,wx=px-ax,wz=pz-az,c1=wx*vx+wz*vz,c2=vx*vx+vz*vz,t=c2?clamp(c1/c2,0,1):0,qx=ax+t*vx,qz=az+t*vz;return {d:Math.hypot(px-qx,pz-qz),x:qx,z:qz,t}}
 function beginReceiverSelection(opts,cb){
   const attackSide=moment.userHome?'home':'away',dir=attackSide==='home'?1:-1;
   receiverSelect={opts,cb,attackSide};refs.receiverOverlay.innerHTML='';refs.receiverOverlay.classList.remove('hidden');
   // Three deliberately different routes: wide left, central run, wide right.
   const candidates=players.filter(p=>p.side===attackSide&&p.i!==0),carrier=[...candidates].sort((a,b)=>Math.hypot(a.x-ball.x,a.z-ball.z)-Math.hypot(b.x-ball.x,b.z-ball.z))[0],baseX=ball.x;if(carrier){carrier.tx=ball.x;carrier.tz=ball.z}
   opts.forEach(o=>{let pl=playerFor(attackSide,o.sceneIndex);if(!pl)return;let forward=o.lane==='centre'?9:6.5,x=clamp(baseX+dir*forward,4,101),z=o.lane==='left'?clamp(ball.z-14,6,28):o.lane==='right'?clamp(ball.z+14,40,62):clamp(ball.z+(ball.z<34?3:-3),24,44);pl.tx=x;pl.tz=z;let b=document.createElement('button');b.className='receiver-marker';b.type='button';b.dataset.num=o.num;b.innerHTML=`${o.num}<small>${o.player.name.split(' ').slice(-1)[0]}</small>`;b.onclick=e=>{e.stopPropagation();pickReceiver(o.num)};refs.receiverOverlay.appendChild(b);o.el=b});
 }
 function beginDefenderSelection(opts,cb){
   const userSide=moment.userHome?'home':'away';receiverSelect={opts,cb,attackSide:userSide,mode:'def'};refs.receiverOverlay.innerHTML='';refs.receiverOverlay.classList.remove('hidden');opts.forEach(o=>{let pl=playerFor(userSide,o.sceneIndex);if(!pl)return;let b=document.createElement('button');b.className='receiver-marker defender-marker';b.type='button';b.dataset.num=o.num;b.innerHTML=`${o.num}<small>${o.role}</small>`;b.onclick=e=>{e.stopPropagation();pickReceiver(o.num)};refs.receiverOverlay.appendChild(b);o.el=b})
 }
 function commitDefender(opt,fit){
   const userSide=moment.userHome?'home':'away',oppSide=userSide==='home'?'away':'home',pl=playerFor(userSide,opt.sceneIndex),dir=oppSide==='home'?1:-1;return new Promise(resolve=>{if(pl){pl.tx=clamp(ball.x-dir*2.1,2,103);pl.tz=ball.z+(opt.role==='ESTERNO'?4:opt.role==='MEDIANO'?-3:0)}if(fit<0){let runner=playerFor(oppSide,10);if(runner){runner.tx=clamp(ball.x+dir*9,2,103);runner.tz=clamp(ball.z+(ball.z<34?10:-10),3,65)}}players.filter(p=>p.side===userSide&&p!==pl&&p.i!==0).slice(0,4).forEach((p,i)=>{p.tx=clamp(p.tx-dir*(fit<0?0:1.5),2,103);p.tz=clamp(p.tz+(34-p.tz)*.08,2,66)});setTimeout(resolve,620)})
 }
 function coinToss(){cam.x=52.5;cam.z=34;cam.tight=1.25}
 function cancelReceiverSelection(){receiverSelect=null;refs.receiverOverlay.classList.add('hidden');refs.receiverOverlay.innerHTML=''}
 function pickReceiver(num){if(!receiverSelect)return;let o=receiverSelect.opts.find(x=>x.num===num);if(!o)return;let cb=receiverSelect.cb;cancelReceiverSelection();cb(o)}
 function passToReceiver(opt){
   const attackSide=moment.userHome?'home':'away',defSide=attackSide==='home'?'away':'home',dir=attackSide==='home'?1:-1,recv=playerFor(attackSide,opt.sceneIndex);
   return new Promise(async resolve=>{
     let start={...ball},dest={x:clamp(recv.tx+dir*2.2,3,102),z:recv.tz,y:.28};recv.tx=dest.x;recv.tz=dest.z;
     let nearest=null;players.filter(p=>p.side===defSide&&p.i!==0).forEach(d=>{let hit=distToSegment(d.x,d.z,start.x,start.z,dest.x,dest.z);if(!nearest||hit.d<nearest.hit.d)nearest={p:d,hit}});
     let passStat=actorStat(state.chain.actor,'passing'),danger=nearest?.hit.d??9,cut=opt.lane==='centre'?5.4:2.8,intercept=danger<cut&&passStat<94;
     if(intercept){let ip={x:nearest.hit.x,z:nearest.hit.z,y:.28};nearest.p.tx=ip.x;nearest.p.tz=ip.z;await runBallAnim(ip,720,.18);targetBall={...ip};resolve({intercepted:true,defender:nearest.p});return}
     await runBallAnim(dest,820,.20);targetBall={...dest};ball={...dest};resolve({intercepted:false,receiver:recv});
   })
 }
 function beginFirstTouch(opt,cb){
   const attackSide=moment.userHome?'home':'away',recv=playerFor(attackSide,opt.sceneIndex);stopState={opt,cb,recv,start:performance.now(),deadline:1900,done:false};refs.stopControl.classList.remove('hidden');
   refs.stopControl.onclick=()=>{if(!stopState||stopState.done)return;stopState.done=true;let ms=performance.now()-stopState.start,grade=ms>=620&&ms<=1050?'PERFECT':ms>=380&&ms<=1380?'GOOD':ms>=220&&ms<=1600?'DIRTY':'ERROR';finishTouch(grade)};
   setTimeout(()=>{if(stopState&&!stopState.done){stopState.done=true;finishTouch('ERROR')}},1900)
 }
 function finishTouch(grade){let st=stopState;if(!st)return;refs.stopControl.classList.add('hidden');stopState=null;const attackSide=moment.userHome?'home':'away',dir=attackSide==='home'?1:-1;if(grade==='ERROR'){let loose={x:clamp(ball.x+dir*4.4,3,102),z:ball.z+(st.opt.lane==='left'?-1.4:st.opt.lane==='right'?1.4:0),y:.28};runBallAnim(loose,430,.10).then(()=>st.cb({grade}));return}if(grade==='DIRTY'){let loose={x:clamp(ball.x+dir*1.5,3,102),z:ball.z,y:.28};runBallAnim(loose,260,.05).then(()=>st.cb({grade}));return}st.cb({grade})}
 function startCounterattack(){
   const userSide=moment.userHome?'home':'away',oppSide=userSide==='home'?'away':'home',dir=oppSide==='home'?1:-1;let candidates=players.filter(p=>p.side===oppSide&&p.i!==0),carrier=[...candidates].sort((a,b)=>Math.hypot(a.x-ball.x,a.z-ball.z)-Math.hypot(b.x-ball.x,b.z-ball.z))[0],support=playerFor(oppSide,10)||candidates[1];cam.attackDir=dir;cam.tight=1.35;carrier.tx=ball.x;carrier.tz=ball.z;return new Promise(resolve=>setTimeout(()=>{carrier.tx=clamp(ball.x+dir*13,3,102);carrier.tz=ball.z;if(support){support.tx=clamp(ball.x+dir*9,3,102);support.tz=clamp(ball.z+10,4,64)}runBallAnim({x:carrier.tx,z:carrier.tz,y:.28},920,.12).then(resolve)},430))
 }
 function resolveRoute(kind){
   const attackSide=moment.userHome?'home':'away',dir=attackSide==='home'?1:-1;
   if(kind==='cross')return runBallAnim({x:attackSide==='home'?94:11,z:34,y:1.15},940,3.4);
   if(kind==='through')return runBallAnim({x:clamp(ball.x+dir*14,3,102),z:clamp(ball.z+(ball.z<34?5:-5),8,60),y:.28},820,.18);
   if(kind==='switch')return runBallAnim({x:clamp(ball.x+dir*7,3,102),z:ball.z<34?53:15,y:.55},880,1.15);
   if(kind==='inside')return runBallAnim({x:clamp(ball.x+dir*9,3,102),z:34,y:.28},760,.12);
   if(kind==='overlap')return runBallAnim({x:clamp(ball.x+dir*11,3,102),z:clamp(ball.z+(ball.z<34?-5:5),5,63),y:.28},790,.10);
   if(kind==='support')return runBallAnim({x:clamp(ball.x-dir*4,3,102),z:clamp(34+(ball.z-34)*.7,6,62),y:.28},620,.08);
   if(kind==='carry')return runBallAnim({x:clamp(ball.x+dir*8,3,102),z:clamp(ball.z+(ball.z<34?1.5:-1.5),4,64),y:.28},760,.06);
   return runBallAnim({x:clamp(ball.x+dir*10,3,102),z:34,y:.28},760,.12)
 }
 function loseRoute(kind){const attackSide=moment.userHome?'home':'away',dir=attackSide==='home'?1:-1;return runBallAnim({x:clamp(ball.x+dir*6,3,102),z:clamp(ball.z+(kind==='cross'?9:3),3,65),y:.35},620,kind==='cross'?1.8:.12)}
 function resolveMoment(m,outcome,isDef){return new Promise(async resolve=>{
   const attackSide=isDef?(moment.userHome?'away':'home'):(moment.userHome?'home':'away'),dir=attackSide==='home'?1:-1,goalX=attackSide==='home'?105.4:-.4,nearPost=30.65,farPost=37.35;
   if(outcome==='goal'){let z=state.qte&&state.qte.type==='setpiece'?clamp(30.7+((state.qte.setpieceDirection||50)/100)*6.6,30.6,37.4):state.qte&&state.qte.type==='aim'?clamp(30.7+((state.qte.aimX||50)/100)*6.6,30.6,37.4):(choice&&/SECONDO|INCROCIATO|GIRO/.test(choice))?(ball.z<34?farPost:nearPost):34.2;await runBallAnim({x:goalX,z,y:1.25},980,2.4);resolve();return}
   if(outcome==='wide'){let z=ball.z<34?27.9:40.1;await runBallAnim({x:goalX+dir*2.2,z,y:.45},980,2.6);resolve();return}
   if(outcome==='post'){let z=ball.z<34?30.25:37.75;await runBallAnim({x:attackSide==='home'?104.7:.3,z,y:1.15},760,2.0);let reb={x:clamp(ball.x-dir*8,2,103),z:clamp(z+(z<34?4:-4),3,65),y:.32};await runBallAnim(reb,520,.8);resolve();return}
   if(outcome==='saved'){let save={x:attackSide==='home'?101.2:3.8,z:34+(ball.z-34)*.12,y:1.0};await runBallAnim(save,700,1.7);let deflect={x:clamp(save.x-dir*8,2,103),z:clamp(save.z+(save.z<34?-8:8),3,65),y:.38};await runBallAnim(deflect,520,1.0);resolve();return}
   if(outcome==='defended'){await runBallAnim({x:clamp(ball.x-dir*12,3,102),z:clamp(ball.z+(ball.z<34?8:-8),3,65),y:.55},760,1.2);resolve();return}
   if(outcome==='advance'){await runBallAnim({x:clamp(ball.x+dir*10,3,102),z:ball.z,y:.28},720,.15);resolve();return}
   await runBallAnim({x:clamp(ball.x+dir*12,3,102),z:clamp(ball.z+10,3,65),y:.4},780,1.1);resolve()
 })}
 function drawEnvironment(s,p,now){
  // V17 visual pass: stadium built mostly from sloped planes instead of chunky boxes.
  const concrete='#353b3c',concrete2='#2a3031',dark='#111817',roof='#171d1e',rail='#c6c8bc';
  const face=(pts,color)=>s.face(pts,color);
  // Long-side grandstands: sloped seating bowls.
  face([[0,.65,-2],[105,.65,-2],[108,8.2,-16],[-3,8.2,-16]],concrete);
  face([[0,.65,70],[105,.65,70],[108,8.2,84],[-3,8.2,84]],concrete2);
  // End stands.
  face([[-2,.65,0],[-2,.65,68],[-16,7.2,72],[-16,7.2,-4]],concrete2);
  face([[107,.65,0],[107,.65,68],[121,7.2,72],[121,7.2,-4]],concrete);
  // Dark fascia separates pitch from crowd without making a solid wall.
  face([[0,.15,-1.25],[105,.15,-1.25],[105,1.35,-1.25],[0,1.35,-1.25]],'#101716');
  face([[0,.15,69.25],[105,.15,69.25],[105,1.35,69.25],[0,1.35,69.25]],'#101716');
  // Lightweight roofs and rear shadow planes.
  face([[-4,9.4,-17],[109,9.4,-17],[104,9.0,-8],[1,9.0,-8]],roof);
  face([[-4,9.4,85],[109,9.4,85],[104,9.0,76],[1,9.0,76]],roof);
  // Sparse roof supports rather than giant structural blocks.
  for(let x=5;x<=100;x+=19){s.box([x,5.0,-14],[.18,8.2,.18],dark);s.box([x,5.0,82],[.18,8.2,.18],dark)}
  // Thin advertising hoardings as planes.
  const ads=['#d6a735','#214d83','#8d2428','#e2ddd0','#2e7148'];
  for(let i=0,x=3;x<102;i++,x+=10.2){
    let c=ads[i%ads.length],x2=Math.min(102,x+9.3);
    face([[x,.08,-.55],[x2,.08,-.55],[x2,1.05,-.55],[x,1.05,-.55]],c);
    face([[x,.08,68.55],[x2,.08,68.55],[x2,1.05,68.55],[x,1.05,68.55]],ads[(i+2)%ads.length]);
  }
  // Open dugouts: roof + glass-like back + thin posts, no solid cuboids.
  const dugout=(cx)=>{
    face([[cx-6,.08,-1.7],[cx+6,.08,-1.7],[cx+6,1.65,-2.55],[cx-6,1.65,-2.55]],'rgba(126,151,151,.22)');
    face([[cx-6,1.65,-2.55],[cx+6,1.65,-2.55],[cx+5.3,1.9,-1.55],[cx-5.3,1.9,-1.55]],'#7e8984');
    for(let q=-5;q<=5;q+=2.5)s.box([cx+q,.48,-1.95],[1.45,.18,.62],'#24322f');
    s.box([cx-6, .82,-2.1],[.12,1.55,.12],rail);s.box([cx+6,.82,-2.1],[.12,1.55,.12],rail);
  };
  dugout(36);dugout(69);
  // Tunnel opening in main stand.
  face([[48.2,.1,-2.05],[56.8,.1,-2.05],[56.8,2.9,-5.2],[48.2,2.9,-5.2]],'#050908');
 }
 function drawCrowd(p){
  // V17: sprite-like spectators following seating slopes; avoids a wall of 3D cubes.
  const w=canvas.width,h=canvas.height,shirts=['#d9d1bd','#b23b35','#3a6791','#d6d6d1','#2a3b34','#d2aa49'];
  const dot=(x,y,z,c,r=1.45)=>{let q=p([x,y,z]);if(q.z<=.1||q.x<-20||q.x>w+20||q.y<-20||q.y>h+20)return;let rr=Math.max(.7,Math.min(2.4,w/980*r));ctx.fillStyle=c;ctx.beginPath();ctx.arc(q.x,q.y,rr,0,Math.PI*2);ctx.fill()};
  for(let side=0;side<2;side++){
    for(let row=0;row<8;row++){
      let z=side?71.5+row*1.45:-3.5-row*1.45,y=1.2+row*.78;
      for(let i=0;i<58;i++){let x=1.5+i*1.82+((row%2)*.7);dot(x,y,z,shirts[(i+row*3+side)%shirts.length],1.15)}
    }
  }
  // end-stand spectators (sparser for performance)
  for(let end=0;end<2;end++)for(let row=0;row<6;row++)for(let i=0;i<28;i++){
    let x=end?-3.2-row*1.55:108.2+row*1.55,z=2+i*2.35,y=1.15+row*.8;dot(x,y,z,shirts[(i+row+end*2)%shirts.length],1.05)
  }
  // simple fan banners as projected screen-space strips.
  const banner=(a,b,text,color)=>{let q1=p(a),q2=p(b);if(q1.z<.1||q2.z<.1)return;ctx.save();ctx.strokeStyle=color;ctx.lineWidth=Math.max(2,w/420);ctx.beginPath();ctx.moveTo(q1.x,q1.y);ctx.lineTo(q2.x,q2.y);ctx.stroke();ctx.restore()};
  banner([18,3.0,-7],[38,3.0,-7],'','#e6e0c8');banner([65,4.0,76],[89,4.0,76],'','#b63c36');
 }
 function drawPitch(s,p){
  G.pitchSurface(ctx,p,0,0,105,68,10.5);const white='#e5ecdc';
  const line=pts=>{ctx.strokeStyle=white;ctx.lineWidth=Math.max(1.1,canvas.width/1050);ctx.beginPath();pts.map(p).forEach((q,i)=>i?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y));ctx.stroke()};
  line([[0,.04,0],[105,.04,0],[105,.04,68],[0,.04,68],[0,.04,0]]);line([[52.5,.04,0],[52.5,.04,68]]);
  line([[0,.04,13.84],[16.5,.04,13.84],[16.5,.04,54.16],[0,.04,54.16]]);line([[105,.04,13.84],[88.5,.04,13.84],[88.5,.04,54.16],[105,.04,54.16]]);
  line([[0,.04,24.84],[5.5,.04,24.84],[5.5,.04,43.16],[0,.04,43.16]]);line([[105,.04,24.84],[99.5,.04,24.84],[99.5,.04,43.16],[105,.04,43.16]]);
  const circ=[];for(let i=0;i<=48;i++){const a=i/48*Math.PI*2;circ.push([52.5+9.15*Math.cos(a),.04,34+9.15*Math.sin(a)])}line(circ);
  // technical areas
  line([[30,.03,0],[30,.03,5],[45,.03,5],[45,.03,0]]);line([[60,.03,0],[60,.03,5],[75,.03,5],[75,.03,0]]);
  const goal=(x,dir)=>{const z1=30.34,z2=37.66;s.box([x,2.44,34],[.10,.10,7.32],'#f3f5ee');s.box([x,1.22,z1],[.10,2.44,.10],'#f3f5ee');s.box([x,1.22,z2],[.10,2.44,.10],'#f3f5ee');s.box([x-dir*2.15,.08,34],[.08,.08,7.32],'#cfd5ce')};goal(0,1);goal(105,-1)
 }
 function drawGoalNets(p){
  const net=(x,dir)=>{const z1=30.34,z2=37.66,back=x-dir*2.15;ctx.save();ctx.strokeStyle='rgba(232,238,230,.48)';ctx.lineWidth=Math.max(.55,canvas.width/2100);
   const l=(a,b)=>{let q1=p(a),q2=p(b);if(q1.z>.1&&q2.z>.1){ctx.beginPath();ctx.moveTo(q1.x,q1.y);ctx.lineTo(q2.x,q2.y);ctx.stroke()}};
   for(let i=0;i<=7;i++){let z=z1+(z2-z1)*i/7;l([x,0,z],[back,0,z]);l([x,2.44,z],[back,.12,z])}
   for(let i=0;i<=5;i++){let y=2.44*i/5;l([x,y,z1],[back,y*.12,z1]);l([x,y,z2],[back,y*.12,z2])}
   for(let i=0;i<=7;i++){let z=z1+(z2-z1)*i/7;l([back,.12,z],[back,.12,z+(i%2?.02:-.02)])}
   ctx.restore()};net(0,1);net(105,-1)
 }
 function attackSideGoalX(userHome,isDef){let attackSide=isDef?(userHome?'away':'home'):(userHome?'home':'away');return attackSide==='home'?105:0}
 function render(now){resize();const dt=Math.min(.05,(now-last)/1000||.016);last=now;ctx.clearRect(0,0,canvas.width,canvas.height);const sky=ctx.createLinearGradient(0,0,0,canvas.height);sky.addColorStop(0,'#111917');sky.addColorStop(.58,'#07110d');sky.addColorStop(1,'#030706');ctx.fillStyle=sky;ctx.fillRect(0,0,canvas.width,canvas.height);players.forEach(pl=>{const dx=pl.tx-pl.x,dz=pl.tz-pl.z,dist=Math.hypot(dx,dz);pl.x+=dx*Math.min(1,dt*2.3);pl.z+=dz*Math.min(1,dt*2.3);if(dist>.02){pl.phase+=dt*7;pl.angle=Math.atan2(dx,dz)}});if(anim){const t=clamp((now-anim.start)/anim.duration,0,1),e=1-Math.pow(1-t,3);ball.x=anim.from.x+(anim.to.x-anim.from.x)*e;ball.z=anim.from.z+(anim.to.z-anim.from.z)*e;ball.y=.28+Math.sin(t*Math.PI)*(anim.arc??1.9)+(anim.to.y-.28)*e;if(t>=1){const done=anim.done;targetBall={...anim.to};anim=null;setTimeout(done,100)}}else{ball.x+=(targetBall.x-ball.x)*Math.min(1,dt*4);ball.z+=(targetBall.z-ball.z)*Math.min(1,dt*4);ball.y+=(targetBall.y-ball.y)*Math.min(1,dt*4)}cam.x+=(ball.x-cam.x)*Math.min(1,dt*1.8);cam.z+=(ball.z-cam.z)*Math.min(1,dt*1.6);const w=canvas.width,h=canvas.height,focusX=clamp(cam.x,8,97),focusZ=34+(cam.z-34)*.55,dir=cam.attackDir||1,tight=cam.tight||1;let eye,target,fov;if(moment&&(moment.kind==='freekick'||moment.kind==='penalty')){eye=[ball.x-dir*8.5,4.8,ball.z+0.3];target=[attackSideGoalX(moment.userHome,moment.def),1.2,34];fov=38}else{eye=[focusX-dir*(18/tight),28/tight,focusZ+54/tight];target=[focusX+dir*(7/tight),.8,focusZ];fov=Math.max(34,43-5*(tight-1))}const p=G.camera(eye,target,w,h,fov),env=G.scene(ctx,p);lastProjection=p;if(receiverSelect){receiverSelect.opts.forEach(o=>{let pl=playerFor(receiverSelect.attackSide,o.sceneIndex);if(pl&&o.el){let q=p([pl.x,2.8,pl.z]);o.el.style.left=(q.x/w*100)+'%';o.el.style.top=(q.y/h*100)+'%';o.el.style.opacity=q.z>.1?'1':'0'}})}if(stopState&&stopState.recv){let q=p([stopState.recv.x,2.0,stopState.recv.z]);refs.stopControl.style.left=(q.x/w*100)+'%';refs.stopControl.style.top=(q.y/h*100)+'%'}drawEnvironment(env,p,now);env.flush();drawCrowd(p);const field=G.scene(ctx,p);drawPitch(field,p);field.flush();drawGoalNets(p);const actors=G.scene(ctx,p);players.forEach(pl=>{const sh=p([pl.x,.02,pl.z]);ctx.fillStyle='rgba(0,12,5,.28)';ctx.beginPath();ctx.ellipse(sh.x,sh.y,Math.max(3,w/225),Math.max(1.4,w/590),0,0,Math.PI*2);ctx.fill();const kit=pl.side==='home'?homeKit:awayKit;G.player(actors,pl.x,pl.z,kit,pl.phase,pl.angle,1.35,String(pl.i===0?1:pl.i+1),pl.i===0)});// Officials: referee, two assistants and bench staff.
 const refKit={shirt:'#e5c847',shorts:'#171717',socks:'#171717',front:null};
 G.player(actors,52.5+(ball.x-52.5)*.32,31+(ball.z-34)*.22,refKit,now/190,0,1.18,'',false);
 G.player(actors,clamp(ball.x-12,8,97),1.1,refKit,now/220,0,1.03,'',false);
 G.player(actors,clamp(ball.x+12,8,97),66.9,refKit,now/220,Math.PI,1.03,'',false);
 for(let i=0;i<5;i++){G.player(actors,33+i*1.5,-1.4,homeKit,0,0,0.82,String(i+12),false);G.player(actors,64+i*1.5,-1.4,awayKit,0,0,0.82,String(i+12),false)}
 actors.flush();const bp=p([ball.x,ball.y,ball.z]),be=p([ball.x+.14,ball.y,ball.z]),br=clamp(Math.hypot(be.x-bp.x,be.y-bp.y),3,18),ground=p([ball.x,.03,ball.z]);const shadowFade=clamp(1-ball.y/7,.16,.62);ctx.fillStyle=`rgba(0,10,4,${shadowFade*.55})`;ctx.beginPath();ctx.ellipse(ground.x,ground.y,br*(1.18+ball.y*.035),br*.48,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#f7f6ee';ctx.strokeStyle='#26302d';ctx.lineWidth=Math.max(1,br*.09);ctx.beginPath();ctx.arc(bp.x,bp.y,br,0,Math.PI*2);ctx.fill();ctx.stroke();const spin=(now*.012+ball.x*.16+ball.z*.11);ctx.fillStyle='#26302d';for(let k=0;k<3;k++){let a=spin+k*2.094,rr=br*.44,px=bp.x+Math.cos(a)*rr,py=bp.y+Math.sin(a)*rr*.72;ctx.beginPath();ctx.arc(px,py,Math.max(1.1,br*.18),0,Math.PI*2);ctx.fill()}raf=requestAnimationFrame(render)}
 function frame(t){render(t)}
 return {start,stop,setTeams,reset,playLeadIn,kickoffSequence,getReceiverContext,commitChoice,resolveIntermediate,resolveMoment,beginReceiverSelection,beginDefenderSelection,commitDefender,coinToss,cancelReceiverSelection,pickReceiver,passToReceiver,beginFirstTouch,startCounterattack,resolveRoute,loseRoute};
})();

function openTeamScreen(){teamPick();show('screenTeam')}

// V12: mouse/touch unificati. Nessuna sequenza di frecce.
let gestureStart=null;
function gestureDir(dx,dy){let mag=Math.hypot(dx,dy);if(mag<34)return null;let dir=Math.abs(dx)>Math.abs(dy)?(dx>0?'RIGHT':'LEFT'):(dy>0?'DOWN':'UP');return {dir,mag:clamp(mag/110,.65,1.35)}}
function gestStart(x,y){gestureStart={x,y,time:performance.now()}}
function gestEnd(x,y){if(!gestureStart)return;let g=gestureDir(x-gestureStart.x,y-gestureStart.y);gestureStart=null;if(g)handleSequence(g.dir,g.mag)}
if(refs.swipeArena){refs.swipeArena.addEventListener('pointerdown',e=>{e.preventDefault();gestStart(e.clientX,e.clientY);refs.swipeArena.setPointerCapture?.(e.pointerId)});refs.swipeArena.addEventListener('pointerup',e=>{e.preventDefault();gestEnd(e.clientX,e.clientY)})}
document.querySelectorAll('[data-react]').forEach(b=>b.addEventListener('click',()=>handleReaction(b.dataset.react)));
window.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')handleReaction('LEFT');if(e.key==='ArrowRight')handleReaction('RIGHT');if(['1','2','3'].includes(e.key))S9Scene.pickReceiver?.(+e.key);if(e.key.toLowerCase()==='d'&&e.shiftKey){document.body.classList.toggle('debug-ui');if(document.body.classList.contains('debug-ui'))refs.outcomeBreakdown.classList.remove('hidden')}});
if(refs.holdBtn){refs.holdBtn.addEventListener('pointerdown',e=>{e.preventDefault();beginHold()});['pointerup','pointercancel','pointerleave'].forEach(ev=>refs.holdBtn.addEventListener(ev,e=>{e.preventDefault();endHold()}))}
refs.continueBtn.addEventListener('click',()=>{if(state.round>=state.fixtures.length){alert('Fine girone del prototipo 3D.');state.round=0}renderHub();show('screenHub')});

refs.startBtn.addEventListener('click',openTeamScreen);refs.playBtn.addEventListener('click',startMatch);refs.qteBtn.addEventListener('click',stopTimingQte);refs.aimBtn.addEventListener('click',stopAimQte);

if(refs.setPieceBtn)refs.setPieceBtn.addEventListener('click',lockSetPieceDirection);if(refs.setPiecePowerBtn)refs.setPiecePowerBtn.addEventListener('click',lockSetPiecePower);

if(refs.goalTarget)refs.goalTarget.addEventListener('pointerdown',e=>{e.preventDefault();setAimFromPointer(e)});
