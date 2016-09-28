# Gerrit project

[TOC]

## 配置ssh
配置源gerrit 的ssh
```
trumanz@gerrit4test:~/.ssh$ cat config
Host reviews.maginatics.com
  port 29418
  User zhout8
  IdentityFile ~/.ssh/zhout8.id_rsa
```
配置gerrit http password
```
Settings-->HTTP Password -->Generate Password
```
## list prject

ssh comamnd
```
ssh  reviews.maginatics.com gerrit  ls-project
```
REST API
```
curl --digest --user zhout8:u1hSrn2CAAnHZasEz6JMz6Jh5iDvxdq4n7ypX6t6NA -i -H   "Accept: application/json"  http://reviews.maginatics.com/a/projects/?d```
