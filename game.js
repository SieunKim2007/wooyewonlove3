// Simple state-machine driven story
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

// Utility
function el(html){ const d=document.createElement('div'); d.innerHTML=html.trim(); return d.firstElementChild; }
function show(node){ scene.innerHTML=''; scene.appendChild(node); window.scrollTo({top:0, behavior:'smooth'}); }

function narrator(text){
  return el(`<div class="card center"><p class="small">나레이션</p><h2>${text}</h2><div class="mt"><button class="btn" data-next>다음</button></div></div>`);
}

function hero(imgIdx, text, showTalkBtn=true, talkLabel='우예원과 대화하기'){
  const node = el(`<div class="card hero">
    <img src="${IMAGES[imgIdx % IMAGES.length]}" alt="우예원 이미지"/>
    <div class="bubble">${text ? text : ''}</div>
  </div>`);
  const wrapper = el(`<div></div>`);
  wrapper.appendChild(node);
  const controls = el(`<div class="controls center"></div>`);
  if(showTalkBtn){
    const btn = el(`<button class="btn" data-talk>${talkLabel}</button>`);
    controls.appendChild(btn);
  }
  wrapper.appendChild(controls);
  return wrapper;
}

function inputCard(question, submitLabel='확인'){
  const node = el(`<div class="card input-card">
    <label class="small">${question}</label>
    <input type="text" placeholder="여기에 입력해 주세요" />
    <div class="controls"><button class="btn" data-submit>${submitLabel}</button></div>
  </div>`);
  return node;
}

// FLOW
const answers = {
  color: '', hobby: '', skill: '', food: '', song: ''
};

const flow = [];

// Title screen
flow.push(function startScreen(){
  const node = el(`<div class="center">
    <div class="card">
      <h2 class="center">예쁘고 아기자기한 스토리 게임</h2>
      <p class="center small">반짝반짝 ✨ 나는 우예원 ✨</p>
      <div class="controls center"><button class="btn" data-start>시작하기</button></div>
    </div>
  </div>`);
  node.querySelector('[data-start]').addEventListener('click', next);
  show(node);
});

// Narration: "나는 우예원이다."
flow.push(function n1(){
  const node = narrator('“나는 우예원이다.”');
  node.querySelector('[data-next]').addEventListener('click', next);
  show(node);
});

// Conversation beats with image changes
const talkLines = [
  '안녕하세요 저는 우예원이에요.',
  '안녕하새요 저는 우얘원이애요.',
  '안녕하새요 저는 우얘원이애요. 최애라면은 진순.',
  '안녕하새요 저는 우얘원이애요. 가식적인 사람을 실어해요.',
  '안녕하새요 저는 우얘원이애요. 실키보이즈 노래 참 조아여~~',
];
let imgIdx=0;

talkLines.forEach((line, i) => {
  // show hero with talk button
  flow.push(function(){
    const node = hero(imgIdx++, '', true, '우예원과 대화하기');
    node.querySelector('[data-talk]').addEventListener('click', () => {
      const bubble = node.querySelector('.bubble');
      bubble.textContent = line;
      // After click, show Next
      const controls = node.querySelector('.controls');
      const nextBtn = el(`<button class="btn secondary">다음</button>`);
      controls.innerHTML='';
      controls.appendChild(nextBtn);
      nextBtn.addEventListener('click', next);
    });
    show(node);
  });
  // narration after each line
  flow.push(function(){
    const node = narrator('“나는 우예원이다.”');
    node.querySelector('[data-next]').addEventListener('click', next);
    show(node);
  });
});

// Auto lines (no button)
const autoLines = [
  '안녕하새요 저는 우얘원 무병장수를 찬양하지 앰비티아이?그럿개가지자새히는 기억안나요',
  '안녕하새요 저는 우얘원입니다 아침시간업으면 안먹고 시간잇으면 방 내^^ 안녕하새요',
  '안녕하새요 저는 우얘원입니다 하이루 yewon795 안녕하새요 안녕',
  '안녕하새요 저는 우얘원입니다 애스크프사 귀엽잔아',
  '허걱스 내? 내? 안녕하새요 내? 내? 내?',
  '저는 우얘원 안녕하새요 허걱스 내? 내^^ 내? 저는 우얘원 내? 우얘원.. 저는..'
];
autoLines.forEach((line) => {
  flow.push(function(){
    const node = hero(imgIdx++, line, false);
    const btns = el(`<div class="controls center"><button class="btn" data-next>다음</button></div>`);
    node.appendChild(btns);
    node.querySelector('[data-next]').addEventListener('click', next);
    show(node);
  });
});

// Confused narration
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
  node.querySelector('[data-talk]').addEventListener('click', () => {
    const bubble = node.querySelector('.bubble');
    bubble.innerHTML = '나는… 나는…<br><strong>나는 우예원이야!!!!!!!!</strong>';
    const controls = node.querySelector('.controls');
    const nextBtn = el(`<button class="btn secondary">다음</button>`);
    controls.innerHTML='';
    controls.appendChild(nextBtn);
    nextBtn.addEventListener('click', next);
  });
  show(node);
});

// Q&A sequence
function ask(key, question){
  return function(){
    const node = inputCard(question, '확인');
    node.querySelector('[data-submit]').addEventListener('click', () => {
      const val = node.querySelector('input').value.trim();
      answers[key] = val || '';
      next();
    });
    show(node);
  }
}

flow.push(ask('color', '네가 좋아하는 색은 뭐야?'));
flow.push(ask('hobby', '네 취미는 무엇이야?'));
flow.push(ask('skill', '특기는? 무엇을 잘 하니?'));
flow.push(ask('food', '가장 좋아하는 음식은?'));
flow.push(ask('song', '좋아하는 노래는?'));

// "너는 우예원이지." with only "응"
flow.push(function(){
  const node = el(`<div class="card center">
    <h2>너는 우예원이지.</h2>
    <div class="controls center">
      <button class="btn" data-yes>응</button>
    </div>
  </div>`);
  node.querySelector('[data-yes]').addEventListener('click', next);
  show(node);
});

// Finale: show multiple images and summary speech bubble, then credits
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
  const wrapper = el(`<div></div>`);
  wrapper.appendChild(node);
  const nextBtn = el(`<div class="controls center"><button class="btn" data-next>엔딩 보기</button></div>`);
  wrapper.appendChild(nextBtn);
  nextBtn.querySelector('[data-next]').addEventListener('click', next);
  show(wrapper);
});

// End credits
flow.push(function(){
  const node = el(`<div class="card center">
    <h2>“나는 나 자신일 때 가장 아름답고 가장 빛난다.”</h2>
    <p>“우예원은 어디서든 빛나는 존재니까.”</p>
    <h3>THE END</h3>
    <div class="controls center">
      <button class="btn secondary" data-replay>다시 하기</button>
    </div>
  </div>`);
  node.querySelector('[data-replay]').addEventListener('click', () => go(0));
  show(node);
});

// Flow runner
let idx = 0;
function go(i){ idx = i; flow[idx](); }
function next(){ idx++; if(idx < flow.length){ flow[idx](); } }

// Start game
go(0);

// --- 이미지 교체 가이드 ---
// 1) /assets 폴더에 본인 이미지(PNG/JPG) 넣기
// 2) 위의 IMAGES 배열을 파일명으로 교체
// 3) 저장 후 새로고침
