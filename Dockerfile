FROM node:lts-alpine as foundation

ENV NODE_ENV=development

# set this env explicitly to disable bluebird debug output 
# see: https://npm.community/t/npm-ci-produces-a-tonn-of-excess-warnings-on-install/3261
# see: http://bluebirdjs.com/docs/api/environment-variables.html
ENV BLUEBIRD_DEBUG=0

# RUN apk add --no-cache git openssh-client

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait
RUN mkdir -p /usr/src/app 
WORKDIR  /usr/src/app
COPY package.json .
RUN mkdir src test fixtures api
RUN chown -R node:node /usr/src/app

USER node

FROM foundation AS dependencies
# install node packages
RUN npm set progress=false && npm config set depth 0
RUN npm install --only=production 
# copy production node_modules aside
RUN cp -R node_modules prod_node_modules
# install ALL node_modules, including 'devDependencies'
RUN npm install

FROM foundation AS release
# copy production node_modules
COPY --from=dependencies /usr/src/app/prod_node_modules ./node_modules
# copy app sources
COPY . .

EXPOSE 3030

## Launch the wait tool and then your application
CMD /wait && npm run dev