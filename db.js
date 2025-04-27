// db.js
const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB 연결
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB 연결 성공'))
.catch(err => console.error('❌ MongoDB 연결 실패:', err));

// FAQ 질문/응답 스키마 정의
const FaqIntentSchema = new mongoose.Schema({
  intent: String,
  질문예시: [String],  // 질문 리스트
  응답: String,
  부서: String,
  담당자: String,
  전화번호: String
});

// mongoose 모델 생성 및 export
const FaqIntent = mongoose.model('FaqIntent', FaqIntentSchema);
module.exports = FaqIntent;
