# Gerrit plugin 编译安装

[TOC]

## 安装buck
```
$ git clone https://github.com/facebook/buck.git
$ cd buck/
$ ant
$ export PATH=$(pwd)/bin:$PATH
docker push  10.29.113.20:5000/saltstack
```

## 编译importer
```
$ git clone https://gerrit.googlesource.com/bucklets
$ git clone --recursive https://gerrit.googlesource.com/plugins/importer
$ cd importer
$ git branch -a
$ git checkout -b  stable-2.12 remotes/origin/stable-2.12
$ ln -s  ../bucklets/  .
$ ln -s ../bucklets/buckversion   .buckversion
$ ln -s  bucklets/watchmanconfig  .watchmanconfig


```
