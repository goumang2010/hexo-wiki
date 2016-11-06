---
title: linux-authority
excerpt: linux-authority
categories: 
- Linux
---


# 概念
所有者

一般为文件的创建者，谁创建了该文件，就天然的成为该文件的所有者

用ls ‐ahl命令可以看到文件的所有者

也可以使用chown 用户名 文件名来修改文件的所有者

 

文件所在组

当某个用户创建了一个文件后，这个文件的所在组就是该用户所在的组

用ls ‐ahl命令可以看到文件的所有组

也可以使用chgrp 组名 文件名来修改文件所在的组

 

其它组

除开文件的所有者和所在组的用户外，系统的其它用户都是文件的其它组

# 数字对照
```
-rw------- (600) -- 只有属主有读写权限。

-rw-r--r-- (644) -- 只有属主有读写权限；而属组用户和其他用户只有读权限。

-rwx------ (700) -- 只有属主有读、写、执行权限。

-rwxr-xr-x (755) -- 属主有读、写、执行权限；而属组用户和其他用户只有读、执行权限。

-rwx--x--x (711) -- 属主有读、写、执行权限；而属组用户和其他用户只有执行权限。

-rw-rw-rw- (666) -- 所有用户都有文件读、写权限。这种做法不可取。

-rwxrwxrwx (777) -- 所有用户都有读、写、执行权限。更不可取的做法。
```

# 参考
[http://blog.chinaunix.net/uid-26960488-id-3442817.html](http://blog.chinaunix.net/uid-26960488-id-3442817.html)

[http://blog.chinaunix.net/uid-25052030-id-174343.html](http://blog.chinaunix.net/uid-25052030-id-174343.html)

[http://www.cnblogs.com/123-/p/4189072.html](http://www.cnblogs.com/123-/p/4189072.html)

[http://blog.csdn.net/nzing/article/details/9166057](http://blog.csdn.net/nzing/article/details/9166057)
