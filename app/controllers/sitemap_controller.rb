
class SitemapController < ApplicationController
  layout nil

  def index
    @photos = YAML.load_file("#{Rails.root}/config/photography.yml")
    @illustrations = YAML.load_file("#{Rails.root}/config/illustration.yml")
    @table_examples = YAML.load_file("#{Rails.root}/config/table.yml")
    @graphics = YAML.load_file("#{Rails.root}/config/graphic-design.yml")
    @osx_mockups = YAML.load_file("#{Rails.root}/config/osx.yml")

    @base_url = "https://aslittledesign.com"

    respond_to do |format|
      format.xml
    end
  end
end
