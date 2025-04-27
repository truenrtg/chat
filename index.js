// index.js
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const FaqIntent = require('./db'); // 수정한 db.js 불러오기

dotenv.config();

const app = express();
app.use(bodyParser.json());

const PORT = 3000;

// Webhook 엔드포인트
app.post('/webhook', async (req, res) => {
  try {
    const userMessage = req.body.userRequest.utterance;
    console.log('🔵 사용자 메시지:', userMessage);

    // MongoDB에서 질문 매칭
    const faq = await FaqIntent.findOne({ 질문예시: { $in: [userMessage] } });

    if (faq) {
      res.json({
        version: "2.0",
        template: {
          outputs: [
            {
              simpleText: {
                text: faq.응답
              }
            }
          ]
        }
      });
    } else {
      res.json({
        version: "2.0",
        template: {
          outputs: [
            {
              simpleText: {
                text: "죄송합니다. 해당 질문에 대한 답변이 없습니다."
              }
            }
          ]
        }
      });
    }
  } catch (error) {
    console.error('❌ 서버 오류:', error);
    res.status(500).send('Internal Server Error');
  }
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`✅ Node.js 서버 실행중 → http://localhost:${PORT}`);
});
