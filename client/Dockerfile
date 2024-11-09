from node:22.8.0
WORDIR /app
COPY package*.json .
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]