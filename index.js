const express = require('express');
const axios = require('axios');
const connectDB = require('./db');
require('dotenv').config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const KOBERT_API_URL = 'https://kobert.onrender.com/classify';  // 아까 우리가 만든 KoBERT API 주소

// 👉 webhook 엔드포인트
app.post('/webhook', async (req, res) => {
  const userMessage = req.body.userRequest?.utterance || '';

  try {
    const faqIntents = await connectDB();
    
    // 1️⃣ KoBERT API로 사용자 입력 분석 요청
    const kobertResponse = await axios.post(KOBERT_API_URL, { text: userMessage });
    const predictedIntent = kobertResponse.data.intent;
    console.log('예측된 인텐트:', predictedIntent);

    // 2️⃣ 예측된 인텐트로 MongoDB 검색
    const matchedIntent = await faqIntents.findOne({ intent: predictedIntent });

    if (matchedIntent) {
      const responseText = `${matchedIntent.응답}\n\n담당 부서: ${matchedIntent.부서}\n담당자: ${matchedIntent.담당자}\n전화번호: ${matchedIntent.전화번호}`;
      
      res.json({
        version: "2.0",
        template: {
          outputs: [
            {
              simpleText: {
                text: responseText
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
    console.error('서버 오류:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

// 👉 서버 시작
app.listen(PORT, () => {
  console.log(`✅ Node.js 서버 실행 중 ➔ http://localhost:${PORT}`);
});
