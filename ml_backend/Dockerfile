FROM python:3.8-buster
WORKDIR /app
COPY . .
# RUN wget https://s3.amazonaws.com/rds-downloads/rds-combined-ca-bundle.pem
RUN pip install -r requirements.txt
CMD ["python3", "ml_pipeline.py"]

