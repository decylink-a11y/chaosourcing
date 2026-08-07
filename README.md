# chaosourcing 独立站

一个可直接打开的个人 IP 外贸独立站：中文/English/عربي 三语、SEO 文件、视频宣传位、询盘表单、本地 CRM 和报价单后台。

## 使用

1. 编辑 `assets/config.js`，替换品牌名、你的名字、Facebook、WhatsApp、邮箱、视频链接和产品品类。
2. 直接打开 `index.html`，或在本目录运行 `python -m http.server 4173` 后访问 `http://localhost:4173`。
3. 后台入口在页脚“管理后台”，也可以直接访问 `index.html#/admin`。
4. 前台提交的询盘会进入本机浏览器存储；后台可改跟进状态、生成报价单、打印并导出 CSV。

## 上线前

- 把 `assets/config.js` 和 `index.html` 里的 `https://www.yourdomain.com` 换成真实域名。
- 把 `sitemap.xml` 和 `robots.txt` 提交到 Google Search Console。
- 把 `assets/videos/` 下的演示视频换成你的真实宣传视频。
- 多人共用 CRM 前，需要把本地存储换成数据库和后端登录；当前版本是单人演示版。
