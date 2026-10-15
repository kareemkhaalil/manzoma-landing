const https = require('https');

const botToken = process.env.BOT_TOKEN;
const chatId = process.env.CHAT_ID;
const jobStatus = process.env.JOB_STATUS;
const repo = process.env.REPO || 'Unknown';
const branch = process.env.BRANCH || 'main';
const actor = process.env.ACTOR || 'Developer';
const commitMsg = (process.env.COMMIT_MSG || '').split('\n')[0];
const runId = process.env.RUN_ID;

if (!botToken || !chatId) {
  console.log('⚠️ Telegram bot token or chat ID is missing. Skipping notification.');
  process.exit(0);
}

const isSuccess = jobStatus === 'success';

const text = isSuccess
  ? `🚀 *تم نشر موقع المنظومة بنجاح على السيرفر!*

🌐 *الموقع الحي:* https://manzoma.online
📦 *المستودع:* \`${repo}\`
🌿 *الفرع:* \`${branch}\`
👤 *المطور:* ${actor}
💬 *التعديل:* ${commitMsg}
🔗 [عرض تفاصيل العملية](https://github.com/${repo}/actions/runs/${runId})`
  : `❌ *فشلت عملية نشر موقع المنظومة!*

📦 *المستودع:* \`${repo}\`
🌿 *الفرع:* \`${branch}\`
👤 *المطور:* ${actor}
💬 *التعديل:* ${commitMsg}
🔗 [فحص سبب الفشل](https://github.com/${repo}/actions/runs/${runId})`;

const body = JSON.stringify({
  chat_id: chatId,
  text: text,
  parse_mode: 'Markdown'
});

const options = {
  hostname: 'api.telegram.org',
  port: 443,
  path: `/bot${botToken}/sendMessage`,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body)
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      console.log('✅ Telegram notification sent successfully!');
    } else {
      console.error(`❌ Telegram API Error: HTTP ${res.statusCode} - ${data}`);
    }
  });
});

req.on('error', (err) => {
  console.error('❌ Network error sending Telegram notification:', err.message);
});

req.write(body);
req.end();
