
# SSL Setup Details: https://zettabyte.me/lets-encrypt-with-docker-nginx-proxy/
# Build: docker build -t aslittledesign/portfolio-neue .
# Run: docker run -d -p 0.0.0.0:80:80 -p 0.0.0.0:443:443 --restart=always -v /var/local/nginx/certs:/etc/nginx/certs -v /etc/letsencrypt:/etc/letsencrypt aslittledesign/portfolio-neue
# Terminal in container: docker exec -it <container_id> bash

FROM aslittledesign/portfolio-base-image
MAINTAINER "Dave Scott McCarthy <dave@aslittledesign.com>"

# Set up app
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
