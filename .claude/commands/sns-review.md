# /sns-review — 週次SNS投稿レビュー & 次週企画コマンド

## 使い方
このセッションで `/sns-review` を実行すると、秋元が以下を自動実行します。

## Step 1: 数値収集
以下を確認・入力してください（またはスクリーンショットを共有）:

```
【前回投稿データ】
- 投稿日時 (JST):
- X インプレッション数:
- X クリック数 (viberush.io):
- LinkedIn インプレッション数:
- LinkedIn クリック数 (viberush.io):
- LinkedIn エンゲージメント（いいね/コメント/リポスト）:
- 現プロダクト数（get_product_count.py で確認）:
```

## Step 2: 秋元が実行すること
1. `python3 scripts/get_product_count.py` でプロダクト数取得
2. `viberush.io/admin/analytics` でSupabaseクリック数確認（Chrome MCP）
3. 前回との比較・CTR算出
4. 投稿時刻の評価（目標: X=22:00 JST / LinkedIn=23:00 JST）

## Step 3: Close The Loop 分析フレーム

| 評価軸 | 問い |
|---|---|
| **リーチ** | IMPは目標比どうか？時刻・曜日の影響は？ |
| **エンゲージメント** | CTR・いいね率は？コンテンツの刺さり方は？ |
| **コンバージョン** | viberush.ioへの着地数は？どちらの媒体が優秀か？ |
| **コンテンツ** | どのフレーズ/アングルが効いた？次はどうする？ |

## Step 4: 次回投稿企画（秋元が案を出す）

### 出力フォーマット
```
【X メイン投稿案】
（リンクなし / 280文字以内）

【X リプライ案】
👇 Browse all XX Vibe-coded apps:
https://viberush.io/explore?utm_source=x&utm_campaign=曜日_MMDD

【LinkedIn 投稿案】
（500〜800文字 / ハッシュタグ付き）
https://viberush.io/explore?utm_source=linkedin&utm_campaign=曜日_MMDD
```

## KPI目標値（2026年3月時点）
| 指標 | 現状 | 短期目標 |
|---|---|---|
| X IMP | 13/回 | 100/回 |
| LinkedIn IMP | 40/回 | 200/回 |
| X CTR | 0% | 3%+ |
| LinkedIn CTR | 5% | 5%維持 |
| 週間着地数合計 | 2 | 20 |
