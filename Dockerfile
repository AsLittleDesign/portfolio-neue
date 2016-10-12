
# SSL Setup Details: https://zettabyte.me/lets-encrypt-with-docker-nginx-proxy/
# Build: docker build -t aslittledesign/portfolio-neue .
# Run: docker run -d -p 0.0.0.0:80:80 -p 0.0.0.0:443:443 --restart=always -v /var/local/nginx/certs:/etc/nginx/certs -v /etc/letsencrypt:/etc/letsencrypt aslittledesign/portfolio-neue
# Terminal in container: docker exec -it <container_id> bash

FROM ubuntu:16.04
MAINTAINER "Dave Scott McCarthy <dave@aslittledesign.com>"

# Ignore TTY warnings on install
ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update -qq && \
            apt-get install -y -qq \
            apt-utils \
            build-essential \
            patch \
            curl \
            git \
            ssh \
            vim \
            imagemagick \
            libmagickwand-dev \
            libcurl4-openssl-dev

ENV RUBY_VERSION 2.3.0

RUN echo 'gem: --no-document' >> /usr/local/etc/gemrc &&\
    mkdir /src && cd /src && git clone https://github.com/sstephenson/ruby-build.git &&\
    cd /src/ruby-build && ./install.sh &&\
    cd / && rm -rf /src/ruby-build && ruby-build $RUBY_VERSION /usr/local

RUN gem update --system &&\
    gem install bundler

WORKDIR /tmp
ADD Gemfile Gemfile
ADD Gemfile.lock Gemfile.lock

RUN bundle install --jobs 20 --retry 5

# Set up NGINX
ADD container/nginx_signing.key /var/www/nginx_signing.key
RUN apt-key add /var/www/nginx_signing.key
RUN echo "deb http://nginx.org/packages/mainline/ubuntu/ precise nginx" >> /etc/apt/sources.list
RUN echo "deb-src http://nginx.org/packages/mainline/ubuntu/ precise nginx" >> /etc/apt/sources.list
RUN apt-get update && apt-get install -y nginx

RUN mkdir -p /run/nginx
RUN rm -rf /etc/nginx/sites-available/default
ADD container/nginx.conf /etc/nginx/nginx.conf

ENV APP_HOME /portfolio-neue
RUN mkdir -p $APP_HOME
ADD . $APP_HOME
WORKDIR $APP_HOME

# Set up ENV variables
RUN touch .env
RUN echo "SECRET_KEY_BASE=$(bundle exec rake secret)" >> .env
RUN echo "SECRET_TOKEN=$(bundle exec rake secret)" >> .env

RUN RAILS_ENV=production bundle exec rake assets:precompile --trace

EXPOSE 80
EXPOSE 443

CMD ["foreman","start"]
