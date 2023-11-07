FROM node:alpine
WORKDIR /app
COPY . .
ENV NODE_ENV=production
RUN yarn
RUN yarn prisma generate
CMD [ "yarn","start" ]