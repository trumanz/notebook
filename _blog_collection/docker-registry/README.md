# 如何使用自己的Docker Registry

[TOC]

## 启动Docker service
启动docker registry 服务，数据存储于目录 /data/docker-images/
`$ docker run -d -p 5000:5000 --restart=always --name registry  -v /data/dockder-images:/var/lib/registry  registry:2`

## 修改docker配置
需要在docker配置中将docker registry设置非安全的
在ubunut14.04 中 修改配置文件/etc/default/docker， 添加如下行,10.29.113.20 为docker service 所在的host IP地址 
DOCKER_OPTS="--insecure-registry 10.29.113.20:5000"

## 上传docker image

```
docker tag  trumanz/saltstack  10.29.113.20:5000/saltstack
docker push  10.29.113.20:5000/saltstack
```
首选tag一下image 执行到私有的docker registiry，然后push就可以了， 

## 下载docker iamge

```
docker pull 10.29.113.20:5000/saltstack
```

