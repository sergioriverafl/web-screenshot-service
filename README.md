
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