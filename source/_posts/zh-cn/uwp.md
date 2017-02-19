---
title: uwp
excerpt: uwp
categories: 
- Windows
---

# 迁移
由wp7和wp8的silverlight应用，迁移至UWP，可使用[mobiliz](http://www.mobilize.net/download-silverlight-bridge)转化。
注意，如果visualStudio的版本问为2015 update3，则需要在需要转化的项目文件(.csproj),修改VisualStudioVersion标签为12.0，若没有该标签。则自行添加`<VisualStudioVersion>12.0</VisualStudioVersion>`，否则转化时会[报错](http://forums.mobilize.net/topic/83-some-errors-occured/)
