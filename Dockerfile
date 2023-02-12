FROM node:18.13.0

#working dir
WORKDIR /app

#copy package json files
COPY ["package.json", "package-lock.json*", "./"]
#install files
RUN npm install --production
#copy source files
COPY . . 
#build
CMD ["node", "server.js"]
#expose the aapi port
EXPOSE 3000