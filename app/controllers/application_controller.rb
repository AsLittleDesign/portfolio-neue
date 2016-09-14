class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  require "yaml"
  require 'uri'
  require 'miro'

  def index
  end

  def photography
    photos = YAML.load_file("#{Rails.root}/config/photography.yml")

    @photos = photos.to_a.shuffle!.to_h
  end

  def photo_page
    page = URI(request.original_url).path.split('/').last
    photos = YAML.load_file("#{Rails.root}/config/photography.yml")

    @photo = photos[page]
    @colors = Miro::DominantColors.new @photo["url"]
  end
end
