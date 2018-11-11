FROM node:8
RUN npm install nodemon -g
WORKDIR /app
COPY package*.json ./
RUN npm install
ADD nodemon.json /app/nodemon.json
COPY . .
EXPOSE 8080
CMD [ "npm", "start" ]