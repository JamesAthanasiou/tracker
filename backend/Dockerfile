FROM node:lts-alpine
# ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package.json", "yarn.lock", "./"]
RUN yarn install --dev --silent && mv node_modules ../ && npm install -g typescript
COPY . .
EXPOSE 3000
RUN chown -R node /usr/src/app
USER node
RUN yarn build
CMD ["yarn", "start"]