
# SSL Setup Details: https://zettabyte.me/lets-encrypt-with-docker-nginx-proxy/
# Build: docker build -t aslittledesign/portfolio-neue .
# Run: docker run -d -p 0.0.0.0:80:80 -p 0.0.0.0:443:443 --restart=always -v /var/local/nginx/certs:/etc/nginx/certs -v /etc/letsencrypt:/etc/letsencrypt aslittledesign/portfolio-neue
# Terminal in container: docker exec -it <container_id> bash

# Available vers here https://registry.hub.docker.com/_/ruby
FROM ubuntu:16.04

MAINTAINER "Dave Scott McCarthy <dave@aslittledesign.com>"

RUN apt-get update -qq && apt-get install -y apt-utils build-essential patch curl git ssh vim imagemagick libmagickwand-dev libcurl4-openssl-dev

# Install Ruby 2.3
RUN git clone https://github.com/rbenv/rbenv.git ~/.rbenv
RUN echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc
RUN echo 'eval "$(rbenv init -)"' >> ~/.bashrc
RUN exec $SHELL

RUN git clone https://github.com/rbenv/ruby-build.git ~/.rbenv/plugins/ruby-build
RUN echo 'export PATH="$HOME/.rbenv/plugins/ruby-build/bin:$PATH"' >> ~/.bashrc
RUN exec $SHELL

RUN rbenv install 2.3 && rbenv global 2.3 && ruby -v

WORKDIR /tmp
ADD Gemfile Gemfile
ADD Gemfile.lock Gemfile.lock

RUN gem install bundler && bundle install --jobs 20 --retry 5

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
