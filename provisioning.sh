#!/bin/bash

# This script is idempotent, but will throw some errors if run more than once
# because the files it tries to delete has already been deleted, and symbolic
# links already deleted.

# Update and upgrade. This gets sort of interesting with grub.
apt-get update --assume-yes
apt-get upgrade --assume-yes

# Install our webserver
apt-get install nginx --assume-yes

# Copy the configuration from the project to the webserver
cp /vagrant/nginx.conf /etc/nginx/sites-available/vagrant

# Disable default config, enable our site
rm /etc/nginx/sites-enabled/default
ln -s /etc/nginx/sites-available/vagrant /etc/nginx/sites-enabled/vagrant

# Load new configuration
service nginx reload