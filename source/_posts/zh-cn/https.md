---
title: https
excerpt: https
categories: 
- FE
---

# 握手原理

http://www.ruanyifeng.com/blog/2014/09/illustration-ssl.html

1. 客户端请求，发送client random 及支持的cipher，比如TLS 1.0版
2. 服务端发送server random 及证书，证书中包含公钥，此时服务器也会生成session ID
3. 客户端验证证书并取出公钥，若验证通过，生成premaster secret(同样是随机数)， 并使用公钥加密，发送给服务端.
4. 服务端和客户端都通过协商好的cipher方法，根据client random， server random， premaster secret生成session key，为可同时加密解密的对称密钥，用于之后的会话。

## 验证数字证书

http://www.cnblogs.com/zery/p/5164795.html

1. 验证证书是否在有效期内。
2. 验证证书是否被吊销了， 验证吊销有CRL(证书吊销列表)和OCSP(在线证书检查)两种方法。
3. 查询系统内信任的根证书， 验证证书是否是上级CA签发的，并取得CA公钥。
4. 证书是经过CA用自己的私钥，对服务端的公钥和一些相关信息一起加密，所以用CA公钥可解密并验证服务端公钥。

# demo

## https服务

 https://gaboesquivel.com/blog/2014/nodejs-https-and-ssl-certificate-for-development/

1. 安装openssl

2. 生成私钥和自签名数字证书（使用自己私钥而非CA私钥签名的数字证书）
    ```bash
    openssl genrsa -out key.pem
    openssl req -new -key key.pem -out csr.pem
    openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem
    rm csr.pem
    ```
3. node创建https
    ```js
    // https://nodejs.org/docs/latest/api/https.html#https_https_createserver_options_requestlistener
    // https://nodejs.org/docs/latest/api/tls.html#tls_tls_createsecurecontext_options
    var https = require('https');
    var fs = require('fs');

    var pkey = fs.readFileSync('key.pem');
    var pcert = fs.readFileSync('cert.pem')

    var options = {
        key: pkey,
        cert: pcert
    };

    var server = https.createServer(options, function (req, res) {
        res.writeHead(200);
        res.end("hello world\n");
    }).listen(443);

    ```
    