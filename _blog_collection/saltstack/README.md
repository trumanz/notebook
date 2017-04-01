# Saltstack assert System Version

[TOC]

## Why
Salt State File represent the sate in which a system should in. E.g what package should be installed, the conent of specific configuraiton file.

The probmen which may occasionally encounter is the configuration file should be different on different version of OS. The simplest solution is just assert current system version and distribution.

refernece:
https://docs.saltstack.com/en/latest/topics/tutorials/starting_states.html


##Example
Below is an exmaple SLS file dhcpd.sls.  It represent that the System should install isc-dhcp-server package and using confiugration file dhcpd.conf.
This works on ubuntu14.04, but If we apply this state file on other distribution, we might encounter unknown issue.
```
isc-dhcp-server:
  pkg.installed:
    - pkgs:
      - isc-dhcp-server
  service.running:
     - watch:
        - file: /etc/dhcp/dhcpd.conf

/etc/dhcp/dhcpd.conf:
    file.managed:
       - source: salt://net_boot_server/dhcpd.conf
```


## How



We need to got the version of current system

###Using GRAINS to get OS version
Grains is a component os saltstack  that could collect information about the underlying system, e.g the operating system,IP, memory.

Runing below command on yout target system could got those information:
```
sudo salt-call  grains.items
```

Below is a example template 

```
{% set os_version =   grains['osfinger'] %}

{% if os_version == 'Ubuntu-14.04' %}

isc-dhcp-server:
  pkg.installed:
    - pkgs:
      - isc-dhcp-server
  service.running:
     - watch:
        - file: /etc/dhcp/dhcpd.conf

/etc/dhcp/dhcpd.conf:
    file.managed:
       - source: salt://net_boot_server/dhcpd.conf

{% else %}
dhcpd_error:
    report:
        - error
        - name: "This state file might encounter error on other distribution"
{% endif %}

```

###Try:
Run below command on target system
```
sudo salt-call --local state.apply  dhcpd -l debug
```


refernece:
   Jina is the default templating language in SLS files.
   https://docs.saltstack.com/en/latest/topics/jinja/index.html

##TODO:
summarize more approach to set the variable os_version, eg
sudo salt-call system.get_computer_desc




