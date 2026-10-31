const express = require("express");
const { Telegraf, Markup } = require("telegraf");

const app = express();
const PORT = process.env.PORT || 3000;
const BOT_TOKEN = process.env.BOT_TOKEN;
const WEB_APP_URL = process.env.WEB_APP_URL || "https://christmas-carnival-bot.onrender.com";

const html = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<script src="https://telegram.org/js/telegram-web-app.js"></script>
<title>Christmas Carnival</title>

<style>
*{box-sizing:border-box}
body{
 margin:0;
 background:#07140e;
 color:#fff;
 font-family:Arial,sans-serif;
 padding-bottom:90px;
}
.top{
 background:linear-gradient(135deg,#103c25,#07140e);
 padding:25px 18px 30px;
 border-bottom:1px solid #b58b35;
}
.topline{display:flex;justify-content:space-between;align-items:center}
.logo{font-size:19px;font-weight:bold;color:#f4d078}
.profile{
 width:40px;height:40px;border-radius:50%;
 background:#d7aa46;color:#17301e;
 display:grid;place-items:center;font-size:20px;
}
.greeting{margin-top:27px}
.greeting small{color:#b7cbbb}
.greeting h1{font-size:25px;margin:8px 0;color:#fff}
.balance{
 margin-top:22px;
 padding:20px;
 border-radius:18px;
 background:linear-gradient(120deg,#c79a3d,#f0d27e,#a97924);
 color:#172719;
 box-shadow:0 8px 25px #0005;
}
.balance small{font-weight:bold}
.amount{font-size:32px;font-weight:bold;margin:10px 0}
.balance span{font-size:12px}
.content{padding:16px}
.page{display:none}
.page.active{display:block}
.card{
 background:linear-gradient(145deg,#173624,#10271b);
 border:1px solid #31583b;
 border-radius:18px;
 padding:18px;
 margin-bottom:15px;
}
.card h3{margin-top:0}
.muted{color:#a9c1ae;font-size:13px;line-height:1.6}
.gold{color:#f2cf76}
.section-title{font-size:19px;margin:23px 0 13px}
.stats{
 display:grid;
 grid-template-columns:1fr 1fr;
 gap:12px;
}
.stat{
 background:#142d1e;
 border:1px solid #31583b;
 border-radius:15px;
 padding:16px;
}
.stat strong{display:block;font-size:22px;color:#f2cf76;margin-top:8px}
.btn{
 background:linear-gradient(120deg,#e3bd63,#f5dc94);
 color:#172819;
 border:0;
 border-radius:12px;
 padding:14px 18px;
 font-weight:bold;
 width:100%;
 cursor:pointer;
 font-size:14px;
}
.btn.secondary{
 background:#244b30;color:white;
 border:1px solid #507653;
}
.btn:disabled{opacity:.45}
.activity{
 display:flex;align-items:center;gap:13px;
 padding:14px 0;border-bottom:1px solid #31583b;
}
.icon{
 width:43px;height:43px;border-radius:13px;
 display:grid;place-items:center;
 background:#254a30;font-size:22px;
}
.activity:last-child{border:0}
.activity small{color:#a9c1ae}
.progress{
 height:9px;background:#07140e;border-radius:20px;
 overflow:hidden;margin:13px 0;
}
.progress div{height:100%;background:#e9c46a;width:35%}
.wheelbox{
 background:#10271a;
 border-radius:20px;padding:20px 10px;text-align:center;
}
canvas{max-width:100%;height:auto}
.pointer{
 width:0;height:0;margin:auto;
 border-left:13px solid transparent;
 border-right:13px solid transparent;
 border-top:28px solid #fff;
 position:relative;z-index:2;
 margin-bottom:-8px;
}
.wheel-wrap{position:relative;width:290px;max-width:100%;margin:auto}
#wheel{width:100%;height:auto;display:block}
.center-wheel{
 position:absolute;top:50%;left:50%;
 transform:translate(-50%,-50%);
 width:57px;height:57px;border-radius:50%;
 background:#f5d27b;color:#17301e;
 border:5px solid white;
 display:grid;place-items:center;
 font-size:13px;font-weight:bold;
}
.prize{
 display:flex;justify-content:space-between;
 padding:13px 0;border-bottom:1px solid #31583b;
}
input{
 width:100%;padding:14px;border-radius:11px;
 border:1px solid #45674d;background:#07140e;
 color:white;margin:9px 0;
}
.leader{
 display:flex;align-items:center;justify-content:space-between;
 padding:14px 0;border-bottom:1px solid #31583b;
}
.rank{font-size:20px;width:35px}
nav{
 position:fixed;bottom:0;left:0;right:0;
 background:#10271a;border-top:1px solid #416447;
 display:flex;overflow-x:auto;
 padding:9px 3px;
 z-index:10;
}
nav button{
 flex:1;min-width:65px;
 background:none;border:0;color:#a9c1ae;
 font-size:10px;padding:7px 2px;
}
nav button span{display:block;font-size:20px;margin-bottom:5px}
nav button.active{color:#f2cf76}
.notice{
 font-size:12px;color:#b5c8b8;
 line-height:1.6;margin-top:12px;
}
.hero{
 background:linear-gradient(135deg,#79252b,#183c27);
 border-radius:18px;padding:22px;
 margin-bottom:15px;
 border:1px solid #a87b39;
}
.hero h2{color:#f4d078}
</style>
</head>

<body>

<header class="top">
 <div class="topline">
  <div class="logo">🎄 CHRISTMAS CARNIVAL</div>
  <div class="profile">🎅</div>
 </div>

 <div class="greeting">
  <small>WELCOME TO THE CARNIVAL</small>
  <h1>Hello, Carnival Player! 👋</h1>
  <small>Your Christmas adventure starts here.</small>
 </div>

 <div class="balance">
  <small>YOUR CARNIVAL POINTS</small>
  <div class="amount" id="balance">0.00</div>
  <span>DEMO POINTS • NOT REAL USDT</span>
 </div>
</header>

<main class="content">

<section id="home" class="page active">

 <div class="hero">
  <h2>🎁 The Christmas Celebration!</h2>
  <p>Play games, explore activities and enjoy the festive season.</p>
 </div>

 <div class="stats">
  <div class="stat">
   <small>⛏️ Mining Points</small>
   <strong id="minedStat">0</strong>
  </div>
  <div class="stat">
   <small>🎡 Wheel Spins</small>
   <strong id="spinsStat">0</strong>
  </div>
 </div>

 <h3 class="section-title">Carnival Activities</h3>

 <div class="card">
  <div class="activity">
   <div class="icon">⛏️</div>
   <div><b>Mining Station</b><br><small>Collect carnival points</small></div>
  </div>
  <div class="activity">
   <div class="icon">🎡</div>
   <div><b>Lucky Wheel</b><br><small>Spin and discover prizes</small></div>
  </div>
  <div class="activity">
   <div class="icon">👥</div>
   <div><b>Invite Friends</b><br><small>Share the carnival</small></div>
  </div>
 </div>

 <div class="card">
  <h3>🎄 Your Progress</h3>
  <div class="progress"><div id="progress"></div></div>
  <small class="muted">Keep exploring the carnival!</small>
 </div>

</section>

<section id="mining" class="page">

 <div class="hero">
  <h2>⛏️ Mining Station</h2>
  <p>Welcome to your personal carnival mining station.</p>
 </div>

 <div class="card" style="text-align:center">
  <div style="font-size:55px">🎄</div>
  <p class="muted">YOUR MINING BALANCE</p>
  <div class="amount gold" id="mineBalance">0</div>
  <button class="btn" id="mineButton" onclick="mine()">START MINING</button>
  <p id="mineStatus" class="notice">Mining is ready.</p>
  <p class="muted">Demo mining reward: 10 points every 60 seconds.</p>
 </div>

 <div class="card">
  <h3>Mining Information</h3>
  <div class="prize"><span>Mining reward</span><b>10 points</b></div>
  <div class="prize"><span>Mining duration</span><b>60 seconds cooldown</b></div>
  <div class="prize"><span>Mining status</span><b class="gold">Demo</b></div>
 </div>

</section>

<section id="wheel" class="page">

 <div class="hero">
  <h2>🎡 The Lucky Christmas Wheel</h2>
  <p>Every section has a different demo prize. Watch the wheel spin!</p>
 </div>

 <div class="card wheelbox">
  <div class="pointer"></div>
  <div class="wheel-wrap">
   <canvas id="wheel" width="600" height="600"></canvas>
   <div class="center-wheel">SPIN</div>
  </div>
  <h3 class="gold">YOUR LUCK AWAITS!</h3>
  <button class="btn" id="spinButton" onclick="spin()">🎡 SPIN THE WHEEL</button>
  <p id="spinStatus" class="notice">Ready for your next spin?</p>
 </div>

 <div class="card">
  <h3>🎁 Available Wheel Prizes</h3>
  <div class="prize"><span>Prize 1</span><b>5 points</b></div>
  <div class="prize"><span>Prize 2</span><b>10 points</b></div>
  <div class="prize"><span>Prize 3</span><b>20 points</b></div>
  <div class="prize"><span>Prize 4</span><b>50 points</b></div>
  <div class="prize"><span>Prize 5</span><b>100 points</b></div>
  <div class="prize"><span>Prize 6</span><b>200 points</b></div>
 </div>

</section>

<section id="rewards" class="page">

 <div class="hero">
  <h2>🎁 Rewards Centre</h2>
  <p>Keep track of your carnival points and activities.</p>
 </div>

 <div class="card">
  <small class="muted">TOTAL DEMO POINTS</small>
  <div class="amount gold" id="rewardBalance">0</div>
  <p class="muted">Your current demonstration balance.</p>
 </div>

 <div class="card">
  <h3>Reward Information</h3>
  <div class="prize"><span>Mining rewards</span><b>Demo points</b></div>
  <div class="prize"><span>Wheel rewards</span><b>Demo points</b></div>
  <div class="prize"><span>USDT conversion</span><b>Not available</b></div>
 </div>

</section>

<section id="invite" class="page">

 <div class="hero">
  <h2>👥 Invite Friends</h2>
  <p>Share the Christmas Carnival with your friends.</p>
 </div>

 <div class="card" style="text-align:center">
  <div style="font-size:55px">🎅</div>
  <h3>Bring Your Friends Along!</h3>
  <p class="muted">Share your carnival invitation through Telegram.</p>
  <button class="btn" onclick="invite()">SHARE INVITATION</button>
  <p class="notice">Referral tracking and referral rewards are not yet activated.</p>
 </div>

</section>

<section id="withdraw" class="page">

 <div class="hero">
  <h2>💰 Withdrawal Centre</h2>
  <p>Withdrawal interface preview.</p>
 </div>

 <div class="card">
  <h3>USDT Withdrawal</h3>
  <label class="muted">USDT wallet address</label>
  <input placeholder="Enter your USDT wallet address" disabled>
  <label class="muted">Amount</label>
  <input type="number" placeholder="Enter amount" disabled>
  <button class="btn" disabled>WITHDRAW</button>
  <p class="notice">Real USDT payments and withdrawals are not connected. No deposits or withdrawals are currently supported.</p>
 </div>

</section>

<section id="league" class="page">

 <div class="hero">
  <h2>🏆 Carnival League</h2>
  <p>Discover the leaderboard and compete with other players.</p>
 </div>

 <div class="card">
  <h3>🏆 Top Players</h3>
  <div class="leader"><span><b>🥇</b> Player One</span><b>Coming soon</b></div>
  <div class="leader"><span><b>🥈</b> Player Two</span><b>Coming soon</b></div>
  <div class="leader"><span><b>🥉</b> Player Three</span><b>Coming soon</b></div>
  <p class="notice">Live player rankings require a connected database.</p>
 </div>

</section>

</main>

<nav>
 <button class="active" onclick="showPage('home',this)"><span>🏠</span>Home</button>
 <button onclick="showPage('mining',this)"><span>⛏️</span>Mining</button>
 <button onclick="showPage('wheel',this)"><span>🎡</span>Wheel</button>
 <button onclick="showPage('rewards',this)"><span>🎁</span>Rewards</button>
 <button onclick="showPage('invite',this)"><span>👥</span>Invite</button>
 <button onclick="showPage('withdraw',this)"><span>💰</span>Withdraw</button>
 <button onclick="showPage('league',this)"><span>🏆</span>League</button>
</nav>

<script>
let points=0;
let mined=0;
let spins=0;
let lastMine=0;
let spinning=false;
let rotation=0;

function update(){
 document.getElementById("balance").textContent=points.toFixed(2);
 document.getElementById("mineBalance").textContent=mined;
 document.getElementById("rewardBalance").textContent=points;
 document.getElementById("minedStat").textContent=mined;
 document.getElementById("spinsStat").textContent=spins;
 document.getElementById("progress").style.width=Math.min(points/5,100)+"%";
}

function showPage(id,button){
 document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
 document.getElementById(id).classList.add("active");
 document.querySelectorAll("nav button").forEach(b=>b.classList.remove("active"));
 button.classList.add("active");
 window.scrollTo(0,0);
}

function mine(){
 let now=Date.now();
 if(now-lastMine<60000){
  let remaining=Math.ceil((60000-(now-lastMine))/1000);
  document.getElementById("mineStatus").textContent="Please wait "+remaining+" seconds before mining again.";
  return;
 }
 lastMine=now;
 points+=10;
 mined+=10;
 update();
 document.getElementById("mineStatus").textContent="🎉 Congratulations! You collected 10 demo points.";
}

const canvas=document.getElementById("wheel");
const ctx=canvas.getContext("2d");
const prizes=[5,10,20,50,100,200,10,20];
const colors=["#b82732","#e8c15e","#187442","#d23c3c","#e8c15e","#187442","#b82732","#e8c15e"];

function drawWheel(){
 const cx=300,cy=300,r=285;
 ctx.clearRect(0,0,600,600);
 const step=Math.PI*2/prizes.length;
 for(let i=0;i<prizes.length;i++){
  const start=rotation+i*step;
  ctx.beginPath();
  ctx.moveTo(cx,cy);
  ctx.arc(cx,cy,r,start,start+step);
  ctx.closePath();
  ctx.fillStyle=colors[i];
  ctx.fill();
  ctx.strokeStyle="#fff0c4";
  ctx.lineWidth=5;
  ctx.stroke();

  ctx.save();
  ctx.translate(cx,cy);
  ctx.rotate(start+step/2);
  ctx.textAlign="right";
  ctx.fillStyle="#ffffff";
  ctx.font="bold 30px Arial";
  ctx.shadowColor="#000";
  ctx.shadowBlur=4;
  ctx.fillText(prizes[i]+" PTS",r-25,10);
  ctx.restore();
 }
 ctx.beginPath();
 ctx.arc(cx,cy,r,0,Math.PI*2);
 ctx.strokeStyle="#e8c15e";
 ctx.lineWidth=12;
 ctx.stroke();
}

drawWheel();

function spin(){
 if(spinning)return;
 spinning=true;
 document.getElementById("spinButton").disabled=true;
 document.getElementById("spinStatus").textContent="🎡 The wheel is spinning...";

 const winner=Math.floor(Math.random()*prizes.length);
 const step=Math.PI*2/prizes.length;
 const target=-(winner*step+step/2);
 const extra=Math.PI*2*6;
 const start=rotation;
 const end=start+extra+target;
 const duration=4500;
 const startTime=performance.now();

 function animate(now){
  let t=Math.min((now-startTime)/duration,1);
  let eased=1-Math.pow(1-t,4);
  rotation=start+(end-start)*eased;
  drawWheel();

  if(t<1){
   requestAnimationFrame(animate);
  }else{
   points+=prizes[winner];
   spins++;
   update();
   document.getElementById("spinStatus").textContent="🎉 You won "+prizes[winner]+" demo points!";
   spinning=false;
   document.getElementById("spinButton").disabled=false;
  }
 }
 requestAnimationFrame(animate);
}

function invite(){
 const url=location.href;
 const message="Join me at Christmas Carnival!";
 if(window.Telegram && Telegram.WebApp){
  Telegram.WebApp.openTelegramLink("https://t.me/share/url?url="+encodeURIComponent(url)+"&text="+encodeURIComponent(message));
 }else{
  window.open("https://t.me/share/url?url="+encodeURIComponent(url)+"&text="+encodeURIComponent(message));
 }
}

if(window.Telegram && Telegram.WebApp){
 Telegram.WebApp.ready();
 Telegram.WebApp.expand();
}
update();
</script>

</body>
</html>
`;

app.get("/",(req,res)=>res.send(html));
app.get("/health",(req,res)=>res.json({status:"ok",app:"Christmas Carnival"}));

if(BOT_TOKEN){
 const bot=new Telegraf(BOT_TOKEN);
 bot.start(async(ctx)=>{
  await ctx.reply(
   "🎄 Welcome to Christmas Carnival!",
   Markup.inlineKeyboard([
    [Markup.button.webApp("🎁 Open Christmas Carnival",WEB_APP_URL)]
   ])
  );
 });
 bot.launch().catch(err=>console.error("Bot error:",err.message));
}

app.listen(PORT,()=>{
 console.log("Christmas Carnival is running on port "+PORT);
});
