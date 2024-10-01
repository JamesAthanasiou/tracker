FROM node:lts-alpine AS builder
ENV NODE_ENV=production
# WORKDIR /usr/src/app
WORKDIR /var/www/api
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
# COPY package.json yarn.lock ./
# RUN yarn install
COPY . .
EXPOSE 3000
# RUN chown -R node /usr/src/app/
RUN chown -R node /var/www/api
USER node
CMD ["npm", "start"]
# CMD ['yarn', 'dev']
