---
title: mediaWiki
excerpt: mediaWiki
categories: 
- FE
---


* 使用<nowiki><nowiki></nowiki></nowiki>对MediaWiki符号进行非转义

# 配置
修改LocalSettings.php
Mediawiki采用的数据库不可禁用MyISAM，因为SearchIndex将会使用，故把默认的引擎都改为InnoDB后，不可禁用MyISAM,参见： [https://www.mediawiki.org/wiki/Manual_talk](https://www.mediawiki.org/wiki/Manual_talk):Searchindex_table
```
<?php
# Protect against web entry
// // // // if ( !defined( 'mediawiki' ) ) {
	// // // // exit;
// // // // }
## Uncomment this to disable output compression
# $wgDisableOutputCompression = true;
$wgSitename = "ChuuneWiki";
$wgScriptPath = "";
#需要与nginx中设置的php监视后缀一致
$wgScriptExtension = ".php";
#使用wiki/.../模式来显示url
$wgUsePathInfo      = true;
$wgArticlePath      = "/wiki/$1";
$wgServer = "http://wiki.chuune.top";
$wgStylePath = "$wgScriptPath/skins";
$wgResourceBasePath = $wgScriptPath;
$wgLogo = "/logo/wiki_logo.jpg";
$wgEnableEmail = false;
$wgEnableUserEmail = true; # UPO
$wgEmergencyContact = "ngnix@localhost";
$wgPasswordSender = "ngnix@localhost";
$wgEnotifUserTalk = false; # UPO
$wgEnotifWatchlist = false; # UPO
$wgEmailAuthentication = true;
#$wgGroupPermissions = array();
$wgGroupPermissions['*']['createaccount']   = true; 
$wgGroupPermissions['*']['read']            = true;
$wgGroupPermissions['*']['edit']            = false;
## Database settings
$wgDBtype = "mysql";
$wgDBserver = "***";
$wgDBname = "***";
$wgDBuser = "***";
$wgDBpassword = "***";
$wgDBprefix = "";

# MySQL table options to use during installation or update
#数据库引擎及字符
$wgDBTableOptions = "ENGINE=MyISAM, DEFAULT CHARSET=utf8";

# Experimental charset support for MySQL 5.0.
$wgDBmysql5 = false;

## Shared memory settings
$wgMainCacheType = CACHE_NONE;
$wgMemCachedServers = array();
$wgEnableUploads = false;
#$wgUseImageMagick = true;
#$wgImageMagickConvertCommand = "/usr/bin/convert";
$wgUseInstantCommons = false;
$wgShellLocale = "en_US.utf8";
#$wgHashedUploadDirectory = false;
$wgCacheDirectory = "$IP/cache";
# Site language code, should be one of the list in ./languages/Names.php
$wgLanguageCode = "zh-hans";
$wgSecretKey = "78bcf7f529d864e46b87a0f75a19bcb325eb66540ac49f201fde3d8a67ce0ede";
# Site upgrade key. Must be set to a string (default provided) to turn on the
# web installer while LocalSettings.php is in place
$wgUpgradeKey = "31d77b8f4d6d6cfb";
## For attaching licensing metadata to pages, and displaying an
## appropriate copyright notice / icon. GNU Free Documentation
## License and Creative Commons licenses are supported so far.
$wgRightsPage = ""; # Set to the title of a wiki page that describes your license/copyright
$wgRightsUrl = "";
$wgRightsText = "";
$wgRightsIcon = "";
# Path to the GNU diff3 utility. Used for conflict resolution.
$wgDiff3 = "";
## Default skin: you can change the default skin. Use the internal symbolic
## names, ie 'vector', 'monobook':
$wgDefaultSkin = "Metrolook";
$wgMetrolookFeatures = array( 'collapsiblenav' => array( 'global' => true, 'user' => true ) );
$wgMetrolookUploadButton = false;
# Enabled skins.
# The following skins were automatically enabled:
#加载皮肤
wfLoadSkin( 'CologneBlue' );
wfLoadSkin( 'Modern' );
wfLoadSkin( 'MonoBook' );
wfLoadSkin( 'Vector' );
wfLoadSkin( 'Metrolook' );
# Enabled Extensions. Most extensions are enabled by including the base extension file here
# but check specific extension documentation for more details
# The following extensions were automatically enabled:
wfLoadExtension( 'WikiEditor' );
# End of automatically generated settings.
# Add more configuration options below.
```


# 皮肤
所有的皮肤：[https://www.mediawiki.org/wiki/Category](https://www.mediawiki.org/wiki/Category):All_skins

皮肤排行：[https://wikiapiary.com/wiki/Skin](https://wikiapiary.com/wiki/Skin):Skins

当前使用：[https://www.mediawiki.org/wiki/Skin](https://www.mediawiki.org/wiki/Skin):Metrolook
Github:[https://github.com/paladox/Metrolook](https://github.com/paladox/Metrolook)
