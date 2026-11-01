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
.sub{font-size:12px;color:#c9
</style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background:
    radial-gradient(ellipse at top, #243b68 0%, transparent 55%),
    linear-gradient(180deg, #080f20 0%, #111a30 55%, #080d19 100%);
  color: #ffffff;
  font-family: Arial, sans-serif;
  min-height: 100vh;
}

header {
  padding: 24px 16px;
  text-align: center;
  background: linear-gradient(135deg, #172b4d, #10182a);
  border-bottom: 1px solid rgba(255, 207, 112, 0.4);
  box-shadow: 0 8px 30px #0005;
}

.logo {
  font-size: 23px;
  font-weight: 900;
  color: #ffda87;
  letter-spacing: 1px;
  text-shadow: 0 0 18px #ffbd5944;
}

.sub {
  font-size: 12px;
  color: #c8d4e9;
  margin-top: 8px;
}

main {
  padding: 18px 14px 100px;
  max-width: 480px;
  margin: auto;
}

.card {
  background: linear-gradient(145deg, #202e49, #121d32);
  border: 1px solid #ffffff18;
  border-radius: 22px;
  padding: 21px;
  margin-bottom: 17px;
  box-shadow: 0 12px 30px #0004;
}

.label {
  font-size: 11px;
  color: #b8c7df;
  letter-spacing: 1.5px;
  font-weight: bold;
}

.balance {
  font-size: 36px;
  font-weight: 900;
  color: #ffda87;
  margin: 12px 0;
  overflow-wrap: anywhere;
}

.gold {
  color: #ffda87;
}

button {
  width: 100%;
  padding: 16px;
  border: 1px solid #ffe4a4;
  border-radius: 14px;
  background: linear-gradient(135deg, #ffdf96, #e8aa43);
  color: #17213a;
  font-size: 15px;
  font-weight: 900;
  margin-top: 12px;
  box-shadow: 0 5px 18px #e8aa4330;
  cursor: pointer;
}

button:active {
  transform: scale(0.98);
}

button:disabled {
  opacity: 0.55;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin: 15px 0;
  font-size: 13px;
}

.bar {
  height: 9px;
  background: #ffffff16;
  border-radius: 20px;
  overflow: hidden;
  margin-top: 14px;
}

.progress {
  height: 100%;
  width: 0;
  background: linear-gradient(90deg, #e5a63f, #fff0ae);
  border-radius: 20px;
  transition: width 0.5s;
}

nav {
  display: flex;
  gap: 8px;
  margin-bottom: 18px;
}

nav button {
  margin: 0;
  padding: 12px 5px;
  font-size: 12px;
  color: #e6edf9;
  background: #ffffff0d;
  border: 1px solid #ffffff20;
  box-shadow: none;
}

.hidden {
  display: none !important;
}

.notice {
  text-align: center;
  color: #c5d0e3;
  font-size: 13px;
  line-height: 1.7;
}

#status {
  padding: 12px;
  text-align: center;
  color: #ffda87;
  font-size: 13px;
  line-height: 1.6;
}

h3 {
  color: #ffda87;
}

@media (max-width: 360px) {
  .logo {
    font-size: 19px;
  }

  .balance {
    font-size: 30px;
  }

  .card {
    padding: 16px;
  }
}
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
// DATABASE SETUP
async function setupDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS players (
      telegram_id BIGINT PRIMARY KEY,
      username TEXT,
      first_name TEXT,
      balance NUMERIC(20,6) NOT NULL DEFAULT 0,
      referred_by BIGINT REFERENCES players(telegram_id),
      mining_started_at TIMESTAMPTZ,
      mining_ends_at TIMESTAMPTZ,
      mining_credited_until TIMESTAMPTZ,
      mining_notified_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
}

// VERIFY TELEGRAM LOGIN
function verifyTelegram(initData) {
  if (!initData) throw new Error("Telegram login required");

  const params = new URLSearchParams(initData);
  const hash = params.get("hash");

  if (!hash) throw new Error("Invalid Telegram login");

  const authDate = Number(params.get("auth_date"));

  if (!authDate || Date.now() / 1000 - authDate > 86400 ||
      authDate > Date.now() / 1000 + 60) {
    throw new Error("Telegram login expired. Reopen the app.");
  }

  const checkString = [...params.entries()]
    .filter(([key]) => key !== "hash")
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  const secret = crypto
    .createHmac("sha256", "WebAppData")
    .update(BOT_TOKEN)
    .digest();

  const calculated = crypto
    .createHmac("sha256", secret)
    .update(checkString)
    .digest("hex");

  const a = Buffer.from(hash, "hex");
  const b = Buffer.from(calculated, "hex");

  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    throw new Error("Telegram verification failed");
  }

  const user = JSON.parse(params.get("user") || "null");

  if (!user || !user.id) throw new Error("Player information missing");

  return { user, params };
}

// AUTHENTICATION MIDDLEWARE
async function authenticate(req, res, next) {
  try {
    const initData = req.headers["x-telegram-init-data"];
    const verified = verifyTelegram(initData);

    req.player = verified.user;
    req.startParam = verified.params.get("start_param");

    next();
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
}

// CREATE OR FIND PLAYER
async function getPlayer(user, startParam) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    let referralId = null;

    if (startParam && startParam.startsWith("ref_")) {
      const possibleId = startParam.slice(4);

      if (/^\d+$/.test(possibleId) &&
          possibleId !== String(user.id)) {
        referralId = possibleId;
      }
    }

    const existing = await client.query(
      "SELECT * FROM players WHERE telegram_id=$1 FOR UPDATE",
      [String(user.id)]
    );

    if (existing.rows.length) {
      await client.query("COMMIT");
      return existing.rows[0];
    }

    if (referralId) {
      const referrer = await client.query(
        "SELECT telegram_id FROM players WHERE telegram_id=$1 FOR UPDATE",
        [referralId]
      );

      if (!referrer.rows.length) referralId = null;
    }

    const created = await client.query(`
      INSERT INTO players
      (telegram_id, username, first_name, referred_by)
      VALUES ($1,$2,$3,$4)
      RETURNING *
    `, [
      String(user.id),
      user.username || null,
      user.first_name || "Player",
      referralId
    ]);

    if (referralId) {
      await client.query(
        "UPDATE players SET balance=balance+50 WHERE telegram_id=$1",
        [referralId]
      );
    }

    await client.query("COMMIT");
    return created.rows[0];

  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

// CREDIT MINING EARNINGS SAFELY
async function settleMining(telegramId) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await client.query(
      "SELECT * FROM players WHERE telegram_id=$1 FOR UPDATE",
      [String(telegramId)]
    );

    if (!result.rows.length) throw new Error("Player not found");

    const player = result.rows[0];

    if (player.mining_started_at && player.mining_ends_at) {
      const now = Date.now();
      const end = new Date(player.mining_ends_at).getTime();
      const last = new Date(player.mining_credited_until).getTime();

      const through = Math.min(now, end);
      const seconds = Math.max(0, (through - last) / 1000);
      const reward = seconds * 50 / 3600;

      if (reward > 0) {
        await client.query(`
          UPDATE players
          SET balance=balance+$1,
              mining_credited_until=$2
          WHERE telegram_id=$3
        `, [
          reward,
          new Date(through),
          String(telegramId)
        ]);
      }
    }

    const updated = await client.query(
      "SELECT * FROM players WHERE telegram_id=$1",
      [String(telegramId)]
    );

    await client.query("COMMIT");
    return updated.rows[0];

  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

// PLAYER ACCOUNT
app.get("/api/me", authenticate, async (req, res) => {
  try {
    await getPlayer(req.player, req.startParam);

    const player = await settleMining(req.player.id);

    const count = await pool.query(
      "SELECT COUNT(*) FROM players WHERE referred_by=$1",
      [String(req.player.id)]
    );

    res.json({
      balance: player.balance,
      mining_active: !!player.mining_ends_at &&
        new Date(player.mining_ends_at) > new Date(),
      mining_started_at: player.mining_started_at,
      mining_ends_at: player.mining_ends_at,
      referral_count: Number(count.rows[0].count),
      referral_link: `https://t.me/${botUsername}?start=ref_${req.player.id}`
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not load account" });
  }
});

// START A NEW MINING SESSION
app.post("/api/mining/start", authenticate, async (req, res) => {
  try {
    await getPlayer(req.player, req.startParam);

    const player = await settleMining(req.player.id);

    if (player.mining_ends_at &&
        new Date(player.mining_ends_at) > new Date()) {
      return res.status(400).json({
        error: "Your mining session is already active."
      });
    }

    const started = await pool.query(`
      UPDATE players
      SET mining_started_at=NOW(),
          mining_ends_at=NOW()+INTERVAL '24 hours',
          mining_credited_until=NOW(),
          mining_notified_at=NULL
      WHERE telegram_id=$1
      RETURNING *
    `, [String(req.player.id)]);

    res.json({
      balance: started.rows[0].balance,
      mining_started_at: started.rows[0].mining_started_at,
      mining_ends_at: started.rows[0].mining_ends_at
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not start mining" });
  }
});

// TELEGRAM BOT
bot.start(async (ctx) => {
  try {
    const payload = ctx.startPayload || "";

    const startParam = payload.startsWith("ref_")
      ? payload
      : null;

    await getPlayer(ctx.from, startParam);

    await ctx.reply(
      "🎄 Welcome to Christmas Carnival!\n\nYour festive rewards journey starts here.",
      Markup.inlineKeyboard([
        Markup.button.webApp(
          "🎁 Open Christmas Carnival",
          WEB_APP_URL
        )
      ])
    );

  } catch (error) {
    console.error(error);
    await ctx.reply("Sorry, something went wrong. Please try again.");
  }
});

// NOTIFY PLAYERS WHEN MINING EXPIRES
async function notifyExpiredMining() {
  const result = await pool.query(`
    SELECT telegram_id
    FROM players
    WHERE mining_ends_at <= NOW()
      AND mining_notified_at IS NULL
    LIMIT 100
  `);

  for (const player of result.rows) {
    try {
      await bot.telegram.sendMessage(
        String(player.telegram_id),
        "🎄 Your Christmas Carnival mining session has ended!\n\nYour 24-hour session is complete. Return to Christmas Carnival and tap Start Mining to begin another session."
      );

      await pool.query(`
        UPDATE players
        SET mining_notified_at=NOW()
        WHERE telegram_id=$1
          AND mining_notified_at IS NULL
      `, [player.telegram_id]);

    } catch (error) {
      console.error("Notification error:", error.message);
    }
  }
}

// START WEB SERVER FIRST
const server = app.listen(PORT, () => {
  console.log("Christmas Carnival server running on port " + PORT);
});

// START DATABASE AND TELEGRAM SERVICES
async function startBackgroundServices() {
  try {
    await setupDatabase();

    const me = await bot.telegram.getMe();
    botUsername = me.username;

    bot.launch().catch(error => {
      console.error("TELEGRAM BOT STARTUP ERROR:", error);
    });

    setInterval(() => {
      notifyExpiredMining().catch(error => {
        console.error("MINING NOTIFICATION ERROR:", error);
      });
    }, 30000);

    console.log("Christmas Carnival services initialized.");
  } catch (error) {
    console.error("BACKGROUND SERVICE ERROR:", error);
  }
}

startBackgroundServices();
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
