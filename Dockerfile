FROM node:alpine

WORKDIR /app
COPY package.json .
COPY docker.env ./.env
RUN npm install --production
COPY . .

RUN mkdir -p /app/src/public/img/avatar 
RUN mkdir -p /app/src/public/img/certificate 
RUN chmod -R 777 /app/src/public

EXPOSE 5050

CMD ["npm", "run", "dev"]