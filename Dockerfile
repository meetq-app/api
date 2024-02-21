FROM node:alpine

WORKDIR /app
COPY package.json .
COPY docker.env ./.env
RUN npm install --production
COPY . .

EXPOSE 5050

CMD ["npm", "run", "dev"]