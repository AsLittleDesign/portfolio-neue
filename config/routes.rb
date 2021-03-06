Rails.application.routes.draw do
  require 'pry'
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  root :to => 'application#index'
  get 'sitemap' => 'sitemap#index'

  get 'photography' => 'application#photography'
  scope "/photography" do
    photos = YAML.load_file("#{Rails.root}/config/photography.yml")
    photos.each do |name, data|
      get name.gsub("_", "-") => 'application#photo_page'
    end
  end

  get 'table' => 'application#table'
  scope "/table" do
    photos = YAML.load_file("#{Rails.root}/config/table.yml")
    photos.each do |name, data|
      get name.gsub("_", "-") => 'application#photo_page'
    end
  end

  get 'illustration' => 'application#illustration'
  scope "/illustration" do
    photos = YAML.load_file("#{Rails.root}/config/illustration.yml")
    photos.each do |name, data|
      get name.gsub("_", "-") => 'application#photo_page'
    end
  end

  get 'osx' => 'application#osx'
  scope "/osx" do
    photos = YAML.load_file("#{Rails.root}/config/osx.yml")
    photos.each do |name, data|
      get name.gsub("_", "-") => 'application#photo_page'
    end
  end

  get 'graphic-design' => 'application#graphic_design'
  scope "/graphic-design" do
    photos = YAML.load_file("#{Rails.root}/config/graphic-design.yml")
    photos.each do |name, data|
      get name.gsub("_", "-") => 'application#photo_page'
    end
  end

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
