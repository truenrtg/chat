const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function connectDB() {
  try {
    await client.connect();
    console.log('✅ MongoDB 연결 성공');
    return client.db('chatbot').collection('faq_intents');
  } catch (err) {
    console.error('❌ MongoDB 연결 실패:', err.message);
  }
}

module.exports = connectDB;
