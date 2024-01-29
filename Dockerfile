FROM ghcr.io/puppeteer/puppeteer:21.10.0

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable
  
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
CMD ["node", "dist/server.js"]