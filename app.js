'use strict';

/* ===== DATA ===== */
const GIFTS = [
  { gid:'g1',  name:'Плюшевый Мишка',      emoji:'🧸', base:14,  rarity:'common' },
  { gid:'g2',  name:'Роза Вечной Любви',   emoji:'🌹', base:22,  rarity:'common' },
  { gid:'g3',  name:'Кубик Любви',         emoji:'🎁', base:28,  rarity:'common' },
  { gid:'g4',  name:'Труба Славы',         emoji:'🎺', base:35,  rarity:'rare' },
  { gid:'g5',  name:'Космо-Ракета',        emoji:'🚀', base:48,  rarity:'rare' },
  { gid:'g6',  name:'Золотая Корона',      emoji:'👑', base:70,  rarity:'rare' },
  { gid:'g7',  name:'Алмазное Кольцо',     emoji:'💎', base:95,  rarity:'epic' },
  { gid:'g8',  name:'Тон-Монета',          emoji:'🪙', base:120, rarity:'epic' },
  { gid:'g9',  name:'Космический Кот',     emoji:'🐈', base:160, rarity:'epic' },
  { gid:'g10', name:'Радужный Дракон',     emoji:'🐲', base:260, rarity:'legendary' },
  { gid:'g11', name:'Плазменный Череп',    emoji:'💀', base:340, rarity:'legendary' },
  { gid:'g12', name:'Звёздный Дирижабль',  emoji:'🎈', base:120, rarity:'epic' },
  { gid:'g13', name:'Праздничный Торт',    emoji:'🎂', base:45,  rarity:'rare' }
];
function giftById(gid){ return GIFTS.find(g => g.gid === gid) || GIFTS[0]; }
function short(gid){ return giftById(gid).emoji + ' ' + giftById(gid).name; }
function marketValue(gid){ return f1(giftById(gid).base * state.trend); }

const RAR = {
  common:    { label:'Обычный',    fr:3,  miss:[ '#2b3a4a','#22303e','#26343f' ] },
  rare:      { label:'Редкий',     fr:7,  miss:[ '#1d3a5f','#173049','#1f426b' ] },
  epic:      { label:'Эпический',  fr:14, miss:[ '#3a2360','#2b1a4a','#452a75' ] },
  legendary: { label:'Легендарный',fr:24, miss:[ '#5c4310','#4a340b','#6e5216' ] }
};

const NAMES = ['Артём','Максим','Данил','Кирилл','Тимур','Никита','Роман','Егор','Саша','Дима','Лера','Настя','Вика','Марк','Лев','Ян','Юля','Соня','Паша','Глеб'];
const NEMOJI = ['🐻','🦊','🐺','🐼','🦁','🐯','🦅','🐸','🍎','⚡','🎮','🎧','🕶️','🎩','🚴','🕺','💃','🌙','⭐','🔥'];
const LINES = [
  'Собираю редкие подарки с 2020',
  'Куплю всё, что светится ✨',
  'Торг уместен, но не наглей',
  'Коллекционирую короны и кольца',
  'Перекуп, но честный 😎',
  'Меняю подарки на подарки',
  'Люблю легендарки 🔥',
  'Инвестор подарочного рынка',
  'Подарки — моя жизнь',
  'Купить дешевле всех — моя цель'
];
const GREEDS = [0.15,0.25,0.35,0.5,0.65,0.8,0.9];

const BUYERS = [
  { name:'Тимур 🦊', emoji:'🦊' }, { name:'Вика 🌙', emoji:'🌙' },
  { name:'Марк 🎧', emoji:'🎧' }, { name:'Соня ⭐', emoji:'⭐' },
  { name:'Егор 🚴', emoji:'🚴' }, { name:'Настя 🔥', emoji:'🔥' },
  { name:'Лев 🎩', emoji:'🎩' }, { name:'Ян ⚡', emoji:'⚡' }
];

const AVA_PALS = [
  ['#ff885e','#ff516a'],['#ffcd6a','#ffa85c'],['#82b1ff','#665fff'],['#a0de7e','#54cb68'],
  ['#53edd6','#28c9b7'],['#6a99ff','#4e7cf6'],['#e0a2f3','#d669ed'],['#b0b9ff','#7a8cff']
];

const PH = {
  sellerHello: ['Привет! Смотри, какой экземпляр 👀','Здарова. Цена честная, но потолкуем','Приветствую! Готов обсудить'],
  sellerKnock: ['Хм… как насчёт {p} TON? Ну, если сойдёшься сейчас.','Ладно, тебе повезло — {p} TON и по рукам. Подходит?','Мне не очень выгодно… но {p} TON — и забирай ↩️'],
  sellerDisc:  ['Могу уступить {p} TON, но это последний раз','Если берёшь сейчас — {p} TON, дело говорю','Только для тебя: {p} TON. Решай быстрее'],
  sellerHold:  ['Нет, уж извини. {p} TON и обсуждать больше нечего 👊','Сколько можно сбивать?! {p} TON, бери или иди дальше'],
  sellerDeal:  ['Отлично! Кидай свой TON-адрес — подарок твой сразу после перевода ⚡','По рукам! Жду перевод 🙌','Готово, скидываю подарок после перевода 💸'],
  sellerNo:    ['Э нет, это слишком дёшево 😒','Ты серьёзно? С таким не торгуемся 😒','Такой цены не будет, извини'],
  personHi:    ['Оо, привет! Давненько не виделись 👋','Здарова! Что по подаркам?','О, привет! Как раз хотел кое-что спросить'],
  personAsk:   ['Как думаешь, рынок ещё вырастет?','Ты видел, {g} подорожал!','Дай совет: брать сейчас или позже?','Мой friend продал {g} дорого, я не успел 😤'],
  personWant:  ['Слушай, а {g} не продашь? Готов дать {p} TON','Мне очень нужен {g}! Предлагаю {p} TON, по рукам?','Увижу {g} у тебя — куплю сразу, {p} TON, норм?'],
  personGive:  ['Спасибо! Ты настоящий друг 🙏','Ухты! Как раз искал этот! Обожаю тебя 💜','Класс! Ставлю в коллекцию, тебе респект ✨'],
  personBack:  ['Держи, от чистого сердца 🎁','На — тебе должен! 🫡','С днём рождения, дружище! Пользуйся 🎉'],
  leadHi:      ['Привет! Хочу купить твой лот','Есть дело: твой {g} мне подходит, предложение внутри 👀','Здравствуй! По твоему лоту есть оффер'],
  leadAcc:     ['Красиво торгуетесь! Перевожу ⚡','Сделка! Отправляю TON 💸','Отлично, по рукам, кидаю монеты 🪙'],
  leadBye:     ['Дорого. Обратись, если передумаешь','Ну и пожалуйста, у меня есть варианты 🤷','Ладно, лимит мой. Удачи в продаже']
};

/* ===== HELPERS ===== */
function f1(x){ return Math.round(x*10)/10; }
function clamp(x,a,b){ return Math.max(a, Math.min(b, x)); }
function esc(s){ return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }
function rnd(a){ return a[Math.floor(Math.random()*a.length)]; }
function hash(s){ let h=0; for (let i=0;i<s.length;i++){ h=(h*31 + s.charCodeAt(i))|0; } return Math.abs(h); }
let _uid = 1;
function uid(){ return (_uid++) + Math.floor(Math.random()*999).toString(36); }
function fmtT(t){
  const d = new Date(t);
  let m = String(d.getMinutes()); if (m.length<2) m='0'+m;
  let h = String(d.getHours()); if (h.length<2) h='0'+h;
  return h+':'+m;
}

/* ===== ART (inline SVG data-URIs) ===== */
function svgWrap(w,h,inner){
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="'+w+'" height="'+h+'" viewBox="0 0 '+w+' '+h+'">'+inner+'</svg>');
}
function avaArt(name, emoji){
  const p = AVA_PALS[hash(name||'?') % AVA_PALS.length];
  return svgWrap(96,96,
    '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">'+
    '<stop offset="0" stop-color="'+p[0]+'"/><stop offset="1" stop-color="'+p[1]+'"/></linearGradient></defs>'+
    '<rect width="96" height="96" fill="url(#g)"/>'+
    '<circle cx="48" cy="40" r="19" fill="rgba(255,255,255,.28)"/>'+
    '<path d="M12 96c0-22 16-34 36-34s36 12 36 34z" fill="rgba(255,255,255,.28)"/>'+
    '<text x="48" y="62" font-size="44" text-anchor="middle">'+ (emoji||'👤') +'</text>');
}
function giftArt(g){
  const pal = RAR[g.rarity].miss;
  const seed = hash(g.gid);
  const c1 = pal[seed % pal.length], c2 = pal[(seed+1) % pal.length];
  const epic = g.rarity==='epic' || g.rarity==='legendary';
  let inner =
    '<defs>'+
    '<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">'+
    '<stop offset="0" stop-color="'+c1+'"/><stop offset="1" stop-color="'+c2+'"/></linearGradient>'+
    '<radialGradient id="gl" cx="0.5" cy="0.42" r="0.55">'+
    '<stop offset="0" stop-color="rgba(255,255,255,.30)"/><stop offset="1" stop-color="rgba(255,255,255,0)"/></radialGradient>'+
    '</defs>'+
    '<rect width="512" height="640" fill="url(#bg)"/>'+
    '<rect width="512" height="640" fill="url(#gl)"/>';
  for (let i=0;i<16;i++){
    const x=(seed*(i+7))%512, y=(seed*(i*3+11))%640, r=1.5+((seed*(i+2))%4);
    inner += '<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="rgba(255,255,255,.16)"/>';
  }
  inner += '<ellipse cx="256" cy="560" rx="150" ry="26" fill="rgba(0,0,0,.28)"/>';
  inner += '<text x="256" y="410" font-size="230" text-anchor="middle">'+g.emoji+'</text>';
  inner += '<path d="M110 40 L180 40 L150 90 Z" fill="rgba(255,255,255,.14)"/>';
  inner += '<rect x="40" y="600" width="432" height="7" rx="3.5" fill="rgba(255,255,255,.12)"/>';
  if (epic){
    inner += '<text x="70" y="120" font-size="34" fill="rgba(255,255,255,.8)">✦</text>';
    inner += '<text x="430" y="170" font-size="26" fill="rgba(255,255,255,.7)">✦</text>';
    inner += '<text x="400" y="560" font-size="30" fill="rgba(255,255,255,.6)">✦</text>';
  }
  return svgWrap(512,640, inner);
}
function giftImg(g){ return giftArt(g); }

/* ===== STATE ===== */
const KEY = 'giftsMarketV2';
let state = null;

function genListing(){
  const g = rnd(GIFTS);
  const p = newPerson();
  const ref0 = f1(g.base * (0.85 + Math.random()*0.5));
  return { rid:'r'+uid(), gid:g.gid, ref0:ref0, price:ref0, seller:{ name:p.name, emoji:p.emoji, greed:p.greed, sid:p.sid } };
}
function newPerson(){
  const p = { name: rnd(NAMES), emoji: rnd(NEMOJI), greed: rnd(GREEDS), line: rnd(LINES) };
  p.sid = 's' + hash(p.name + p.emoji);
  const gifts = [];
  const n1 = rnd(GIFTS);
  gifts.push({ uid:'pg'+uid(), gid:n1.gid });
  if (Math.random() < 0.5){
    const n2 = rnd(GIFTS.filter(x => x.rarity==='common' || x.rarity==='rare'));
    gifts.push({ uid:'pg'+uid(), gid:n2.gid });
  }
  return { pid:'p'+uid(), name:p.name, emoji:p.emoji, greed:p.greed, line:p.line, sid:'s'+hash(p.name+p.emoji), friendship:Math.floor(Math.random()*22), gifts:gifts };
}
function defaultState(){
  const st = {
    v:2, ton:25, trend:1, inventory:[], market:[], myList:[], people:[], chats:{},
    stats:{ spent:0, earned:0, deals:0, giftsGiven:0, giftsReceived:0 },
    lastBonus:0, tickN:0, seenChat:''
  };
  state = st;
  for (let i=0;i<6;i++) st.market.push(genListing());
  for (let i=0;i<4;i++) st.people.push(newPerson());
  return st;
}
function save(){ try { localStorage.setItem(KEY, JSON.stringify(state)); } catch(e){} }
function load(){
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const st = JSON.parse(raw);
    if (!st || st.v !== 2 || typeof st.ton !== 'number') return null;
    return st;
  } catch(e){ return null; }
}

/* ===== CHAT ENGINE ===== */
function getChat(key, factory){
  if (!state.chats[key]) state.chats[key] = factory();
  const c = state.chats[key];
  c.key = key;
  return c;
}
function addMsg(c, who, text){
  c.messages.push({ who:who, text:text, t:Date.now(), read:false });
  if (who !== 'me' && c.key !== curChat) c.unread = (c.unread||0) + 1;
}
function readUp(c){ c.messages.forEach(m => m.read = true); c.unread = 0; }
function chatsCount(){ return Object.keys(state.chats).length; }
function unreadTotal(){
  let n = 0;
  for (const k in state.chats) n += state.chats[k].unread || 0;
  return n;
}

let curChat = null;

function toast(text, kind){
  const box = document.getElementById('toasts');
  if (!box) return;
  const t = document.createElement('div');
  t.className = 'toast' + (kind ? ' ' + kind : '');
  t.textContent = text;
  box.appendChild(t);
  setTimeout(() => { if (t.parentNode) t.parentNode.removeChild(t); }, 2600);
}
function vibe(ms){ try { if (navigator.vibrate) navigator.vibrate(ms); } catch(e){} }

let typingTimer = null;
function botSay(c, text, after){
  c.typing = true;
  if (c.key === curChat) renderChatScreen(c.key);
  setTimeout(() => {
    c.typing = false;
    addMsg(c, 'bot', text);
    vibe(12);
    if (c.key === curChat) renderChatScreen(c.key);
    else renderHome();
    save();
    if (after) after();
  }, 700 + Math.random()*700);
}
function say(t, kind){ toast(t, kind||''); }

/* ===== SELLER CHATS (market purchases) ===== */
function personaFor(rid){
  const l = state.market.find(x => x.rid === rid);
  if (!l) return null;
  return l.seller;
}
function openSellerChat(rid){
  const l = state.market.find(x => x.rid === rid);
  if (!l) return;
  const key = 'sell:' + rid;
  const c = getChat(key, () => ({ kind:'sell', rid:rid, unread:0, messages:[], knocks:0, offer:0, done:false, greeted:false }));
  if (!c.greeted){
    c.greeted = true;
    addMsg(c, 'bot', rnd(PH.sellerHello));
    addMsg(c, 'bot', short(l.gid) + ' — ' + f1(l.price) + ' TON. Норм?');
  }
  readUp(c);
  openChatKey(key);
  save();
}
function haggleFloor(l){ return f1(l.ref0 * clamp(1 - 0.35*(1 - l.seller.greed), 0.55, 0.95)); }
function botHaggle(c, num){
  const l = state.market.find(x => x.rid === c.rid);
  if (!l) return;
  const floor = haggleFloor(l);
  const insult = num <= floor*0.55;
  if (insult){
    c.insults = (c.insults||0) + 1;
    if (c.insults >= 2){
      l.price = f1(l.price * 1.06);
      botSay(c, rnd(PH.sellerHold).replace('{p}', f1(l.price)));
      return;
    }
    botSay(c, rnd(PH.sellerNo));
    return;
  }
  if (num >= floor){
    const off = clamp(num, floor, f1(l.price*0.97));
    botSay(c, rnd(PH.sellerKnock).replace('{p}', f1(off)), () => {
      c.offer = f1(off);
      renderChatScreen(c.key);
    });
  } else {
    botSay(c, 'Ну ты понял… ' + f1(floor) + ' TON — и ни рублём меньше 😐');
  }
}
function sellerOffer(c){
  const l = state.market.find(x => x.rid === c.rid);
  if (!l) return;
  const floor = haggleFloor(l);
  const disc = clamp(0.78 - 0.10*(1 - l.seller.greed), 0.6, 0.88);
  const off = Math.max(floor, f1(l.price * disc));
  botSay(c, rnd(PH.sellerDisc).replace('{p}', f1(off)), () => {
    c.offer = f1(off);
    renderChatScreen(c.key);
  });
}
function buyListing(rid, agreed){
  const l = state.market.find(x => x.rid === rid);
  if (!l) return;
  const usePrice = agreed || l.price;
  if (state.ton < usePrice){
    say('Не хватает TON', 'bad');
    botSay(getChat('sell:' + rid, () => ({ kind:'sell', rid:rid, unread:0, messages:[], done:false, greeted:true })), 'Извини, у тебя не хватает TON 😅 Забирай часовой бонус или продавай быстрее!');
    say('Не хватает TON', 'bad');
    return;
  }
  const c = getChat('sell:'+rid, () => ({ kind:'sell', rid:rid, unread:0, messages:[], done:false }));
  c.done = true;
  state.ton -= usePrice;
  state.stats.spent += usePrice;
  state.stats.deals++;
  l.dealPrice = usePrice;
  state.inventory.push({ uid:'i'+uid(), gid:l.gid, bought:f1(usePrice) });
  state.market = state.market.filter(x => x.rid !== rid);
  delete state.chats['sell:' + rid];
  vibe([10,40,10]);
  say('Куплено: ' + short(l.gid) + ' за ' + f1(usePrice) + ' TON', 'good');
  closeItem();
  save(); renderAll();
}

/* ===== PERSON CHATS (holders / friends) ===== */
function openPersonChat(pid){
  const pd = state.people.find(p => p.pid === pid);
  if (!pd) return;
  const key = 'person:' + pid;
  const c = getChat(key, () => ({ kind:'person', pid:pid, unread:0, messages:[], offer:0, greeted:false, talked:0 }));
  if (!c.greeted){
    c.greeted = true;
    addMsg(c, 'bot', rnd(PH.personHi));
  }
  readUp(c);
  openChatKey(key);
  save();
}
function personQuote(c){
  const pd = state.people.find(p => p.pid === c.pid);
  if (!pd) return;
  c.talked = (c.talked||0) + 1;
  const g = rnd(GIFTS);
  let text = rnd(PH.personAsk).replace('{g}', short(g.gid));
  botSay(c, text);
}
function personOfferBase(pd, g){
  const disc = 1 - (pd.friendship||0)/320;
  return f1(marketValue(g.gid) * clamp(disc, 0.7, 1.05) * (0.8 + Math.random()*0.35));
}
function personAskQuote(c){
  const pd = state.people.find(p => p.pid === c.pid);
  if (!pd || !pd.gifts.length) return;
  const it = pd.gifts[0];
  const g = giftById(it.gid);
  const offer = personOfferBase(pd, g);
  botSay(c, rnd(PH.personWant).replace('{g}', short(g.gid)).replace('{p}', f1(offer)), () => {
    c.offer = f1(offer);
    c.offerGid = g.gid;
    renderChatScreen(c.key);
  });
}
function personBuy(c){
  const pd = state.people.find(p => p.pid === c.pid);
  if (!pd || !c.offer || !c.offerGid) { botSay(c, 'Давай сначала обсудим подарок? 🙂'); return; }
  if (state.ton < c.offer){ say('Не хватает TON', 'bad'); botSay(c, 'Ты обещал ' + f1(c.offer) + ' TON 😕'); return; }
  state.ton -= c.offer;
  state.stats.spent += c.offer;
  state.stats.deals++;
  pd.gifts = pd.gifts.filter(x => x.gid !== c.offerGid);
  pd.friendship = clamp((pd.friendship||0) + 5, 0, 100);
  state.inventory.push({ uid:'i'+uid(), gid:c.offerGid, bought:f1(c.offer) });
  c.offer = 0; c.offerGid = '';
  vibe([10,40,10]);
  say('Куплено у ' + pd.name, 'good');
  closeChat();
  save(); renderAll();
}
function personHaggle(c){
  const pd = state.people.find(p => p.pid === c.pid);
  if (!pd || !c.offer) { botSay(c, 'Торгуйся по делу 😄'); return; }
  const floor = f1(c.offer * 0.75);
  if (Math.random() < 0.55){
    const off = f1(Math.max(floor, c.offer * (0.8 + Math.random()*0.12)));
    botSay(c, 'Ладно уж… ' + f1(off) + ' TON, но только для друга 😉', () => {
      c.offer = off;
      renderChatScreen(c.key);
    });
  } else {
    botSay(c, 'Не-не, ' + f1(c.offer) + ' TON — финальная 🤝');
  }
}
function personGive(c){
  const pd = state.people.find(p => p.pid === c.pid);
  if (!pd) return;
  let best = null;
  state.inventory.forEach(x => {
    if (!best || RAR[giftById(x.gid).rarity].fr > RAR[giftById(best.gid).rarity].fr) best = x;
  });
  if (!best){ botSay(c, 'У тебя инвентарь пуст — подарки из инвентаря, не с рынка 🙂'); return; }
  state.inventory = state.inventory.filter(x => x.uid !== best.uid);
  pd.gifts.push({ uid:'pg'+uid(), gid:best.gid });
  pd.friendship = clamp((pd.friendship||0) + RAR[giftById(best.gid).rarity].fr, 0, 100);
  state.stats.giftsGiven++;
  botSay(c, rnd(PH.personGive));
  vibe([10,30,10]);
  say('Подарок вручён: ' + short(best.gid) + ' (дружба +)', 'good');
  closeItem();
  save(); renderAll();
}
function personGiftBack(pid){
  const pd = state.people.find(p => p.pid === pid);
  if (!pd || !pd.gifts.length) return;
  const idx = Math.floor(Math.random()*pd.gifts.length);
  const it = pd.gifts[idx];
  pd.gifts = pd.gifts.filter((_,i) => i !== idx);
  state.inventory.push({ uid:'i'+uid(), gid:it.gid, bought:0 });
  state.stats.giftsReceived++;
  const key = 'person:' + pid;
  const c = getChat(key, () => ({ kind:'person', pid:pid, unread:0, messages:[], greeted:true }));
  addMsg(c, 'bot', rnd(PH.personBack) + ' ' + short(it.gid));
  c.unread = (c.unread||0) + 1;
  toast(pd.name + ' подарил тебе ' + short(it.gid) + ' 🎁', 'good');
  save();
  if (c.key === curChat) renderChatScreen(c.key); else renderHome();
}

/* ===== LEAD CHATS (buyers of my listings) ===== */
function openLeadChat(lid){
  const c = getChat('lead:' + lid, () => ({ kind:'lead', lid:lid, unread:0, messages:[], done:false }));
  readUp(c);
  openChatKey(c.key);
  save();
}
function leadOf(c){
  const l = state.myList.find(x => x.lid === c.lid);
  return l ? l.lead : null;
}
function leadAccept(c){
  const l = state.myList.find(x => x.lid === c.lid);
  const lead = leadOf(c);
  if (!l || !lead || lead.walked) return;
  const fee = f1(lead.offer * 0.05);
  const net = f1(lead.offer - fee);
  state.ton += net;
  state.stats.earned += net;
  state.stats.deals++;
  const gid = l.gid;
  state.myList = state.myList.filter(x => x.lid !== l.lid);
  state.market.push({ rid:'r'+uid(), gid:gid, ref0:f1(marketValue(gid)), price:f1(marketValue(gid)), seller:{ name:lead.buyer.name, emoji:lead.buyer.emoji, greed:rnd(GREEDS), sid:'s'+hash(lead.buyer.name) } });
  c.done = true;
  if (l.lead) l.lead = null;
  vibe([10,50,10]);
  botSay(c, rnd(PH.leadAcc));
  setTimeout(() => {
    say('Продано! +' + f1(net) + ' TON (комиссия 5%)', 'good');
    save(); renderAll();
    closeChat();
  }, 900);
}
function leadCounter(c){
  const lead = leadOf(c);
  if (!lead || lead.walked) return;
  const target = f1(lead.max * 1.05);
  botSay(c, 'Тогда давай ' + f1(target) + ' TON — и по рукам 🤙', () => {
    if (target <= lead.max){
      lead.offer = target;
      lead.counterReady = true;
      renderChatScreen(c.key);
    } else if (target <= lead.max * 1.2){
      lead.counterReady = true;
      renderChatScreen(c.key);
    } else {
      lead.walked = true;
      botSay(c, rnd(PH.leadBye));
      renderChatScreen(c.key);
    }
    save();
  });
}
function leadDecline(c){
  const lead = leadOf(c);
  if (lead) lead.walked = true;
  botSay(c, rnd(PH.leadBye));
  save();
}

/* ===== MY SALES ===== */
function listMyItem(iuid, price){
  const it = state.inventory.find(x => x.uid === iuid);
  if (!it) return;
  price = parseFloat(price);
  if (!price || price <= 0){ say('Введи цену в TON', 'bad'); return; }
  price = f1(price);
  state.inventory = state.inventory.filter(x => x.uid !== iuid);
  const lid = 'l' + uid();
  state.myList.push({ lid:lid, gid:it.gid, price:price, bought:it.bought||0 });
  state.chats['lead:' + lid] = { kind:'lead', lid:lid, unread:0, messages:[], done:false };
  state.chats['lead:' + lid].key = 'lead:' + lid;
  closeItem();
  closeChat();
  save(); renderAll();
  say('Лот выставлен за ' + f1(price) + ' TON. Ждём покупателей 💬', 'good');
}
function instantSell(iuid){
  const it = state.inventory.find(x => x.uid === iuid);
  if (!it) return;
  const price = f1(marketValue(it.gid) * 0.7);
  state.ton += price;
  state.stats.earned += price;
  state.stats.deals++;
  state.inventory = state.inventory.filter(x => x.uid !== iuid);
  closeItem();
  vibe(15);
  say('Скупка: ' + short(it.gid) + ' за ' + f1(price) + ' TON (70%)', 'good');
  save(); renderAll();
}
function takeOff(lid){
  const l = state.myList.find(x => x.lid === lid);
  if (!l) return;
  state.inventory.push({ uid:'i'+uid(), gid:l.gid, bought:l.bought });
  state.myList = state.myList.filter(x => x.lid !== lid);
  delete state.chats['lead:' + lid];
  toast('Снято с продажи: ' + short(l.gid), '');
  save(); renderAll();
}
function listMyItemFromMy(lid){
  const l = state.myList.find(x => x.lid === lid);
  if (!l) return;
  if (l.lead) delete state.chats['lead:' + l.lid];
  l.lead = null;
  toast('Лот снова в поиске покупателя 📈', '');
  save(); renderAll(); renderItem();
}

function claimBonus(){
  const need = 60000;
  const now = Date.now();
  const left = need - (now - (state.lastBonus || 0));
  if (state.lastBonus && left > 0){ toast('Бонус через ' + Math.ceil(left/1000) + ' сек', ''); return; }
  state.lastBonus = now;
  state.ton += 4;
  vibe(15);
  toast('Бонус +4 TON! 🎁', 'good');
  save(); renderAll();
}

/* ===== TABS & NAVIGATION ===== */
const TABS = [
  { id:'chats',   label:'Чаты',   icon:'💬' },
  { id:'market',  label:'Маркет', icon:'🛍' },
  { id:'gifts',   label:'Подарки', icon:'🎁' },
  { id:'sales',   label:'Продажи', icon:'💰' },
  { id:'profile', label:'Я',      icon:'👤' }
];
let curTab = 'market';
let filter = 'all';
let searchQ = '';
let curItemCtx = null;

function goTab(id){
  curTab = id;
  readUpIfVisible();
  renderFolderTabs();
  renderTab();
  save();
}
function readUpIfVisible(){}

function showScreen(id){
  const s = document.getElementById(id);
  s.classList.remove('hidden');
  s.classList.remove('slide-in');
  void s.offsetWidth;
  s.classList.add('slide-in');
}
function closeScreen(id){
  document.getElementById(id).classList.add('hidden');
}

function openChatKey(key){
  curChat = key;
  renderChatScreen(key);
  showScreen('screenChat');
}
function closeChat(){
  const c = curChat ? state.chats[curChat] : null;
  if (c) readUp(c);
  curChat = null;
  curChatSend = null;
  closeScreen('screenChat');
  renderAll();
  save();
}

function chatHeads(c){
  if (c.kind === 'sell'){
    const l = state.market.find(x => x.rid === c.rid);
    const p = l ? l.seller : (personaFor(c.rid) || { name:'Продавец', emoji:'👤' });
    const g = l ? giftById(l.gid) : null;
    return {
      ava: avaArt(p.name, p.emoji),
      title: p.name + ' ' + p.emoji,
      sub: c.typing ? 'печатает…' : 'онлайн',
      online: !c.typing,
      hint: g ? f1(l.price) + ' TON' : ''
    };
  }
  if (c.kind === 'person'){
    const pd = state.people.find(p => p.pid === c.pid) || { name:'Друг', emoji:'👤', friendship:0 };
    return {
      ava: avaArt(pd.name, pd.emoji),
      title: pd.name + ' ' + pd.emoji,
      sub: c.typing ? 'печатает…' : 'коллекционер · ' + (pd.friendship||0) + '%',
      online: !c.typing,
      hint: '🤝 ' + (pd.friendship||0) + '%'
    };
  }
  const l = state.myList.find(x => x.lid === c.lid);
  const b = (l && l.lead) ? l.lead.buyer : { name:'Покупатель', emoji:'👤' };
  return {
    ava: avaArt(b.name, b.emoji),
    title: b.name,
    sub: c.typing ? 'печатает…' : 'покупатель',
    online: !c.typing,
    hint: l ? short(l.gid) : ''
  };
}

function renderChatScreen(key){
  curChat = key;
  const c = state.chats[key];
  if (!c){ closeChat(); return; }
  readUp(c);
  const heads = chatHeads(c);
  document.getElementById('chatAva').src = heads.ava;
  document.getElementById('chatTitle').textContent = heads.title;
  const subEl = document.getElementById('chatSub');
  subEl.textContent = heads.sub;
  subEl.className = 'ut-sub' + (heads.online ? ' online' : '');
  document.getElementById('chatHint').textContent = heads.hint;

  const box = document.getElementById('msgs');
  let html = '';
  const inp = document.getElementById('chatInput');
  const keepVal = inp ? inp.value : '';

  c.messages.forEach(m => {
    if (m.who === 'sys'){ html += '<div class="sysb">' + esc(m.text) + '</div>'; return; }
    const me = m.who === 'me';
    html += '<div class="brow' + (me ? ' out' : '') + '"><div class="bub' + (m.pop ? ' pop' : '') + '">';
    html += esc(m.text);
    if (me) html += '<div class="bmeta"><span class="btime">' + fmtT(m.t) + '</span><span class="ticks' + (m.read ? '' : ' tick-one') + '">' + (m.read ? '✓✓' : '✓') + '</span></div>';
    html += '</div></div>';
  });
  if (c.typing){
    html += '<div class="brow"><div class="bub typing-bub"><span class="tdot">●</span><span class="tdot">●</span><span class="tdot">●</span></div></div>';
  }
  box.innerHTML = html;
  box.scrollTop = box.scrollHeight;

  const kb = document.getElementById('kb');
  let b = '';
  if (c.kind === 'sell'){
    const l = state.market.find(x => x.rid === c.rid);
    if (l && !c.done){
      b += '<button class="hl" onclick="kb(\'buy\')">✅ Купить ' + f1(l.price) + ' TON</button>';
      b += '<button onclick="kb(\'knock\')">⬇ Сбить цену (~25%)</button>';
      b += '<button onclick="kb(\'askdisc\')">💬 Насколько уступишь?</button>';
      b += '<button class="gold" onclick="kb(\'dealbuy\')">🤝 Купить предложение</button>';
    } else {
      b += '<button disabled>Сделка завершена</button>';
    }
  } else if (c.kind === 'person'){
    const pd = state.people.find(p => p.pid === c.pid);
    if (pd){
      b += (c.offer && c.offerGid
        ? '<button class="grn" onclick="kb(\'pbuy\')">💳 Купить за ' + f1(c.offer) + ' TON</button>'
        : '<button class="grn" onclick="kb(\'pask\')">🛒 Спросить про подарок</button>');
      b += (c.offer ? '<button onclick="kb(\'phag\')">🔥 Сбить цену</button>' : '<button onclick="kb(\'ptalk\')">💬 Поболтать</button>');
      b += '<button class="gold" onclick="kb(\'give\',\'' + c.pid + '\')">🎁 Подарить лучший</button>';
      if (pd.gifts.length){
        b += '<button onclick="openItem(\'person\',\'' + c.pid + '\')">🖼 Его коллекция</button>';
      } else {
        b += '<button disabled>У ' + esc(pd.name) + ' подарков не осталось 😢</button>';
      }
    }
  } else if (c.kind === 'lead'){
    const l = state.myList.find(x => x.lid === c.lid);
    const lead = l && l.lead;
    if (l && lead && !lead.walked && !c.done){
      b += '<button class="grn" onclick="kb(\'lacc\')">✅ Принять ' + f1(lead.offer) + ' TON</button>';
      b += '<button onclick="kb(\'lcnt\')">🔁 За торги (нужно ' + f1(lead.max*1.05) + ')</button>';
      b += '<button class="rd" onclick="kb(\'ldec\')">❌ Отказать</button>';
    } else {
      b += '<button disabled>Покупатель ушёл / сделка закрыта</button>';
    }
  }
  kb.innerHTML = b;

  if (c.unread) c.unread = 0;
  const inp2 = document.getElementById('chatInput');
  if (inp2){
    inp2.value = keepVal;
    inp2.onkeydown = e => { if (e.key === 'Enter') sendMsg(); };
    curChatSend = sendMsg;
  }
  const c2 = state.chats[key];
  if (c2){ c2.messages.forEach(m => m.pop = false); }
  save();
}
let curChatSend = null;

function kb(act, arg){
  const c = curChat ? state.chats[curChat] : null;
  if (!c) return;
  if (act === 'buy'){ closeChat(); openItem('listing', c.rid); }
  else if (act === 'knock'){ const l = state.market.find(x => x.rid === c.rid); if (l) botHaggle(c, f1(l.price * 0.75)); addMsg(c, 'me', 'Давай за ' + f1((l ? l.price : 0) * 0.75) + ' TON?'); renderChatScreen(curChat); }
  else if (act === 'askdisc'){ addMsg(c, 'me', 'Насколько уступишь?'); renderChatScreen(curChat); sellerOffer(c); }
  else if (act === 'dealbuy'){ if (c.offer) closeChat(), openItem('listing', c.rid), buyListing(c.rid, c.offer); else sellerOffer(c); }
  else if (act === 'pask'){ addMsg(c, 'me', 'Есть что-нибудь интересное?'); renderChatScreen(curChat); personAskQuote(c); }
  else if (act === 'ptalk'){ addMsg(c, 'me', 'Как дела, как рынок? 😄'); renderChatScreen(curChat); personQuote(c); }
  else if (act === 'pbuy'){ personBuy(c); }
  else if (act === 'phag'){ addMsg(c, 'me', 'Скинь чуть-чуть 👉👈'); renderChatScreen(curChat); personHaggle(c); }
  else if (act === 'give'){ personGive(c); }
  else if (act === 'lacc'){ leadAccept(c); }
  else if (act === 'lcnt'){ addMsg(c, 'me', 'Давай побольше 😎'); renderChatScreen(curChat); leadCounter(c); }
  else if (act === 'ldec'){ leadDecline(c); }
}

function askGift(pid){
  openPersonChat(pid);
}
function sendMsg(){
  const inp = document.getElementById('chatInput');
  if (!inp) return;
  const val = inp.value.trim();
  if (!val) return;
  const c = curChat ? state.chats[curChat] : null;
  if (!c) return;
  inp.value = '';
  addMsg(c, 'me', val);
  renderChatScreen(curChat);

  const num = parseFloat(val.replace(',', '.'));
  if (c.kind === 'sell' && !c.done && !isNaN(num) && num > 0){
    botHaggle(c, num);
    return;
  }
  if (c.kind === 'person'){
    if (!isNaN(num) && num > 0 && c.offer){ botSay(c, 'Ты про ' + f1(num) + ' TON? У меня уже есть предложение — жми кнопку ниже 👇'); return; }
    botSay(c, rnd(['Ага, понятно 😄','Ха, точно!','Согласен на 100%','Кстати, смотри кнопки ниже 👇','Рынок вечно скачет…']));
    return;
  }
  if (c.kind === 'lead'){
    if (!isNaN(num) && num > 0){
      const lead = leadOf(c);
      if (lead && !lead.walked){
        if (num <= lead.max){ lead.offer = num; lead.counterReady = true; botSay(c, 'Ну ок: ' + f1(num) + ' TON. Верно? Подтверди кнопкой ✅'); }
        else { lead.walked = true; botSay(c, rnd(PH.leadBye)); }
      }
      return;
    }
    botSay(c, 'Торгуйся цифрами, так проще 😉');
  }
}

/* ===== MARKET ===== */
function marketCard(l){
  const g = giftById(l.gid);
  const mv = marketValue(g.gid);
  const off = l.price < mv * 0.92;
  return '<div class="gcard" onclick="openItem(\'listing\',\'' + l.rid + '\')">' +
    '<div class="gimg" style="background-image:url(\'' + giftArt(g) + '\')">' +
    '<span class="rr rr-' + g.rarity + '">' + RAR[g.rarity].label + '</span>' +
    (off ? '<span class="off">−' + Math.round((1 - l.price/mv)*100) + '%</span>' : '') +
    '</div>' +
    '<div class="ginfo"><div class="gname">' + g.name + '</div>' +
    '<div class="gprice">' + f1(l.price) + ' <small>TON</small></div>' +
    '<div class="gseller"><img src="' + avaArt(l.seller.name, l.seller.emoji) + '" alt=""><span>' + esc(l.seller.name) + '</span></div>' +
    '<div class="gbtns"><button class="t" onclick="event.stopPropagation();openSellerChat(\'' + l.rid + '\')">💬 Чат</button>' +
    '<button onclick="event.stopPropagation();buyListing(\'' + l.rid + '\')">Купить</button></div>' +
    '</div></div>';
}
function renderMarketTab(){
  let items = state.market.slice();
  if (filter !== 'all') items = items.filter(l => giftById(l.gid).rarity === filter);
  if (searchQ){
    const q = searchQ.toLowerCase();
    items = items.filter(l => giftById(l.gid).name.toLowerCase().includes(q));
  }
  items.sort((a,b) => a.price - b.price);
  let h = '';
  h += '<div class="search">🔍<input id="mSearch" placeholder="Поиск подарков…" value="' + esc(searchQ) + '"></div>';
  h += '<div class="chips">' +
    [['all','Все'],['common','Обычные'],['rare','Редкие'],['epic','Эпические'],['legendary','Легендарные']].map(f =>
      '<button class="chip-f' + (filter===f[0] ? ' on' : '') + '" onclick="setFilter(\'' + f[0] + '\')">' + f[1] + '</button>'
    ).join('') + '</div>';
  h += '<div class="mgrid">' + (items.length ? items.map(marketCard).join('') : '<div class="empty" style="grid-column:1/-1"><span class="e">🛍</span>Ничего не найдено.<br>Загляни через минуту — лоты появляются каждый тик!</div>') + '</div>';
  const page = document.getElementById('page');
  page.innerHTML = h;
  const si = document.getElementById('mSearch');
  if (si){
    si.oninput = () => { marketSearch(si.value); };
    if (searchQ) si.focus();
  }
}
function marketSearch(v){ searchQ = v; renderMarketTab(); }
function setFilter(f){ filter = f; renderMarketTab(); }

/* ===== CHATS TAB ===== */
function lastPrev(c){
  const ms = c.messages;
  if (!ms.length) return '…';
  const m = ms[ms.length-1];
  return (m.who === 'me' ? 'Вы: ' : '') + m.text;
}
function renderChatsTab(){
  let h = '';
  h += '<div class="search">🔍<input placeholder="Поиск чатов…" disabled></div>';
  h += '<div class="chatlist">';
  h += '<div class="crow" onclick="goTab(\'market\')">' +
    '<img class="ava" src="' + avaArt('Gift Маркет', '💎') + '">' +
    '<div class="cmid"><div class="ctop"><div class="cname">💎 Gifts Маркет <span class="pin">📌</span></div><div class="ctime">бот</div></div>' +
    '<div class="cbot"><div class="cprev you">Главный бот рынка подарков · открыть маркет</div></div></div></div>';
  const keys = Object.keys(state.chats);
  if (!keys.length){
    h += '<div class="empty"><span class="e">💬</span>Пока нет чатов.<br>Открой Маркет и напиши продавцу — или дождись покупателя.</div>';
  }
  keys.slice().reverse().forEach(k => {
    const c = state.chats[k];
    const heads = chatHeads(c);
    const last = c.messages[c.messages.length-1];
    h += '<div class="crow" onclick="openChatKey(\'' + k + '\')">' +
      '<img class="ava" src="' + heads.ava + '">' +
      '<div class="cmid"><div class="ctop"><div class="cname">' + esc(heads.title) + '</div><div class="ctime">' + (last ? fmtT(last.t) : '') + '</div></div>' +
      '<div class="cbot"><div class="cprev' + (c.messages.length && c.messages[c.messages.length-1].who === 'me' ? ' you' : '') + '">' + esc(lastPrev(c)) + '</div>' +
      (c.unread ? '<div class="cbadge">' + c.unread + '</div>' : '') +
      '</div></div></div>';
  });
  h += '</div>';
  document.getElementById('page').innerHTML = h;
}

/* ===== GIFTS TAB (holders) ===== */
function renderGiftsTab(){
  let h = '<div class="gifts-page">';
  if (!state.people.length){
    h += '<div class="empty"><span class="e">🎁</span>Пока никто не показывает подарки.</div>';
  }
  state.people.forEach(pd => {
    h += '<div class="hcard" onclick="openItem(\'person\',\'' + pd.pid + '\')">' +
      '<img class="hava" src="' + avaArt(pd.name, pd.emoji) + '">' +
      '<div class="hmid"><div class="hname">' + esc(pd.name) + ' ' + pd.emoji + '</div>' +
      '<div class="hgifs">' + pd.gifts.slice(0,5).map(it => '<img src="' + giftImg(giftById(it.gid)) + '" alt="">').join('') + '</div>' +
      '<div class="hfr"><div class="fbar"><div class="ffill" style="width:' + (pd.friendship||0) + '%"></div></div>' +
      '<span class="flab">' + (pd.friendship||0) + '% дружба</span></div>' +
      '</div></div>';
  });
  h += '</div>';
  document.getElementById('page').innerHTML = h;
}

/* ===== SALES TAB ===== */
function renderSalesTab(){
  let h = '<div class="sales-page">';
  h += '<div class="sect">Мои лоты</div>';
  if (!state.myList.length){
    h += '<div class="empty" style="padding:22px 30px"><span class="e">🏷</span>Нет активных лотов.<br>Выстави подарок из инвентаря — покупатели напишут в чат сами.</div>';
  }
  state.myList.forEach(l => {
    const g = giftById(l.gid);
    const mv = marketValue(g.gid);
    h += '<div class="sale-card"><div class="sale-top">' +
      '<img src="' + giftArt(g) + '" alt="">' +
      '<div style="flex:1"><div class="sale-name">' + g.name + '</div>' +
      '<div class="sale-sub">Цена: <b>' + f1(l.price) + ' TON</b> · рынок ' + f1(mv) + ' ' +
      (l.price > mv ? '<span class="neg">дороже рынка</span>' : '<span class="pos">лучше рынка</span>') + '</div></div></div>' +
      (l.lead
        ? (l.lead.walked
            ? '<div class="buyer-line" style="opacity:.55"><div style="flex:1">Покупатель ушёл 😤 Лот снова ждёт</div></div>'
            : '<div class="buyer-line' + (l.lead.counterReady ? ' ok' : '') + '" onclick="openLeadChat(\'' + l.lid + '\')">' +
              '<img src="' + avaArt(l.lead.buyer.name, l.lead.buyer.emoji) + '">' +
              '<div style="flex:1"><b>' + esc(l.lead.buyer.name) + '</b>' + (l.lead.counterReady ? ' готов к ' : ' даёт ') + '<b>' + f1(l.lead.offer) + ' TON</b></div><span>›</span></div>')
        : '') +
      '<div class="sale-actions">' +
      (l.lead && !l.lead.walked ? '<button class="sbtn blue" onclick="openLeadChat(\'' + l.lid + '\')">💬 Чат с покупателем</button>' : '') +
      '<button class="sbtn" onclick="takeOff(\'' + l.lid + '\')">Снять</button>' +
      '</div></div>';
  });
  h += '<div class="sect">Выставить из инвентаря</div>';
  if (!state.inventory.length){
    h += '<div class="empty" style="padding:14px 30px"><span class="e">📦</span>Инвентарь пуст — купи что-нибудь на Маркете.</div>';
  }
  h += '<div class="sell-form"><label>Цена в TON (для следующего лота)</label>' +
    '<input id="sellPrice" type="number" min="1" step="0.1" placeholder="Например 19.5"></div>';
  state.inventory.forEach(it => {
    const g = giftById(it.gid);
    const mv = marketValue(g.gid);
    h += '<div class="sale-card"><div class="sale-top">' +
      '<img src="' + giftArt(g) + '" alt="">' +
      '<div style="flex:1"><div class="sale-name">' + g.name + '</div>' +
      '<div class="sale-sub">Рынок: <b>' + f1(mv) + ' TON</b>' + (it.bought ? ' · куплен за ' + f1(it.bought) : '') + '</div></div></div>' +
      '<div class="sale-actions">' +
      '<button class="sbtn blue" onclick="quickList(\'' + it.uid + '\')">🏷 Выставить</button>' +
      '<button class="sbtn red" onclick="instantSell(\'' + it.uid + '\')">⚡ Скупка 70% · ' + f1(mv*0.7) + '</button>' +
      '</div></div>';
  });
  h += '<div class="sect">Касса</div>';
  const earn = state.stats.earned || 0, spent = state.stats.spent || 0;
  h += '<div class="stat4">' +
    '<div class="s"><div class="v">' + f1(state.ton) + '</div><div class="k">TON на счету</div></div>' +
    '<div class="s"><div class="v pos">+' + f1(earn) + '</div><div class="k">заработано</div></div>' +
    '<div class="s"><div class="v neg">−' + f1(spent) + '</div><div class="k">потрачено</div></div>' +
    '<div class="s"><div class="v">' + (state.stats.deals||0) + '</div><div class="k">сделок</div></div></div>';
  h += '</div>';
  const page = document.getElementById('page');
  page.innerHTML = h;
  const sp = document.getElementById('sellPrice');
  if (sp){
    sp.onkeydown = e => {
      if (e.key === 'Enter' && curItemCtx && curItemCtx.type === 'quick'){ listMyItem(curItemCtx.id, sp.value); curItemCtx = null; }
    };
  }
}

/* ===== PROFILE ===== */
function renderProfileTab(){
  let h = '<div class="profile-page">';
  h += '<div class="pava"><img src="' + avaArt('Ты', '🙂') + '"></div>' +
    '<div class="pname">Твой профиль</div>' +
    '<div class="pbal"><b>' + f1(state.ton) + '</b> TON · тренд рынка ' + (state.trend >= 1 ? '📈' : '📉') + ' ' + Math.round((state.trend-1)*100) + '%</div>';
  h += '<div class="sect">Мои подарки (' + state.inventory.length + ')</div>';
  if (!state.inventory.length) h += '<div class="empty" style="padding:16px 30px"><span class="e">📦</span>Пока пусто</div>';
  h += '<div class="pmy">' + state.inventory.map(it => {
    const g = giftById(it.gid);
    return '<div class="g" onclick="openItem(\'inv\',\'' + it.uid + '\')">' +
      '<div class="im" style="background-image:url(\'' + giftArt(g) + '\')"></div>' +
      '<div class="n">' + g.name + '</div></div>';
  }).join('') + '</div>';
  h += '<div class="sect">Статистика</div>';
  h += '<div class="stat4">' +
    '<div class="s"><div class="v">' + (state.stats.deals||0) + '</div><div class="k">сделок</div></div>' +
    '<div class="s"><div class="v">' + (state.stats.giftsGiven||0) + '</div><div class="k">подарено</div></div>' +
    '<div class="s"><div class="v">' + (state.stats.giftsReceived||0) + '</div><div class="k">подарили тебе</div></div>' +
    '<div class="s"><div class="v">' + chatsCount() + '</div><div class="k">чатов</div></div></div>';
  h += '<div class="d-actions" style="margin:16px 12px"><button class="sec" style="color:var(--red);border-color:rgba(236,95,85,.4)" onclick="resetAll()">🗑 Начать заново</button></div>';
  h += '<div class="d-note" style="padding:0 26px 10px">Бонус 🎁 +4 TON каждый последний час — не забудь! Кнопка в шапке.</div></div>';
  document.getElementById('page').innerHTML = h;
}

/* ===== ITEM DETAIL ===== */
function openItem(type, id){
  curItemCtx = { type:type, id:id };
  renderItem();
  showScreen('screenItem');
}
function closeItem(){
  curItemCtx = null;
  document.getElementById('screenItem').classList.add('hidden');
  save();
}

function renderItem(){
  if (!curItemCtx) return;
  const body = document.getElementById('itemBody');
  const title = document.getElementById('itemTitle');
  const sub = document.getElementById('itemSub');

  if (curItemCtx.type === 'listing'){
    const l = state.market.find(x => x.rid === curItemCtx.id);
    if (!l){ closeItem(); return; }
    const g = giftById(l.gid);
    title.textContent = g.name;
    sub.textContent = 'лот на маркете';
    body.innerHTML =
      '<div class="hero-wrap"><div class="hero" style="background-image:url(\'' + giftArt(g) + '\')"></div></div>' +
      '<div class="detail"><div class="d-name">' + g.name + '</div>' +
      '<span class="d-rr rr-' + g.rarity + '">' + RAR[g.rarity].label + '</span>' +
      '<div class="d-price">' + f1(l.price) + ' <small>TON</small></div>' +
      '<div class="d-seller" onclick="closeItem();openSellerChat(\'' + l.rid + '\')">' +
      '<img src="' + avaArt(l.seller.name, l.seller.emoji) + '">' +
      '<div style="flex:1"><div class="n">' + esc(l.seller.name) + ' ' + l.seller.emoji + '</div>' +
      '<div class="s">Нажми — откроется чат, можно торговаться</div></div><span style="color:var(--accent)">›</span></div>' +
      '<div class="d-actions">' +
      '<button onclick="kbBuyFromItem(\'' + l.rid + '\')">💳 Купить сейчас</button>' +
      '<button class="sec" onclick="closeItem();openSellerChat(\'' + l.rid + '\')">💬 Торговаться</button>' +
      '</div>' +
      '<div class="d-note">💡 Продавцы иногда уступают: открой чат и предложи свою цену. Дважды оскорбишь низкой ценой — поднимет её накину 6% сверху!</div></div>';
    return;
  }
  if (curItemCtx.type === 'inv'){
    const it = state.inventory.find(x => x.uid === curItemCtx.id);
    if (!it){ closeItem(); return; }
    const g = giftById(it.gid);
    const mv = marketValue(g.gid);
    title.textContent = g.name;
    sub.textContent = 'в инвентаре';
    body.innerHTML =
      '<div class="hero-wrap"><div class="hero" style="background-image:url(\'' + giftArt(g) + '\')"></div></div>' +
      '<div class="detail"><div class="d-name">' + g.name + '</div>' +
      '<span class="d-rr rr-' + g.rarity + '">' + RAR[g.rarity].label + '</span>' +
      '<div class="d-price">' + f1(mv) + ' <small>TON · рыночная</small></div>' +
      (it.bought ? '<div class="d-note">Куплен за ' + f1(it.bought) + ' TON</div>' : '') +
      '<div class="sell-form" id="dsell" style="display:none"><label>Твоя цена в TON</label>' +
      '<input id="dprice" type="number" min="1" step="0.1" placeholder="Например 19.5">' +
      '<div class="d-actions" style="margin-top:9px"><button onclick="ufltListFromItem()">🏷 Выставить</button></div></div>' +
      '<div class="d-actions">' +
      '<button onclick="kbSellShow()">🏷 Выставить лот</button>' +
      '<button class="sec" onclick="instantSell(\'' + it.uid + '\')">⚡ Скупка 70%<br>за ' + f1(mv*0.7) + ' TON</button>' +
      '</div>' +
      '<div class="d-note">«Выставить» — цена из поля: покупатели напишут в чат, торгуйся и продавай дороже. «Скупка» — мгновенно, но за 70%.</div></div>';
    return;
  }
  if (curItemCtx.type === 'my'){
    const l = state.myList.find(x => x.lid === curItemCtx.id);
    if (!l){ closeItem(); return; }
    const g = giftById(l.gid);
    title.textContent = g.name;
    sub.textContent = 'твой лот';
    body.innerHTML =
      '<div class="hero-wrap"><div class="hero" style="background-image:url(\'' + giftArt(g) + '\')"></div></div>' +
      '<div class="detail"><div class="d-name">' + g.name + '</div>' +
      '<span class="d-rr rr-' + g.rarity + '">' + RAR[g.rarity].label + '</span>' +
      '<div class="d-price">' + f1(l.price) + ' <small>TON · твой лот</small></div>' +
      (l.lead
        ? (l.lead.walked
            ? '<div class="buyer-line" style="opacity:.55"><div style="flex:1">Покупатель ушёл 😤 Ждём нового… или пересылай</div></div>'
            : '<div class="buyer-line' + (l.lead.counterReady ? ' ok' : '') + '" onclick="closeItem();openLeadChat(\'' + l.lid + '\')">' +
              '<img src="' + avaArt(l.lead.buyer.name, l.lead.buyer.emoji) + '">' +
              '<div style="flex:1"><b>' + esc(l.lead.buyer.name) + '</b>' + (l.lead.counterReady ? ' готов к ' : ' даёт ') + '<b>' + f1(l.lead.offer) + ' TON</b></div><span>›</span></div>')
        : '<div class="d-note">Покупатели появятся в течение пары минут — им важно успеть, лоты продаются, пока рынок живой 😄</div>') +
      '<div class="d-actions">' +
      (l.lead && !l.lead.walked ? '<button onclick="closeItem();openLeadChat(\'' + l.lid + '\')">💬 Чат с покупателем</button>' : '') +
      (l.lead && l.lead.walked ? '<button class="sec" onclick="listMyItemFromMy(\'' + l.lid + '\')">🔁 Искать заново</button>' : '') +
      '<button class="sec" onclick="takeOff(\'' + l.lid + '\')">⬇ Снять с продажи</button>' +
      '</div>' +
      '<div class="d-note">Комиссия маркетплейса при продаже — 5%.</div></div>';
    return;
  }
  if (curItemCtx.type === 'person'){
    const pd = state.people.find(p => p.pid === curItemCtx.id);
    if (!pd){ closeItem(); return; }
    title.textContent = pd.name;
    sub.textContent = 'коллекционер';
    body.innerHTML =
      '<div class="profile-page"><div class="pava"><img src="' + avaArt(pd.name, pd.emoji) + '"></div>' +
      '<div class="pname">' + esc(pd.name) + ' ' + pd.emoji + '</div>' +
      '<div class="pbal" style="color:var(--gold)">Дружба ' + (pd.friendship||0) + '% ' + ((pd.friendship||0) >= 60 ? '🤝' : '') + '</div>' +
      '<div class="fbar" style="margin:10px 40px"><div class="ffill" style="width:' + (pd.friendship||0) + '%"></div></div>' +
      '<div class="d-note" style="text-align:center;padding:0 30px">' + esc(pd.line) + '</div>' +
      '<div class="d-actions" style="margin:14px 16px 0">' +
      '<button onclick="closeItem();openPersonChat(\'' + pd.pid + '\')">💬 Написать</button>' +
      '<button class="sec" onclick="kbGiveToPerson(\'' + pd.pid + '\')">🎁 Подарить</button>' +
      '</div>' +
      '<div class="sect">Его подарки</div><div class="pmy" style="grid-template-columns:repeat(4,1fr)">' +
      (pd.gifts.length ? pd.gifts.map(item => {
        const g2 = giftById(item.gid);
        return '<div class="g"><div class="im" style="background-image:url(\'' + giftArt(g2) + '\')"></div>' +
          '<div class="n">' + g2.name + '</div></div>';
      }).join('') : '<div class="empty" style="padding:8px 30px"><span class="e">📭</span>Пусто</div>') +
      '</div></div>';
    return;
  }
  body.innerHTML = '';
}
function kbBuyFromItem(rid){
  const l = state.market.find(x => x.rid === rid);
  if (!l) return;
  closeItem();
  buyListing(rid);
}
function kbGiveToPerson(pid){
  const c = getChat('person:' + pid, () => ({ kind:'person', pid:pid, unread:0, messages:[], greeted:true }));
  closeItem();
  openPersonChat(pid);
  personGive(c);
}
function ufltListFromItem(){
  if (!curItemCtx || curItemCtx.type !== 'inv') return;
  const val = (document.getElementById('dprice')||{}).value;
  listMyItem(curItemCtx.id, val);
}

function kbSellShow(){
  const f = document.getElementById('dsell');
  if (f) f.style.display = 'block';
  const inp = document.getElementById('dprice');
  if (inp){ inp.focus(); inp.onkeydown = e => { if (e.key === 'Enter'){ const v = parseFloat(inp.value); if (curItemCtx && curItemCtx.type === 'inv') listMyItem(curItemCtx.id, v); } }; }
}
function quickList(iuid){
  const sp = document.getElementById('sellPrice');
  const v = sp ? parseFloat(sp.value) : NaN;
  if (!v || v <= 0){ if (sp) sp.focus(); toast('Введи цену в поле выше', 'bad'); return; }
  listMyItem(iuid, v);
}

/* ===== HOME CHROME ===== */
function renderFolderTabs(){
  const unread = unreadTotal();
  document.getElementById('folderTabs').innerHTML = TABS.map(t => {
    const badge = t.id === 'chats' && unread ? '<span class="b">' + unread + '</span>' : '';
    return '<button class="ftab' + (curTab === t.id ? ' active' : '') + '" onclick="goTab(\'' + t.id + '\')">' + t.icon + ' ' + t.label + badge + '</button>';
  }).join('');
}
function renderTab(){
  if (curTab === 'market') renderMarketTab();
  else if (curTab === 'chats') renderChatsTab();
  else if (curTab === 'gifts') renderGiftsTab();
  else if (curTab === 'sales') renderSalesTab();
  else renderProfileTab();
}
function updateBalanceLine(){
  const invW = state.inventory.reduce((s,i) => s + marketValue(i.gid), 0);
  document.getElementById('balLine').innerHTML = '<b>' + f1(state.ton) + '</b> TON · ' + f1(invW) + ' в подарках';
}
function updateBonusChip(){
  const left = 60000 - (Date.now() - (state.lastBonus || 0));
  const el = document.getElementById('bonusT');
  if (el) el.textContent = (state.lastBonus && left > 0) ? Math.ceil(left/1000) + 'с' : 'забрать';
}
function renderHome(){
  updateBalanceLine();
  updateBonusChip();
  renderFolderTabs();
  renderTab();
}
function renderAll(){
  renderHome();
  if (curChat && !document.getElementById('screenChat').classList.contains('hidden')) renderChatScreen(curChat);
}
function refreshChrome(){
  updateBalanceLine();
  updateBonusChip();
  renderFolderTabs();
  if (curTab === 'market' || curTab === 'sales' || curTab === 'gifts') renderHome();
}

/* ===== LIVE TICK ===== */
let lastLeadToast = 0;
function tick(){
  state.tickN++;
  state.trend = clamp(state.trend + (Math.random()-0.5)*0.07, 0.75, 1.45);
  state.market.forEach(l => {
    l.price = f1(clamp(l.ref0 * clamp(state.trend, 0.8, 1.35) * (1 + Math.abs(Math.sin(hash(l.rid) + state.tickN/40))*0.12), 0.3, 9999));
  });
  if (state.market.length < 9 && Math.random() < 0.5) state.market.push(genListing());
  if (state.market.length > 3 && Math.random() < 0.15) state.market.splice(Math.floor(Math.random()*state.market.length), 1);
  const chatVisible = curChat && !document.getElementById('screenChat').classList.contains('hidden');
  state.myList.forEach(l => {
    if (!l.lead && Math.random() < 0.10){
      const b = rnd(BUYERS);
      const offer = f1(Math.max(0.5, l.price * (0.6 + Math.random()*0.5)));
      l.lead = { offer:offer, max:f1(Math.max(offer, l.price * (1.0 + Math.random()*0.25))), buyer:b, walked:false, counterReady:false };
      const key = 'lead:' + l.lid;
      const c = getChat(key, () => ({ kind:'lead', lid:l.lid, unread:0, messages:[], done:false }));
      addMsg(c, 'bot', 'Привет! Хочу купить ' + short(l.gid) + '. Дам ' + f1(offer) + ' TON. По рукам?');
      c.unread = (c.unread||0) + 1;
      vibe([10,30,10]);
      toast(b.name + ' хочет купить ' + short(l.gid) + ' за ' + f1(offer) + ' TON 💬', '');
    }
  });
  if (Math.random() < 0.05){
    const cands = state.people.filter(p => (p.friendship||0) >= 45 && p.gifts.length > 0);
    if (cands.length) personGiftBack(rnd(cands).pid);
  }
  save();
  refreshChrome();
  if (chatVisible) renderChatScreen(curChat);
}

function resetAll(){
  if (!confirm('Начать игру заново? Весь прогресс исчезнет.')) return;
  state = defaultState();
  curChat = null;
  curTab = 'market';
  save();
  renderAll();
  toast('Новая игра! Удачных сделок 🚀', 'good');
}

/* ===== BOOT ===== */
window.kb = kb; window.goTab = goTab; window.setFilter = setFilter; window.marketSearch = marketSearch;
window.openSellerChat = openSellerChat; window.openItem = openItem; window.closeItem = closeItem;
window.openPersonChat = openPersonChat; window.openLeadChat = openLeadChat; window.closeChat = closeChat;
window.buyListing = buyListing; window.instantSell = instantSell; window.takeOff = takeOff;
window.listMyItemFromMy = listMyItemFromMy; window.claimBonus = claimBonus; window.resetAll = resetAll;
window.quickList = quickList; window.kbSellShow = kbSellShow; window.kbBuyFromItem = kbBuyFromItem; window.kbGiveToPerson = kbGiveToPerson; window.ufltListFromItem = ufltListFromItem;

function bind(){
  const send = document.getElementById('chatSend');
  if (send) send.addEventListener('click', () => sendMsg());
}

let tickHandle = null;
function boot(){
  state = load();
  if (!state){
    state = defaultState();
    save();
    toast('Добро пожаловать на Gifts Market! 💎', 'good');
  }
  curTab = 'market';
  bind();
  renderAll();
  if (!tickHandle) tickHandle = setInterval(tick, 5000);
}
boot();
