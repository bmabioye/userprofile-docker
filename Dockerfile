FROM node:13-alpine

ENV MONGO_DB_USERNAME=bma \
    MONGO_DB_PWD=iloveyou1 

RUN mkdir -p /home/app

COPY ./app /home/app

CMD [ "node", "/home/app/server.js" ]