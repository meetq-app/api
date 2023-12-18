FROM node:alpine

WORKDIR /app
COPY package.json .
COPY docker.env ./.env
RUN npm install --production
COPY . .

RUN chmod -R 775 src/public

EXPOSE 5050

CMD ["npm", "run", "dev"]