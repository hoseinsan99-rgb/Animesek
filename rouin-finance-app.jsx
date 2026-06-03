import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── THEME ────────────────────────────────────────────────────────────────────
const C = {
  navy: "#080F1E", navyMid: "#0C1830", navyCard: "#101E38",
  emerald: "#00C896", emeraldDark: "#009E78", emeraldGlow: "rgba(0,200,150,0.18)",
  white: "#FFFFFF", slate: "#7A8FAF", slateL: "#A8BCDA",
  border: "rgba(255,255,255,0.07)", card: "rgba(255,255,255,0.035)",
  red: "#FF4F61", orange: "#FF9224", purple: "#845EF7", blue: "#3B82F6", yellow: "#FBBF24",
};

// ─── 20 LANGUAGES GUIDE DATA ──────────────────────────────────────────────────
const LANGUAGES = [
  { lang: "English", flag: "🇬🇧", title: "How to Use ROUIN", steps: [
    { icon: "🏠", t: "Dashboard", d: "See your total balance, income, expenses & goals at a glance." },
    { icon: "↕️", t: "Transactions", d: "Tap ＋ to add income or expense. Tap Edit/Del to modify." },
    { icon: "◎", t: "Budgets", d: "Set monthly limits per category. Get alerts at 75% & 90%." },
    { icon: "◈", t: "Goals", d: "Create savings goals with target amount & deadline." },
    { icon: "✦", t: "AI Advisor", d: "Ask AI anything — it can add/edit/delete your data for you!" },
  ]},
  { lang: "العربية", flag: "🇸🇦", title: "كيفية استخدام ROUIN", steps: [
    { icon: "🏠", t: "لوحة التحكم", d: "عرض رصيدك الكلي والدخل والمصاريف والأهداف دفعة واحدة." },
    { icon: "↕️", t: "المعاملات", d: "اضغط ＋ لإضافة دخل أو مصروف. اضغط تعديل/حذف للتغيير." },
    { icon: "◎", t: "الميزانيات", d: "ضع حدوداً شهرية لكل فئة. تنبيهات عند 75٪ و90٪." },
    { icon: "◈", t: "الأهداف", d: "أنشئ أهداف ادخار بمبلغ مستهدف وتاريخ انتهاء." },
    { icon: "✦", t: "المساعد الذكي", d: "اسأل الذكاء الاصطناعي أي شيء — يستطيع إضافة/تعديل/حذف بياناتك!" },
  ]},
  { lang: "Soomaali", flag: "🇸🇴", title: "Sida loo Isticmaalo ROUIN", steps: [
    { icon: "🏠", t: "Shashada Hore", d: "Eeg dheefta, dakhliga, kharashaadka iyo yoolalka." },
    { icon: "↕️", t: "Macaamilada", d: "Riix ＋ si aad u darto dakhli ama kharash. Tafatir/tirtir." },
    { icon: "◎", t: "Miisaaniyada", d: "Geli xadka bishiilaha ee nooc kasta. Digniinaha 75% & 90%." },
    { icon: "◈", t: "Yoolalka", d: "Samee yoolal kaydinta oo leh lacag la bartilmaameedsanayo." },
    { icon: "✦", t: "Kaaliyaha AI", d: "Weydii AI wax kastoo — waxa uu geli/tafatiri/tirtiri kartaa." },
  ]},
  { lang: "Français", flag: "🇫🇷", title: "Comment utiliser ROUIN", steps: [
    { icon: "🏠", t: "Tableau de bord", d: "Voyez solde, revenus, dépenses et objectifs en un coup d'œil." },
    { icon: "↕️", t: "Transactions", d: "Appuyez ＋ pour ajouter revenu/dépense. Modifier ou supprimer." },
    { icon: "◎", t: "Budgets", d: "Définissez des limites mensuelles par catégorie. Alertes 75%/90%." },
    { icon: "◈", t: "Objectifs", d: "Créez des objectifs d'épargne avec montant cible et date limite." },
    { icon: "✦", t: "Conseiller IA", d: "Demandez tout à l'IA — elle peut ajouter/modifier/supprimer vos données!" },
  ]},
  { lang: "Español", flag: "🇪🇸", title: "Cómo usar ROUIN", steps: [
    { icon: "🏠", t: "Panel principal", d: "Ve tu saldo, ingresos, gastos y metas de un vistazo." },
    { icon: "↕️", t: "Transacciones", d: "Toca ＋ para agregar ingreso/gasto. Editar o eliminar fácil." },
    { icon: "◎", t: "Presupuestos", d: "Establece límites mensuales por categoría. Alertas al 75%/90%." },
    { icon: "◈", t: "Metas", d: "Crea metas de ahorro con monto objetivo y fecha límite." },
    { icon: "✦", t: "Asesor IA", d: "Pregúntale al IA lo que sea — puede agregar/editar/eliminar tus datos." },
  ]},
  { lang: "Deutsch", flag: "🇩🇪", title: "So nutzen Sie ROUIN", steps: [
    { icon: "🏠", t: "Dashboard", d: "Sehen Sie Guthaben, Einnahmen, Ausgaben und Ziele auf einen Blick." },
    { icon: "↕️", t: "Transaktionen", d: "Tippen Sie ＋ um Einnahmen/Ausgaben hinzuzufügen. Bearbeiten/Löschen." },
    { icon: "◎", t: "Budgets", d: "Setzen Sie monatliche Limits pro Kategorie. Warnungen bei 75%/90%." },
    { icon: "◈", t: "Ziele", d: "Erstellen Sie Sparziele mit Zielbetrag und Fristdatum." },
    { icon: "✦", t: "KI-Berater", d: "Fragen Sie die KI alles — sie kann Ihre Daten hinzufügen/bearbeiten/löschen!" },
  ]},
  { lang: "中文", flag: "🇨🇳", title: "如何使用 ROUIN", steps: [
    { icon: "🏠", t: "仪表板", d: "一眼查看您的总余额、收入、支出和目标。" },
    { icon: "↕️", t: "交易记录", d: "点击 ＋ 添加收入或支出。点击编辑/删除进行修改。" },
    { icon: "◎", t: "预算", d: "为每个类别设置月度限额。在75%和90%时收到提醒。" },
    { icon: "◈", t: "储蓄目标", d: "创建带有目标金额和截止日期的储蓄目标。" },
    { icon: "✦", t: "AI顾问", d: "向AI询问任何问题——它可以为您添加/编辑/删除数据！" },
  ]},
  { lang: "हिन्दी", flag: "🇮🇳", title: "ROUIN का उपयोग कैसे करें", steps: [
    { icon: "🏠", t: "डैशबोर्ड", d: "अपना कुल बैलेंस, आय, खर्च और लक्ष्य एक नज़र में देखें।" },
    { icon: "↕️", t: "लेनदेन", d: "आय/खर्च जोड़ने के लिए ＋ दबाएं। संपादित/हटाएं।" },
    { icon: "◎", t: "बजट", d: "प्रत्येक श्रेणी के लिए मासिक सीमा निर्धारित करें। 75%/90% पर अलर्ट।" },
    { icon: "◈", t: "लक्ष्य", d: "लक्ष्य राशि और समयसीमा के साथ बचत लक्ष्य बनाएं।" },
    { icon: "✦", t: "AI सलाहकार", d: "AI से कुछ भी पूछें — वह आपका डेटा जोड़/संपादित/हटा सकता है!" },
  ]},
  { lang: "Português", flag: "🇧🇷", title: "Como usar o ROUIN", steps: [
    { icon: "🏠", t: "Painel", d: "Veja saldo, receitas, despesas e metas de um relance." },
    { icon: "↕️", t: "Transações", d: "Toque ＋ para adicionar receita/despesa. Editar ou excluir." },
    { icon: "◎", t: "Orçamentos", d: "Defina limites mensais por categoria. Alertas em 75%/90%." },
    { icon: "◈", t: "Metas", d: "Crie metas de poupança com valor alvo e prazo." },
    { icon: "✦", t: "Consultor IA", d: "Pergunte qualquer coisa à IA — ela pode adicionar/editar/excluir seus dados!" },
  ]},
  { lang: "Русский", flag: "🇷🇺", title: "Как использовать ROUIN", steps: [
    { icon: "🏠", t: "Панель", d: "Смотрите баланс, доходы, расходы и цели с первого взгляда." },
    { icon: "↕️", t: "Транзакции", d: "Нажмите ＋ чтобы добавить доход/расход. Редактировать/удалить." },
    { icon: "◎", t: "Бюджеты", d: "Установите ежемесячные лимиты по категориям. Оповещения 75%/90%." },
    { icon: "◈", t: "Цели", d: "Создайте цели накопления с суммой и сроком." },
    { icon: "✦", t: "ИИ советник", d: "Спросите ИИ что угодно — он может добавлять/редактировать/удалять данные!" },
  ]},
  { lang: "日本語", flag: "🇯🇵", title: "ROUINの使い方", steps: [
    { icon: "🏠", t: "ダッシュボード", d: "残高・収入・支出・目標を一目で確認。" },
    { icon: "↕️", t: "取引", d: "＋をタップして収入/支出を追加。編集・削除も簡単。" },
    { icon: "◎", t: "予算", d: "カテゴリ別に月次上限を設定。75%/90%でアラート。" },
    { icon: "◈", t: "目標", d: "目標金額と期限付きの貯蓄目標を作成。" },
    { icon: "✦", t: "AIアドバイザー", d: "AIに何でも聞いてください—データの追加/編集/削除が可能！" },
  ]},
  { lang: "한국어", flag: "🇰🇷", title: "ROUIN 사용 방법", steps: [
    { icon: "🏠", t: "대시보드", d: "잔액, 수입, 지출, 목표를 한눈에 확인하세요." },
    { icon: "↕️", t: "거래 내역", d: "＋를 눌러 수입/지출 추가. 편집/삭제도 가능." },
    { icon: "◎", t: "예산", d: "카테고리별 월 한도 설정. 75%/90%에서 알림." },
    { icon: "◈", t: "목표", d: "목표 금액과 기한으로 저축 목표 만들기." },
    { icon: "✦", t: "AI 어드바이저", d: "AI에게 무엇이든 물어보세요—데이터 추가/편집/삭제 가능!" },
  ]},
  { lang: "Türkçe", flag: "🇹🇷", title: "ROUIN Nasıl Kullanılır", steps: [
    { icon: "🏠", t: "Gösterge Paneli", d: "Bakiye, gelir, gider ve hedeflerinizi bir bakışta görün." },
    { icon: "↕️", t: "İşlemler", d: "Gelir/gider eklemek için ＋'ya dokunun. Düzenleyin/silin." },
    { icon: "◎", t: "Bütçeler", d: "Kategori başına aylık limitler belirleyin. %75/%90 uyarıları." },
    { icon: "◈", t: "Hedefler", d: "Hedef tutarı ve son tarihiyle tasarruf hedefleri oluşturun." },
    { icon: "✦", t: "AI Danışman", d: "AI'ya her şeyi sorun — verilerinizi ekleyebilir/düzenleyebilir/silebilir!" },
  ]},
  { lang: "Italiano", flag: "🇮🇹", title: "Come usare ROUIN", steps: [
    { icon: "🏠", t: "Dashboard", d: "Visualizza saldo, entrate, uscite e obiettivi in un colpo d'occhio." },
    { icon: "↕️", t: "Transazioni", d: "Premi ＋ per aggiungere entrate/uscite. Modifica o elimina." },
    { icon: "◎", t: "Budget", d: "Imposta limiti mensili per categoria. Avvisi al 75%/90%." },
    { icon: "◈", t: "Obiettivi", d: "Crea obiettivi di risparmio con importo e scadenza." },
    { icon: "✦", t: "Consulente IA", d: "Chiedi all'IA qualsiasi cosa — può aggiungere/modificare/eliminare i tuoi dati!" },
  ]},
  { lang: "Nederlands", flag: "🇳🇱", title: "Hoe ROUIN te gebruiken", steps: [
    { icon: "🏠", t: "Dashboard", d: "Zie saldo, inkomsten, uitgaven en doelen in één oogopslag." },
    { icon: "↕️", t: "Transacties", d: "Tik op ＋ om inkomen/uitgave toe te voegen. Bewerken/verwijderen." },
    { icon: "◎", t: "Budgetten", d: "Stel maandlimieten per categorie in. Waarschuwingen bij 75%/90%." },
    { icon: "◈", t: "Doelen", d: "Maak spaardoelen met doelbedrag en deadline." },
    { icon: "✦", t: "AI Adviseur", d: "Vraag de AI alles — het kan uw gegevens toevoegen/bewerken/verwijderen!" },
  ]},
  { lang: "Polski", flag: "🇵🇱", title: "Jak używać ROUIN", steps: [
    { icon: "🏠", t: "Panel", d: "Zobacz saldo, dochody, wydatki i cele na pierwszy rzut oka." },
    { icon: "↕️", t: "Transakcje", d: "Dotknij ＋ aby dodać dochód/wydatek. Edytuj lub usuń." },
    { icon: "◎", t: "Budżety", d: "Ustaw miesięczne limity dla kategorii. Alerty przy 75%/90%." },
    { icon: "◈", t: "Cele", d: "Twórz cele oszczędnościowe z docelową kwotą i terminem." },
    { icon: "✦", t: "Doradca AI", d: "Zapytaj AI o cokolwiek — może dodawać/edytować/usuwać dane!" },
  ]},
  { lang: "Svenska", flag: "🇸🇪", title: "Hur man använder ROUIN", steps: [
    { icon: "🏠", t: "Instrumentpanel", d: "Se saldo, inkomster, utgifter och mål på ett ögonblick." },
    { icon: "↕️", t: "Transaktioner", d: "Tryck ＋ för att lägga till inkomst/utgift. Redigera/ta bort." },
    { icon: "◎", t: "Budgetar", d: "Ange månadsgränser per kategori. Varningar vid 75%/90%." },
    { icon: "◈", t: "Mål", d: "Skapa sparmål med målbelopp och deadline." },
    { icon: "✦", t: "AI-rådgivare", d: "Fråga AI vad som helst — det kan lägga till/redigera/ta bort data!" },
  ]},
  { lang: "Bahasa", flag: "🇮🇩", title: "Cara Menggunakan ROUIN", steps: [
    { icon: "🏠", t: "Dasbor", d: "Lihat saldo, pendapatan, pengeluaran & tujuan sekilas." },
    { icon: "↕️", t: "Transaksi", d: "Ketuk ＋ untuk tambah pemasukan/pengeluaran. Edit/Hapus." },
    { icon: "◎", t: "Anggaran", d: "Tetapkan batas bulanan per kategori. Peringatan di 75%/90%." },
    { icon: "◈", t: "Tujuan", d: "Buat tujuan tabungan dengan target dan tenggat waktu." },
    { icon: "✦", t: "Penasihat AI", d: "Tanya AI apa saja — bisa tambah/edit/hapus data Anda!" },
  ]},
  { lang: "Kiswahili", flag: "🇰🇪", title: "Jinsi ya Kutumia ROUIN", steps: [
    { icon: "🏠", t: "Dashibodi", d: "Ona salio, mapato, matumizi na malengo yako mara moja." },
    { icon: "↕️", t: "Miamala", d: "Bonyeza ＋ kuongeza mapato/matumizi. Hariri au futa." },
    { icon: "◎", t: "Bajeti", d: "Weka mipaka ya kila mwezi kwa kila aina. Tahadhari 75%/90%." },
    { icon: "◈", t: "Malengo", d: "Unda malengo ya akiba na kiasi na tarehe ya mwisho." },
    { icon: "✦", t: "Mshauri wa AI", d: "Uliza AI chochote — anaweza kuongeza/kuhariri/kufuta data yako!" },
  ]},
  { lang: "Hausa", flag: "🇳🇬", title: "Yadda Ake Amfani da ROUIN", steps: [
    { icon: "🏠", t: "Allon Gida", d: "Duba ma'auni, kuɗin shiga, kashe-kashe da manufofi cikin sauri." },
    { icon: "↕️", t: "Ma'amaloli", d: "Danna ＋ don ƙara kuɗi/kashe-kashe. Shirya ko share." },
    { icon: "◎", t: "Kasafin Kuɗi", d: "Saita iyakoki na wata-wata. Gargaɗi a 75%/90%." },
    { icon: "◈", t: "Manufofi", d: "Ƙirƙiri manufofin ajiya da adadin da ake so da ƙarshen lokaci." },
    { icon: "✦", t: "Mataimaki AI", d: "Tambayi AI komai — zai iya ƙara/gyara/share bayananka!" },
  ]},
];

// ─── INITIAL DATA ─────────────────────────────────────────────────────────────
const initialTransactions = [
  { id: 1, type: "income",  category: "Salary",        amount: 5200, date: "2026-06-01", notes: "Monthly salary",       recurring: true  },
  { id: 2, type: "expense", category: "Rent",           amount: 1400, date: "2026-06-01", notes: "June rent",            recurring: true  },
  { id: 3, type: "expense", category: "Food",           amount: 320,  date: "2026-06-02", notes: "Groceries & dining",   recurring: false },
  { id: 4, type: "income",  category: "Freelance",      amount: 800,  date: "2026-06-02", notes: "Design project",       recurring: false },
  { id: 5, type: "expense", category: "Transport",      amount: 95,   date: "2026-06-03", notes: "Uber & metro",         recurring: false },
  { id: 6, type: "expense", category: "Entertainment",  amount: 65,   date: "2026-06-03", notes: "Netflix & Spotify",    recurring: true  },
  { id: 7, type: "expense", category: "Healthcare",     amount: 180,  date: "2026-06-02", notes: "Gym membership",       recurring: true  },
  { id: 8, type: "income",  category: "Investments",    amount: 340,  date: "2026-06-01", notes: "Dividend payout",      recurring: false },
  { id: 9, type: "expense", category: "Shopping",       amount: 210,  date: "2026-06-03", notes: "Clothing & shoes",     recurring: false },
  { id: 10,type: "expense", category: "Bills",          amount: 155,  date: "2026-06-02", notes: "Internet & electricity",recurring: true  },
];
const initialGoals = [
  { id: 1, name: "Emergency Fund", target: 10000, saved: 6200, icon: "🛡️", deadline: "2026-12-01" },
  { id: 2, name: "Dream Vacation",  target: 3500,  saved: 1100, icon: "✈️", deadline: "2026-09-01" },
  { id: 3, name: "New MacBook",     target: 2499,  saved: 2100, icon: "💻", deadline: "2026-07-01" },
];
const initialBudgets = [
  { id: 1, category: "Food",          limit: 400, spent: 320, color: C.orange },
  { id: 2, category: "Transport",     limit: 150, spent: 95,  color: C.blue   },
  { id: 3, category: "Entertainment", limit: 100, spent: 65,  color: C.purple },
  { id: 4, category: "Shopping",      limit: 250, spent: 210, color: C.yellow },
  { id: 5, category: "Healthcare",    limit: 200, spent: 180, color: C.emerald},
];

const INCOME_CATS  = ["Salary","Business","Freelance","Investments","Gifts","Bonuses","Other"];
const EXPENSE_CATS = ["Food","Transport","Shopping","Bills","Rent","Healthcare","Education","Entertainment","Travel","Family","Insurance","Taxes","Other"];
const ICONS = { Salary:"💼",Business:"🏢",Freelance:"💡",Investments:"📈",Gifts:"🎁",Bonuses:"🏆",Other:"💰",
  Food:"🍔",Transport:"🚗",Shopping:"🛍️",Bills:"⚡",Rent:"🏠",Healthcare:"🏥",
  Education:"📚",Entertainment:"🎬",Travel:"✈️",Family:"👨‍👩‍👧",Insurance:"🛡️",Taxes:"📋" };

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fmt   = n => new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:0}).format(n);
const fmtS  = n => n>=1000?`$${(n/1000).toFixed(1)}k`:`$${n}`;
const pct   = (a,b) => b===0?0:Math.min(100,Math.round((a/b)*100));
const uid   = () => Date.now() + Math.random();

function useLS(key,init){
  const [v,setV]=useState(()=>{try{const s=localStorage.getItem(key);return s?JSON.parse(s):init;}catch{return init;}});
  const set=useCallback(x=>{setV(x);try{localStorage.setItem(key,JSON.stringify(x));}catch{}},[key]);
  return [v,set];
}

// ─── SPARKLINE ────────────────────────────────────────────────────────────────
function Spark({data,color,w=90,h=28}){
  if(!data||data.length<2)return null;
  const mx=Math.max(...data),mn=Math.min(...data),rng=mx-mn||1;
  const pts=data.map((v,i)=>`${(i/(data.length-1))*w},${h-((v-mn)/rng)*h}`).join(" ");
  return <svg width={w} height={h} style={{overflow:"visible"}}><polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

// ─── DONUT ────────────────────────────────────────────────────────────────────
function Donut({data,size=150}){
  const total=data.reduce((s,d)=>s+d.value,0);
  if(!total)return null;
  const r=54,cx=size/2,cy=size/2,circ=2*Math.PI*r;
  let off=0;
  const segs=data.map(d=>{const dash=(d.value/total)*circ;const s={...d,dash,off,gap:circ-dash};off+=dash;return s;});
  return(
    <svg width={size} height={size}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.border} strokeWidth="20"/>
      {segs.map((s,i)=>(
        <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={s.color} strokeWidth="20"
          strokeDasharray={`${s.dash} ${s.gap}`} strokeDashoffset={-s.off}
          style={{transform:"rotate(-90deg)",transformOrigin:`${cx}px ${cy}px`}}/>
      ))}
      <text x={cx} y={cy-5} textAnchor="middle" fill={C.white} fontSize="14" fontWeight="800">{fmtS(total)}</text>
      <text x={cx} y={cy+13} textAnchor="middle" fill={C.slate} fontSize="9" letterSpacing="1">TOTAL</text>
    </svg>
  );
}

// ─── BAR CHART ────────────────────────────────────────────────────────────────
function Bars({data,color=C.emerald,h=110}){
  const mx=Math.max(...data.map(d=>d.value),1);
  return(
    <div style={{display:"flex",alignItems:"flex-end",gap:5,height:h}}>
      {data.map((d,i)=>{const bh=Math.max(4,(d.value/mx)*(h-20));return(
        <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
          <motion.div initial={{height:0}} animate={{height:bh}} transition={{delay:i*0.05}}
            style={{width:"100%",background:color,borderRadius:"4px 4px 0 0"}}/>
          <span style={{fontSize:9,color:C.slate,whiteSpace:"nowrap"}}>{d.label}</span>
        </div>
      );})}
    </div>
  );
}

// ─── PROGRESS BAR ─────────────────────────────────────────────────────────────
function PBar({value,max,color,h=7}){
  const p=pct(value,max);
  const bc=p>=90?C.red:p>=75?C.orange:color||C.emerald;
  return(
    <div style={{width:"100%",height:h,background:"rgba(255,255,255,0.07)",borderRadius:h}}>
      <motion.div initial={{width:0}} animate={{width:`${p}%`}} transition={{duration:0.8,ease:"easeOut"}}
        style={{height:"100%",background:bc,borderRadius:h}}/>
    </div>
  );
}

// ─── CARD ─────────────────────────────────────────────────────────────────────
function Card({children,style,onClick}){
  return(
    <motion.div whileHover={onClick?{scale:1.01}:{}} onClick={onClick}
      style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:18,padding:20,cursor:onClick?"pointer":"default",...style}}>
      {children}
    </motion.div>
  );
}

// ─── MODAL ────────────────────────────────────────────────────────────────────
function Modal({open,onClose,title,children}){
  return(
    <AnimatePresence>
      {open&&(
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={onClose}
          style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",backdropFilter:"blur(10px)",zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center",padding:"0 0 0 0"}}>
          <motion.div initial={{y:"100%"}} animate={{y:0}} exit={{y:"100%"}} transition={{type:"spring",damping:28,stiffness:300}}
            onClick={e=>e.stopPropagation()}
            style={{background:C.navyMid,borderTop:`1px solid ${C.border}`,borderRadius:"24px 24px 0 0",padding:"28px 24px 40px",width:"100%",maxWidth:440,maxHeight:"90vh",overflowY:"auto"}}>
            <div style={{width:40,height:4,background:"rgba(255,255,255,0.15)",borderRadius:2,margin:"0 auto 24px"}}/>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
              <span style={{fontSize:18,fontWeight:700,color:C.white}}>{title}</span>
              <button onClick={onClose} style={{background:"rgba(255,255,255,0.08)",border:"none",color:C.white,width:34,height:34,borderRadius:10,cursor:"pointer",fontSize:15}}>✕</button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── FORM HELPERS ─────────────────────────────────────────────────────────────
function Field({label,value,onChange,type="text",placeholder}){
  return(
    <div style={{marginBottom:14}}>
      {label&&<label style={{display:"block",fontSize:11,color:C.slate,marginBottom:6,fontWeight:700,letterSpacing:"0.07em",textTransform:"uppercase"}}>{label}</label>}
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        style={{width:"100%",background:"rgba(255,255,255,0.05)",border:`1px solid ${C.border}`,borderRadius:12,padding:"12px 14px",color:C.white,fontSize:14,outline:"none",boxSizing:"border-box"}}/>
    </div>
  );
}
function Pick({label,value,onChange,options}){
  return(
    <div style={{marginBottom:14}}>
      {label&&<label style={{display:"block",fontSize:11,color:C.slate,marginBottom:6,fontWeight:700,letterSpacing:"0.07em",textTransform:"uppercase"}}>{label}</label>}
      <select value={value} onChange={e=>onChange(e.target.value)}
        style={{width:"100%",background:C.navyCard,border:`1px solid ${C.border}`,borderRadius:12,padding:"12px 14px",color:C.white,fontSize:14,outline:"none"}}>
        {options.map(o=><option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
function Btn({onClick,children,color=C.emerald,textColor=C.navy,style={}}){
  return(
    <button onClick={onClick}
      style={{width:"100%",padding:14,background:color,color:textColor,border:"none",borderRadius:14,fontWeight:700,fontSize:15,cursor:"pointer",...style}}>
      {children}
    </button>
  );
}

// ─── TRANSACTION FORM ─────────────────────────────────────────────────────────
function TxForm({onSave,onClose,init,forceType}){
  const [type,setType]=useState(init?.type||forceType||"expense");
  const [amount,setAmount]=useState(init?.amount?.toString()||"");
  const [cat,setCat]=useState(init?.category||(forceType==="income"?"Salary":"Food"));
  const [date,setDate]=useState(init?.date||new Date().toISOString().slice(0,10));
  const [notes,setNotes]=useState(init?.notes||"");
  const [recurring,setRecurring]=useState(init?.recurring||false);
  const cats=type==="income"?INCOME_CATS:EXPENSE_CATS;
  const save=()=>{
    if(!amount||isNaN(+amount))return;
    onSave({id:init?.id||uid(),type,amount:+amount,category:cat,date,notes,recurring});
    onClose();
  };
  return(
    <div>
      {!forceType&&(
        <div style={{display:"flex",gap:8,marginBottom:18}}>
          {["income","expense"].map(t=>(
            <button key={t} onClick={()=>{setType(t);setCat(t==="income"?"Salary":"Food");}}
              style={{flex:1,padding:12,borderRadius:12,border:"none",cursor:"pointer",fontWeight:700,fontSize:13,
                background:type===t?(t==="income"?C.emerald:C.red):"rgba(255,255,255,0.06)",
                color:type===t?C.navy:C.slate}}>
              {t==="income"?"💰 Income":"💸 Expense"}
            </button>
          ))}
        </div>
      )}
      <Field label="Amount ($)" value={amount} onChange={setAmount} type="number" placeholder="0"/>
      <Pick label="Category" value={cat} onChange={setCat} options={cats}/>
      <Field label="Date" value={date} onChange={setDate} type="date"/>
      <Field label="Notes (optional)" value={notes} onChange={setNotes} placeholder="What's this for?"/>
      <label style={{display:"flex",gap:10,alignItems:"center",marginBottom:18,cursor:"pointer"}}>
        <input type="checkbox" checked={recurring} onChange={e=>setRecurring(e.target.checked)} style={{accentColor:C.emerald,width:16,height:16}}/>
        <span style={{color:C.slateL,fontSize:13}}>Recurring transaction 🔄</span>
      </label>
      <Btn onClick={save}>{init?"Update":"Add"} {type==="income"?"Income":"Expense"}</Btn>
    </div>
  );
}

// ─── GOAL FORM ────────────────────────────────────────────────────────────────
function GoalForm({onSave,onClose,init}){
  const [name,setName]=useState(init?.name||"");
  const [target,setTarget]=useState(init?.target?.toString()||"");
  const [saved,setSaved]=useState(init?.saved?.toString()||"0");
  const [deadline,setDeadline]=useState(init?.deadline||"");
  const [icon,setIcon]=useState(init?.icon||"🎯");
  const GOAL_ICONS=["🎯","✈️","🏠","🚗","💻","📚","🛡️","💍","🏋️","🎸","🌎","👶"];
  return(
    <div>
      <label style={{display:"block",fontSize:11,color:C.slate,marginBottom:8,fontWeight:700,letterSpacing:"0.07em",textTransform:"uppercase"}}>Icon</label>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
        {GOAL_ICONS.map(ic=>(
          <button key={ic} onClick={()=>setIcon(ic)}
            style={{width:42,height:42,borderRadius:12,border:`2px solid ${ic===icon?C.emerald:C.border}`,background:"transparent",fontSize:22,cursor:"pointer"}}>
            {ic}
          </button>
        ))}
      </div>
      <Field label="Goal Name" value={name} onChange={setName} placeholder="e.g. Dream Vacation"/>
      <Field label="Target Amount ($)" value={target} onChange={setTarget} type="number"/>
      <Field label="Already Saved ($)" value={saved} onChange={setSaved} type="number"/>
      <Field label="Target Date" value={deadline} onChange={setDeadline} type="date"/>
      <Btn onClick={()=>{if(!name||!target)return;onSave({id:init?.id||uid(),name,target:+target,saved:+saved,deadline,icon});onClose();}}>
        {init?"Update":"Create"} Goal
      </Btn>
    </div>
  );
}

// ─── BUDGET FORM ──────────────────────────────────────────────────────────────
function BudgetForm({onSave,onClose,init}){
  const [cat,setCat]=useState(init?.category||"Food");
  const [limit,setLimit]=useState(init?.limit?.toString()||"");
  const [color,setColor]=useState(init?.color||C.emerald);
  const PALETTE=[C.emerald,C.blue,C.purple,C.orange,C.red,C.yellow];
  return(
    <div>
      <Pick label="Category" value={cat} onChange={setCat} options={EXPENSE_CATS}/>
      <Field label="Monthly Limit ($)" value={limit} onChange={setLimit} type="number"/>
      <label style={{display:"block",fontSize:11,color:C.slate,marginBottom:8,fontWeight:700,letterSpacing:"0.07em",textTransform:"uppercase"}}>Color</label>
      <div style={{display:"flex",gap:8,marginBottom:18}}>
        {PALETTE.map(cl=>(
          <button key={cl} onClick={()=>setColor(cl)}
            style={{width:34,height:34,borderRadius:"50%",border:`3px solid ${cl===color?"white":"transparent"}`,background:cl,cursor:"pointer"}}/>
        ))}
      </div>
      <Btn onClick={()=>{if(!limit)return;onSave({id:init?.id||uid(),category:cat,limit:+limit,spent:init?.spent||0,color});onClose();}}>
        {init?"Update":"Create"} Budget
      </Btn>
    </div>
  );
}

// ─── ONBOARDING / GUIDE ───────────────────────────────────────────────────────
function Guide({onDone}){
  const [langIdx,setLangIdx]=useState(0);
  const [step,setStep]=useState(0);
  const lang=LANGUAGES[langIdx];
  const isRTL=["العربية","עברית"].includes(lang.lang);

  return(
    <div style={{minHeight:"100vh",background:C.navy,display:"flex",flexDirection:"column",padding:"0 0 40px"}}>
      {/* Header */}
      <div style={{padding:"40px 24px 20px",textAlign:"center"}}>
        <div style={{fontSize:32,fontWeight:900,letterSpacing:"-1px",color:C.white}}>
          ROUIN<span style={{color:C.emerald}}>.</span>
        </div>
        <div style={{fontSize:12,color:C.slate,marginTop:4}}>Take Control of Your Money</div>
      </div>

      {/* Language Picker */}
      <div style={{padding:"0 16px",marginBottom:24}}>
        <div style={{fontSize:11,color:C.slate,textAlign:"center",marginBottom:12,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase"}}>
          Choose Your Language · اختر لغتك
        </div>
        <div style={{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center"}}>
          {LANGUAGES.map((l,i)=>(
            <button key={i} onClick={()=>{setLangIdx(i);setStep(0);}}
              style={{padding:"6px 12px",borderRadius:20,border:`1.5px solid ${i===langIdx?C.emerald:C.border}`,
                background:i===langIdx?C.emeraldGlow:"transparent",cursor:"pointer",
                color:i===langIdx?C.emerald:C.slate,fontSize:13,display:"flex",gap:5,alignItems:"center"}}>
              <span>{l.flag}</span><span style={{fontSize:11}}>{l.lang}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Step Card */}
      <div style={{flex:1,padding:"0 20px",display:"flex",flexDirection:"column",gap:16}} dir={isRTL?"rtl":"ltr"}>
        <div style={{fontSize:18,fontWeight:700,color:C.white,textAlign:"center"}}>{lang.title}</div>

        <AnimatePresence mode="wait">
          <motion.div key={`${langIdx}-${step}`} initial={{opacity:0,x:40}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-40}}>
            {lang.steps.map((s,i)=>(
              <motion.div key={i} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:i*0.08}}
                style={{display:"flex",gap:14,alignItems:"flex-start",padding:"14px 0",borderBottom:`1px solid ${C.border}`}}>
                <div style={{width:46,height:46,borderRadius:14,background:C.emeraldGlow,border:`1px solid ${C.emerald}30`,
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>
                  {s.icon}
                </div>
                <div>
                  <div style={{fontSize:14,fontWeight:700,color:C.white,marginBottom:4}}>{s.t}</div>
                  <div style={{fontSize:13,color:C.slateL,lineHeight:1.5}}>{s.d}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        <div style={{marginTop:"auto",paddingTop:24}}>
          <Btn onClick={onDone}>
            {lang.lang==="العربية"?"ابدأ الآن ✨":lang.lang==="Soomaali"?"Bilow Hadda ✨":"Get Started ✨"}
          </Btn>
          <button onClick={onDone}
            style={{width:"100%",marginTop:10,background:"none",border:"none",color:C.slate,fontSize:13,cursor:"pointer",padding:8}}>
            {lang.lang==="العربية"?"تخطي":"Skip"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── AI ASSISTANT (with data mutation powers) ─────────────────────────────────
function AiPanel({transactions,setTransactions,budgets,setBudgets,goals,setGoals,onClose}){
  const [msgs,setMsgs]=useState([
    {role:"assistant",text:"👋 Hi! I'm your ROUIN AI. I can **analyze** your finances AND **make changes** for you.\n\nTry saying:\n• \"Add $500 salary income for today\"\n• \"Delete the Netflix expense\"\n• \"Create a goal: New Car, $20,000\"\n• \"Set Food budget to $600\"\n• \"How am I doing this month?\""}
  ]);
  const [input,setInput]=useState("");
  const [loading,setLoading]=useState(false);
  const scrollRef=useRef(null);

  const income=transactions.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0);
  const expenses=transactions.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0);
  const balance=income-expenses;

  const dataContext=`
CURRENT USER DATA (JSON):
Transactions: ${JSON.stringify(transactions)}
Budgets: ${JSON.stringify(budgets)}
Goals: ${JSON.stringify(goals)}
Summary: Income=$${income}, Expenses=$${expenses}, Balance=$${balance}

AVAILABLE ACTIONS — you can perform these by including a special JSON block in your response.
When the user asks you to add/edit/delete data, include ONE action block like this at the END of your reply:

For adding income/expense:
[ACTION:ADD_TX] {"type":"income or expense","category":"one of: Salary,Business,Freelance,Investments,Gifts,Bonuses,Other for income OR Food,Transport,Shopping,Bills,Rent,Healthcare,Education,Entertainment,Travel,Family,Insurance,Taxes,Other for expense","amount":number,"date":"YYYY-MM-DD","notes":"string","recurring":false} [/ACTION]

For deleting a transaction (use the id from above):
[ACTION:DEL_TX] {"id": number} [/ACTION]

For editing a transaction:
[ACTION:EDIT_TX] {"id":number,"type":"income or expense","category":"string","amount":number,"date":"YYYY-MM-DD","notes":"string","recurring":false} [/ACTION]

For creating/updating a budget:
[ACTION:SET_BUDGET] {"category":"Food/Transport/etc","limit":number,"color":"#hex"} [/ACTION]

For creating/updating a goal:
[ACTION:SET_GOAL] {"name":"string","target":number,"saved":number,"deadline":"YYYY-MM-DD","icon":"emoji"} [/ACTION]

For deleting a goal:
[ACTION:DEL_GOAL] {"id": number} [/ACTION]

IMPORTANT: Only include an action block if the user explicitly asked you to make a change. For analysis/advice questions, just respond normally without any action block. Always confirm what action you took in plain language.
`;

  const execAction=(tag,payload,prevTx,prevBu,prevGo)=>{
    try{
      const data=JSON.parse(payload);
      if(tag==="ADD_TX"){
        const newTx={id:uid(),...data};
        setTransactions([newTx,...prevTx]);
        return `✅ Added ${data.type}: ${data.category} — $${data.amount}`;
      }
      if(tag==="DEL_TX"){
        setTransactions(prevTx.filter(t=>t.id!==data.id));
        return `🗑️ Transaction deleted.`;
      }
      if(tag==="EDIT_TX"){
        setTransactions(prevTx.map(t=>t.id===data.id?{...t,...data}:t));
        return `✏️ Transaction updated.`;
      }
      if(tag==="SET_BUDGET"){
        const exist=prevBu.find(b=>b.category===data.category);
        if(exist){setBudgets(prevBu.map(b=>b.category===data.category?{...b,...data}:b));}
        else{setBudgets([...prevBu,{id:uid(),spent:0,...data}]);}
        return `💰 Budget for ${data.category} set to $${data.limit}.`;
      }
      if(tag==="SET_GOAL"){
        const exist=prevGo.find(g=>g.name===data.name);
        if(exist){setGoals(prevGo.map(g=>g.name===data.name?{...g,...data}:g));}
        else{setGoals([...prevGo,{id:uid(),...data}]);}
        return `🎯 Goal "${data.name}" saved.`;
      }
      if(tag==="DEL_GOAL"){
        setGoals(prevGo.filter(g=>g.id!==data.id));
        return `🗑️ Goal deleted.`;
      }
    }catch(e){}
    return "";
  };

  const send=async()=>{
    if(!input.trim()||loading)return;
    const userMsg={role:"user",text:input};
    const history=[...msgs,userMsg];
    setMsgs(history);
    setInput("");
    setLoading(true);

    // snapshot state at call time
    const snapTx=[...transactions],snapBu=[...budgets],snapGo=[...goals];

    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:1000,
          system:`You are ROUIN's AI financial assistant. Be concise, helpful, and friendly. You have full access to the user's financial data and can make changes when asked. Here is the data and instructions:\n\n${dataContext}`,
          messages:history.map(m=>({role:m.role,content:m.text}))
        })
      });
      const data=await res.json();
      let reply=data.content?.[0]?.text||"Sorry, couldn't process that.";

      // Parse and execute any actions
      const actionRe=/\[ACTION:(\w+)\]([\s\S]*?)\[\/ACTION\]/g;
      let match,actionResults=[];
      while((match=actionRe.exec(reply))!==null){
        const result=execAction(match[1],match[2].trim(),snapTx,snapBu,snapGo);
        if(result)actionResults.push(result);
      }

      // Strip action blocks from display
      reply=reply.replace(/\[ACTION:\w+\][\s\S]*?\[\/ACTION\]/g,"").trim();
      if(actionResults.length)reply=reply+"\n\n"+actionResults.join("\n");

      setMsgs(prev=>[...prev,{role:"assistant",text:reply}]);
    }catch{
      setMsgs(prev=>[...prev,{role:"assistant",text:"Connection error. Please try again."}]);
    }
    setLoading(false);
    setTimeout(()=>scrollRef.current?.scrollTo({top:99999,behavior:"smooth"}),100);
  };

  const QUICK=["How am I doing?","Add $500 salary today","What's my biggest expense?","Create New Car goal $15000","Set food budget to $500"];

  return(
    <div style={{display:"flex",flexDirection:"column",height:"70vh"}}>
      {/* Messages */}
      <div ref={scrollRef} style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:10,paddingBottom:10}}>
        {msgs.map((m,i)=>(
          <motion.div key={i} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}
            style={{alignSelf:m.role==="user"?"flex-end":"flex-start",maxWidth:"85%",
              background:m.role==="user"?C.emerald:"rgba(255,255,255,0.07)",
              color:m.role==="user"?C.navy:C.white,
              padding:"10px 14px",borderRadius:m.role==="user"?"16px 16px 4px 16px":"16px 16px 16px 4px",
              fontSize:13,lineHeight:1.55,whiteSpace:"pre-wrap"}}>
            {m.text}
          </motion.div>
        ))}
        {loading&&(
          <div style={{alignSelf:"flex-start",background:"rgba(255,255,255,0.07)",padding:"12px 16px",borderRadius:"16px 16px 16px 4px"}}>
            <div style={{display:"flex",gap:4}}>
              {[0,1,2].map(i=><motion.div key={i} animate={{opacity:[0.3,1,0.3]}} transition={{duration:1,repeat:Infinity,delay:i*0.2}}
                style={{width:6,height:6,borderRadius:"50%",background:C.emerald}}/>)}
            </div>
          </div>
        )}
      </div>

      {/* Quick suggestions */}
      <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:10}}>
        {QUICK.map((q,i)=>(
          <button key={i} onClick={()=>setInput(q)}
            style={{background:"rgba(0,200,150,0.1)",border:`1px solid ${C.emerald}30`,borderRadius:20,padding:"5px 12px",
              color:C.emerald,fontSize:11,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0}}>
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div style={{display:"flex",gap:10,paddingTop:10,borderTop:`1px solid ${C.border}`}}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}
          placeholder="Ask or command anything..."
          style={{flex:1,background:"rgba(255,255,255,0.05)",border:`1px solid ${C.border}`,borderRadius:12,
            padding:"11px 14px",color:C.white,fontSize:13,outline:"none"}}/>
        <button onClick={send} disabled={loading}
          style={{background:C.emerald,border:"none",color:C.navy,padding:"11px 18px",borderRadius:12,cursor:"pointer",fontWeight:700,fontSize:13}}>
          ↑
        </button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ════════════════════════════════════════════════════════════════════════════════
export default function App(){
  const [showGuide,setShowGuide]=useLS("rouin_guided",true);
  const [transactions,setTransactions]=useLS("rouin_tx",initialTransactions);
  const [goals,setGoals]=useLS("rouin_goals",initialGoals);
  const [budgets,setBudgets]=useLS("rouin_budgets",initialBudgets);
  const [nav,setNav]=useState("dashboard");
  const [modal,setModal]=useState(null);
  const [editItem,setEditItem]=useState(null);
  const [search,setSearch]=useState("");
  const [txFilter,setTxFilter]=useState("all");
  const [showAI,setShowAI]=useState(false);

  // ─ Computed ─────────────────────────────────────────────────────────────────
  const income=transactions.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0);
  const expenses=transactions.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0);
  const balance=income-expenses;
  const savingsRate=income>0?Math.round((balance/income)*100):0;

  const expByCat=EXPENSE_CATS.reduce((acc,cat)=>{
    acc[cat]=transactions.filter(t=>t.type==="expense"&&t.category===cat).reduce((s,t)=>s+t.amount,0);
    return acc;
  },{});

  const monthlyData=[
    {label:"Jan",value:3200},{label:"Feb",value:2800},{label:"Mar",value:3600},
    {label:"Apr",value:2900},{label:"May",value:3400},{label:"Jun",value:expenses},
  ];
  const donutData=Object.entries(expByCat).filter(([,v])=>v>0)
    .map(([k,v],i)=>({label:k,value:v,color:[C.emerald,C.blue,C.purple,C.orange,C.red,C.yellow][i%6]})).slice(0,6);

  // ─ CRUD ──────────────────────────────────────────────────────────────────────
  const saveTx=tx=>setTransactions(prev=>{const i=prev.findIndex(t=>t.id===tx.id);if(i>=0){const n=[...prev];n[i]=tx;return n;}return[tx,...prev];});
  const delTx=id=>setTransactions(prev=>prev.filter(t=>t.id!==id));
  const saveGoal=g=>setGoals(prev=>{const i=prev.findIndex(x=>x.id===g.id);if(i>=0){const n=[...prev];n[i]=g;return n;}return[g,...prev];});
  const delGoal=id=>setGoals(prev=>prev.filter(g=>g.id!==id));
  const saveBudget=b=>setBudgets(prev=>{const i=prev.findIndex(x=>x.id===b.id);if(i>=0){const n=[...prev];n[i]=b;return n;}return[b,...prev];});
  const delBudget=id=>setBudgets(prev=>prev.filter(b=>b.id!==id));

  const filteredTx=transactions.filter(t=>{
    const s=search===""||t.category.toLowerCase().includes(search.toLowerCase())||t.notes.toLowerCase().includes(search.toLowerCase());
    const f=txFilter==="all"||t.type===txFilter;
    return s&&f;
  });

  const openEdit=(item,type)=>{setEditItem(item);setModal(type);};
  const closeModal=()=>{setModal(null);setEditItem(null);};

  // ─ NAV ───────────────────────────────────────────────────────────────────────
  const NAV=[
    {id:"dashboard",icon:"🏠",label:"Home"},
    {id:"transactions",icon:"↕️",label:"Txns"},
    {id:"budgets",icon:"📊",label:"Budget"},
    {id:"goals",icon:"🎯",label:"Goals"},
    {id:"analytics",icon:"📈",label:"Charts"},
  ];

  if(showGuide) return <Guide onDone={()=>setShowGuide(false)}/>;

  // ═══ VIEWS ═══════════════════════════════════════════════════════════════════

  const Dashboard=()=>(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      {/* Balance Hero */}
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}
        style={{background:"linear-gradient(135deg,#0C1830 0%,#003D2E 100%)",borderRadius:22,padding:26,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-50,right:-50,width:180,height:180,borderRadius:"50%",background:"rgba(0,200,150,0.1)"}}/>
        <div style={{position:"absolute",bottom:-30,left:-20,width:120,height:120,borderRadius:"50%",background:"rgba(0,200,150,0.06)"}}/>
        <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:6}}>Net Balance · June 2026</div>
        <div style={{fontSize:44,fontWeight:900,color:C.white,letterSpacing:"-2px"}}>{fmt(balance)}</div>
        <div style={{display:"flex",gap:8,marginTop:10,flexWrap:"wrap"}}>
          <span style={{fontSize:12,background:C.emeraldGlow,color:C.emerald,padding:"4px 12px",borderRadius:20,border:`1px solid ${C.emerald}30`}}>
            ↑ {Math.abs(savingsRate)}% savings rate
          </span>
          <span style={{fontSize:12,color:"rgba(255,255,255,0.35)",padding:"4px 0"}}>
            {balance>=0?"📈 On track":"⚠️ Over budget"}
          </span>
        </div>
        <div style={{display:"flex",gap:20,marginTop:18}}>
          {[{l:"Income",v:income,c:C.emerald,ic:"↑"},{l:"Expenses",v:expenses,c:C.red,ic:"↓"}].map(s=>(
            <div key={s.l}>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.4)",marginBottom:2}}>{s.ic} {s.l}</div>
              <div style={{fontSize:20,fontWeight:700,color:s.c}}>{fmtS(s.v)}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        {[
          {label:"+ Add Income",  color:C.emerald, tc:C.navy, action:()=>{setEditItem(null);setModal("income");}},
          {label:"+ Add Expense", color:"rgba(255,79,97,0.15)", tc:C.red, action:()=>{setEditItem(null);setModal("expense");}},
        ].map(a=>(
          <button key={a.label} onClick={a.action}
            style={{padding:"14px 0",background:a.color,border:`1px solid ${a.tc}30`,borderRadius:14,color:a.tc,fontWeight:700,fontSize:13,cursor:"pointer"}}>
            {a.label}
          </button>
        ))}
      </div>

      {/* AI CTA */}
      <button onClick={()=>setShowAI(true)}
        style={{width:"100%",padding:"14px 20px",background:C.emeraldGlow,border:`1px solid ${C.emerald}40`,borderRadius:16,
          color:C.emerald,cursor:"pointer",display:"flex",alignItems:"center",gap:12,justifyContent:"space-between",boxSizing:"border-box"}}>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <span style={{fontSize:22}}>✦</span>
          <div style={{textAlign:"left"}}>
            <div style={{fontSize:13,fontWeight:700}}>AI Financial Advisor</div>
            <div style={{fontSize:11,color:C.slate,marginTop:2}}>Ask me to add, edit, or analyze your data</div>
          </div>
        </div>
        <span style={{fontSize:18,color:C.slate}}>›</span>
      </button>

      {/* Budget Overview */}
      <Card>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <span style={{fontSize:14,fontWeight:700,color:C.white}}>Budgets</span>
          <button onClick={()=>setNav("budgets")} style={{background:"none",border:"none",color:C.emerald,fontSize:12,cursor:"pointer"}}>See all →</button>
        </div>
        {budgets.slice(0,3).map(b=>(
          <div key={b.id} style={{marginBottom:14}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
              <span style={{fontSize:12,color:C.white}}>{ICONS[b.category]} {b.category}</span>
              <span style={{fontSize:11,color:pct(b.spent,b.limit)>=75?C.orange:C.slate}}>{fmt(b.spent)}/{fmt(b.limit)}</span>
            </div>
            <PBar value={b.spent} max={b.limit} color={b.color}/>
          </div>
        ))}
      </Card>

      {/* Goals */}
      <Card>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <span style={{fontSize:14,fontWeight:700,color:C.white}}>Goals</span>
          <button onClick={()=>setNav("goals")} style={{background:"none",border:"none",color:C.emerald,fontSize:12,cursor:"pointer"}}>See all →</button>
        </div>
        <div style={{display:"flex",gap:12,overflowX:"auto",paddingBottom:4}}>
          {goals.map(g=>(
            <div key={g.id} style={{minWidth:120,background:"rgba(255,255,255,0.03)",border:`1px solid ${C.border}`,borderRadius:14,padding:14}}>
              <div style={{fontSize:26,marginBottom:8}}>{g.icon}</div>
              <div style={{fontSize:12,color:C.white,fontWeight:600,marginBottom:3}}>{g.name}</div>
              <div style={{fontSize:11,color:C.emerald,marginBottom:8,fontWeight:700}}>{pct(g.saved,g.target)}%</div>
              <PBar value={g.saved} max={g.target} color={C.emerald} h={4}/>
            </div>
          ))}
          <button onClick={()=>{setEditItem(null);setModal("goal");}}
            style={{minWidth:80,background:C.emeraldGlow,border:`1px dashed ${C.emerald}40`,borderRadius:14,padding:14,
              color:C.emerald,cursor:"pointer",fontSize:22,display:"flex",alignItems:"center",justifyContent:"center"}}>
            +
          </button>
        </div>
      </Card>

      {/* Recent */}
      <Card>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <span style={{fontSize:14,fontWeight:700,color:C.white}}>Recent</span>
          <button onClick={()=>setNav("transactions")} style={{background:"none",border:"none",color:C.emerald,fontSize:12,cursor:"pointer"}}>See all →</button>
        </div>
        {transactions.slice(0,4).map((t,i)=>(
          <div key={t.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:i<3?`1px solid ${C.border}`:"none"}}>
            <div style={{width:40,height:40,borderRadius:12,background:t.type==="income"?`${C.emerald}18`:`${C.red}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>
              {ICONS[t.category]}
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:600,color:C.white}}>{t.category}</div>
              <div style={{fontSize:11,color:C.slate}}>{t.date}</div>
            </div>
            <div style={{fontSize:14,fontWeight:700,color:t.type==="income"?C.emerald:C.red}}>
              {t.type==="income"?"+":"-"}{fmt(t.amount)}
            </div>
          </div>
        ))}
      </Card>
    </div>
  );

  const Transactions=()=>(
    <div>
      <div style={{display:"flex",gap:10,marginBottom:14}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍  Search..."
          style={{flex:1,background:"rgba(255,255,255,0.05)",border:`1px solid ${C.border}`,borderRadius:12,padding:"11px 14px",color:C.white,fontSize:13,outline:"none"}}/>
        <button onClick={()=>{setEditItem(null);setModal("tx");}}
          style={{background:C.emerald,border:"none",color:C.navy,width:44,height:44,borderRadius:12,cursor:"pointer",fontSize:22,fontWeight:700,flexShrink:0}}>
          +
        </button>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:14}}>
        {["all","income","expense"].map(f=>(
          <button key={f} onClick={()=>setTxFilter(f)}
            style={{padding:"7px 16px",borderRadius:20,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,
              background:txFilter===f?C.emerald:"rgba(255,255,255,0.06)",
              color:txFilter===f?C.navy:C.slate}}>
            {f.charAt(0).toUpperCase()+f.slice(1)}
          </button>
        ))}
      </div>
      <AnimatePresence>
        {filteredTx.map(t=>(
          <motion.div key={t.id} initial={{opacity:0,x:-16}} animate={{opacity:1,x:0}} exit={{opacity:0,x:16}}
            style={{display:"flex",alignItems:"center",gap:12,background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:"12px 16px",marginBottom:8}}>
            <div style={{width:44,height:44,borderRadius:13,background:t.type==="income"?`${C.emerald}18`:`${C.red}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>
              {ICONS[t.category]}
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:13,fontWeight:600,color:C.white}}>{t.category}{t.recurring?" 🔄":""}</div>
              <div style={{fontSize:11,color:C.slate,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.date}{t.notes?` · ${t.notes}`:""}</div>
            </div>
            <div style={{textAlign:"right",flexShrink:0}}>
              <div style={{fontSize:15,fontWeight:700,color:t.type==="income"?C.emerald:C.red}}>
                {t.type==="income"?"+":"-"}{fmt(t.amount)}
              </div>
              <div style={{display:"flex",gap:6,marginTop:4,justifyContent:"flex-end"}}>
                <button onClick={()=>openEdit(t,"tx")}
                  style={{background:"rgba(255,255,255,0.07)",border:"none",color:C.slateL,padding:"3px 10px",borderRadius:6,cursor:"pointer",fontSize:11}}>Edit</button>
                <button onClick={()=>delTx(t.id)}
                  style={{background:`${C.red}18`,border:"none",color:C.red,padding:"3px 10px",borderRadius:6,cursor:"pointer",fontSize:11}}>Del</button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      {filteredTx.length===0&&<div style={{textAlign:"center",padding:50,color:C.slate}}>No transactions found</div>}
    </div>
  );

  const Budgets=()=>(
    <div>
      <button onClick={()=>{setEditItem(null);setModal("budget");}}
        style={{width:"100%",marginBottom:16,padding:14,background:C.emeraldGlow,border:`1px dashed ${C.emerald}50`,
          borderRadius:16,color:C.emerald,cursor:"pointer",fontWeight:700,fontSize:14}}>
        + New Budget
      </button>
      {budgets.map(b=>{
        const p=pct(b.spent,b.limit);
        return(
          <Card key={b.id} style={{marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
              <div style={{display:"flex",gap:12,alignItems:"center"}}>
                <div style={{width:44,height:44,borderRadius:13,background:`${b.color}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>
                  {ICONS[b.category]}
                </div>
                <div>
                  <div style={{fontSize:14,fontWeight:700,color:C.white}}>{b.category}</div>
                  <div style={{fontSize:11,color:C.slate}}>{fmt(b.limit-b.spent)} left</div>
                </div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:16,fontWeight:800,color:p>=90?C.red:p>=75?C.orange:C.white}}>{p}%</div>
                <div style={{fontSize:11,color:C.slate}}>{fmt(b.spent)}/{fmt(b.limit)}</div>
              </div>
            </div>
            <PBar value={b.spent} max={b.limit} color={b.color} h={9}/>
            {p>=90&&<div style={{marginTop:10,fontSize:12,color:C.red,background:`${C.red}12`,padding:"7px 12px",borderRadius:10}}>⚠️ Almost out of budget!</div>}
            {p>=75&&p<90&&<div style={{marginTop:10,fontSize:12,color:C.orange,background:`${C.orange}12`,padding:"7px 12px",borderRadius:10}}>⚡ 75% of budget used</div>}
            <div style={{display:"flex",gap:8,marginTop:12}}>
              <button onClick={()=>openEdit(b,"budget")}
                style={{flex:1,background:"rgba(255,255,255,0.06)",border:"none",color:C.slate,padding:"8px",borderRadius:10,cursor:"pointer",fontSize:12}}>Edit</button>
              <button onClick={()=>delBudget(b.id)}
                style={{flex:1,background:`${C.red}10`,border:"none",color:C.red,padding:"8px",borderRadius:10,cursor:"pointer",fontSize:12}}>Delete</button>
            </div>
          </Card>
        );
      })}
    </div>
  );

  const Goals=()=>(
    <div>
      <button onClick={()=>{setEditItem(null);setModal("goal");}}
        style={{width:"100%",marginBottom:16,padding:14,background:C.emeraldGlow,border:`1px dashed ${C.emerald}50`,
          borderRadius:16,color:C.emerald,cursor:"pointer",fontWeight:700,fontSize:14}}>
        + New Goal
      </button>
      {goals.map(g=>{
        const p=pct(g.saved,g.target);
        const daysLeft=g.deadline?Math.max(0,Math.ceil((new Date(g.deadline)-new Date())/86400000)):null;
        const monthlyNeeded=daysLeft?Math.ceil((g.target-g.saved)/(daysLeft/30)):null;
        return(
          <Card key={g.id} style={{marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
              <div style={{display:"flex",gap:12,alignItems:"center"}}>
                <div style={{width:52,height:52,borderRadius:16,background:C.emeraldGlow,border:`1px solid ${C.emerald}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28}}>
                  {g.icon}
                </div>
                <div>
                  <div style={{fontSize:15,fontWeight:700,color:C.white}}>{g.name}</div>
                  {daysLeft!==null&&<div style={{fontSize:11,color:C.slate}}>{daysLeft} days left</div>}
                </div>
              </div>
              <div style={{background:C.emeraldGlow,padding:"6px 14px",borderRadius:20,border:`1px solid ${C.emerald}30`}}>
                <span style={{fontSize:14,fontWeight:800,color:C.emerald}}>{p}%</span>
              </div>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
              <div>
                <div style={{fontSize:11,color:C.slate}}>Saved</div>
                <div style={{fontSize:20,fontWeight:800,color:C.white}}>{fmt(g.saved)}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:11,color:C.slate}}>Target</div>
                <div style={{fontSize:20,fontWeight:800,color:C.slate}}>{fmt(g.target)}</div>
              </div>
            </div>
            <PBar value={g.saved} max={g.target} color={C.emerald} h={10}/>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:8}}>
              <span style={{fontSize:11,color:C.slate}}>{fmt(g.target-g.saved)} to go</span>
              {monthlyNeeded&&<span style={{fontSize:11,color:C.emerald}}>≈{fmt(monthlyNeeded)}/mo needed</span>}
            </div>
            <div style={{display:"flex",gap:8,marginTop:14}}>
              <button onClick={()=>openEdit(g,"goal")}
                style={{flex:1,background:"rgba(255,255,255,0.06)",border:"none",color:C.slate,padding:"8px",borderRadius:10,cursor:"pointer",fontSize:12}}>Edit</button>
              <button onClick={()=>delGoal(g.id)}
                style={{flex:1,background:`${C.red}10`,border:"none",color:C.red,padding:"8px",borderRadius:10,cursor:"pointer",fontSize:12}}>Delete</button>
            </div>
          </Card>
        );
      })}
    </div>
  );

  const Analytics=()=>(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <Card>
        <div style={{fontSize:14,fontWeight:700,color:C.white,marginBottom:16}}>Spending by Category</div>
        <div style={{display:"flex",gap:16,alignItems:"center"}}>
          <Donut data={donutData}/>
          <div style={{flex:1,display:"flex",flexDirection:"column",gap:8}}>
            {donutData.map(d=>(
              <div key={d.label} style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{display:"flex",gap:7,alignItems:"center"}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:d.color}}/>
                  <span style={{fontSize:12,color:C.slate}}>{d.label}</span>
                </div>
                <span style={{fontSize:12,fontWeight:700,color:C.white}}>{fmtS(d.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
      <Card>
        <div style={{fontSize:14,fontWeight:700,color:C.white,marginBottom:16}}>Monthly Expenses</div>
        <Bars data={monthlyData} color={C.emerald} h={120}/>
      </Card>
      <Card>
        <div style={{fontSize:14,fontWeight:700,color:C.white,marginBottom:14}}>Cash Flow</div>
        <div style={{display:"flex",gap:10}}>
          {[{l:"Income",v:income,c:C.emerald},{l:"Expenses",v:expenses,c:C.red},{l:"Savings",v:balance,c:C.blue}].map(s=>(
            <div key={s.l} style={{flex:1,background:"rgba(255,255,255,0.03)",borderRadius:14,padding:"14px 10px",textAlign:"center",border:`1px solid ${C.border}`}}>
              <div style={{fontSize:11,color:C.slate,marginBottom:6}}>{s.l}</div>
              <div style={{fontSize:16,fontWeight:800,color:s.c}}>{fmtS(s.v)}</div>
              <div style={{fontSize:10,color:C.slate,marginTop:2}}>{income>0?Math.round((s.v/income)*100):0}%</div>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <div style={{fontSize:14,fontWeight:700,color:C.white,marginBottom:14}}>Goals Progress</div>
        {goals.map(g=>(
          <div key={g.id} style={{marginBottom:14}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
              <span style={{fontSize:13,color:C.white}}>{g.icon} {g.name}</span>
              <span style={{fontSize:12,color:C.emerald,fontWeight:700}}>{pct(g.saved,g.target)}%</span>
            </div>
            <PBar value={g.saved} max={g.target} color={C.emerald} h={8}/>
          </div>
        ))}
      </Card>
    </div>
  );

  const VIEWS={dashboard:<Dashboard/>,transactions:<Transactions/>,budgets:<Budgets/>,goals:<Goals/>,analytics:<Analytics/>};
  const PAGE_TITLES={dashboard:"ROUIN",transactions:"Transactions",budgets:"Budgets",goals:"Goals",analytics:"Analytics"};

  return(
    <div style={{fontFamily:"'DM Sans','SF Pro Display',system-ui,sans-serif",background:C.navy,minHeight:"100vh",color:C.white,maxWidth:420,margin:"0 auto",position:"relative"}}>

      {/* Header */}
      <div style={{padding:"18px 20px 10px",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:10,background:`${C.navy}ee`,backdropFilter:"blur(14px)",borderBottom:`1px solid ${C.border}`}}>
        {nav==="dashboard"?(
          <div>
            <div style={{fontSize:22,fontWeight:900,letterSpacing:"-0.5px",color:C.white}}>ROUIN<span style={{color:C.emerald}}>.</span></div>
            <div style={{fontSize:10,color:C.slate}}>Take Control of Your Money</div>
          </div>
        ):(
          <div style={{fontSize:19,fontWeight:700,color:C.white}}>{PAGE_TITLES[nav]}</div>
        )}
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <button onClick={()=>setShowGuide(true)}
            style={{background:"rgba(255,255,255,0.06)",border:`1px solid ${C.border}`,borderRadius:10,padding:"7px 12px",color:C.slateL,cursor:"pointer",fontSize:12}}>
            ?
          </button>
          <button onClick={()=>setShowAI(true)}
            style={{background:C.emeraldGlow,border:`1px solid ${C.emerald}40`,borderRadius:10,padding:"7px 14px",color:C.emerald,cursor:"pointer",fontSize:12,fontWeight:700,display:"flex",gap:5,alignItems:"center"}}>
            <span>✦</span> AI
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{padding:"14px 16px 100px"}}>
        <AnimatePresence mode="wait">
          <motion.div key={nav} initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-14}} transition={{duration:0.18}}>
            {VIEWS[nav]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Nav */}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:420,background:`${C.navyMid}f2`,backdropFilter:"blur(16px)",borderTop:`1px solid ${C.border}`,padding:"10px 0 22px",display:"flex",zIndex:20}}>
        {NAV.map(n=>(
          <button key={n.id} onClick={()=>setNav(n.id)}
            style={{flex:1,background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:0}}>
            <div style={{fontSize:20,lineHeight:1}}>{n.icon}</div>
            <span style={{fontSize:10,color:nav===n.id?C.emerald:C.slate,fontWeight:nav===n.id?700:400}}>{n.label}</span>
            {nav===n.id&&<div style={{width:16,height:2,background:C.emerald,borderRadius:2,marginTop:2}}/>}
          </button>
        ))}
      </div>

      {/* Modals */}
      <Modal open={modal==="tx"} onClose={closeModal} title={editItem?"Edit Transaction":"Add Transaction"}>
        <TxForm onSave={saveTx} onClose={closeModal} init={editItem}/>
      </Modal>
      <Modal open={modal==="income"} onClose={closeModal} title="Add Income">
        <TxForm onSave={saveTx} onClose={closeModal} forceType="income"/>
      </Modal>
      <Modal open={modal==="expense"} onClose={closeModal} title="Add Expense">
        <TxForm onSave={saveTx} onClose={closeModal} forceType="expense"/>
      </Modal>
      <Modal open={modal==="goal"} onClose={closeModal} title={editItem?"Edit Goal":"New Goal"}>
        <GoalForm onSave={saveGoal} onClose={closeModal} init={editItem}/>
      </Modal>
      <Modal open={modal==="budget"} onClose={closeModal} title={editItem?"Edit Budget":"New Budget"}>
        <BudgetForm onSave={saveBudget} onClose={closeModal} init={editItem}/>
      </Modal>
      <Modal open={showAI} onClose={()=>setShowAI(false)} title="✦ AI Financial Advisor">
        <AiPanel transactions={transactions} setTransactions={setTransactions}
          budgets={budgets} setBudgets={setBudgets}
          goals={goals} setGoals={setGoals}
          onClose={()=>setShowAI(false)}/>
      </Modal>
    </div>
  );
}
