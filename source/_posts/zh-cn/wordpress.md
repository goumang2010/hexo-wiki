---
title: wordpress
excerpt: wordpress
categories: 
- FE
---



# 站点迁移
* 编辑配置文件，更改数据库设置
* 改变数据库中的相关链接：
```
UPDATE wp_options SET option_value = replace( option_value, 'www.liqiune.xyz','blog.liqiune.xyz') WHERE option_name = 'home' OR option_name ='siteurl' ;
UPDATE wp_posts SET post_content = replace( post_content, 'www.liqiune.xyz','blog.liqiune.xyz') ;
UPDATE wp_comments SET comment_content = replace(comment_content, 'www.liqiune.xyz','blog.liqiune.xyz') ;
UPDATE wp_comments SET comment_author_url = replace(comment_author_url, 'www.liqiune.xyz','blog.liqiune.xyz');
```
 如上所示，即是将域名www.liqiune.xyz迁移到blog.liqiune.xyz

# 技巧


## 首页显示摘要
```
 content.php 
　　<?php
the_content( __( 'Continue reading <span>→</span>', 'twentyeleven' ) ); 
?>

　　将它修改为
　　<?php if(!is_single()) {
the_excerpt();
} else {
the_content(__('(more…)'));
} ?>
```
[http://zhidao.baidu.com/link?url=aMq7xLOdcsAuQB11CeD8C2ujW9TwNKVIDaqWnIJt222mqD8ec8-9YEo-uZza2Cv5_jPbZp2Yw4SqDazBvdFjqq](http://zhidao.baidu.com/link?url=aMq7xLOdcsAuQB11CeD8C2ujW9TwNKVIDaqWnIJt222mqD8ec8-9YEo-uZza2Cv5_jPbZp2Yw4SqDazBvdFjqq)
