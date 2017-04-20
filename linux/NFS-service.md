# NFS on ubuntu 16.04
[TOC]

Install NFS service
```
$ sudo apt-get -y install nfs-kernel-server
```

Edit /etc/exports

```
/export     10.0.0.0/8(rw,sync,no_root_squash,no_subtree_check)
```