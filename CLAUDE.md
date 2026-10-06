# CLAUDE.md

## このリポジトリ

HOPE しごとタウン（職業体験 VR）。いまはビルド不要の 1 ファイル（`index.html`）で、three.js r128 を cdnjs から読む。
記録の項目は hope-work の `TrialPhase`（`app/src/domain/types.ts`）にそろえる。項目を変えるときは hope-work 側と合わせる。

## 作業の進め方

- 変更は `main` に入れる。プッシュ前に、ブラウザ（Playwright の Chromium など）で開いてコンソールにエラーが出ないことと、
  `window.hopeTown`（`goBooth` / `startSession` / `select`）で 1 つ以上のお店を最後まで進められることを確かめる。
- 公開は GitHub Pages（`main` / ルート）。WebXR は https でしか動かない。
