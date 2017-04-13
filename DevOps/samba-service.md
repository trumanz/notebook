# Samba on ubuntu 16.04
[TOC]

Install samba service
```
$ sudo apt-get -y install samba
```
Add a dedicated user
```
$ sudo adduser USER_NAME
```
Set a password in samba for the USER
```
$ sudo smbpasswd -a mozy
```
```
[FOLDER_NAME]
   browseable = no
   path =  FOLDER_PATH
   guest ok = no
   read only = yes
```