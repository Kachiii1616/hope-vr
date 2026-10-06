# デモ版の 保存先（GAS ＋ スプレッドシート）

`index.html` の 名前・バッジ・お金・家・家具と、体験の 記録を スプレッドシートに 残すための ウェブアプリです。

## 置きかた（clasp）

```sh
cd gas
clasp create --type sheets --title "HOPE しごとタウン 保存（デモ）" --rootDir .
clasp push
clasp open   # エディタで setup() を 1 回 実行（profiles / logs シートが できる）
clasp deploy --description "demo"
```

デプロイの 種類は「ウェブアプリ」、実行ユーザーは「自分」、アクセスは「全員」（`appsscript.json` の とおり）。
出てきた ウェブアプリの URL（`https://script.google.com/macros/s/…/exec`）を、ゲームの「設定 → スプレッドシートに 保存」に 入れます。
全員の 既定に したい ときは `index.html` の `DEFAULT_GAS_URL` に 入れます。

## シート

- `profiles`：`id` ごとに 1 行（なければ 足す・あれば 上書き）。`profile_json` が 読みこみに 使う 本体
- `logs`：体験が おわるたびに 1 行。hope-work の `TrialPhase` と 同じ 項目に、`medal`（1 銅・2 銀・3 金）と `pay` を 足した もの

## 気を つける こと（デモ版）

- URL を 知っている 人は だれでも 読み書き できます（ログインなし）。利用者ID には 本名を 使わず、`A001` のような 番号に して ください。名前の らんも ニックネームを すすめます。
- 本番で 使う ときは、Google ログイン（`executeAs: USER_ACCESSING`）や 事業所ごとの 合言葉など、アクセスの しくみを 別に 用意して ください。
- Claude 上の 公開ページ（Artifact）からは、外の サイトへの 通信が 止められて いる ことが あります。スプレッドシート保存を ためす ときは GitHub Pages など ふつうの ページで 開いて ください。
