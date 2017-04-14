# LVM Filesysme
[TOC]

![Image of LVM](http://linux.macrofinances.com/wp-content/uploads/2015/12/lvm.jpg)


##Rescan new disk device
```
$ sudo apt-get install scsitools
$ sudo rescan-scsi-bus
```
##Expand paration
```
$ pvcreate /dev/sdb
$ lvextend /dev/ubuntu16-template-vg/root  /dev/sdb
$ vgextend  ubuntu16-template-vg  /dev/sdb
$ lvextend -L +50G  /dev/ubuntu16-template-vg/root
$ resize2fs  /dev/ubuntu16-template-vg/root
```
##Create Logical Volumes and filsystem on VG
```
$ lvcreate    ubuntu16-template-vg   -L  200GB   --name NEW-LV-NAME
$ mkfs.ext4   /dev/ubuntu16-template-vg/NEW-LV-NAME
```
Add mount point in /etc/fstab
```
/dev/mapper/ubuntu16--template--vg-NEW-LV-NAME /MOUNT_PATH    ext4    errors=remount-ro 0       1
```
Mount all
```
$ mount -a
```


