# Kubernetes 之部署 cassandra + solr（datastax）解析

[TOC]

Kubernetes 是一个在cluster中部署管理docker container 的软件。这里介绍在Kuberntes中部署cassandra 和solr。
在这个场景下有以下几点：
1. 网络
2. 存储
3. 规模伸缩性


##环境需求
###kubertes cluster环境
需要一个kuberntes cluster 环境，以举github 文档ubunut vm 安装即可。
[kubernetes 安装文档](https://github.com/kubernetes/kubernetes/blob/master/docs/getting-started-guides/ubuntu.md)
###datastax image

DataStax 提供了一个软件包，包含了cassandra， solr 等服务，可以通过[下载地址](http://downloads.datastax.com/enterprise/dse-4.8.3-bin.tar.gz)下载。
可以参考一下两个目录的内容制作适合在Kuberntes中使用的docker image， images 我已上传到dockerhub上，[dse4kube](https://hub.docker.com/r/trumanz/dse4kube/)。 


##Image解析
这里的DataStax Image制作可以参考一下github中的代码。
https://github.com/trumanz/dockerBuild/tree/v1.0/datastax-enterprise/dsebase
https://github.com/trumanz/dockerBuild/tree/v1.0/datastax-enterprise/kubernetes

由以下两个Dockerfile 制作出kube4dse， 非常简单，增加了一个jar包，以及几个启动脚本。
详细请参考[build.sh](https://github.com/trumanz/dockerBuild/blob/v1.0/datastax-enterprise/kubernetes/build.sh)
dsebase：
```
FROM  trumanz/ubuntu14.04-dev
ADD dse-4.8.2-bin.tar.gz /opt
```
dse4kube
```
FROM  trumanz/dsebase
ADD  SeedProvider/target/kubernetes-cassandra-0.0.5.jar    /opt/dse-4.8.2/resources/driver/lib/
ADD  dse-config.sh  /
ADD  run-cassandra.sh    /
ADD  run-solr.sh   /
```

###image增加kubernetes支持（伸缩性支持）
这里的kubernetes-cassandra-0.0.5.jar由以下代码构建
https://github.com/trumanz/dockerBuild/tree/v1.0/datastax-enterprise/kubernetes/SeedProvider
在cassandra会有一个或多个种子节点作为入口， 后续节点会接入种子节点从而进入到cassandra cluster在中。
在默认的cassandra.yaml中如下所示， seed_provider 为SimpleSeedProvider，这种配置写死了一个或多个IP为种子节点， 这种情况下，需要预先知道每个种子节点的IP，并且如果所有种子节点都挂掉后，将不可再继续扩展规模。
```
# any class that implements the SeedProvider interface and has a
# constructor that takes a Map<String, String> of parameters will do.
seed_provider:
    # Addresses of hosts that are deemed contact points. 
    # Cassandra nodes use this list of hosts to find each other and learn
    # the topology of the ring.  You must change this if you are running
    # multiple nodes!
    - class_name: org.apache.cassandra.locator.SimpleSeedProvider
      parameters:
          # seeds is actually a comma-delimited list of addresses.
          # Ex: "<ip1>,<ip2>,<ip3>"
          - seeds: "127.0.0.1"
```
Kubernetes提供了API 去查询每一个某个service 下所有POD的IP地址。 这样我们只需将所有的cassandra 和solr 的POD都关联到同一service 下面，这样每一个节点启动后，都可以感知到其他节点的IP地址。
参考代码实现[KubernetesSeedProvider.java](https://github.com/trumanz/dockerBuild/blob/v1.0/datastax-enterprise/kubernetes/SeedProvider/src/main/java/io/k8s/cassandra/KubernetesSeedProvider.java) 正式使用Kubernetes的查询endpoint 的API去实现的动态获取种子节点的地址。

###image 增加启动脚本
这里的三个脚本文件，主要是根据环境去修改cassandra.yaml 并启动servcie
[dse-config.sh](https://github.com/trumanz/dockerBuild/blob/v1.0/datastax-enterprise/kubernetes/dse-config.sh)  修改rpc_address 和 listen_address 的地址 以及 SeedProvider。
[run-cassandra.sh](https://github.com/trumanz/dockerBuild/blob/v1.0/datastax-enterprise/kubernetes/run-cassandra.sh) 前台启动Cassandra
[run-solr.sh](https://github.com/trumanz/dockerBuild/blob/v1.0/datastax-enterprise/kubernetes/run-solr.sh) 前台启动Solr

##Kuberntes yaml 解析












