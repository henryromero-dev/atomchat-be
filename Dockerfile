FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache dumb-init wget

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

COPY package*.json ./

RUN npm ci --only=production && npm cache clean --force

COPY dist/ ./dist/

COPY .env* ./
COPY start.sh ./

RUN chmod +x start.sh

RUN chown -R nodejs:nodejs /app
USER nodejs

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

ENTRYPOINT ["dumb-init", "--"]

CMD ["./start.sh"]
