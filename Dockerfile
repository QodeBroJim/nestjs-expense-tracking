FROM node:14-alpine

# Create app directory. This is where the app will live within the container
WORKDIR /qodebrojim/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# If you are building your code for production
# RUN npm ci --only=production
RUN npm install

# Bundle app source
COPY . .

RUN npm run build

EXPOSE 8080

CMD [ "node", "dist/main",]