
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

  def illustration
    @illustrations = YAML.load_file("#{Rails.root}/config/illustration.yml")
  end

  def graphic_design
    @graphics = YAML.load_file("#{Rails.root}/config/graphic_design.yml")
  end

  def osx
    @mockups = YAML.load_file("#{Rails.root}/config/osx.yml")
  end

  def photo_page
    uri = URI(request.original_url).path.split('/')
    @type = uri[-2]
    page = uri.last
    photos = YAML.load_file("#{Rails.root}/config/#{@type}.yml")

    @photo = photos[page]
  end
end
