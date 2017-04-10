---
layout: post
title: "ELK Timestamp From Log"
---

[TOC]

##Why?
The timestamp is important when we analyze some logs.
The default @timesamp of a log that Logstash push to Elasticsearch is the time it got that log. But what we want to analyze is the when the log generated, most system dump log that composed with a timestamp string. What we want to to is obtain that timestamp and build a new failed with it, then we can use Elasticsearch analyze it.

##How?

```
input {
    stdin {}
}

filter {
    grok{
        match => { "message" => "\[%{TIMESTAMP_ISO8601:logtimestamp_str} %{GREEDYDATA:dummy_}" }
        remove_field => [ "dummy_" ]
    }
    date {
       match => [ "logtimestamp_str", "ISO8601", "yyyy-MM-dd HH:mm:ss,sss" ]
       target => "logtimestamp"
       remove_field => [ "logtimestamp_str" ]
    }
}

output {
    stdout { codec => rubydebug }
}


```
```
[2017-03-23 04:30:02,421 -0600] 8371ab01 projx a/1000002 LOGOUT
```

```
/usr/share/logstash/bin/logstash  -f  log-pipeline.conf

```