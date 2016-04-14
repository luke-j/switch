# -*- mode: ruby -*-
# vi: set ft=ruby :

$provision = <<SCRIPT
sudo apt-get update -y
sudo apt-get upgrade -y
sudo apt-get install -y nginx
sudo apt-get install -y apache
sudo apt-get install -y libmozjs-24-bin
curl -so- https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh | bash
. /home/vagrant/.nvm/nvm.sh
nvm install 5.9.0
SCRIPT

Vagrant.configure(2) do |config|
  config.vm.box="ubuntu/trusty64"
  config.vm.provision "shell", inline: $provision, privileged: false

  config.hostmanager.enabled = true
  config.hostmanager.manage_host = true
  config.hostmanager.ignore_private_ip = false
  config.hostmanager.include_offline = true

  config.vm.define "Switch" do |box|
    box.vm.hostname = "switch.dev"
    box.vm.network :public_network, ip: "192.168.0.58", bridge: "en0: Wi-Fi (AirPort)"
  end

  config.vm.network :forwarded_port, host: 7200, guest: 80

  config.vm.synced_folder ".", "/switch", create: true, owner: "vagrant", group: "vagrant"

  config.vm.provider "virtualbox" do |box|
      box.memory = 512
      box.cpus = 1
  end

  config.hostmanager.ip_resolver = proc do |machine|
      result = ""
      machine.communicate.execute("ifconfig eth1") do |type, data|
          result << data if type == :stdout
      end
      (ip = /inet addr:(\d+\.\d+\.\d+\.\d+)/.match(result)) && ip[1]
  end
end