# Nginx 对特定client重定向

[TOC]




##Nginx 对特定client重定向
###示例
将来自IP 10.32.254.77的请求重定向到baidu.com， 其他则重定向到google.com
```
geo $spec_user {
    default common;
    10.32.254.77 u1;
}
server {
...
 location / {
                if ($spec_user = "u1") {
                   return 302 http://wwww.baidu.com;
                }
                return 302 https://wwww.google.com;
        }

...
}
```

