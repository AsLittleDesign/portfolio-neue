
class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  require "yaml"
  require 'uri'
  require 'miro'
  require 'mime/types'

  def index
    @metadata = {
      "title" => "Portfolio",
      "description" => "Explore Daves best design and artwork across many mediums and practices.",
      "url" => "http://davesmccarthy.com",
      "type" => "website",
      "card" => "summary_large_image",
      "image" => {
        "url" => "https://d2vez5w0ugqe83.cloudfront.net/open_graph/photography.png",
        "type" => "image/png",
        "alt" => "Dave Scott McCarthy's Photography"
      }
    }
  end

  def photography
    photos = YAML.load_file("#{Rails.root}/config/photography.yml")

    @photos = photos.to_a.shuffle!.to_h
    @metadata = {
      "title" => "Photography",
      "description" => "Explore Dave's best photography work, from portraiture to landscape photos.",
      "url" => "http://davesmccarthy.com/photography",
      "type" => "website",
      "card" => "summary_large_image",
      "image" => {
        "url" => "https://d2vez5w0ugqe83.cloudfront.net/open_graph/photography.png",
        "type" => "image/png",
        "alt" => "Dave Scott McCarthy's Photography"
      }
    }
  end

  def illustration
    @illustrations = YAML.load_file("#{Rails.root}/config/illustration.yml")

    @metadata = {
      "title" => "Illustration",
      "description" => "Explore Dave's best illustration work, from charcoal renderings to digital paintings.",
      "url" => "http://davesmccarthy.com/illustration",
      "type" => "website",
      "card" => "summary_large_image",
      "image" => {
        "url" => "https://d2vez5w0ugqe83.cloudfront.net/open_graph/illustration.png",
        "type" => "image/png",
        "alt" => "Dave Scott McCarthy's Illustrations"
      }
    }
  end

  def table
    @examples = YAML.load_file("#{Rails.root}/config/table.yml")

    @metadata = {
      "title" => "Table.co",
      "description" => "Explore Dave's best graphic design work, from logos to watchfaces.",
      "url" => "http://davesmccarthy.com/graphic_design",
      "type" => "website",
      "card" => "summary_large_image",
      "image" => {
        "url" => "https://d2vez5w0ugqe83.cloudfront.net/open_graph/table.png",
        "type" => "image/png",
        "alt" => "Dave Scott McCarthy's Graphic Design"
      }
    }
  end

  def graphic_design
    @graphics = YAML.load_file("#{Rails.root}/config/graphic_design.yml")

    @metadata = {
      "title" => "Graphic Design",
      "description" => "Explore Dave's best graphic design work, from logos to watchfaces.",
      "url" => "http://davesmccarthy.com/graphic_design",
      "type" => "website",
      "card" => "summary_large_image",
      "image" => {
        "url" => "https://d2vez5w0ugqe83.cloudfront.net/open_graph/graphic-design.png",
        "type" => "image/png",
        "alt" => "Dave Scott McCarthy's Graphic Design"
      }
    }
  end

  def osx
    @mockups = YAML.load_file("#{Rails.root}/config/osx.yml")

    @metadata = {
      "title" => "OS X 'Everest'",
      "description" => "Explore Dave's concept for a new version of OS X, created before the reveal of OS X 10.10 'Yosemite'.",
      "url" => "http://davesmccarthy.com/osx",
      "type" => "website",
      "card" => "summary_large_image",
      "image" => {
        "url" => "https://d2vez5w0ugqe83.cloudfront.net/open_graph/osx.png",
        "type" => "image/png",
        "alt" => "OS X 10.10 'Everest' Concept"
      }
    }
  end

  def photo_page
    uri = URI(request.original_url).path.split('/')
    @type = uri[-2]
    page = uri.last
    photos = YAML.load_file("#{Rails.root}/config/#{@type}.yml")

    @photo = photos[page]

    @metadata = {
      "title" => @photo["title"],
      "description" => @photo["description"].truncate(155),
      "url" => "http://davesmccarthy.com/#{@type}/#{page}",
      "type" => "website",
      "card" => "summary_large_image",
      "image" => {
        "url" => @photo["url"],
        "type" => MIME::Types.type_for(File.extname(@photo["url"]).gsub(/\./, ""))[0].content_type,
        "alt" => "Image titled #{@photo["title"]}"
      }
    }
  end
end
