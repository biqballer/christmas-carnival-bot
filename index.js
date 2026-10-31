const express = require("express");
const { Telegraf, Markup } = require("telegraf");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const BOT_TOKEN = process.env.BOT_TOKEN;
const WEB_APP_URL = process.env.WEB_APP_URL || "https://YOUR-RENDER-SERVICE.onrender.com";

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Christmas Carnival</title>
<script src="https://telegram.org/js/telegram-web-app.js"></script>
<style>
*{box-sizing:border-box}
body{margin:0;background:#07180f;color:#fff;font-family:Arial,sans-serif;padding-bottom:85px}
header{padding:22px 18px;background:linear-gradient(135deg,#123c25,#07180f);border-bottom:1px solid #b99745}
.logo{text-align:center;color:#f5d477;font-size:25px;font-weight:bold}
.subtitle{text-align:center;color:#b9c9bc;font-size:12px;margin-top:6px}
.container{padding:16px;max-width:520px;margin:auto}
.card{background:#122b1d;border:1px solid #28543a;border-radius:17px;padding:17px;margin-bottom:15px}
.hero{background:linear-gradient(135deg,#174c2c,#10251a);text-align:center}
.label{font-size:12px;color:#b7c8ba}
.balance{font-size:32px;color:#f5d477;font-weight:bold;margin:10px}
.btn{border:0;border-radius:12px;padding:13px 17px;background:linear-gradient(135deg,#f3d477,#bd8e32);color:#152315;font-weight:bold;width:100%;font-size:14px;margin-top:10px}
.btn:disabled{opacity:.5}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.stat{background:#193b27;padding:14px;border-radius:13px;text-align:center}
.stat strong{display:block;color:#f5d477;font-size:20px;margin-top:7px}
h2{font-size:18px;margin-top:0;color:#f5d477}
p{color:#c1d0c4;font-size:13px;line-height:1.6}
nav{position:fixed;bottom:0;left:0;right:0;background:#0d2417;border-top:1px solid #31553b;display:flex;justify-content:space-around;padding:10px 2px;z-index:5}
nav button{background:none;border:0;color:#b9c9bc;font-size:10px;padding:5px}
nav button.active{color:#f5d477}
.page{display:none}
.page.active{display:block}
.wheel-wrap{width:270px;height:270px;margin:20px auto;position:relative}
#wheel{width:100%;height:100%;border-radius:50%;border:8px solid #d5ae50;background:conic-gradient(#a51d2d 0deg 45deg,#e6bd57 45deg 90deg,#176c3b 90deg 135deg,#a51d2d 135deg 180deg,#e6bd57 180deg 225deg,#176c3b 225deg 270deg,#a51d2d 270deg 315deg,#e6bd57 315deg 360deg);transition:transform 4s cubic-bezier(.15,.7,.1,1);position:relative}
.wheel-label{position:absolute;font-size:12px;font-weight:bold;color:#fff;text-shadow:1px 1px 3px #000}
.pointer{position:absolute;top:-12px;left:calc(50% - 13px);border-left:13px solid transparent;border-right:13px solid transparent;border-top:27px solid #fff;z-index:2}
.wheel-center{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:55px;height:55px;border-radius:50%;background:#f4d477;border:5px solid #fff;z-index:1}
input{width:100%;padding:13px;border-radius:10px;border:1px solid #42634c;background:#091b11;color:white;margin-top:9px}
.row{display:flex;justify-content:space-between;padding:12px 0;border-bottom:1px solid #294533;font-size:13px}
.small{font-size:11px;color:#a8b9ac}
</style>
</head>
<body>
<header>
<div class="logo">🎄 CHRISTMAS CARNIVAL</div>
<div class="subtitle">MINE • SPIN • EARN • CELEBRATE</div>
</header>

<div class="container">

<section id="home" class="page active">
<div class="card hero">
<div style="font-size:35px">🎅 🎁 ❄️</div>
<h2>Welcome to Christmas Carnival!</h2>
<p>Your festive reward
