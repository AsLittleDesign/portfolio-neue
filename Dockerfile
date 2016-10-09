
# SSL Setup Details: https://zettabyte.me/lets-encrypt-with-docker-nginx-proxy/

# Build: docker build -t aslittledesign/portfolio-neue .

# Run: docker run -d -p 0.0.0.0:80:80 -p 0.0.0.0:443:443 --restart=always -v /var/local/nginx/certs:/etc/nginx/certs -v /etc/letsencrypt:/etc/letsencrypt aslittledesign/portfolio-neue

# Terminal in container: docker exec -it <container_id> bash


# Available vers here https://registry.hub.docker.com/_/ruby
FROM ruby:2.3

MAINTAINER "Dave Scott McCarthy <dave@aslittledesign.com>"

RUN apt-get update -qq && apt-get install -y apt-utils build-essential patch curl git ssh vim imagemagick libmagickwand-dev libcurl4-openssl-dev

WORKDIR /tmp
ADD Gemfile Gemfile
ADD Gemfile.lock Gemfile.lock

RUN gem install bundler && bundle install --jobs 20 --retry 5

RUN apt-get install -y nginx
RUN mkdir -p /run/nginx
RUN rm -rf /etc/nginx/sites-available/default
ADD container/nginx.conf /etc/nginx/nginx.conf

ENV APP_HOME /portfolio-neue
RUN mkdir -p $APP_HOME
ADD . $APP_HOME
WORKDIR $APP_HOME

RUN RAILS_ENV=production bundle exec rake assets:precompile --trace

EXPOSE 80
EXPOSE 443

CMD ["foreman","start"]
