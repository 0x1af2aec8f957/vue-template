#### public目录（原始文件存放目录 & 模板文件存放目录）

```bash
public
├── README.md # 文件夹描述文件
├── favicon.ico # 网站ico文件
└── index.html # 项目html模板文件, `htmlWebpackOptions.template`配置项

0 directories, 3 files
```

> Tips: 放入这里文件及文件夹，将原封不动的发送给打包文件夹,排除`CopyWebpackPlugin.patterns`内忽略的特殊文件。
