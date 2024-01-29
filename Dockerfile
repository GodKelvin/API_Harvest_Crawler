FROM ghcr.io/puppeteer/puppeteer:21.10.0

# Instale o Google Chrome
RUN apt-get update && apt-get install -y \
    google-chrome-stable \
  && rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable
  
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
CMD ["node", "dist/server.js"]