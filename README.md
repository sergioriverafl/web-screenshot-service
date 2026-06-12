
# 1. Levantar infraestructura local
npm run local:up

# 2. Exportar variables
export AWS_ENDPOINT_URL=http://localhost:4566 &&
export AWS_ACCESS_KEY_ID=test &&
export AWS_SECRET_ACCESS_KEY=test &&
export AWS_REGION=us-east-1 &&
export S3_BUCKET_NAME=web-screenshots-bucket

# 3. Correr la Lambda local
cd lambda && npm run dev:screenshot https://google.com

brew install awscli
aws --version

aws configure

npm run deploy:local
npm run update:local

aws s3 mb s3://web-screenshots-bucket \
  --endpoint-url http://localhost:4566 \
  --region us-east-1


  aws s3 ls \
  --endpoint-url http://localhost:4566