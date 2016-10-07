# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.vm.box_check_update = false
  config.vm.synced_folder ".", "/vagrant", disabled: true
  config.vm.hostname = "portfolio"

  config.ssh.username = 'dave'
  config.ssh.password = 'tcuser'
  # config.ssh.port = 80
  config.ssh.insert_key = false

  config.vm.provider "docker" do |d|
    d.name = "portfolio-neue"
    # d.pull = true
    d.has_ssh = true
    d.image = "aslittledesign/portfolio-neue"
    d.ports = ["80:80", "443:443"]
  end

  # Forward port 8080 on OSX to port 80 on guest
  config.vm.network "forwarded_port", guest: 80, host: 8080
end
