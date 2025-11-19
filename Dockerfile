FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY src/ ./src
COPY frontend/ ./frontend
COPY run.sh ./

RUN chmod +x run.sh

EXPOSE 8080

CMD ["./run.sh"]

