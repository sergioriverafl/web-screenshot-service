# 📸 Web Screenshot Service

Servicio para captura automática de pantallas web. En local usa un emulador de AWS (floci), sin necesidad de cuenta en la nube.

---

## Requisitos previos

Instala lo siguiente antes de continuar. Si ya lo tienes, pasa al siguiente paso.

**1. Node.js 20+**
Descarga desde https://nodejs.org y sigue el instalador.

```bash
node --version  # debe mostrar v20 o superior
```

**2. Docker Desktop**
Descarga desde https://www.docker.com/products/docker-desktop e instala.
Ábrelo y espera a que el ícono de la ballena aparezca en la barra superior.

**3. Homebrew** (gestor de paquetes para macOS)

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**4. AWS CLI**

```bash
brew install awscli
```

**5. Configura credenciales locales falsas** (no necesitas cuenta de AWS)

```bash
aws configure
```

Ingresa estos valores cuando los pida:

```
AWS Access Key ID:     test
AWS Secret Access Key: test
Default region name:   us-east-1
Default output format: json
```

---

## Instalación

Desde la raíz del proyecto, instala las dependencias de ambos módulos:

```bash
cd api && npm install && cd ../lambda && npm install && cd ..
```

---

## Variables de entorno

Copia los archivos de ejemplo:

```bash
cp api/.env.example api/.env
cp lambda/.env.example lambda/.env
```

> Los valores ya están configurados para local. No necesitas cambiar nada.

---

## Instalar el navegador Chromium

Playwright necesita descargar Chromium para poder tomar capturas:

```bash
cd lambda && npx playwright install chromium && cd ..
```

---

## Levantar el emulador de AWS

Asegúrate de que Docker Desktop esté abierto y corriendo, luego ejecuta:

```bash
npm run local:up
```

Este comando levanta floci (emulador de AWS) en `http://localhost:4566` y crea el bucket S3 automáticamente.

Exporta las variables de entorno en tu terminal actual:

```bash
export AWS_ENDPOINT_URL=http://localhost:4566
export AWS_ACCESS_KEY_ID=test
export AWS_SECRET_ACCESS_KEY=test
export AWS_REGION=us-east-1
export S3_BUCKET_NAME=web-screenshots-bucket
```

> Debes exportar estas variables cada vez que abras una terminal nueva.

Verifica que el bucket fue creado:

```bash
aws s3 ls --endpoint-url http://localhost:4566
```

Debes ver `web-screenshots-bucket` en la lista.

---

## Levantar la API

Abre una nueva terminal y ejecuta:

```bash
cd api && npm run dev
```

La API estará disponible en `http://localhost:3000`.

---

## Probar el servicio

### Opción A — Desde la terminal (curl)

```bash
curl -X POST http://localhost:3000/api/v1/screenshots \
  -H "Content-Type: application/json" \
  -d '{ "url": "https://github.com", "fullPage": true }'
```

### Opción B — Ejecutar el scraper directamente sin la API

```bash
cd lambda && npm run dev:screenshot https://github.com
```

La imagen se guarda en `lambda/public/` para inspección inmediata.

---

## Consultar capturas generadas

```bash
curl http://localhost:3000/api/v1/screenshots
```

O desde Postman importa la colección incluida en `requests/`.

---

## Apagar el emulador

```bash
npm run local:down
```

---

## Comandos de referencia

| Comando                                     | Descripción                          |
| ------------------------------------------- | ------------------------------------ |
| `npm run local:up`                          | Levanta floci y crea el bucket S3    |
| `npm run local:down`                        | Apaga el emulador                    |
| `npm run local:logs`                        | Ver logs del emulador en tiempo real |
| `cd api && npm run dev`                     | Inicia la API en modo desarrollo     |
| `cd lambda && npm run dev:screenshot <url>` | Ejecuta el scraper directamente      |

---

## Endpoints disponibles

| Método | URL                               | Descripción                |
| ------ | --------------------------------- | -------------------------- |
| `GET`  | `/health`                         | Estado de la API           |
| `POST` | `/api/v1/screenshots`             | Solicita una captura       |
| `GET`  | `/api/v1/screenshots`             | Lista todas las capturas   |
| `GET`  | `/api/v1/screenshots/:nombre.png` | URL firmada de una captura |
