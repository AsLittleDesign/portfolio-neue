
# New Docker Machine: docker-machine create --driver virtualbox default
# List Docker Machines: docker-machine ls
# Build: docker build -t portfolio .
# Run: docker run -ti -d portfolio
# Stop: docker stop portfolio
# Inspect: docker inspect <container>
# List Containers: docker ps
# Vagrant:
  # Put together vm: vagrant up --provider=docker
  # Enter vm: vagrant ssh
  # Terminate: Vagrant destroy


# Available vers here https://registry.hub.docker.com/_/ruby
FROM ruby:2.3

MAINTAINER "Dave Scott McCarthy <dave@aslittledesign.com>"

RUN apt-get update -qq && apt-get install -y build-essential curl git imagemagick libmagickwand-dev libcurl4-openssl-dev

WORKDIR /tmp
ADD Gemfile Gemfile
ADD Gemfile.lock Gemfile.lock

RUN gem install bundler && bundle install --jobs 20 --retry 5

RUN apt-get install -y nginx
RUN rm -rf /etc/nginx/sites-available/default
ADD container/nginx.conf /etc/nginx/nginx.conf

ENV APP_HOME /portfolio-neue
RUN mkdir -p $APP_HOME
ADD . $APP_HOME
WORKDIR $APP_HOME

RUN RAILS_ENV=production bundle exec rake assets:precompile --trace

CMD ["foreman","start"]
