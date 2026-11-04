# 发布到插件市场

本文件是操作手册。规则取自 `awesome-dsh-plugin/awesome-dsh-plugin` 的 `contributing.md`
（2026-11 抓取）与本机装的 `dshmarket` 1.71.1 的实现，不是猜的。

## 一、它是怎么被「发现」的

```
你的 GitHub 仓库
      │  PR：data/plugins/<owner>__<repo>.yml（一个文件 = 一次投稿）
      ▼
awesome-dsh-plugin 仓库 ──CI──► README 生成 + docs/plugins.json + npm 包 dsh-plugin-catalog
      │                                        │
      │                          jsdelivr / 国内 npm 镜像
      ▼                                        ▼
awesome-dsh-plugin.com/plugins.json ──► 市场「插件市场」页签（每次打开实时拉取）
```

所以你不用往市场仓库提任何东西——市场只是一个读者。它每次打开都实时拉
`awesome-dsh-plugin.com/plugins.json`，国内优先从 npm 镜像读同一份目录；宿主 0.2.1 起的
「插件 → 发现 → 索引源」也能加 `https://cdn.jsdelivr.net/npm/dsh-plugin-catalog/index.json`。

## 二、硬性门槛（缺一条就被 CI 或维护者打回）

1. 仓库的 `package.json` 声明 `dsh.bundle`——✅ 本包已声明。**只声明 `dsh.client` 是最常见的被拒原因**，那东西装不上。
2. 仓库里有真实可用的代码——✅ 两个文件，没有占位。
3. **仓库创建满 1 天**。CI 自动查。今天建仓库、今天提 PR 会被拒；明天再提即可，重新提交不影响任何东西。
4. 仓库加上 `dsh-plugin` topic。
5. 描述只说功能、必须与代码对得上（描述被当作对你插件的声明，会被逐条核对）。营销词与夸大是让一个本来不错的插件被打回的主因。

## 三、步骤

### 0. 先决条件

- GitHub 账号一个，npm 账号一个（推荐；不发 npm 也能上架，见 §四）
- 目录 `D:\动画\sticky-wall` 就是将来仓库的根目录，`git` 已初始化并有了首次提交

### 0.5 先把身份填进去（一条命令）

仓库建好之后跑一次，它会补齐 `package.json` 的 `repository` / `homepage` / `bugs` / `author`，
并把 `market-entry.yml` 里的 `OWNER` 换成真值：

```sh
node scripts/apply-identity.mjs <github-owner> [仓库名] --author "你的名字 <you@example.com>"
# 例：node scripts/apply-identity.mjs octocat dsh-sticky-wall --author "Octo Cat <octo@example.com>"
```

它还会打印投稿文件应当落在 `awesome-dsh-plugin` 仓库里的路径与文件名
（`data/plugins/<owner>__<repo>.yml`）。加 `--dry-run` 只打印、不写文件。

### 1. 建仓库并推上去

仓库名建议 `dsh-sticky-wall`（与 npm 包名一致，省得解释）。**public**。

```sh
cd D:/动画/sticky-wall
git remote add origin https://github.com/OWNER/dsh-sticky-wall.git
git push -u origin main
```

推完去 GitHub 仓库设置里加 topic：`dsh-plugin`。

> 首次提交现在用的是占位作者（`dsh-sticky-wall <dsh-sticky-wall@users.noreply.github.com>`，
> 当时这台机器没配 git 身份）。想换成你自己名字，推之前跑一次：
>
> ```sh
> git config user.name "你的名字"
> git config user.email "你的邮箱"
> git commit --amend --reset-author --no-edit
> ```

### 2. 补 package.json 的仓库字段

这一步已由 §0.5 的脚本完成，不用手写。它写入的是：

```jsonc
"repository": { "type": "git", "url": "git+https://github.com/OWNER/dsh-sticky-wall.git" },
"homepage": "https://github.com/OWNER/dsh-sticky-wall#readme",
"bugs": { "url": "https://github.com/OWNER/dsh-sticky-wall/issues" },
"author": "你的名字 <you@example.com>"
```

### 2.5 截图（强烈建议，别跳过）

目录现在的正规做法是：**在你自己的仓库根目录放一个 `screenshots.json`**（和 `package.json` 并排），
列出 1–8 张图的相对路径。之后换图不用再提 PR，推自己的仓库、下次构建自动生效。

1. 按 `docs/screenshots/README.md` 的要求拍三张，放进 `docs/screenshots/`
2. 在仓库根目录新建 `screenshots.json`：

   ```json
   [
     "docs/screenshots/wall.png",
     "docs/screenshots/appearance.png",
     "docs/screenshots/note.png"
   ]
   ```

3. 再把 `README.md` 里 `## Screenshots` 段落的两行注释围栏删掉

路径相对于 `screenshots.json` 本身，**图没提交就别先建这个文件**——写错的路径不会报错，只会显示成裂图。
不建也行，市场会退回去从 README 抽图；建了的好处是能控制顺序和取舍。

注意：图必须是 GitHub 托管（相对路径，或 `raw.githubusercontent.com` 这类绝对地址）；
第三方图床会被拒，SVG 也不行（卡片图标那条规则）。`assets/icon-180.png` 是卡片图标，别和截图混了。

### 3. 发 npm（推荐）

发 npm 的插件是「预构建安装」，用户装的时候不用走 `allowBuilds` 构建授权，装得快也少一步吓人的弹窗。

```sh
npm login                      # 需要开 2FA 的浏览器确认
npm publish --access public    # 名称已确认没被占用：https://registry.npmjs.org/dsh-sticky-wall 返回 404
```

本包 `npm pack --dry-run` 已核对过内容，9 个文件、8.8 kB：

```
LICENSE  README.md  client.js  cordis.patch.yml  icon.svg  index.js
locale/en.json  locale/zh.json  package.json
```

`assets/icon-180.png` 只在 GitHub 上给商店卡片用，不进 npm 包（也不该进）。

> npm 上如果哪天要改名字，先 `npm deprecate` 旧名，再在新条目的 yml 里用 `previousNpm` 字段声明旧名，否则用户的更新会断。

### 4. 可选：GitHub Release 预构建包

不发 npm 时，把 `npm pack` 出来的 tgz 挂到 Release，让条目里的 `tarball:` 指过去。
**注意** `latest/download/` 只解析 `latest`、文件名按字面取——文件名带版本号的话，下次发版链接就 404。
要么文件名不带版本号，要么钉住 tag。

### 5. 提 PR：一个 YAML 文件

把 [market-entry.yml](market-entry.yml) 改好（填 `OWNER`），放进
`awesome-dsh-plugin` 仓库的 `data/plugins/<owner>__<repo>.yml`，例如：

```
data/plugins/octocat__dsh-sticky-wall.yml
```

内容就是那一个文件，别改 README——两个 README 都是 CI 从 `data/plugins/*.yml` 生成的，
手改会被要求 revert。一个 PR 最多 3 条，且只能动自己的条目。

### 6. CI 会依次检查

1. 条目数 ≤ 3
2. 从你仓库 `package.json` 读 `dsh.bundle`
3. 仓库年龄 ≥ 1 天
4. `awesome-lint` + 站点构建（双语、分隔符、日期、截图）

失败会明确说改什么，推到同一分支即可，不用重开 PR。

### 7. 评审与合并之后

维护者会读你的仓库，核对描述里的每一句、分类是否贴切、是否和已有条目重复、源码有无可疑之处。
需要改动时给 PR 打 `held: author` 标签：把修改推到同一分支，**再留一条评论**说明改了什么就够了，
反复推送不会更快。合并后网站自动重建，市场下次打开就有。

分类我填的是 `ui`（合法取值之一：`agi` `ui` `usage` `theme` `model` `identity` `session` `memory`
`tools` `wsl` `browser` `vision` `voice` `docs` `skill` `workflow` `git` `notify` `dev` `security`
`remote` `market` `fun`）。分类选偏不会被打回，维护者直接改。

## 四、不发 npm 行不行

行。条目只认仓库，`dsh.bundle` 存在即可源码安装。代价是用户装的时候要走一次构建授权
（本包没有构建脚本，所以其实很快）。想省掉那一步就发 npm，或挂 Release tarball。

## 五、发版之后

改了代码：`npm version patch`（或 minor）→ `npm publish` → 条目不用动，市场从 npm 的
`dist-tags.latest` 读版本，用户那边会看到「有更新」。

如果你换了包名：在条目 yml 里加

```yaml
previousNpm:
  - 旧包名
```

## 六、本仓库的三处一致性（改名时容易翻车）

包名同时出现在三个地方，必须一致，否则装上了也不渲染：

| 位置 | 现在的值 |
| --- | --- |
| `package.json` → `name` | `dsh-sticky-wall` |
| `cordis.patch.yml` → `insert[0].name` | `dsh-sticky-wall` |
| `client.js` → `window.__ModuleLoader__.load({ id })` | `dsh-sticky-wall` |

`cordis.patch.yml` 里的 `insert[0].id`（`sticky-wall`）是 loader 行 id，和包名无关，改不改都行。

## 七、常见被拒原因（对照自查）

- 只写 `dsh.client`、没有 `dsh.bundle` → 装不上
- 仓库刚建几十分钟 → 等一天
- 描述里写了不存在的命令 / 夸大了功能数量 → 改准
- 描述里有 `: `（英文冒号+空格）却没加引号 → YAML 解析成嵌套键，整个 PR CI 红
- 纯聚合包（内容只有一份依赖清单）→ 不单独收录
- 依赖指向别人仓库的副本而不是原作者 → 不收
