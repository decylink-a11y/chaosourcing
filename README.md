# chaosourcing 独立站

一个可直接打开的个人 IP 外贸独立站：中文/English/عربي 三语、SEO 文件、视频宣传位、询盘表单、在线 CRM 和报价单后台。

## 使用

1. 编辑 `assets/config.js`，替换品牌名、你的名字、Facebook、WhatsApp、邮箱、视频链接和产品品类。
2. 直接打开 `index.html`，或在本目录运行 `python -m http.server 4173` 后访问 `http://localhost:4173`。
3. 后台入口在页脚“管理后台”，也可以直接访问 `index.html#/admin`。
4. 前台提交的询盘会进入 Supabase 在线数据库；后台可改跟进状态、生成报价单、打印并导出 CSV。

## 线上地址

- Vercel：https://chaosourcing.vercel.app/
- GitHub Pages：https://decylink-a11y.github.io/chaosourcing/
- Vercel 环境变量已配置：`SUPABASE_URL`、`SUPABASE_SERVICE_ROLE_KEY`、`ADMIN_PASSWORD`
- 管理后台需要输入 `ADMIN_PASSWORD` 才能查看和操作客户数据
- 购买域名后，再把 `assets/config.js`、`index.html`、`sitemap.xml`、`robots.txt` 里的地址换成正式域名。
- 把 `sitemap.xml` 和 `robots.txt` 提交到 Google Search Console。
- 把 `assets/videos/` 下的演示视频换成你的真实宣传视频。
