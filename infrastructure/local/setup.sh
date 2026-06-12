#!/bin/bash
set -e

BUCKET_NAME="${S3_BUCKET_NAME:-web-screenshots-bucket}"

echo "🚀 Levantando floci (AWS local)..."
docker compose -f "$(dirname "$0")/docker-compose.yml" up -d

echo "⏳ Esperando que floci esté listo..."
until curl -s http://localhost:4566/_floci/health > /dev/null 2>&1; do
  sleep 1
done

echo "🪣 Creando bucket S3: $BUCKET_NAME"
AWS_ENDPOINT_URL=http://localhost:4566 \
AWS_ACCESS_KEY_ID=test \
AWS_SECRET_ACCESS_KEY=test \
AWS_DEFAULT_REGION=us-east-1 \
aws s3 mb s3://$BUCKET_NAME --region us-east-1 2>/dev/null || echo "  (ya existe)"

echo ""
echo "✅ Listo. Exporta las variables con:"
echo ""
echo "  export AWS_ENDPOINT_URL=http://localhost:4566"
echo "  export AWS_ACCESS_KEY_ID=test"
echo "  export AWS_SECRET_ACCESS_KEY=test"
echo "  export AWS_REGION=us-east-1"
echo "  export S3_BUCKET_NAME=$BUCKET_NAME"