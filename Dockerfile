
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

RUN apt-get update -qq && apt-get install -y build-essential

ENV APP_HOME /portfolio-neue
RUN mkdir $APP_HOME
WORKDIR $APP_HOME

COPY Gemfile Gemfile.lock Rakefile ./

RUN gem install bundler && bundle install --jobs 20 --retry 5

COPY . ./

RUN bundle exec rake assets:precompile

EXPOSE 5000

CMD ["unicorn","--port","5000"]
