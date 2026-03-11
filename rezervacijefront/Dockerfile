FROM node:20-alpine
WORKDIR /app
#COPY package*.json ./
COPY ./rezervacijefront/package*.json ./
RUN npm install
#COPY . .
COPY ./rezervacijefront/ .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]