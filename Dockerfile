FROM nginx:latest
LABEL author=Abner
LABEL version="1.0"
LABEL description="A Vue Template"

ENV WORKDIR=/app

WORKDIR $WORKDIR

COPY .nginx.conf /etc/nginx/nginx.conf
COPY --chown=777 ./build .