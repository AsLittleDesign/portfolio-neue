
# Run the app locally
`$ unicorn --port=5000`

# Deploy the app
1. SSH into server
2. `cd /var/www/portfolio-neue`
3. `docker kill $(docker ps -q)`
4. `docker build -t aslittledesign/portfolio-neue .`
5. `docker run -d -p 0.0.0.0:80:80 -p 0.0.0.0:443:443 --restart=always -v /var/local/nginx/certs:/etc/nginx/certs -v /etc/letsencrypt:/etc/letsencrypt aslittledesign/portfolio-neue`

# Debugging container
Enter container with bash shell: `docker exec -it <container_id> bash`

# SSL
We use volumes to manage SSL certificates. See: https://zettabyte.me/lets-encrypt-with-docker-nginx-proxy/
