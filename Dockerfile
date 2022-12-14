FROM python:3.9-buster
WORKDIR /app
COPY . .
RUN pip install -r requirements.txt
CMD ["python3", "ml_pipeline.py"]

