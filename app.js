const STORAGE_KEY = 'nftTonGameV1';

const GIFTS = [
  { gid:'candy',  name:'Леденец',            emoji:'🍭', base:4,   rarity:'common' },
  { gid:'balloon',name:'Шарик',              emoji:'🎈', base:5,   rarity:'common' },
  { gid:'rose',   name:'Роза',               emoji:'🌹', base:6,   rarity:'common' },
  { gid:'heart',  name:'Сердечко',           emoji:'❤️', base:8,   rarity:'common' },
  { gid:'scarf',  name:'Косынка',            emoji:'🧣', base:11,  rarity:'rare' },
  { gid:'champ',  name:'Шампанское',         emoji:'🍾', base:14,  rarity:'rare' },
  { gid:'pad',    name:'Геймпад',            emoji:'🎮', base:17,  rarity:'rare' },
  { gid:'ring',   name:'Кольцо',             emoji:'💍', base:32,  rarity:'epic' },
  { gid:'bike',   name:'Космо-байк',         emoji:'🏍', base:40,  rarity:'epic' },
  { gid:'rocket', name:'Ракета',             emoji:'🚀', base:55,  rarity:'epic' },
  { gid:'star',   name:'Вечная звезда',      emoji:'🌟', base:110, rarity:'legendary' },
  { gid:'pepe',   name:'Плюшевый Пепе',      emoji:'🧸', base:160, rarity:'legendary' },
  { gid:'crown',  name:'Корона Дурова',      emoji:'👑', base:260, rarity:'legendary' }
];

const RARITY_LABEL = { common:'обычный', rare:'редкий', epic:'эпик', legendary:'легенда' };
const RARITY_FRIEND = { common:6, rare:11, epic:17, legendary:26 };

const PERSONAS = [
  { name:'Крипто-Кот',   emoji:'🐱', greed:0.8,  line:'Мур. Всё продаю, всё покупаю.' },
  { name:'Дед Инвест',   emoji:'💼', greed:0.5,  line:'Я ещё в 2013-м TON покупал.' },
  { name:'Аня Дроп',     emoji:'🌸', greed:0.2,  line:'Люблю красивые подарки и честные цены.' },
  { name:'Тон Мастер',   emoji:'⚡', greed:0.6,  line:'Прайс решает всё. Но красивым — скидка.' },
  { name:'Шулер Олег',   emoji:'🎲', greed:0.9,  line:'Кнопки давить умеешь? А торговаться?' },
  { name:'Мила НФТка',   emoji:'💿', greed:0.35, line:'Коллекционирую редкости с душой.' }
];

const BUYER_NAMES = [
  { name:'Скупщик Виктор', emoji:'🕵' }, { name:'Флиппер Ким', emoji:'🤹' },
  { name:'Тихий Пётр', emoji:'🧊' }, { name:'Барыга Гоша', emoji:'🦝' },
  { name:'Коллекционер Лёв', emoji:'🎩' }, { name:'Резел Рустам', emoji:'🛴' }
];

const PH = {
  greet: ['Привет! Смотрю, ты по делу.', 'О, покупатель!', 'Здравствуй. Что интересно?'],
  askPrice: ['Отдаю за {p} TON. Твердо.', 'Цена — {p} TON. Не дорого за такое.', 'Хочешь? {p} TON и забирай.'],
  accept: ['По рукам! Жми кнопку 🤝', 'Ладно, уговорил. {p} TON — и моё.', 'Беру! Не могу устоять.'],
  counter: ['Мало. Моя цена — {p} TON, и это уже скидка.', 'Не-не. {p} TON, последний раз говорю.', 'Дешевле не отдам. {p} TON — и по рукам.'],
  refuse: ['Нет. Даже не близко.', 'Такие цены только в фантазиях.', 'Иди копи, потом приходи.'],
  angry: ['Всё, обиделся. Теперь {p} TON.', 'За такое цены растут. {p} TON.'],
  noMoney: ['Извини, TON не хватает.', 'Сначала подкопи, потом торгуйся.'],
  bought: ['Сделка закрыта 🔒 Приятно иметь дело!', 'Готово! Пользуйся с удовольствием.'],
  thanks: ['Всегда рад!', 'Обращайся ещё 😉'],
  cheap: ['Ну хорошо, немного скину.', 'Только тебе. Немного.'],
  soldMe: ['Забираю! Отличная вещь.', 'Беру, не раздумываю.'],
  tooLowSell: ['Это слишком дёшево для меня.', 'Нет, я не настолько щедрый.'],
  giftGot: ['Спасибо! Очень приятно, что ты подумал обо мне.', 'Ого, для меня? Спасибо! 🎉'],
  giftAsk: ['Отдам за {p} TON, вещь классная.', 'Хм, хочу {p} TON за него.', '{p} TON и обсуждать нечего.']
};

const giftById = gid => GIFTS.find(g => g.gid === gid);
const rnd = a => a[Math.floor(Math.random() * a.length)];
const f1 = n => Math.round(n * 10) / 10;
const clamp = (n, a, b) => Math.min(b, Math.max(a, n));

let state = null;
let currentChat = null;
let currentTab = 'market';

function uidSeq() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

function marketValue(gid) {
  return f1(giftById(gid).base * state.trend);
}

function weightedGift() {
  const wob = { common: 5, rare: 3, epic: 1.6, legendary: 0.5 };
  const pool = [];
  GIFTS.forEach(g => { for (let i = 0; i < Math.round(wob[g.rarity] * 10); i++) pool.push(g); });
  return rnd(pool);
}

function hashCode(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) { h = ((h << 5) - h + s.charCodeAt(i)) | 0; }
  return h;
}

function personaFor(seed) {
  return PERSONAS[Math.abs(hashCode(String(seed))) % PERSONAS.length];
}

function shortGift(gid) { return giftById(gid).name + ' ' + giftById(gid).emoji; }

function genListing() {
  const g = weightedGift();
  const price = f1(Math.max(0.5, g.base * state.trend * (0.75 + Math.random() * 0.7)));
  const l = { rid: 'r' + uidSeq(), gid: g.gid, price: price, ref0: price };
  l.acceptK = 1 - 0.35 * (1 - personaFor(l.rid).greed);
  return l;
}

function newPerson() {
  const p = rnd(PERSONAS);
  const gifts = [];
  const n1 = rnd(GIFTS.filter(g => g.rarity === 'common' || g.rarity === 'rare'));
  gifts.push({ uid: 'pg' + uidSeq(), gid: n1.gid });
  if (Math.random() < 0.45) {
    const n2 = rnd(GIFTS.filter(g => g.rarity === 'common' || g.rarity === 'rare'));
    gifts.push({ uid: 'pg' + uidSeq(), gid: n2.gid });
  }
  return { pid: 'p' + uidSeq(), name: p.name, emoji: p.emoji, greed: p.greed, line: p.line, friendship: Math.floor(Math.random() * 25), gifts: gifts };
}

function defaultState() {
  const st = {
    ton: 25, trend: 1, inventory: [], market: [], myList: [], people: [], chats: {},
    stats: { spent: 0, earned: 0, deals: 0, giftsGiven: 0, giftsReceived: 0 },
    lastBonus: 0, tickN: 0
  };
  state = st;
  for (let i = 0; i < 6; i++) st.market.push(genListing());
  for (let i = 0; i < 4; i++) st.people.push(newPerson());
  return st;
}

function save() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {} }

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const st = JSON.parse(raw);
    if (!st || typeof st.ton !== 'number') return null;
    return st;
  } catch (e) { return null; }
}

function getChat(key, factory) {
  if (!state.chats[key]) state.chats[key] = factory();
  const c = state.chats[key];
  c.key = key;
  return c;
}

function msg(c, who, text) {
  c.messages.push({ who: who, text: text, t: Date.now() });
  if (who === 'bot' && currentChat !== c.key) c.unread = (c.unread || 0) + 1;
}

function toast(text, kind) {
  const box = document.getElementById('toasts');
  if (!box) return;
  const el = document.createElement('div');
  el.className = 'toast ' + (kind || '');
  el.textContent = text;
  box.appendChild(el);
  setTimeout(() => el.remove(), 3200);
}

function levelInfo() {
  const lvl = Math.floor(state.stats.deals / 4) + 1;
  const names = ['Новичок рынка', 'Флиппер', 'Трейдер', 'Продвинутый скупщик', 'Магнат подарков', 'Крипто-легенда'];
  return { lvl: lvl, name: names[Math.min(lvl - 1, names.length - 1)] };
}

function setStatus(t) { document.getElementById('chatStatus').textContent = t; }

function botSay(c, text, after) {
  setStatus('печатает…');
  setTimeout(() => {
    if (text) msg(c, 'bot', text);
    save();
    if (currentChat === c.key) { renderChat(c.key); setStatus(c.statusLine || 'онлайн'); }
    refreshBadges();
    if (after) after();
  }, 650 + Math.random() * 850);
}

function openSellerChat(rid) {
  const l = state.market.find(x => x.rid === rid);
  if (!l) return;
  const p = personaFor(rid);
  const key = 'sell:' + rid;
  const c = getChat(key, () => ({
    kind: 'seller', rid: rid, refPrice: l.ref0, ref0: l.ref0, acceptK: l.acceptK,
    statusLine: 'продаёт ' + shortGift(l.gid), done: false, discountUsed: false,
    unread: 0, messages: [], insult: 0
  }));
  if (c.messages.length === 0) {
    msg(c, 'sys', 'Открыт чат с продавцом. Торгуйся или покупай сразу.');
    msg(c, 'bot', p.line);
    botSay(c, rnd(PH.askPrice).replace('{p}', f1(l.price)) + ' (' + shortGift(l.gid) + ')');
  }
  c.unread = 0;
  openChat(key);
}

function botHaggle(c, offer) {
  const floor = c.ref0 * c.acceptK;
  if (offer >= c.refPrice - 0.05) return { type: 'accept', price: f1(c.refPrice) };
  if (offer >= floor) {
    const target = Math.max(offer, floor + (c.refPrice - floor) * 0.45);
    c.refPrice = f1(Math.max(floor, Math.min(c.refPrice, target)));
    return { type: 'counter', price: c.refPrice };
  }
  c.insult = (c.insult || 0) + 1;
  if (c.insult >= 2 && c.refPrice < c.ref0) {
    c.refPrice = f1(Math.min(c.ref0, c.refPrice * 1.06));
    return { type: 'angry', price: c.refPrice };
  }
  return { type: 'refuse', price: c.refPrice };
}

function sellerOffer(c, offer) {
  if (!c || c.done) return;
  const l = state.market.find(x => x.rid === c.rid);
  if (!l) {
    c.done = true;
    c.statusLine = 'товар продан';
    toast('Товар уже купил кто-то другой 😢', 'bad');
    if (currentChat === c.key) renderChat(c.key);
    return;
  }
  const r = botHaggle(c, offer);
  if (r.type === 'accept') {
    msg(c, 'bot', rnd(PH.accept).replace('{p}', r.price));
    c.done = true;
    c.deal = { price: r.price };
    c.statusLine = 'дил готов 🤝';
  } else if (r.type === 'counter') {
    msg(c, 'bot', rnd(PH.counter).replace('{p}', r.price));
    c.statusLine = 'его цена: ' + r.price + ' TON';
  } else if (r.type === 'angry') {
    msg(c, 'bot', rnd(PH.angry).replace('{p}', r.price));
  } else {
    msg(c, 'bot', rnd(PH.refuse));
  }
  if (l) l.price = c.refPrice;
  save();
  refreshBadges();
  if (currentChat === c.key) renderChat(c.key);
}

function buyMarket(rid, agreedPrice) {
  const l = state.market.find(x => x.rid === rid);
  if (!l) return;
  const key = 'sell:' + rid;
  const c = state.chats[key];
  let price = l.price;
  if ((agreedPrice === undefined || agreedPrice === null) && c && c.deal) price = c.deal.price;
  if (agreedPrice !== undefined && agreedPrice !== null) price = agreedPrice;
  if (state.ton < price) { toast('Не хватает TON! Нужно ещё ' + f1(price - state.ton), 'bad'); return; }
  state.ton -= price;
  state.stats.spent += price;
  state.stats.deals++;
  state.inventory.push({ uid: 'i' + uidSeq(), gid: l.gid, bought: price });
  state.market = state.market.filter(x => x.rid !== rid);
  if (c) {
    c.done = true;
    c.statusLine = 'сделка закрыта 🔒';
    msg(c, 'bot', rnd(PH.bought));
  }
  if (currentChat === key) renderChat(key);
  toast('Куплено: ' + shortGift(l.gid) + ' за ' + f1(price) + ' TON', 'good');
  save(); renderAll();
}

function openPersonChat(pid) {
  const pd = state.people.find(p => p.pid === pid);
  if (!pd) return;
  const key = 'person:' + pid;
  const c = getChat(key, () => ({
    kind: 'person', pid: pid, quote: null, statusLine: 'дружба ' + pd.friendship + '%',
    unread: 0, messages: [], refPrice: 0, ref0: 0, acceptK: 0, insult: 0, discountUsed: false
  }));
  if (c.messages.length === 0) {
    msg(c, 'sys', 'Открыт чат с коллекционером. Спроси про подарок или подари что-нибудь.');
    msg(c, 'bot', pd.line);
  }
  c.unread = 0;
  openChat(key);
}

function personQuote(c, uid) {
  const pd = state.people.find(p => p.pid === c.pid);
  if (!pd) return;
  const item = pd.gifts.find(g => g.uid === uid);
  if (!item) return;
  const g = giftById(item.gid);
  const disc = 1 - (pd.friendship || 0) / 320;
  const jitter = 1.05 + Math.random() * 0.45;
  const price = f1(Math.max(0.5, g.base * state.trend * jitter * disc));
  c.quote = { uid: uid, price: price, ready: false };
  c.refPrice = price;
  c.ref0 = price;
  c.acceptK = 1 - 0.3 * (1 - pd.greed);
  c.insult = 0;
  c.statusLine = 'продаёт ' + g.name + ' ' + g.emoji;
  msg(c, 'bot', rnd(PH.giftAsk).replace('{p}', price));
  if (currentChat === c.key) renderChat(c.key);
}

function personBuyFromQuote(c) {
  const pd = state.people.find(p => p.pid === c.pid);
  if (!pd || !c.quote) return;
  const price = c.quote.price;
  if (state.ton < price) { toast('Не хватает TON!', 'bad'); return; }
  const idx = pd.gifts.findIndex(g => g.uid === c.quote.uid);
  if (idx === -1) return;
  const item = pd.gifts.splice(idx, 1)[0];
  state.ton -= price;
  state.stats.spent += price;
  state.stats.deals++;
  pd.friendship = clamp((pd.friendship || 0) + 5, 0, 100);
  state.inventory.push({ uid: 'i' + uidSeq(), gid: item.gid, bought: price });
  c.quote = null;
  c.statusLine = 'дружба ' + pd.friendship + '%';
  msg(c, 'bot', rnd(PH.bought));
  toast('Куплен подарок у ' + pd.name + ': ' + shortGift(item.gid), 'good');
  save(); renderAll();
  if (currentChat === c.key) renderChat(c.key);
}

function personHaggle(c, offer) {
  const pd = state.people.find(p => p.pid === c.pid);
  if (!pd || !c.quote) return;
  const item = pd.gifts.find(g => g.uid === c.quote.uid);
  if (!item) { c.quote = null; return; }
  const r = botHaggle(c, offer);
  if (r.type === 'accept') {
    c.quote.price = r.price;
    c.quote.ready = true;
    msg(c, 'bot', rnd(PH.accept).replace('{p}', r.price));
  } else if (r.type === 'counter') {
    c.quote.price = r.price;
    msg(c, 'bot', rnd(PH.counter).replace('{p}', r.price));
  } else if (r.type === 'angry') {
    c.quote.price = r.price;
    msg(c, 'bot', rnd(PH.angry).replace('{p}', r.price));
  } else {
    c.quote.price = r.price;
    msg(c, 'bot', rnd(PH.refuse));
  }
  save();
  if (currentChat === c.key) renderChat(c.key);
}

function personGive(c, itemUid) {
  const pd = state.people.find(p => p.pid === c.pid);
  if (!pd) return;
  if (!itemUid) {
    msg(c, 'bot', 'У тебя нет подарков, чтобы дарить 🙂');
    if (currentChat === c.key) renderChat(c.key);
    return;
  }
  const idx = state.inventory.findIndex(i => i.uid === itemUid);
  if (idx === -1) return;
  const item = state.inventory.splice(idx, 1)[0];
  const g = giftById(item.gid);
  const before = pd.friendship || 0;
  pd.friendship = clamp(before + RARITY_FRIEND[g.rarity], 0, 100);
  pd.gifts.push({ uid: 'pg' + uidSeq(), gid: item.gid });
  state.stats.giftsGiven++;
  c.statusLine = 'дружба ' + pd.friendship + '%';
  if (currentChat === c.key) renderChat(c.key);
  botSay(c, rnd(PH.giftGot) + ' (+дружба)', () => {
    if (pd.friendship >= 60 && Math.random() < 0.55) personGiftBack(c.pid);
    save(); renderAll();
  });
}

function personGiftBack(pid) {
  const pd = state.people.find(p => p.pid === pid);
  if (!pd || pd.gifts.length === 0) return;
  const idx = Math.floor(Math.random() * pd.gifts.length);
  const item = pd.gifts.splice(idx, 1)[0];
  state.inventory.push({ uid: 'i' + uidSeq(), gid: item.gid, bought: 0 });
  state.stats.giftsReceived++;
  const key = 'person:' + pid;
  const c = getChat(key, () => ({
    kind: 'person', pid: pid, quote: null, statusLine: 'дружба ' + pd.friendship + '%',
    unread: 0, messages: [], refPrice: 0, ref0: 0, acceptK: 0, insult: 0
  }));
  msg(c, 'bot', 'Держи ответный подарок: ' + shortGift(item.gid) + ' 🎁');
  toast(pd.name + ' подарил тебе ' + shortGift(item.gid) + '!', 'good');
  save();
  refreshBadges();
  if (currentChat === key) renderChat(key);
  else if (currentTab === 'gifts' || currentTab === 'inv') renderAll();
}

function openLeadChat(lid) {
  const lead = state.myList.find(x => x.lid === lid && x.lead);
  if (!lead) return;
  const key = 'lead:' + lid;
  const c = getChat(key, () => ({ kind: 'lead', lid: lid, done: false, statusLine: '', unread: 0, messages: [] }));
  c.statusLine = 'предлагает ' + f1(lead.lead.offer) + ' TON';
  c.unread = 0;
  openChat(key);
}

function leadAccept(c) {
  const lead = state.myList.find(x => x.lid === c.lid && x.lead);
  if (!lead) return;
  const gain = f1(lead.lead.offer * 0.95);
  state.ton += gain;
  state.stats.earned += lead.lead.offer;
  state.stats.deals++;
  state.myList = state.myList.filter(x => x.lid !== c.lid);
  state.market.push({ rid: 'r' + uidSeq(), gid: lead.gid, price: f1(lead.lead.offer * 1.15), ref0: f1(lead.lead.offer * 1.15), acceptK: 0.8 });
  c.done = true;
  c.statusLine = 'продано ✅';
  msg(c, 'bot', rnd(PH.soldMe));
  toast('Продано за ' + f1(lead.lead.offer) + ' TON (−5% комиссия)', 'good');
  save(); renderAll();
  if (currentChat === c.key) renderChat(c.key);
}

function leadCounter(c, price) {
  const lead = state.myList.find(x => x.lid === c.lid && x.lead);
  if (!lead || !lead.lead) return;
  const m = lead.lead.max;
  if (price <= m) {
    lead.lead.offer = f1(price);
    c.statusLine = 'согласен на ' + f1(price) + ' TON';
    msg(c, 'bot', rnd(PH.accept).replace('{p}', f1(price)));
    toast('Покупатель согласен на ' + f1(price) + ' TON. Жми «Принять»!', 'good');
  } else if (price <= m * 1.2) {
    lead.lead.offer = f1(m);
    c.statusLine = 'максимум ' + f1(m) + ' TON';
    msg(c, 'bot', 'Больше не потяну. Максимум — ' + f1(m) + ' TON.');
  } else {
    msg(c, 'bot', rnd(PH.tooLowSell));
    lead.lead.walked = true;
    c.statusLine = 'ушёл 😤';
  }
  save();
  refreshBadges();
  if (currentChat === c.key) renderChat(c.key);
}

function leadDecline(c) {
  const lead = state.myList.find(x => x.lid === c.lid);
  if (lead && lead.lead) lead.lead = null;
  delete state.chats['lead:' + c.lid];
  toast('Покупатель ушёл. Лот снова ждёт предложений.', '');
  save(); closeChat();
}

function listMyItem(uid, price) {
  const idx = state.inventory.findIndex(i => i.uid === uid);
  if (idx === -1) return;
  if (isNaN(price) || price <= 0) { toast('Введи корректную цену', 'bad'); return; }
  const item = state.inventory.splice(idx, 1)[0];
  state.myList.push({ lid: 'l' + uidSeq(), gid: item.gid, uid: item.uid, price: f1(price), bought: item.bought || 0, lead: null });
  toast('Выставлено: ' + shortGift(item.gid) + ' за ' + f1(price) + ' TON', 'good');
  save(); renderAll();
}

function instantSell(uid) {
  const idx = state.inventory.findIndex(i => i.uid === uid);
  if (idx === -1) return;
  const item = state.inventory.splice(idx, 1)[0];
  const price = f1(marketValue(item.gid) * 0.7);
  state.ton += price;
  state.stats.earned += price;
  state.stats.deals++;
  toast('Быстрая продажа: ' + shortGift(item.gid) + ' за ' + f1(price) + ' TON (70%)', 'good');
  save(); renderAll();
}

function takeMyListingOff(lid) {
  const l = state.myList.find(x => x.lid === lid);
  if (!l) return;
  state.inventory.push({ uid: 'i' + uidSeq(), gid: l.gid, bought: l.bought });
  state.myList = state.myList.filter(x => x.lid !== lid);
  delete state.chats['lead:' + lid];
  toast('Снято с продажи: ' + shortGift(l.gid), '');
  save(); renderAll();
}

function claimBonus() {
  const need = 60000;
  const now = Date.now();
  const left = need - (now - (state.lastBonus || 0));
  if (state.lastBonus && left > 0) { toast('Бонус через ' + Math.ceil(left / 1000) + ' сек', ''); return; }
  state.lastBonus = now;
  state.ton += 4;
  toast('Бонус +4 TON получен! 🎁', 'good');
  save(); renderAll();
}

function gidOfLead(c) {
  const l = state.myList.find(x => x.lid === c.lid);
  return l ? l.gid : 'rocket';
}

function sendChatText() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text || !currentChat) return;
  input.value = '';
  const c = state.chats[currentChat];
  if (!c) return;
  msg(c, 'me', text);
  if (currentChat === c.key) renderChat(c.key);
  const numMatch = text.match(/(\d+(?:[.,]\d+)?)/);
  const num = numMatch ? parseFloat(numMatch[1].replace(',', '.')) : null;
  if (c.kind === 'seller' || c.kind === 'person') {
    if (num !== null) {
      if (c.kind === 'seller') sellerOffer(c, num);
      else if (c.quote) personHaggle(c, num);
      else botSay(c, 'Сначала спроси про конкретный подарок 👇');
    } else if (/привет|здравств|хай|ку\b/i.test(text)) {
      botSay(c, rnd(PH.greet));
    } else if (/дорого|скидк|скинь|дешевле/i.test(text) && !c.discountUsed) {
      c.discountUsed = true;
      if (c.kind === 'seller') {
        const l = state.market.find(x => x.rid === c.rid);
        if (l) {
          c.refPrice = f1(Math.max(c.ref0 * c.acceptK, c.refPrice * 0.93));
          l.price = c.refPrice;
          botSay(c, rnd(PH.cheap) + ' Могу за ' + c.refPrice + ' TON.');
          save();
          return;
        }
      }
      botSay(c, rnd(PH.cheap));
    } else if (/спасиб|благодар/i.test(text)) {
      botSay(c, rnd(PH.thanks));
    } else {
      botSay(c, rnd(['Не понял 🤔 Напиши сумму в TON.', 'Давай по делу — сколько дашь?']));
    }
  } else if (c.kind === 'lead') {
    if (/да|бери|ладно|ок\b|согласен/i.test(text)) {
      botSay(c, 'Тогда жми зелёную кнопку вверху 🙂');
    } else if (num !== null) {
      botSay(c, '', () => leadCounter(c, num));
    } else {
      botSay(c, 'Напиши сумму, которую хочешь за ' + shortGift(gidOfLead(c)) + '.');
    }
  }
  save();
  refreshBadges();
}

function fakeOffer(c, amount) {
  msg(c, 'me', 'Дам ' + amount + ' TON. Как смотришь?');
  if (currentChat === c.key) setTimeout(() => renderChat(c.key), 40);
  setTimeout(() => {
    if (c.kind === 'seller') sellerOffer(c, amount);
    else personHaggle(c, amount);
  }, 30);
}

function fakeCounter(c, amount) {
  msg(c, 'me', 'Дай ' + amount + ' TON — и по рукам.');
  if (currentChat === c.key) setTimeout(() => renderChat(c.key), 40);
  botSay(c, '', () => leadCounter(c, amount));
}

function renderChat(key) {
  const c = state.chats[key];
  if (!c) return;
  const body = document.getElementById('chatBody');
  const actions = document.getElementById('chatActions');
  const hint = document.getElementById('chatHint');
  let avatar = '💬', name = 'Чат';
  if (c.kind === 'seller') {
    const l = state.market.find(x => x.rid === c.rid);
    const p = personaFor(c.rid);
    avatar = p.emoji; name = p.name;
    hint.textContent = l ? 'тек. цена: ' + f1(l.price) + ' TON' : 'товар продан';
  } else if (c.kind === 'person') {
    const pd = state.people.find(p => p.pid === c.pid);
    avatar = pd ? pd.emoji : '🙂'; name = pd ? pd.name : 'Коллекционер';
    hint.textContent = pd ? 'дружба ' + pd.friendship + '%' : '';
  } else if (c.kind === 'lead') {
    const lead = state.myList.find(x => x.lid === c.lid && x.lead);
    avatar = lead ? lead.lead.buyer.emoji : '🤖'; name = lead ? lead.lead.buyer.name : 'Покупатель';
    hint.textContent = lead ? 'твоё: ' + shortGift(lead.gid) : 'продано';
  }
  document.getElementById('chatAvatar').textContent = avatar;
  document.getElementById('chatName').textContent = name;
  setStatus(c.statusLine || 'онлайн');

  body.innerHTML = '';
  c.messages.forEach(m => {
    const el = document.createElement('div');
    el.className = 'msg ' + m.who;
    el.textContent = m.text;
    body.appendChild(el);
  });
  body.scrollTop = body.scrollHeight;

  actions.innerHTML = '';
  if (c.kind === 'seller' && !c.done) {
    const l = state.market.find(x => x.rid === c.rid);
    if (l) {
      const bBuy = document.createElement('button');
      bBuy.className = 'green';
      bBuy.textContent = 'Купить за ' + f1(l.price) + ' TON';
      bBuy.onclick = () => buyMarket(c.rid, null);
      actions.appendChild(bBuy);
      const half = f1(Math.max(l.ref0 * c.acceptK, l.price * 0.75));
      const bHalf = document.createElement('button');
      bHalf.textContent = 'Предложить ' + half + ' TON';
      bHalf.onclick = () => fakeOffer(c, half);
      actions.appendChild(bHalf);
      const bAsk = document.createElement('button');
      bAsk.className = 'gold';
      bAsk.textContent = 'Насколько уступишь?';
      bAsk.onclick = () => {
        msg(c, 'me', 'Насколько уступишь?');
        botSay(c, rnd(PH.askPrice).replace('{p}', f1(l.price)));
        if (currentChat === c.key) setTimeout(() => renderChat(c.key), 50);
      };
      actions.appendChild(bAsk);
    }
  }
  if (c.kind === 'person') {
    const pd = state.people.find(p => p.pid === c.pid);
    if (pd) {
      if (c.quote) {
        const bBuy = document.createElement('button');
        bBuy.className = c.quote.ready ? 'green' : '';
        bBuy.textContent = 'Купить за ' + f1(c.quote.price) + ' TON';
        bBuy.onclick = () => personBuyFromQuote(c);
        actions.appendChild(bBuy);
        const half = f1(Math.max(c.ref0 * c.acceptK, c.quote.price * 0.75));
        const bOffer = document.createElement('button');
        bOffer.textContent = 'Предложить ' + half + ' TON';
        bOffer.onclick = () => fakeOffer(c, half);
        actions.appendChild(bOffer);
      } else {
        pd.gifts.forEach(g => {
          const b = document.createElement('button');
          b.className = 'gold';
          b.textContent = 'Спросить про ' + shortGift(g.gid);
          b.onclick = () => {
            msg(c, 'me', 'Продашь ' + shortGift(g.gid) + '?');
            if (currentChat === c.key) setTimeout(() => renderChat(c.key), 50);
            botSay(c, '', () => personQuote(c, g.uid));
          };
          actions.appendChild(b);
        });
      }
      const bGive = document.createElement('button');
      bGive.textContent = '🎁 Подарить';
      bGive.onclick = () => {
        msg(c, 'me', '🎁 Держи подарок!');
        if (currentChat === c.key) renderChat(c.key);
        botSay(c, '', () => personGive(c, state.inventory[0] ? state.inventory[0].uid : null));
      };
      actions.appendChild(bGive);
    }
  }
  if (c.kind === 'lead') {
    const lead = state.myList.find(x => x.lid === c.lid && x.lead);
    if (lead && !c.done && !lead.lead.walked) {
      const bOk = document.createElement('button');
      bOk.className = 'green';
      bOk.textContent = 'Принять ' + f1(lead.lead.offer) + ' TON';
      bOk.onclick = () => leadAccept(c);
      actions.appendChild(bOk);
      const cnt = f1(Math.max(lead.lead.offer * 1.12, lead.lead.offer + 1));
      const bCnt = document.createElement('button');
      bCnt.textContent = 'Контр: ' + cnt + ' TON';
      bCnt.onclick = () => fakeCounter(c, cnt);
      actions.appendChild(bCnt);
      const bNo = document.createElement('button');
      bNo.className = 'red';
      bNo.textContent = 'Отказать';
      bNo.onclick = () => { msg(c, 'me', 'Нет, не интересно.'); leadDecline(c); };
      actions.appendChild(bNo);
    }
  }
  const input = document.getElementById('chatInput');
  input.placeholder = (c.kind === 'lead') ? 'Ответь суммой в TON…' : 'Сообщение или сумма в TON…';
}

function openChat(key) {
  currentChat = key;
  const c = state.chats[key];
  if (!c) return;
  c.key = key;
  c.unread = 0;
  document.getElementById('chatModal').classList.remove('hidden');
  renderChat(key);
  refreshBadges();
  save();
}

function closeChat() {
  currentChat = null;
  document.getElementById('chatModal').classList.add('hidden');
  renderAll();
}

function renderMarket() {
  const v = document.getElementById('view');
  let html = '<h2 class="section">🔥 Лоты рынка (' + state.market.length + ') · тренд ' + (state.trend >= 1 ? '📈' : '📉') + '</h2>';
  if (!state.market.length) html += '<div class="empty"><span class="big">🛒</span>Маркет пуст. Скоро появятся новые лоты!</div>';
  html += '<div class="grid">';
  state.market.forEach(l => {
    const g = giftById(l.gid);
    const p = personaFor(l.rid);
    const cheap = l.price < g.base * state.trend * 0.95;
    html += '<div class="card">' +
      '<div class="gift-emoji">' + g.emoji + '</div>' +
      '<div class="gift-name">' + g.name + '</div>' +
      '<span class="rarity r-' + g.rarity + '">' + RARITY_LABEL[g.rarity] + '</span>' +
      '<div class="price-line ' + (cheap ? 'drop' : '') + '">' + f1(l.price) + ' <span class="ton-ico">TON</span></div>' +
      '<div class="seller-line">' + p.emoji + ' ' + p.name + '</div>' +
      '<div class="btn-row">' +
      '<button class="act chat" onclick="openSellerChat(\'' + l.rid + '\')">💬 Торг</button>' +
      '<button class="act buy" onclick="buyMarket(\'' + l.rid + '\')">Купить</button>' +
      '</div></div>';
  });
  html += '</div>';
  v.innerHTML = html;
}

function renderGifts() {
  const v = document.getElementById('view');
  let html = '<h2 class="section">🎁 Подарки людей</h2>';
  html += '<p class="seller-line" style="margin-bottom:10px">Нажми на человека — откроется чат: спрашивай про его подарок, торгуйся или дари свой ради дружбы (друзья делают скидки и дарят ответные подарки).</p>';
  if (!state.people.length) html += '<div class="empty"><span class="big">👀</span>Пока никого нет.</div>';
  state.people.forEach(pd => {
    const fr = pd.friendship || 0;
    html += '<div class="card person-card" style="margin-bottom:10px; cursor:pointer" onclick="openPersonChat(\'' + pd.pid + '\')">' +
      '<div class="person-ava">' + pd.emoji + '</div>' +
      '<div class="person-info">' +
      '<div class="person-name">' + pd.name + '</div>' +
      '<div class="person-items">' + (pd.gifts.map(g => giftById(g.gid).emoji + ' ' + giftById(g.gid).name).join(', ') || 'подарков нет') + '</div>' +
      '<div class="f-bar"><div class="f-fill" style="width:' + fr + '%"></div></div>' +
      '<div class="f-label">дружба ' + fr + '%' + (fr >= 60 ? ' 🤝' : '') + '</div>' +
      '</div><span style="color:#2ea6ff;font-size:20px">›</span></div>';
  });
  v.innerHTML = html;
}

function renderSales() {
  const v = document.getElementById('view');
  let html = '<h2 class="section">🏷 Мои продажи</h2>';
  html += '<div class="form-row"><input id="sellPrice" type="number" min="0.1" step="0.1" placeholder="Цена в TON для выставления"></div>';
  if (!state.myList.length) html += '<div class="empty"><span class="big">🏷</span>Ничего не выставлено. Зайди во вкладку «Мои» и выставь подарок — покупатели сами напишут в чат!</div>';
  state.myList.forEach(l => {
    const g = giftById(l.gid);
    const leadLine = (l.lead ? '<div class="inv-sub" style="color:' + (l.lead.walked ? '#ff7b72' : '#57d98a') + '">' + l.lead.buyer.emoji + ' ' + l.lead.buyer.name + ' предлагает ' + f1(l.lead.offer) + ' TON' + (l.lead.walked ? ' (уходит)' : '') + '</div>' : '');
    html += '<div class="listing-block">' +
      '<div class="lb-top"><div class="inv-emoji">' + g.emoji + '</div><div class="lb-main">' +
      '<div class="inv-name">' + g.name + ' <span class="rarity r-' + g.rarity + '">' + RARITY_LABEL[g.rarity] + '</span></div>' +
      '<div class="inv-sub">цена: ' + f1(l.price) + ' TON · куплен за ' + f1(l.bought) + ' TON</div>' +
      leadLine + '</div></div>' +
      '<div class="lb-actions">' +
      (l.lead && !l.lead.walked ? '<button class="act chat" onclick="openLeadChat(\'' + l.lid + '\')">💬 Чат с покупателем</button>' : '') +
      '<button class="act warn" onclick="takeMyListingOff(\'' + l.lid + '\')">Снять</button>' +
      '</div></div>';
  });
  html += '<h2 class="section" style="margin-top:16px">💰 Касса</h2><div class="stat-grid">' +
    '<div class="stat"><div class="v pos">' + f1(state.stats.earned) + '</div><div class="k">заработано, TON</div></div>' +
    '<div class="stat"><div class="v neg">' + f1(state.stats.spent) + '</div><div class="k">потрачено, TON</div></div>' +
    '</div>';
  v.innerHTML = html;
}

function renderChats() {
  const v = document.getElementById('view');
  const keys = Object.keys(state.chats);
  let html = '<h2 class="section">💬 Чаты (' + keys.length + ')</h2>';
  if (!keys.length) html += '<div class="empty"><span class="big">💬</span>Чатов нет. Открой лот на маркете или человека на вкладке «Подарки» — и начни торговлю в чате!</div>';
  keys.sort((a, b) => {
    const ca = state.chats[a], cb = state.chats[b];
    const ta = ca.messages.length ? ca.messages[ca.messages.length - 1].t : 0;
    const tb = cb.messages.length ? cb.messages[cb.messages.length - 1].t : 0;
    return tb - ta;
  });
  keys.forEach(key => {
    const c = state.chats[key];
    const last = c.messages[c.messages.length - 1];
    let avatar = '💬', name = 'Чат';
    if (c.kind === 'seller') {
      const l = state.market.find(x => x.rid === c.rid);
      const p = personaFor(c.rid);
      avatar = p.emoji; name = p.name + (l ? '' : ' • сделка закрыта');
    } else if (c.kind === 'person') {
      const pd = state.people.find(p => p.pid === c.pid);
      avatar = pd ? pd.emoji : '🙂'; name = pd ? pd.name : 'Коллекционер';
    } else if (c.kind === 'lead') {
      const lead = state.myList.find(x => x.lid === c.lid && x.lead);
      avatar = lead ? lead.lead.buyer.emoji : '🤖'; name = lead ? lead.lead.buyer.name : 'Покупатель • закрыто';
    }
    html += '<div class="inv-item" style="cursor:pointer" onclick="openChat(\'' + key + '\')">' +
      '<div class="inv-emoji">' + avatar + '</div>' +
      '<div class="inv-main"><div class="inv-name">' + name + '</div>' +
      '<div class="inv-sub">' + (last ? (last.who === 'me' ? 'Ты: ' : '') + String(last.text).slice(0, 64) : 'нет сообщений') + '</div></div>' +
      (c.unread ? '<span class="badge" style="position:static">' + c.unread + '</span>' : '') +
      '</div>';
  });
  v.innerHTML = html;
}

function renderInv() {
  const v = document.getElementById('view');
  let html = '<h2 class="section">🎒 Мои подарки (' + state.inventory.length + ')</h2>';
  if (!state.inventory.length) html += '<div class="empty"><span class="big">🎒</span>Пока пусто. Купи первый подарок на маркете!</div>';
  state.inventory.forEach(i => {
    const g = giftById(i.gid);
    const profit = marketValue(i.gid) - (i.bought || 0);
    html += '<div class="inv-item">' +
      '<div class="inv-emoji">' + g.emoji + '</div>' +
      '<div class="inv-main"><div class="inv-name">' + g.name + ' <span class="rarity r-' + g.rarity + '">' + RARITY_LABEL[g.rarity] + '</span></div>' +
      '<div class="inv-sub">рынок: ' + marketValue(i.gid) + ' TON · P/L: <span style="color:' + (profit >= 0 ? '#57d98a' : '#ff7b72') + '">' + (profit >= 0 ? '+' : '') + f1(profit) + '</span></div></div>' +
      '<div class="btn-row" style="max-width:190px">' +
      '<button class="act chat" onclick="promptSell(\'' + i.uid + '\')">Выставить</button>' +
      '<button class="act warn" onclick="instantSell(\'' + i.uid + '\')">Скупка</button>' +
      '</div></div>';
  });
  const cap = state.ton + state.inventory.reduce((s, i) => s + marketValue(i.gid), 0);
  html += '<h2 class="section" style="margin-top:16px">📊 Статистика</h2><div class="stat-grid">' +
    '<div class="stat"><div class="v">' + state.stats.deals + '</div><div class="k">сделок</div></div>' +
    '<div class="stat"><div class="v">' + f1(cap) + '</div><div class="k">весь капитал, TON</div></div>' +
    '<div class="stat"><div class="v ' + (state.stats.earned - state.stats.spent >= 0 ? 'pos' : 'neg') + '">' + f1(state.stats.earned - state.stats.spent) + '</div><div class="k">профит, TON</div></div>' +
    '<div class="stat"><div class="v">' + state.stats.giftsGiven + ' / ' + state.stats.giftsReceived + '</div><div class="k">подарков отдал / получил</div></div>' +
    '</div>' +
    '<p class="seller-line" style="margin-top:12px">«Скупка» — мгновенная продажа за 70% рыночной цены. «Выставить» — цена берётся из поля на вкладке «Продажи».</p>';
  v.innerHTML = html;
}

function promptSell(uid) {
  const input = document.getElementById('sellPrice');
  const val = input ? parseFloat(input.value) : NaN;
  if (isNaN(val) || val <= 0) {
    toast('Сначала укажи цену в поле на вкладке «Продажи»', 'bad');
    switchTab('sales');
    return;
  }
  listMyItem(uid, val);
}

function setBadge(tab, n) {
  const el = document.getElementById('badge-' + tab);
  if (!el) return;
  if (n > 0) { el.textContent = n; el.classList.remove('hidden'); }
  else el.classList.add('hidden');
}

function refreshBadges() {
  const chatsUnread = Object.values(state.chats).reduce((s, c) => s + (c.unread || 0), 0);
  const salesUnread = state.myList.filter(l => l.lead && !l.lead.walked).length;
  setBadge('chats', chatsUnread);
  setBadge('sales', salesUnread);
  setBadge('market', 0);
  setBadge('gifts', 0);
  setBadge('inv', 0);
}

function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.tab').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  if (tab === 'market') renderMarket();
  if (tab === 'gifts') renderGifts();
  if (tab === 'sales') renderSales();
  if (tab === 'chats') renderChats();
  if (tab === 'inv') renderInv();
  window.scrollTo(0, 0);
}

function updateHeader() {
  document.getElementById('tonValue').textContent = f1(state.ton);
  document.getElementById('levelLine').textContent = 'LVL ' + levelInfo().lvl + ' · ' + levelInfo().name;
  const t = state.trend;
  const tv = document.getElementById('trendValue');
  tv.textContent = (t >= 1 ? '📈 +' : '📉 ') + Math.round((t - 1) * 100) + '%';
  tv.style.color = t >= 1 ? '#57d98a' : '#ff7b72';
  document.getElementById('invValue').textContent = 'Инвентарь: ' + f1(state.inventory.reduce((s, i) => s + marketValue(i.gid), 0)) + ' TON';
}

function updateBonusBtn() {
  const left = 60000 - (Date.now() - (state.lastBonus || 0));
  const el = document.getElementById('bonusTimer');
  el.textContent = left > 0 ? Math.ceil(left / 1000) : '✓';
}

function renderAll() {
  updateHeader();
  switchTab(currentTab);
  refreshBadges();
  updateBonusBtn();
}

function tick() {
  state.tickN++;
  state.trend = clamp(state.trend + (Math.random() - 0.5) * 0.07, 0.75, 1.45);
  state.market.forEach(l => {
    l.price = f1(clamp(l.ref0 * clamp(state.trend, 0.8, 1.35) * (1 + Math.abs(Math.sin(l.rid.length + state.tickN / 40)) * 0.12), 0.3, 9999));
  });
  if (state.market.length < 9 && Math.random() < 0.5) state.market.push(genListing());
  if (state.market.length > 3 && Math.random() < 0.15) state.market.splice(Math.floor(Math.random() * state.market.length), 1);
  state.myList.forEach(l => {
    if (!l.lead && Math.random() < 0.10) {
      const b = rnd(BUYER_NAMES);
      const wobble = 0.6 + Math.random() * 0.5;
      const offer = f1(Math.max(0.5, l.price * wobble));
      l.lead = { offer: offer, max: f1(Math.max(offer, l.price * (1.0 + Math.random() * 0.25))), buyer: b, walked: false };
      const key = 'lead:' + l.lid;
      const c = getChat(key, () => ({ kind: 'lead', lid: l.lid, done: false, statusLine: '', unread: 0, messages: [] }));
      c.statusLine = 'предлагает ' + f1(offer) + ' TON';
      msg(c, 'bot', 'Привет! Хочу купить ' + shortGift(l.gid) + '. Дам ' + f1(offer) + ' TON. По рукам?');
      if (currentChat === key) renderChat(key);
      toast(b.name + ' хочет купить ' + shortGift(l.gid) + ' за ' + f1(offer) + ' TON 💬', '');
    }
  });
  if (Math.random() < 0.05) {
    const candidates = state.people.filter(p => (p.friendship || 0) >= 45 && p.gifts.length > 0);
    if (candidates.length) personGiftBack(rnd(candidates).pid);
  }
  save();
  refreshBadges();
  if (currentTab === 'market') renderMarket();
  if (currentTab === 'sales') renderSales();
  if (currentTab === 'gifts') renderGifts();
  if (currentTab === 'inv') renderInv();
  updateHeader();
  updateBonusBtn();
}

function resetGame() {
  state = defaultState();
  currentChat = null;
  document.getElementById('chatModal').classList.add('hidden');
  save();
  toast('Новая игра! Стартовый капитал: 25 TON 🚀', 'good');
  renderAll();
}

function initReset() {
  const val = prompt('Напиши СБРОС, чтобы начать заново:');
  if (val === 'СБРОС') resetGame();
}

window.openSellerChat = openSellerChat;
window.openPersonChat = openPersonChat;
window.openLeadChat = openLeadChat;
window.openChat = openChat;
window.buyMarket = buyMarket;
window.instantSell = instantSell;
window.promptSell = promptSell;
window.takeMyListingOff = takeMyListingOff;
window.switchTab = switchTab;

function bind() {
  document.querySelectorAll('.tab').forEach(b => b.addEventListener('click', () => switchTab(b.dataset.tab)));
  document.getElementById('bonusBtn').addEventListener('click', claimBonus);
  document.getElementById('bonusBtn').addEventListener('dblclick', initReset);
  document.getElementById('chatClose').addEventListener('click', closeChat);
  document.getElementById('chatSend').addEventListener('click', sendChatText);
  document.getElementById('chatInput').addEventListener('keydown', e => { if (e.key === 'Enter') sendChatText(); });
}

function boot() {
  state = load();
  if (!state) { state = defaultState(); save(); toast('Добро пожаловать! Твой старт: 25 TON 🚀', 'good'); }
  bind();
  renderAll();
  setInterval(tick, 5000);
}

boot();
