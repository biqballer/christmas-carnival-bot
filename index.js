const express = require("express");
const { Telegraf, Markup } = require("telegraf");

const app = express();
const PORT = process.env.PORT || 3000;
const BOT_TOKEN = process.env.BOT_TOKEN;
const WEB_APP_URL = process.env.WEB_APP_URL || "https://YOUR-RENDER-SERVICE.onrender.com";

app.use(express.json());

const html = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<script src="https://telegram.org/js/telegram-web-app.js"></script>
<title>Christmas Carnival</title>

<style>
*{box-sizing:border-box}
body{
 margin:0;
 background:#07170e;
 color:white;
 font-family:Arial,sans-serif;
 padding:18px;
 padding-bottom:90px;
}
header{text-align:center;padding:15px}
header h1{color:#f6ce62;font-size:27px}
header p{color:#b9cdbd}
.card{
 background:#142d20;
 border:1px solid #315b3e;
 border-radius:17px;
 padding:18px;
 margin:14px 0;
 text-align:center;
}
button{
 background:#e8bd50;
 color:#172316;
 border:0;
 padding:13px 20px;
 border-radius:12px;
 font-weight:bold;
 margin:6px;
 cursor:pointer;
}
button:disabled{opacity:.5}
nav{
 position:fixed;
 bottom:0;
 left:0;
 right:0;
 background:#10271a;
 display:flex;
 justify-content:space-around;
 padding:10px 2px;
 border-top:1px solid #315b3e;
}
nav button{
 background:transparent;
 color:white;
 padding:8px 4px;
 font-size:11px;
 margin:0;
}
nav button.active{color:#f6ce62}
.page{display:none}
.page.active{display:block}
.big{font-size:30px;color:#f6ce62;font-weight:bold}
.wheel{
 width:210px;
 height:210px;
 border-radius:50%;
 margin:20px auto;
 border:7px solid #e8bd50;
 background:conic-gradient(
 #d82c36 0deg 45deg,
 #f5d56a 45deg 90deg,
 #287b45 90deg 135deg,
 #d82c36 135deg 180deg,
 #f5d56a 180deg 225deg,
 #287b45 225deg 270deg,
 #d82c36 270deg 315deg,
 #f5d56a 315deg 360deg
 );
 display:flex;
 align-items:center;
 justify-content:center;
 color:#14251a;
 font-weight:bold;
 font-size:20px;
 transition:transform 3s ease-out;
}
input{
 width:100%;
 padding:13px;
 border-radius:10px;
 border:1px solid #55745d;
 background:#07170e;
 color:white;
 margin:8px 0;
}
.notice{font-size:12px;color:#b9cdbd}
</style>
</head>

<body>

<header>
<h1>🎄 CHRISTMAS CARNIVAL 🎄</h1>
<p>Celebrate, play and earn demo points!</p>
</header>

<section id="home" class="page active">
<div class="card">
<h2>Welcome to Christmas Carnival!</h2>
<p>Enjoy the games and explore the carnival.</p>
<div class="big" id="homePoints">0</div>
<p>Your demo points</p>
</div>
<div class="card">
<h3>🎁 Carnival Activities</h3>
<p>Mine points, spin the wheel and invite friends.</p>
</div>
</section>

<section id="mining" class="page">
<div class="card">
<h2>⛏️ Mining Station</h2>
<p>Collect demo points every time you mine.</p>
<div class="big" id="minePoints">0</div>
<button onclick="mine()">START MINING</button>
<p id="mineMessage" class="notice"></p>
</div>
</section>

<section id="wheel" class="page">
<div class="card">
<h2>🎡 Lucky Wheel</h2>
<p>See what prize the wheel lands on!</p>
<div class="wheel" id="wheel">SPIN</div>
<button onclick="spin()">SPIN THE WHEEL</button>
<p id="wheelMessage"></p>
</div>
</section>

<section id="rewards" class="page">
<div class="card">
<h2>🎁 Rewards</h2>
<p>Your demo points balance:</p>
<div class="big" id="rewardPoints">0</div>
<p class="notice">Rewards shown here are demonstrations only.</p>
</div>
</section>

<section id="invite" class="page">
<div class="card">
<h2>👥 Invite Friends</h2>
<p>Invite friends to discover the carnival.</p>
<button onclick="invite()">INVITE FRIENDS</button>
</div>
</section>

<section id="withdraw" class="page">
<div class="card">
<h2>💰 Withdraw</h2>
<p>Withdrawal features are not yet available.</p>
<button disabled>WITHDRAW</button>
<p class="notice">No real USDT is currently being paid or withdrawn.</p>
</div>
</section>

<section id="league" class="page">
<div class="card">
<h2>🏆 Carnival League</h2>
<p>Compete and enjoy the carnival!</p>
<p>Leaderboard coming soon.</p>
</div>
</section>

<nav>
<button class="active" onclick="showPage('home',this)">🏠 Home</button>
<button onclick="showPage('mining',this)">⛏️ Mine</button>
<button onclick="showPage('wheel',this)">🎡 Wheel</button>
<button onclick="showPage('rewards',this)">🎁 Rewards</button>
<button onclick="showPage('invite',this)">👥 Invite</button>
<button onclick="showPage('withdraw',this)">💰 Withdraw</button>
<button onclick="showPage('league',this)">🏆 League</button>
</nav>

<script>
let points = 0;
let lastMine = 0;
let spinning = false;

function updatePoints(){
 document.getElementById("homePoints").textContent=points;
 document.getElementById("minePoints").textContent=points;
 document.getElementById("rewardPoints").textContent=points;
}

function showPage(id,button){
 document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
 document.getElementById(id).classList.add("active");
 document.querySelectorAll("nav button").forEach(b=>b.classList.remove("active"));
 button.classList.add("active");
}

function mine(){
 const now=Date.now();
 if(now-lastMine<60000){
  document.getElementById("mineMessage").textContent="Please wait before mining again.";
  return;
 }
 lastMine=now;
 points+=10;
 updatePoints();
 document.getElementById("mineMessage").textContent="You collected 10 demo points!";
}

function spin(){
 if(spinning)return;
 spinning=true;
 const wheel=document.getElementById("wheel");
 const prizes=[5,10,20,50,100];
 const prize=prizes[Math.floor(Math.random()*prizes.length)];
 wheel.style.transform="rotate("+(1800+Math.floor(Math.random()*360))+"deg)";
 document.getElementById("wheelMessage").textContent="The wheel is spinning...";
 setTimeout(()=>{
  points+=prize;
  updatePoints();
  document.getElementById("wheelMessage").textContent="Congratulations! You won "+prize+" demo points!";
  wheel.style.transform="rotate(0deg)";
  spinning=false;
 },3000);
}

function invite(){
 if(window.Telegram && Telegram.WebApp){
  Telegram.WebApp.openTelegramLink("https://t.me/share/url?url="+encodeURIComponent(location.href)+"&text="+encodeURIComponent("Join me at Christmas Carnival!"));
 }else{
  alert("Open this app inside Telegram to invite friends.");
 }
}

if(window.Telegram && Telegram.WebApp){
 Telegram.WebApp.ready();
 Telegram.WebApp.expand();
}
</script>

</body>
</html>
`;

app.get("/", (req, res) => {
 res.send(html);
});

app.get("/health", (req, res) => {
 res.json({ status: "ok", app: "Christmas Carnival" });
});

if (BOT_TOKEN) {
 const bot = new Telegraf(BOT_TOKEN);

 bot.start(async (ctx) => {
  await ctx.reply(
   "🎄 Welcome to Christmas Carnival!",
   Markup.inlineKeyboard([
    [Markup.button.webApp("🎁 Open Christmas Carnival", WEB_APP_URL)]
   ])
  );
 });

 bot.launch().catch(err => {
  console.error("Telegram bot error:", err.message);
 });
}

app.listen(PORT, () => {
 console.log("Christmas Carnival server running on port " + PORT);
});
