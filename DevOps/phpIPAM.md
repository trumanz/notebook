# phpIPAM on ubuntu 16.04
[TOC]


##pdns-serve installation
#### Installing package
```
$ sudo apt-get install pdns-server  pdns-backend-mysql
```
####Configure mysql backend
Init databse
```
$ mysql -u root -p
mysql> CREATE DATABASE pdns;
mysql> GRANT ALL ON pdns.* TO 'pdns'@'localhost' IDENTIFIED BY 'pdns';
mysql> FLUSH PRIVILEGES;
```
```
$ mysql -updns  -ppdns  pdns  < /usr/share/dbconfig-common/data/pdns-backend-mysql/install/mysql
```

##Install phpipam
####Install Apache, php and mysql server
```
$ apt-get install  apache2 libapache2-mod-php mysql-server  php  php-gmp php-pear php-mysql php-ldap
```
####Donwloading phipam
```
$ wget  https://superb-sea2.dl.sourceforge.net/project/phpipam/phpipam-1.2.1.tar
$ tar xvf phpipam-1.2.1.tar -C /var/www/
```
####Setting phpipam configuration
```
$ cd /var/www/phpipam/
$ cp config.dist.php config.php 
```
####Configure database connection and base directory
```
$db['host'] = "localhost";
$db['user'] = "phpipam";
$db['pass'] = "phpipamadmin";
$db['name'] = "phpipam";
define('BASE', "/phpipam/");
```
####Configure apache 
/etc/apache2/sites-enable/000-default.conf
```
DocumentRoot /var/www/
```
Enable apache rewrite
```
$ a2enmod rewrite
$ /etc/init.d/apache2 restart
```

####Database init
Disable NO_ZERO_DATA of mysql if it enabled it
```
$mysql -u root -p
mysql> SELECT
mysql> SET @@GLOBAL.sql_mode=NEW_VALUE_WITHOUT_NO_ZERO_DATE;
```
open http://10.29.98.3/phpipam/  and choose "Automatic database installation"

#### Enable PowerDNS in phpipam web setting 
just use defualt configuraion

