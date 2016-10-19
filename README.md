
# Run the app locally
`$ unicorn --port=5000`

# Deploy the app
1. `$ ssh root@aslittledesign.com`
2. *Enter Password*
3. `$ cd /var/www/portfolio-neue`
4. `$ git pull origin master`
5. *Enter Password*
6. `$ docker kill $(docker ps -q)`
7. `$ docker build -t aslittledesign/portfolio-neue .`
8. `$ docker run -d -p 0.0.0.0:80:80 -p 0.0.0.0:443:443 --restart=always -v /var/local/nginx/certs:/etc/nginx/certs -v /etc/letsencrypt:/etc/letsencrypt aslittledesign/portfolio-neue`

# Debugging container
Enter container with bash shell: `docker exec -it <container_id> bash`

# SSL
We use volumes to manage SSL certificates. See: https://zettabyte.me/lets-encrypt-with-docker-nginx-proxy/
