---
title: linux-email
excerpt: linux-email
categories: 
- FE
---



# mutt/msmtp
msmtp作为发送邮件的客户端，mutt作为邮件收发的通用工具

## 安装
```
apt-get install mutt msmtp
```

## 配置msmtp
在根目录中建立.msmtprc文件，会自动做为配置文件
```
vi /root/.msmtprc
```
编辑文件，以QQ邮箱为例，详细说明参见手册：[http://msmtp.sourceforge.net/doc/msmtp.pdf](http://msmtp.sourceforge.net/doc/msmtp.pdf)
```
host smtp.qq.com #smtp服务器
tls on#开启ssl
tls_starttls off
tls_trust_file /usr/lib/ssl/certs/ca-certificates.crt #需安装openssl以取得证书文件
auth plain
from goumang2010@qq.com
user goumang2010@qq.com
password XXXX#密码 现qq邮箱已改为授权码[http://service.mail.qq.com/cgi-bin/help?subtype=1&&no=1001256&&id=28](http://service.mail.qq.com/cgi-bin/help?subtype=1&&no=1001256&&id=28)
```

## 配置mutt
```
vi .muttrc
```
或拷贝默认的配置文件：
```
cp /etc/Muttrc /root/.muttrc
```
在配置文件中加入msmtp信息
```
set sendmail="/usr/bin/msmtp"
set use_from=yes
set from=goumang2010@qq.com
set envelope_from=yes
```

## 测试
向409567414@qq.com发一封测试邮件
```
echo "Test" | mutt -s "Title" 409567414@qq.com
```
添加附件
```
echo "Test" | mutt 409567414@qq.com -a webpagetest_2.19.zip -s "Title" 
```
