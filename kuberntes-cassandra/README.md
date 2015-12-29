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

1. ReplicationController 是一个比较虚的东西，它用来保证POD的replica个数。
2. POD  一个POD包含一或多个container，其中的container共享volume 和 网络空间。
3. Container  docker container， 一个运行实例
4. Service 定义了到达cluster的哪些端口和转发到哪些POD中的规范。



###ReplicationController
这里以[cassandra_rc.yaml](https://github.com/trumanz/dockerBuild/blob/v1.0/datastax-enterprise/kubernetes/yaml/cassandra_rc.yaml)来分析
####container 定义
```
    spec:
      containers:
        - command:
            - /run-cassandra.sh
          resources:
            limits:
              cpu: 0.1
          image: trumanz/dse4kube
```
这里定义了相关的POD中有一个container（可以有多个），并定义了image 和启动命令
####网络
```
          ports:
            - containerPort: 9042
              name: cql
            - containerPort: 9160
              name: thrift
```
这里定义了两个port，其name要与后面service 中的相应name对应。
####存储
```
          volumeMounts:
            - mountPath: /var/lib/cassandra/
              name: data
            - mountPath: /var/log/cassandra/
              name: log
      volumes:
        - name: data
          emptyDir: {}
        - name: log
          emptyDir: {}

```

这里使用了类型为emptyDir的volume 作为挂载点，对于每一个POD， kubernetes 会创建两个新空目录，container 启动会挂在这两个目录到对应的 mountPath。
####service 关系
service 会关联
```
spec:
  replicas: 2
  template:
    metadata:
      labels:
        app: dse-cassandra

```
这里我们的POD打了lable  service=dse， 后面创建service 的时候会用到， 也就是说 servcie 跟ReplicationController 并没与关系，而是要关联到某些POD。


###Service
这里以[dse-service.yaml](https://github.com/trumanz/dockerBuild/blob/v1.0/datastax-enterprise/kubernetes/yaml/dse-service.yaml) 作为示例

####网络
```
spec:
  ports:
    - name: cql
      port: 9042
      nodePort: 30010
    - name: solr
      port: 8983
      nodePort: 30011
```

Servcie 一个比较大的功能就是管理网络，
这里定义的port，表示使用分配到的cluster IP 的9042 和 8983分别转到到POD对应名称为solr和cql 中，所以这里port 数值可以自由定义，不一定必须跟POD中相同，但name必须相同。
nodePort 是将service 暴露到 cluster外部的一种方式，这样访问任何 kubernetes 的node ip 的 300010 就会转发到对应的POD中。 这里的 nodePort 必须为 30000 以上一个一部分端口，因为这些port 资源是所有service 共享的。
####POD关联
```
  selector:
    service: dse
```
这样servcie 的定义，定义了selector 为servcie=dse， 这样就能关联到相应的POD， 











