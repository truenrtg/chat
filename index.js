const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const FaqIntent = require('./db'); // 몽고DB 모델

dotenv.config();

const app = express();
app.use(bodyParser.json());

const PORT = 3000;

// MongoDB 연결
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB 연결 성공'))
.catch(err => console.error('❌ MongoDB 연결 실패:', err));

// Webhook 엔드포인트
app.post('/webhook', async (req, res) => {
  try {
    const userMessage = req.body.userRequest.utterance;
    console.log('🔵 사용자 메시지:', userMessage);

    // MongoDB에서 질문예시 배열에 포함되는지 검색
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
                text: "죄송합니다. 해당 질문에 대한 답변을 찾을 수 없습니다."
              }
            }
          ]
        }
      });
    }

  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`✅ Node.js 서버 실행중 → http://localhost:${PORT}`);
});
