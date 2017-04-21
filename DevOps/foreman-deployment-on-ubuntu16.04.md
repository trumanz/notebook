# Foreman deployment on ubuntu 16.04
[TOC]

##configure hosts and hostname
/etc/hosts;  10.29.98.193 is the ip of this host
```
10.29.98.193    foreman03.example.org foreman03
```
/etc/hostname
```
foreman03
```

## Install puppet
```
apt-get -y install ca-certificates
wget https://apt.puppetlabs.com/puppetlabs-release-pc1-xenial.deb
dpkg -i puppetlabs-release-pc1-xenial.deb
```

##install foreman
Enable foreman repo
```
echo "deb http://deb.theforeman.org/ xenial 1.14" > /etc/apt/sources.list.d/foreman.list
echo "deb http://deb.theforeman.org/ plugins 1.14" >> /etc/apt/sources.list.d/foreman.list
apt-get -y install ca-certificates
wget -q https://deb.theforeman.org/pubkey.gpg -O- | apt-key add -
```
Install foreman-installer
```
apt-get update && apt-get -y install foreman-installer
```

Check the IP of this hostname is real IP, not 127.0.0.1;
make sure the domain name map to the real IP,  the /etc/hosts include "10.1.2.3 foreman.example.org foreman"

```
ping $(hostname -f)
```

Install
```
foreman-installer
```