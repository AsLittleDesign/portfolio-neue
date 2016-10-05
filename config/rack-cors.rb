
## Configure Rack CORS Middleware, so that CloudFront can serve our assets.
## See https://github.com/cyu/rack-cors

if defined? Rack::Cors
  Rails.configuration.middleware.insert_before 0, Rack::Cors do
    allow do
      origins %w[
        https://aslittledesign.com
         http://aslittledesign.com
        https://www.aslittledesign.com
         http://www.aslittledesign.com
        https://davesmccarthy.com
         http://davesmccarthy.com
        https://www.davesmccarthy.com
         http://www.davesmccarthy.com
         http://localhost:5000
         http://192.168.1.14:5000
      ]
      resource '/assets/*'
    end
  end
end
