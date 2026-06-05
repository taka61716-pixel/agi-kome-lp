# 阿木川源流米 LP

お米販売・予約受付用の静的ランディングページです。

## 無料公開の方針

GitHub Pagesで公開する前提です。
HTML / CSS / JavaScriptだけで作っているため、サーバー契約や有料CMSは不要です。

## ファイル構成

- `index.html`: LP本体
- `styles.css`: デザイン
- `script.js`: 商品選択と注文メモ作成
- `assets/rice-hero.png`: メインビジュアル
- `.nojekyll`: GitHub Pagesで静的ファイルをそのまま配信するための設定

## 公開手順

1. GitHubで公開リポジトリを作成する
2. このフォルダの内容をそのリポジトリへpushする
3. GitHubのリポジトリ画面で `Settings` → `Pages` を開く
4. `Build and deployment` の `Source` を `Deploy from a branch` にする
5. `Branch` を `main`、フォルダを `/root` にして保存する
6. 数分後に表示されるURLへアクセスする

無料URLの例:

```text
https://githubユーザー名.github.io/リポジトリ名/
```

## 公開前に差し替える項目

- 商品名
- 産地
- 品種
- 価格
- 送料
- LINEのURL
- メールアドレス
- 実物写真
