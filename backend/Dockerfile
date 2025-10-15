FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

# Create uploads directory
RUN mkdir -p uploads/noc-documents

EXPOSE 5000

CMD ["node", "server.js"]