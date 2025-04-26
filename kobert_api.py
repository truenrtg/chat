from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

# 👇 자연어로 intent 추정하는 함수 (지금은 키워드 기반, 나중에 KoBERT 교체)
def predict_intent(text: str) -> str:
    if "여권" in text:
        return "여권_발급"
    elif "쓰레기" in text or "배출" in text:
        return "쓰레기_배출"
    elif "주차" in text:
        return "불법주차"
    else:
        return "기타"

# 👇 JSON 요청 형식 정의
class RequestBody(BaseModel):
    text: str

@app.post("/classify")
def classify_text(body: RequestBody):
    intent = predict_intent(body.text)
    return {"intent": intent}
