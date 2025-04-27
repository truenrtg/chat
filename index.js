const express = require('express');
const axios = require('axios');
const connectDB = require('./db');
require('dotenv').config();

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

// KoBERT API 서버 주소 (예시: localhost → 나중에 외부주소로 교체)
const KOBERT_API_URL = 'http://localhost:8000/classify';

app.post('/webhook', async (req, res) => {
  const userMessage = req.body.userRequest?.utterance;
  console.log('🔵 사용자 질문:', userMessage);

  try {
    // 1️⃣ KoBERT API 호출해서 intent 예측
    const kobertResponse = await axios.post(KOBERT_API_URL, { text: userMessage });
    const predictedIntent = kobertResponse.data.intent;
    console.log('🧠 KoBERT 예측 intent:', predictedIntent);

    // 2️⃣ MongoDB 연결
    const collection = await connectDB();

    // 3️⃣ intent로 MongoDB 검색
    const faq = await collection.findOne({ intent: predictedIntent });

    // 4️⃣ 결과 응답
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
    console.error('❌ 서버 오류:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`✅ Node.js 서버 실행 중 → http://localhost:${port}`);
});
