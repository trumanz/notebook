# Ubuntu16.04 install gnome & VNC 
[TOC]



##Add repo
```
$ sudo add-apt-repository ppa:gnome3-team/gnome3-staging
$ sudo add-apt-repository ppa:gnome3-team/gnome3
$ sudo apt-get update
```
##Install gnome
```
$ sudo apt install gnome  gnome-shell
```
##restart
```
$ sudo reboot
```
##Install x11vnc server
```
$ sudo apt-get install x11vnc
```
##local proxy
```
truman@workspace:~$ ssh  user@remote -L 0.0.0.0:5900:localhost:5900 "x11vnc -display :0 -noxdamage"
```