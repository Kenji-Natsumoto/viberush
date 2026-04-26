# SNS Ope. 引き継ぎ — Week of 3/9〜3/15, 2026

作成: 2026-03-09 | 作成元セッション: 情報分析基盤セッション

---

## 🎯 このドキュメントの目的
Week of 3/9 のSNS投稿コンテンツは **F列に全て完成済み**。
SNS Ope.セッションの役割は「スケジュール設定・投稿実行・計測記録」のみ。

---

## 📋 スプレッドシート情報
- **URL**: https://docs.google.com/spreadsheets/d/1_pmkLULg6Zq2XU97ukYX21VLheY-WhXydAfHVUUp7GU/edit
- **シート**: `Week of 3/9`（gid=0）
- **列構成**: A=日付 / B=曜日 / C=媒体 / D=投稿タイプ / F=EN本文 / G=ハッシュタグ / H=画像/PDF / I=ステータス / J=投稿時刻JST / K=UTMリンク / **P=投稿URL（記録用）** / **Q=GA4セッション（記録用）**

---

## 📅 投稿スケジュール（Week of 3/9）

### 月曜 3/9
| # | シート行 | 媒体 | アクション | 時刻 JST | 内容冒頭 | UTM/リンク |
|---|---------|------|-----------|---------|---------|-----------|
| 1 | Row 2 | **X** | **POST スケジュール** | **22:00** | 🔥 What got Vibed this week? | utm_campaign=mon_0309 (twitter) |
| 2 | Row 3 | **X** | **REPOST（POST後5分以内にリプライ）** | 22:05〜 | 🔥 Start using your favorite apps with Vibe! → [UTMリンク] | F列Row3のリンク付きテキスト |
| 3 | Row 4 | **LinkedIn** | **POST スケジュール** | **23:00** | 🔥 Week in Vibe: The 3 AI apps that moved... | utm_campaign=mon_0309 (linkedin) |
| 4 | Row 5 | **LinkedIn** | **REPOST（POST後にコメント追加）** | 23:05〜 | 👉 Discover more → [UTMリンク] | F列Row5のリンク付きテキスト |

### 火曜 3/10（X のみ）
| # | シート行 | 媒体 | アクション | 時刻 JST | 内容冒頭 | UTM/リンク |
|---|---------|------|-----------|---------|---------|-----------|
| 5 | Row 6 | **X** | **POST スケジュール** | **22:00** | 📊 VibeRush by the numbers this week: | utm_campaign=tue_0310 (twitter) |

> ⚠️ 火曜はREPOSTなし・LinkedInなし

### 水曜 3/11
| # | シート行 | 媒体 | アクション | 時刻 JST | 内容冒頭 | UTM/リンク |
|---|---------|------|-----------|---------|---------|-----------|
| 6 | Row 7 | **X** | **POST スケジュール** | **22:00** | 🚫 The build trap is real. Most Vibe coders... | ship-guide / utm_campaign=wed_0311 (twitter) |
| 7 | Row 8 | **LinkedIn** | **POST スケジュール** | **23:00** | 🚨 The biggest mistake Vibe developers make... | ship-guide / utm_campaign=wed_0311 (linkedin) |

### 木曜 3/12（コメント誘導型 ＝ UTMリンクなし！）
| # | シート行 | 媒体 | アクション | 時刻 JST | 内容冒頭 | 備考 |
|---|---------|------|-----------|---------|---------|------|
| 8 | Row 9 | **X** | **POST スケジュール** | **22:00** | 🤔 What AI tool are you shipping with right now? | **リンクなし・エンゲージメント誘導** |
| 9 | Row 10 | **LinkedIn** | **POST スケジュール** | **23:00** | 🤔 Quick question for builders in my network: | **リンクなし・エンゲージメント誘導** |

> ⚠️ 木曜はコメント誘導型。URLを含めない。REPOSTも不要。

### 金曜 3/13（製品スポットライト）
| # | シート行 | 媒体 | アクション | 時刻 JST | 内容冒頭 | UTM/リンク |
|---|---------|------|-----------|---------|---------|-----------|
| 10 | Row 11 | **X** | **POST スケジュール** | **22:00** | 🎉 TGIF Maker Spotlight — This week: [Maker Name] | product/2e7211db... / utm_campaign=fri_0313 (twitter) |
| 11 | Row 12 | **LinkedIn** | **POST スケジュール** | **23:00** | 🎉 TGIF – Meet this week's featured Vibe Coder: | product/2e7211db... / utm_campaign=fri_0313 (linkedin) |

> ⚠️ 金曜の製品URLは **https://viberush.io/product/2e7211db-624b-4d04-8e84-25223c2efd09** (K列参照)
> [Maker Name] と @[handle] は投稿前に実際のメーカー情報で置換すること！

### 土曜 3/14（X のみ）
| # | シート行 | 媒体 | アクション | 時刻 JST | 内容冒頭 | UTM/リンク |
|---|---------|------|-----------|---------|---------|-----------|
| 12 | Row 13 | **X** | **POST スケジュール** | **14:00** | 📊 This week on VibeRush: | explore / utm_campaign=sat_0314 (twitter) |

### 日曜 3/15（X のみ）
| # | シート行 | 媒体 | アクション | 時刻 JST | 内容冒頭 | UTM/リンク |
|---|---------|------|-----------|---------|---------|-----------|
| 13 | Row 14 | **X** | **POST スケジュール** | **12:00** | ☀️ The best AI apps aren't built by companies. | product/a7ac125a... / utm_campaign=sun_0315 (twitter) |

---

## 🔄 POST → REPOST フロー（月曜のみ）

```
[22:00] X POST スケジュール（Row2 F列をコピペ）
  ↓ 投稿公開後 5分以内
[22:05〜] X REPOST（リプライ）：Row3 F列（UTMリンク入り）を返信として投稿

[23:00] LinkedIn POST スケジュール（Row4 F列をコピペ）
  ↓ 投稿公開後 5分以内
[23:05〜] LinkedIn REPOST（最初のコメント）：Row5 F列（UTMリンク入り）を投稿
```

⚠️ **REPOSTは事前スケジュール不可**（親投稿が公開されてからリプライするため）
→ 月曜22:00・23:00以降にChrome MCPまたは手動で実行

---

## ✅ 投稿後の計測記録（SNS Ope.担当）

各投稿公開後、スプレッドシートに記録:
1. **P列「投稿URL」**: 投稿のパーマリンクを記録
   - X: `https://x.com/VibeRush_Kenji/status/[ID]`
   - LinkedIn: `https://www.linkedin.com/posts/kenji-viberush_[slug]`
2. **I列「ステータス」**: 投稿済み → `投稿済み ✅` に更新
3. **Q列「GA4セッション」**: 週次分析時にGA4から記録

---

## 🛠️ 実行ツール・技術メモ

### X投稿（x_post.pyスクリプト使用）
```bash
cd /Users/natsuken/_01VibeRush/scripts/
python3 x_post.py
```
- `.env`のXクレデンシャルを使用（OAuth 1.0a）
- スクリプトは「本文POST → 5分待機 → リプライ（リンク付き）」を自動実行
- ⚠️ 本文テキストをスクリプト内の変数に入力して使用

### LinkedIn投稿（Chrome MCP経由）
- Quill API使用（Shadow DOMバグ修正済み）:
  ```javascript
  sr.querySelector('.ql-container').__quill.insertText(0, text, 'user')
  ```
- 詳細: `memory/technical_notes.md` 参照
- スケジュール確定は「スケジュール」ボタンを手動クリック推奨

### 画像/PDF（H列を参照）
- H列に画像・PDF添付情報が記載されている場合は対応
- 月曜POSTには画像（X）・PDF（LinkedIn）を添付
- 詳細: `memory/monday_post_workflow.md` 参照

---

## 📊 今週の特記事項

1. **月曜（3/9）が最重要投稿**：Main★★★ × 2媒体 + REPOST
2. **金曜（3/13）は製品スポットライト**：K列の製品URL使用。[Maker Name]/@[handle]の実名置換必須
3. **木曜（3/12）はエンゲージメント型**：URLなしでコメントを誘導するのが目的
4. **今週は月・水・金 + 火・土・日 の混合スケジュール**（全7日間）

---

## 📌 Discord用リンク（Row 15参照）

スプレッドシートRow15にDiscordコミュニティ向けのリンクバリエーションが記載されています。
Discord投稿が必要な場合はそちらを参照（UTMパラメータ: utm_source=discord）。

---

## 🔁 週次クローズ・ザ・ループ（翌週日曜）

投稿後の分析:
- 各投稿のIMP/クリック/CTR%を L/M/O列に記録（手動またはAPI）
- Q列にGA4セッション数を記録
- MEMORY.mdのSNS Analyticsログに週次サマリーを追記

---
_最終更新: 2026-03-09 | 情報分析基盤セッション_
