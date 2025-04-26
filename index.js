const express = require('express');
const axios = require('axios');
const connectDB = require('./db');
require('dotenv').config();

const app = express();
app.use(express.json());

// 서버 시작 시 연결 확인
connectDB();

app.post('/webhook', async (req, res) => {
  const userMsg = req.body.userRequest.utterance;
  console.log('📩 사용자 메시지:', userMsg);

  const collection = await connectDB();

  // ✅ FastAPI KoBERT 서버에 요청 보내기
  let intent = "기타";
  try {
    const response = await axios.post('http://localhost:8000/classify', {
      text: userMsg
    });
    intent = response.data.intent;
    console.log('🔍 KoBERT 의도:', intent);
  } catch (err) {
    console.error('❌ KoBERT 서버 호출 실패:', err.message);
  }

  // 📦 MongoDB에서 intent로 응답 찾기
  const data = await collection.findOne({ intent });
  const reply = data
    ? data.응답
    : "죄송합니다. 관련 정보를 찾지 못했어요. 담당자에게 연결해드릴까요?";

  res.json({
    version: "2.0",
    template: {
      outputs: [
        {
          simpleText: {
            text: reply
          }
        }
      ]
    }
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`✅ Node.js 서버 실행중 → http://localhost:${port}`);
});
