#Manage ISC DHCP via OMAPI 
[TOC]


##install isc-dhcp-server  and tools
```
# apt-get install isc-dhcp-server 
# apt install bind9utils

```
##create a TSIG key
```
# dnssec-keygen -a HMAC-MD5 -b 512 -n HOST -r /dev/urandom  omky
```
we just use the key of file KKonky.*private.
##Enable  OMAPI of isc-dhcp-serve 
/etc/dhcp/dhcpd.conf
```
key omapi_key {
   algorithm HMAC-MD5;
      secret "uLFBJlVz5fJY2QtWpXue4CGHYaFBBYjaeWjMr0CmNewav8B85GExV5BTU5FzV4uyop9hlFdZT8voPvMJdVfveg==";
};
omapi-port 7911;
omapi-key omapi_key;
```

##Create a DHCP lease via omshe
```
> root@foreman-smartproxy01:~# omshell
> server 127.0.0.1
> key omapi_key uLFBJlVz5fJY2QtWpXue4CGHYaFBBYjaeWjMr0CmNewav8B85GExV5BTU5FzV4uyop9hlFdZT8voPvMJdVfveg==
> connect
obj: <null>
> new host
obj: host
> set name = "some-host"
obj: host
name = "some-host"
> set hardware-address = 00:80:c7:84:b1:94
obj: host
name = "some-host"
hardware-address = 00:80:c7:84:b1:94
> set ip-address = 192.168.4.40
obj: host
name = "some-host"
hardware-address = 00:80:c7:84:b1:94
ip-address = c0:a8:04:28
> create
obj: host
name = "some-host"
hardware-address = 00:80:c7:84:b1:94
ip-address = c0:a8:04:28
hardware-type = 00:00:00:00
```
then check the leases file 
/var/lib/dhcp/dhcpd.leases
```
host some-host {
  dynamic;
  hardware unknown-0 00:80:c7:84:b1:94;
  fixed-address 192.168.4.40;
}
```