# CLAUDE.md

## このリポジトリ

HOPE しごとタウン（職業体験 VR）。いまはビルド不要の 1 ファイル（`index.html`）で、three.js r128 を cdnjs から読む。
記録の項目は hope-work の `TrialPhase`（`app/src/domain/types.ts`）にそろえる。項目を変えるときは hope-work 側と合わせる。

## 作業の進め方

- 変更は `main` に入れる。プッシュ前に、ブラウザ（Playwright の Chromium など）で開いてコンソールにエラーが出ないことと、
  `window.hopeTown`（`goBooth` / `startSession` / `select`）で 1 つ以上のお店を最後まで進められることを確かめる。
- 公開は GitHub Pages（`main` / ルート）。WebXR は https でしか動かない。
- 変更は 確認が すんだら そのまま `main` に プッシュする（作業ブランチが あれば そちらにも）。いちいち 聞かない。
- `main` に 入れたら、claude.ai の アーティファクト https://claude.ai/artifact/3K4uKKwQ2JcMYKqvHr1QEp も `index.html` で 同じ 版に 更新する。
- 順番は かならず「`main` に プッシュ → そのあと アーティファクト」。アーティファクトだけ 先に 更新しない
  （アーティファクトにだけ 入って、Pages に 出ない 変更が できてしまう）。
- 作業の はじめに `git fetch origin main` で 最新に してから 始める。ほかの セッションが 同時に `main` を 進めることが ある。
- アーティファクトを 更新する 前に 読んで、`main` に ない 変更が あったら 先に `main` に 取りこむ（上書きして 消さない）。
