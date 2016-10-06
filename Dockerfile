
# New Docker Machine: docker-machine create --driver virtualbox default
# List Docker Machines: docker-machine ls
# Build: docker build -t portfolio .
# Run: docker run -ti -d portfolio
# Stop: docker stop portfolio
# Inspect: docker inspect <container>
# List Containers: docker ps
# Vagrant:
  # Put together vm: --provider=docker
  # Enter vm: vagrant ssh
  # Terminate: Vagrant destroy


# Available vers here https://registry.hub.docker.com/_/ruby
FROM ruby:2.3

MAINTAINER "Dave Scott McCarthy <dave@aslittledesign.com>"

ADD Gemfile /app/Gemfile
ADD Gemfile.lock /app/Gemfile.lock

RUN bundle exec rake assets:precompile

WORKDIR /app
RUN bundle install

ADD . /app

CMD ["unicorn","--port","5000"]
