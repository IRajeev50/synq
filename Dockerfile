FROM node:22-alpine
WORKDIR /app
COPY package.json ./
COPY services/api ./services/api
COPY packages ./packages
ENV NODE_ENV=production PORT=3000
USER node
EXPOSE 3000
CMD ["node","services/api/src/server.js"]
