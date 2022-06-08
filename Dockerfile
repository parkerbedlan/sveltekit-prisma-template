# in package.json scripts, change "prepare" to "_prepare" before docker building

FROM node:16-alpine

COPY package*.json ./
# RUN npm ci --omit=dev # this does the same thing apparently
RUN npm ci --production
# RUN npm i prisma # for some reason this isn't necessary despite prisma being in devDependencies, maybe @prisma/client includes CLI

ENV NODE_ENV production

COPY . .
COPY .env.production .env

# ARG DATABASE_URL
RUN npm run generate

EXPOSE 8080

CMD npm run start
USER node