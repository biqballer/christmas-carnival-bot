const express = require("express");
const crypto = require("crypto");
const { Pool } = require("pg");
const { Telegraf, Markup } = require("telegraf");

const app = express();
const PORT = process.env.PORT || 3000;
const BOT_TOKEN = process.env.BOT_TOKEN;
const WEB_APP_URL = process.env.WEB_APP_URL || "https://christmas-carnival-bot.onrender.com";

if (!process.env.DATABASE_URL || !BOT_TOKEN) {
  throw new Error("DATABASE_URL and BOT_TOKEN are required");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const bot = new Telegraf(BOT_TOKEN);
let botUsername = "";

app.use(express.json());

const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<script src="https://telegram.org/js/telegram-web-app.js"></script>
<title>Christmas Carnival</title>
<style>
*{box-sizing:border-box}
body{margin:0;background:#071b13;color:#fff;font-family:Arial,sans-serif}
header{padding:22px 18px;text-align:center;background:linear-gradient(135deg,#103d29,#071b13);border-bottom:1px solid #b99a48}
.logo{font-size:25px;font-weight:bold;color:#f5d77b}
.sub{font-size:12px;color:#c9c9b8;margin-top:6px}
main{padding:18px;max-width:480px;margin:auto}
.card{background:linear-gradient(145deg,#153b2a,#10291e);border:1px solid #426344;border-radius:18px;padding:20px;margin-bottom:16px}
.label{font-size:12px;color:#c4cbbd}
.balance{font-size:37px;font-weight:bold;color:#f6d879;margin:10px 0}
.gold{color:#f6d879}
button{width:100%;padding:15px;border:0;border-radius:12px;background:linear-gradient(90deg,#d7ae49,#f5df91);color:#172417;font-size:16px;font-weight:bold;margin-top:12px}
button:disabled{opacity:.5}
.row{display:flex;justify-content:space-between;gap:10px;margin:13px 0;font-size:14px}
.bar{height:9px;background:#304a37;border-radius:20px;overflow:hidden;margin-top:12px}
.progress{height:100%;width:0;background:#e6c45e}
nav{display:flex;gap:8px;margin-bottom:16px}
nav button{margin:0;padding:12px 5px;font-size:13px}
.hidden{display:none}
.notice{text-align:center;color:#c5c9bc;font-size:13px;line-height:1.6}
#status{padding:12px;text-align:center;color:#f5d77b;font-size:13px}
</style>
</head>
<body>
<header>
<div class="logo">🎄 CHRISTMAS CARNIVAL</div>
<div class="sub">A new season of rewards begins here</div>
</header>
<main>
<div id="status">Connecting to Christmas Carnival...</div>
<div id="app" class="hidden">
<nav>
<button onclick="showPage('home')">Home</button>
<button onclick="showPage('mining')">Mining</button>
<button onclick="showPage('friends')">Friends</button>
</nav>

<section id="home">
<div class="card">
<div class="label">YOUR CARNIVAL BALANCE</div>
<div class="balance" id="balance">0.00</div>
<div class="label">CARNIVAL POINTS</div>
<div class="row">
<span>Conversion rate</span>
<span class="gold">100 points = 1 USDT</span>
</div>
</div>
<div class="card">
<div class="label">MINING STATUS</div>
<div class="row">
<strong id="miningStatus">Not mining</strong>
<strong class="gold" id="countdown">--:--:--</strong>
</div>
<div class="bar"><div class="progress" id="progress"></div></div>
<p class="notice" id="miningMessage">Start a mining session to earn Carnival Points.</p>
<button id="startButton" onclick="startMining()">Start Mining</button>
</div>
</section>

<section id="mining" class="hidden">
<div class="card">
<h3>⛏️ Carnival Mining</h3>
<div class="balance">50 <span style="font-size:16px">points/hour</span></div>
<p class="notice">Each mining session lasts 24 hours. When it ends, return to start another session.</p>
<div class="row"><span>Session duration</span><span>24 hours</span></div>
<div class="row"><span>Hourly reward</span><span>50 points</span></div>
<div class="row"><span>Maximum per session</span><span>1,200 points</span></div>
<button onclick="startMining()">Start / Restart Mining</button>
</div>
</section>

<section id="friends" class="hidden">
<div class="card">
<h3>👥 Invite Friends</h3>
<div class="balance" id="refCount">0</div>
<div class="label">SUCCESSFUL REFERRALS</div>
<p class="notice">Earn 50 Carnival Points for each successfully registered referral.</p>
<div class="row"><span>Reward per referral</span><span class="gold">50 points</span></div>
<button onclick="shareInvite()">Invite Friends</button>
</div>
</section>
</div>
</main>

<script>
const tg = window.Telegram && window.Telegram.WebApp;
let baseBalance = 0;
let syncTime = Date.now();
let miningEnd = null;
let miningStart = null;
let miningActive = false;
let referralLink = "";

if(tg){
 tg.ready();
 tg.expand();
}

function showStatus(message){
 document.getElementById("status").textContent = message;
}

function showPage(page){
 ["home","mining","friends"].forEach(function(id){
  document.getElementById(id).classList.toggle("hidden",id!==page);
 });
}

async function api(path,method){
 const response = await fetch(path,{
  method:method || "GET",
  headers:{
   "Content-Type":"application/json",
   "X-Telegram-Init-Data":tg.initData
  }
 });
 const data = await response.json();
 if(!response.ok) throw new Error(data.error || "Request failed");
 return data;
}

async function loadAccount(){
 try{
  if(!tg || !tg.initData){
   showStatus("Please open Christmas Carnival through our Telegram bot.");
   return;
  }
  const data = await api("/api/me");
  baseBalance = Number(data.balance);
  syncTime = Date.now();
  miningActive = data.mining_active;
  miningEnd = data.mining_ends_at ? new Date(data.mining_ends_at) : null;
  miningStart = data.mining_started_at ? new Date(data.mining_started_at) : null;
  referralLink = data.referral_link;
  document.getElementById("refCount").textContent = data.referral_count;
  document.getElementById("app").classList.remove("hidden");
  showStatus("Welcome to Christmas Carnival!");
  updateScreen();
 }catch(error){
  showStatus(error.message);
 }
}

function updateScreen(){
 let earned = baseBalance;
 if(miningActive){
  let elapsed = Math.max(0,(Date.now()-syncTime)/1000);
  earned += Math.min(elapsed,86400)*50/3600;
 }
 document.getElementById("balance").textContent = earned.toFixed(2);
 const status = document.getElementById("miningStatus");
 const countdown = document.getElementById("countdown");
 const message = document.getElementById("miningMessage");
 const button = document.getElementById("startButton");

 if(miningActive && miningEnd){
  let remaining = Math.max(0,Math.floor((miningEnd.getTime()-Date.now())/1000));
  let h = Math.floor(remaining/3600);
  let m = Math.floor((remaining%3600)/60);
  let s = remaining%60;
  status.textContent = "● MINING ACTIVE";
  countdown.textContent = [h,m,s].map(x=>String(x).padStart(2,"0")).join(":");
  message.textContent = "Your points are increasing automatically.";
  button.textContent = "Mining in progress";
  button.disabled = true;
  let total = miningEnd.getTime()-miningStart.getTime();
  let done = Date.now()-miningStart.getTime();
  document.getElementById("progress").style.width =
   Math.min(100,Math.max(0,done/total*100))+"%";
 }else{
  status.textContent = "Mining inactive";
  countdown.textContent = "00:00:00";
  message.textContent = "Your session has ended. Start another 24-hour session.";
  button.textContent = "Start Mining";
  button.disabled = false;
  document.getElementById("progress").style.width = "0%";
 }
}

async function startMining(){
 try{
  const data = await api("/api/mining/start","POST");
  baseBalance = Number(data.balance);
  syncTime = Date.now();
  miningActive = true;
  miningStart = new Date(data.mining_started_at);
  miningEnd = new Date(data.mining_ends_at);
  updateScreen();
  showStatus("Your 24-hour mining session has started!");
 }catch(error){
  showStatus(error.message);
 }
}

function shareInvite(){
 if(!referralLink) return;
 if(tg && tg.openTelegramLink){
  tg.openTelegramLink("https://t.me/share/url?url="+encodeURIComponent(referralLink)+"&text="+encodeURIComponent("Join me on Christmas Carnival!"));
 }else{
  navigator.clipboard.writeText(referralLink);
  showStatus("Invite link copied.");
 }
}

setInterval(updateScreen,1000);
setInterval(loadAccount,30000);
loadAccount();
</script>
</body>
</html>`;

app.get("/", (req, res) => res.send(html));

app.get("/health", (req, res) => {
  res.json({ status: "ok", app: "Christmas Carnival" });
});
