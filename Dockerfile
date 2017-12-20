# CaptainFact frontend container
# You must attach a volume containing cert.pem + privkey.pem at /etc/nginx/cert/
FROM betree/centos-nginx-nodejs-brunch-sass:latest
MAINTAINER Benjamin Piouffle <benjamin.piouffle@gmail.com>

WORKDIR /opt/app

# Cache dependencies
COPY package.json .
RUN npm install

# Build project
COPY . .
ARG BUILD_ENV
RUN /opt/app/rel/run.sh build $BUILD_ENV

EXPOSE 80
HEALTHCHECK --start-period=20s --interval=1m CMD curl --fail http://localhost || exit 1
ENTRYPOINT ["/opt/app/rel/run.sh"]
