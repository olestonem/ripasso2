
const state={items:[],index:0,answered:false,activity:null,flipped:false};

function shuffle(a){const x=[...a];for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]]}return x}
function pick15(arr){return shuffle(arr).slice(0,15)}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}

function initActivity(type){
  state.activity=type;
  state.items=pick15(window.RESTAURANTE_DATA[type]);
  state.index=0;
  render();
}

function simplifyPrompt(text){
  let s=String(text||'');
  const replacements=[["presentare un sintomo", "avere un sintomo"], ["assumere un farmaco", "prendere un farmaco"], ["recarsi dal medico", "andare dal medico"], ["somministrazione", "servizio"], ["comunicazione", "modo di parlare"], ["somministrare", "dare"], ["disponibilità", "posti liberi"], ["preparazione", "preparazione"], ["consumazione", "ordine"], ["prescrizione", "ricetta"], ["comprensione", "capire"], ["prenotazione", "prenotazione"], ["attraversare", "passare"], ["raggiungere", "arrivare"], ["soggiornare", "stare"], ["necessitare", "avere bisogno di"], ["specificare", "dire"], ["selezionare", "scegliere"], ["selezionate", "scegli"], ["circostanza", "situazione"], ["manifestare", "avere"], ["prescrivere", "dare"], ["consigliare", "dire di"], ["comprendere", "capire"], ["espressione", "frase"], ["disponibile", "libero"], ["insaporire", "dare sapore"], ["acquistare", "comprare"], ["effettuare", "fare"], ["utilizzare", "usare"], ["richiedere", "chiedere"], ["consentire", "permettere"], ["proseguire", "continuare"], ["alloggiare", "stare"], ["pernottare", "dormire"], ["conservare", "tenere"], ["verificare", "controllare"], ["comunicare", "dire"], ["situazione", "caso"], ["consultare", "chiedere a"], ["preferenza", "scelta"], ["prossimità", "vicinanza"], ["consumare", "mangiare"], ["recarsi a", "andare a"], ["richiesta", "domanda"], ["necessita", "ha bisogno di"], ["seleziona", "scegli"], ["procedere", "andare"], ["malessere", "problema"], ["esprimere", "dire"], ["preferire", "volere di più"], ["adiacente", "vicino"], ["macinare", "fare la farina"], ["macinato", "tritato"], ["frumento", "grano"], ["sostanza", "prodotto"], ["sostanze", "prodotti"], ["assumere", "prendere"], ["utilizzo", "uso"], ["indicare", "dire"], ["reperire", "trovare"], ["verifica", "controlla"], ["pietanza", "piatto"], ["pietanze", "piatti"], ["disturbo", "problema"], ["richiede", "chiede"], ["incrocio", "incrocio"], ["consumo", "mangiare"], ["recarsi", "andare"], ["bevanda", "bibita"], ["sintomo", "problema"], ["ubicato", "che si trova"], ["situato", "che si trova"], ["indica", "vuol dire"]];
  for(const [from,to] of replacements){ s=s.replace(new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'gi'),to); }
  return s;
}

function render(){
  state.answered=false; state.flipped=false;
  const item=state.items[state.index];
  const pct=((state.index+1)/15)*100;
  document.getElementById('progressLabel').textContent=`${state.index+1}/15`;
  document.getElementById('progressBar').style.width=pct+'%';
  const prompt=document.getElementById('prompt'),content=document.getElementById('content'),feedback=document.getElementById('feedback');
  feedback.className='feedback';feedback.innerHTML='';prompt.textContent=simplifyPrompt((item.q||''));content.innerHTML='';
  document.getElementById('prevBtn').disabled=state.index===0;
  document.getElementById('nextBtn').textContent=state.index===14?'Fine →':'Avanti →';
  if(state.activity==='quiz'||state.activity==='completa'||state.activity==='roleplay'||state.activity==='situazioni'||state.activity==='verbi') renderMC(item,content);
  else if(state.activity==='indovina') renderWord(item,content);
  else if(state.activity==='intruso') renderIntruder(item,content);
  else if(state.activity==='flashcard') renderFlash(item,content);
}
function renderMC(item,content){
  if(item.context){const c=document.createElement('div');c.className='context';c.textContent=item.context;content.appendChild(c)}
  const box=document.createElement('div');box.className='options';
  shuffle(item.options.map((text,i)=>({text,i}))).forEach(o=>{
    const b=document.createElement('button');b.className='option';b.textContent=o.text;
    b.onclick=()=>answerMC(item,o.i,b,box);box.appendChild(b)
  });
  content.appendChild(box)
}
function answerMC(item,chosen,button,box){
  if(state.answered)return;state.answered=true;
  [...box.children].forEach(b=>b.disabled=true);
  button.classList.add(chosen===item.answer?'correct':'wrong');
  if(chosen!==item.answer){
    const correctText=item.options[item.answer];
    const idx=[...box.children].findIndex(b=>b.textContent===correctText);
    if(idx>=0)box.children[idx].classList.add('correct')
  }
  showFeedback(chosen===item.answer,item.explanation,item.example)
}
function renderWord(item,content){
  const box=document.createElement('div');box.className='word-answer';const correct=item.answer;
  const candidates=shuffle([correct,...window.RESTAURANTE_DATA.indovina.filter(x=>x.answer!==correct).slice(0,3).map(x=>x.answer)]);
  candidates.forEach(word=>{
    const b=document.createElement('button');b.className='word-chip';b.textContent=word;
    b.onclick=()=>answerWord(item,word,b,box);box.appendChild(b)
  });
  content.appendChild(box)
}
function answerWord(item,word,b,box){
  if(state.answered)return;state.answered=true;[...box.children].forEach(x=>x.disabled=true);
  b.classList.add(word===item.answer?'correct':'wrong');
  if(word!==item.answer)[...box.children].find(x=>x.textContent===item.answer)?.classList.add('correct');
  showFeedback(word===item.answer,item.explanation,item.example)
}
function renderIntruder(item,content){
  const box=document.createElement('div');box.className='word-answer';
  shuffle(item.options).forEach(word=>{
    const b=document.createElement('button');b.className='word-chip';b.textContent=word;
    b.onclick=()=>answerWord(item,word,b,box);box.appendChild(b)
  });
  content.appendChild(box)
}
function renderFlash(item,content){
  document.getElementById('prompt').textContent='';
  const wrap=document.createElement('div');wrap.className='flashcard';
  const inner=document.createElement('div');inner.className='flash-inner';
  const front=document.createElement('div');front.className='face front';
  front.innerHTML=`<div class="term">${esc(item.front)}</div>`;
  const back=document.createElement('div');back.className='face back';
  const parts=item.back.split('\n');
  back.innerHTML=`<div class="ua">${esc(parts[0])}</div><div class="expl">${esc(parts.slice(1).join(' '))}</div>`;
  inner.append(front,back);wrap.appendChild(inner);content.appendChild(wrap);
  wrap.onclick=()=>{wrap.classList.toggle('flipped');state.flipped=!state.flipped}
}
function showFeedback(ok,ex,example){
  const f=document.getElementById('feedback');f.className='feedback show';
  f.innerHTML=`<strong>${ok?'✓ Corretto':'✗ Non corretto'}</strong><div>${esc(ex)}</div><div class="example"><b>Esempio reale:</b> ${esc(example)}</div>`
}
function prev(){if(state.index>0){state.index--;render()}}
function next(){if(state.index<14){state.index++;render()}else{location.href='index.html'}}
