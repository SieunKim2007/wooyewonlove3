// === 펄스파클 큐트팝 테마 전용 보조 이펙트 ===
const floaters = document.getElementById('floaters');
function spawnFloater(x, y){
  const s = document.createElement('div');
  const size = 10 + Math.random()*20;
  s.style.position = 'fixed';
  s.style.left = (x - size/2) + 'px';
  s.style.top = (y - size/2) + 'px';
  s.style.width = size + 'px';
  s.style.height = size + 'px';
  s.style.pointerEvents = 'none';
  s.style.zIndex = -1;

  // 하트/별 랜덤
  const isHeart = Math.random() > 0.35;
  if(isHeart){
    s.style.background = 'radial-gradient(circle at 30% 30%, #fff 0 20%, rgba(255,255,255,0) 40%), radial-gradient(circle at 70% 30%, #fff 0 20%, rgba(255,255,255,0) 40%)';
    s.style.clipPath = 'path("M 50 15 C 50 0, 0 0, 0 35 C 0 70, 50 90, 50 100 C 50 90, 100 70, 100 35 C 100 0, 50 0, 50 15 Z")';
    s.style.filter = 'drop-shadow(0 0 8px rgba(255,255,255,.6))';
    s.style.background = 'linear-gradient(180deg,#ffe0f5,#ff9bd4)';
  }else{
    s.style.background = 'linear-gradient(180deg,#ffd8ff,#b686ff)';
    s.style.clipPath = 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
    s.style.filter = 'drop-shadow(0 0 8px rgba(255,255,255,.6))';
  }

  floaters.appendChild(s);
  const xMove = (Math.random() * 2 - 1) * 40;
  const yMove = - (60 + Math.random()*60);
  s.animate([
    { transform: 'translate(0,0) scale(0.8)', opacity: .9 },
    { transform: `translate(${xMove}px,${yMove}px) scale(1.2)`, opacity: 0 }
  ], { duration: 1200 + Math.random()*600, easing: 'ease-out' }).onfinish = () => s.remove();
}
window.addEventListener('pointerdown', (e)=> {
  for(let i=0;i<6;i++) spawnFloater(e.clientX + (Math.random()*40-20), e.clientY + (Math.random()*24-12));
});

// === 게임 로직 ===
const scene = document.querySelector('#scene');

const IMAGES = [
  // 나중에 보내주실 실제 이미지 파일로 교체하세요.
  'assets/yewon_1.png',
  'assets/yewon_2.png',
  'assets/yewon_3.png',
  'assets/yewon_4.png',
  'assets/yewon_5.png',
  'assets/yewon_6.png',
  'assets/yewon_7.png',
];

// Util
function el(html){ const d=document.createElement('div'); d.innerHTML=html.trim(); return d.firstElementChild; }
function show(node){ scene.innerHTML=''; scene.appendChild(node); window.scrollTo({top:0, behavior:'smooth'}); }
function narrator(text){
  return el(`<div class="card center">
    <p class="small">나레이션</p>
    <h2 style="color:#ffeef9; text-shadow:0 2px 12px rgba(0,0,0,.2),0 0 28px rgba(255,255,255,.3)">${text}</h2>
    <div class="mt"><button class="btn" data-next>다음</button></div>
  </div>`);
}
function hero(imgIdx, text, showTalkBtn=true, talkLabel='우예원과 대화하기'){
  const node = el(`<div class="card hero">
    <img src="${IMAGES[imgIdx % IMAGES.length]}" alt="우예원 이미지"/>
    <div class="bubble">${text ? text : ''}</div>
  </div>`);
  const wrap = el(`<div></div>`);
  wrap.appendChild(node);
  const controls = el(`<div class="controls"></div>`);
  if(showTalkBtn){
    const btn = el(`<button class="btn" data-talk>${talkLabel}</button>`);
    controls.appendChild(btn);
  }
  wrap.appendChild(controls);
  return wrap;
}
function inputCard(question, submitLabel='확인'){
  const node = el(`<div class="card input-card center">
    <label class="small" style="display:block;margin-bottom:8px;color:#ffdff4">✦ ${question}</label>
    <input type="text" placeholder="여기에 입력해 주세요" />
    <div class="controls"><button class="btn" data-submit>${submitLabel}</button></div>
  </div>`);
  return node;
}

// State
const answers = { color:'', hobby:'', skill:'', food:'', song:'' };
const flow = [];

// Title screen
flow.push(function startScreen(){
  const node = el(`<div class="center card" style="padding:28px">
    <h2 style="margin:0 0 6px">반짝반짝 ✨ 나는 우예원 ✨</h2>
    <p class="small">펄스파클 큐트팝 버전</p>
    <div class="controls"><button class="btn" data-start>시작하기</button></div>
  </div>`);
  node.querySelector('[data-start]').addEventListener('click', next);
  show(node);
});

// “나는 우예원이다.”
flow.push(function(){
  const node = narrator('“나는 우예원이다.”');
  node.querySelector('[data-next]').addEventListener('click', next);
  show(node);
});

// Talk beats
const talkLines = [
  '안녕하세요 저는 우예원이에요.',
  '안녕하새요 저는 우얘원이애요.',
  '안녕하새요 저는 우얘원이애요. 최애라면은 진순.',
  '안녕하새요 저는 우얘원이애요. 가식적인 사람을 실어해요.',
  '안녕하새요 저는 우얘원이애요. 실키보이즈 노래 참 조아여~~',
];
let imgIdx = 0;

talkLines.forEach(line => {
  flow.push(function(){
    const node = hero(imgIdx++, '', true, '우예원과 대화하기');
    node.querySelector('[data-talk]').addEventListener('click', (e) => {
      const bubble = node.querySelector('.bubble');
      bubble.textContent = line;
      // 하트 파티
      const rect = e.target.getBoundingClientRect();
      for(let i=0;i<10;i++) spawnFloater(rect.left + rect.width/2, rect.top);

      // 다음 버튼으로 교체
      const controls = node.querySelector('.controls');
      const nextBtn = el(`<button class="btn secondary">다음</button>`);
      controls.innerHTML = '';
      controls.appendChild(nextBtn);
      nextBtn.addEventListener('click', next);
    });
    show(node);
  });
  flow.push(function(){
    const node = narrator('“나는 우예원이다.”');
    node.querySelector('[data-next]').addEventListener('click', next);
    show(node);
  });
});

// Auto lines (no talk button)
const autoLines = [
  '안녕하새요 저는 우얘원 무병장수를 찬양하지 앰비티아이?그럿개가지자새히는 기억안나요',
  '안녕하새요 저는 우얘원입니다 아침시간업으면 안먹고 시간잇으면 방 내^^ 안녕하새요',
  '안녕하새요 저는 우얘원입니다 하이루 yewon795 안녕하새요 안녕',
  '안녕하새요 저는 우얘원입니다 애스크프사 귀엽잔아',
  '허걱스 내? 내? 안녕하새요 내? 내? 내?',
  '저는 우얘원 안녕하새요 허걱스 내? 내^^ 내? 저는 우얘원 내? 우얘원.. 저는..'
];
autoLines.forEach(line=>{
  flow.push(function(){
    const node = hero(imgIdx++, line, false);
    const btns = el(`<div class="controls"><button class="btn" data-next>다음</button></div>`);
    node.appendChild(btns);
    node.querySelector('[data-next]').addEventListener('click', next);
    show(node);
  });
});

// Confusion
flow.push(function(){
  const node = narrator('“나는.. 우예원이다.. 나는..”');
  node.querySelector('[data-next]').addEventListener('click', next);
  show(node);
});
flow.push(function(){
  const node = narrator('“우예원이 누구지?”');
  node.querySelector('[data-next]').addEventListener('click', next);
  show(node);
});

// ??? talk
flow.push(function(){
  const node = hero(imgIdx++, '', true, '???과 대화하기');
  node.querySelector('[data-talk]').addEventListener('click', (e) => {
    const bubble = node.querySelector('.bubble');
    bubble.innerHTML = '나는… 나는…<br><strong>나는 우예원이야!!!!!!!!</strong>';
    const controls = node.querySelector('.controls');
    const nextBtn = el(`<button class="btn secondary">다음</button>`);
    controls.innerHTML='';
    controls.appendChild(nextBtn);
    const rect = e.target.getBoundingClientRect();
    for(let i=0;i<12;i++) spawnFloater(rect.left + rect.width/2, rect.top);
    nextBtn.addEventListener('click', next);
  });
  show(node);
});

// Q&A
function ask(key, question){
  return function(){
    const node = inputCard(question, '확인');
    const input = node.querySelector('input');
    input.addEventListener('keydown', (e)=>{ if(e.key==='Enter'){ node.querySelector('[data-submit]').click(); }});
    node.querySelector('[data-submit]').addEventListener('click', (e) => {
      answers[key] = input.value.trim() || '';
      const rect = e.target.getBoundingClientRect();
      for(let i=0;i<8;i++) spawnFloater(rect.left + rect.width/2, rect.top);
      next();
    });
    show(node);
    setTimeout(()=>input.focus(),10);
  }
}
flow.push(ask('color', '네가 좋아하는 색은 뭐야?'));
flow.push(ask('hobby', '네 취미는 무엇이야?'));
flow.push(ask('skill', '특기는? 무엇을 잘 하니?'));
flow.push(ask('food', '가장 좋아하는 음식은?'));
flow.push(ask('song', '좋아하는 노래는?'));

// "너는 우예원이지." (응만)
flow.push(function(){
  const node = el(`<div class="card center">
    <h2 style="margin-bottom:8px">너는 우예원이지.</h2>
    <div class="controls"><button class="btn" data-yes>응</button></div>
  </div>`);
  node.querySelector('[data-yes]').addEventListener('click', (e)=>{
    const rect = e.target.getBoundingClientRect();
    for(let i=0;i<18;i++) spawnFloater(rect.left + rect.width/2, rect.top);
    next();
  });
  show(node);
});

// Finale
flow.push(function(){
  const images = [imgIdx++, imgIdx++, imgIdx++].map(i => IMAGES[i % IMAGES.length]);
  const node = el(`<div class="card hero"></div>`);
  images.forEach(src => node.appendChild(el(`<img src="${src}" alt="우예원 이미지"/>`)));
  const summary = el(`<div class="bubble"></div>`);
  const text = `반가워! 나는 우예원이야.
내가 좋아하는 색은 ${answers.color || '비밀'}. 
내 취미는 ${answers.hobby || '비밀'}. 
특기는 ${answers.skill || '비밀'}. 
가장 좋아하는 음식은 ${answers.food || '비밀'}. 
가장 좋아하는 노래는 ${answers.song || '비밀'}. 
나는 우예원이야. 잘 부탁해!`;
  summary.innerText = text;
  node.appendChild(summary);
  const wrap = el(`<div></div>`);
  wrap.appendChild(node);
  const nextBtn = el(`<div class="controls"><button class="btn" data-next>엔딩 보기</button></div>`);
  wrap.appendChild(nextBtn);
  nextBtn.querySelector('[data-next]').addEventListener('click', next);
  show(wrap);
});

// End
flow.push(function(){
  const node = el(`<div class="card center">
    <h2 style="color:#ffeef9; text-shadow:0 2px 12px rgba(0,0,0,.2),0 0 28px rgba(255,255,255,.3)">“나는 나 자신일 때 가장 아름답고 가장 빛난다.”</h2>
    <p>“우예원은 어디서든 빛나는 존재니까.”</p>
    <h3>THE END</h3>
    <div class="controls"><button class="btn secondary" data-replay>다시 하기</button></div>
  </div>`);
  node.querySelector('[data-replay]').addEventListener('click', () => go(0));
  show(node);
});

// Runner
let idx = 0;
function go(i){ idx = i; flow[idx](); }
function next(){ idx++; if(idx < flow.length){ flow[idx](); } }
go(0);
