---
name: SNS自動化移行リファレンス
description: SNS Operation を自律型AIエージェント（Notion + GitHub Actions）に移行するための設計書
type: reference
last_updated: 2026-04-05
---

## 最上位構想（2026-04-05 確定）

**人間 10% / AI 90% の経営組織**
- 人間の役割 = 承認 or 却下 のみ
- プロダクト・マーケティングが自律的に進む
- 潜在顧客 → 有料顧客へ自動変換
- 会社口座に定期収益が自動振込

---

## SNS対象アカウント

### Phase 1（構築優先）
| SNS | アカウント | 言語 | URL |
|-----|-----------|------|-----|
| LinkedIn | kenji-viberush | EN | https://linkedin.com/in/kenji-viberush/ |
| X | @VibeRush_Kenji | EN | https://x.com/VibeRush_Kenji |
| Facebook | na2ken | JP | https://facebook.com/na2ken/ |

### Phase 2（将来拡張）
| SNS | アカウント | 言語 | URL |
|-----|-----------|------|-----|
| Instagram | kenjinatsumoto | 未決定 | https://instagram.com/kenjinatsumoto/ |
| TikTok | kenjinatsumoto | 未決定 | https://tiktok.com/@kenjinatsumoto |
| VibeCodingX | — | JP | https://vibecodingx.life/ |
| YouTube | THE-AI-COMPANY-STORY | JP | https://www.youtube.com/@THE-AI-COMPANY-STORY |

### 既存・維持
| SNS | アカウント | 言語 |
|-----|-----------|------|
| X | @natsuken1 | JP |
| note | vibe_coding | JP |
| Medium | @kenji_Natsumoto | EN |

---

## コンテンツ軸

1. **AI時事情報** — ClaudeCode新機能・業界ニュース等（外部ソース）
2. **夏本の一次体験** — MTG議事録・日記・開発体験（内部ソース）

### 切り口カテゴリ
| カテゴリ | 説明 |
|---------|------|
| A. ノウハウ系 | フォロワーが欲しい知識・使い方 |
| B. 潜在顧客開拓 | 課題提示・共感・ビフォーアフター |
| C. つぶやき | カジュアル・人間味・日常 |
| D. 実績・証拠 | 信頼醸成・数字・事例 |

---

## システムアーキテクチャ（完全版）

```
【STEP 1】自動クロール（GitHub Actions・定時起動）
  ┌─ 内部ソース ─────────────────────────┐
  │  situation_report_loop2.md（MTG議事録）  │
  │  MEMORY.md（プロジェクト進捗）           │
  │  weekly_posts.json（過去投稿・実績）      │
  │  VibeRush Chronicles（機能リリース）      │
  └──────────────────────────────────────┘
  ┌─ 外部ソース ─────────────────────────┐
  │  Anthropic/ClaudeCode 公式ブログ         │
  │  AI業界ニュース（X・LinkedIn トレンド）   │
  └──────────────────────────────────────┘
           ↓ Claude APIに投げる

【STEP 2】AI分析・投稿案提案（5〜10案）
  各案に: 事象タイトル / 切り口(A/B/C/D) / 対象SNS / ソース
           ↓ Notionの「提案DB」に書き込み
           ↓ Slackに通知

【STEP 3】夏本さんが選択・承認 ← 唯一の人間介在点①
  好みの案をNotionで採用
  必要なら修正指示を追記
           ↓

【STEP 4】コンテンツ生成（テキスト＋ビジュアル・同時並行）
  ┌─ テキスト生成 ──────────────────────┐
  │  LinkedIn(en) / X(en) / Facebook(jp)    │
  │  各プラットフォーム向けに最適化          │
  └──────────────────────────────────────┘
  ┌─ ビジュアル生成 ────────────────────┐
  │  Claude API → コンテンツ文脈に合ったHTML  │
  │  デザインガイドライン・テンプレートを適用  │
  │  Chrome Headless → PNG / PDF生成        │
  │  保存先: assets/posts/YYMMDD/           │
  │  LinkedIn: 1200×628px                   │
  │  X: 1024×1024px                         │
  │  Facebook: 1200×630px                   │
  └──────────────────────────────────────┘
           ↓ Notionの「草案DB」に一式保存
           ↓ Slackに最終確認通知

【STEP 5】最終承認（テキスト＋ビジュアルをセット確認）← 人間介在点②
  ✅ 承認 → 自動投稿へ
  ❌ 却下 + 修正指示 → 自動ブラッシュアップ（最大2回）→ 再通知
           ↓

【STEP 6】自動投稿（GitHub Actions）
  LinkedIn API → X API → Facebook API
  （Phase 2追加: Instagram / TikTok / VibeCodingX）
           ↓

【STEP 7】パフォーマンス収集 → 次回クロールにフィードバック
  IMP / クリック / エンゲージメント
  切り口別効果測定 → 提案精度の改善
```

---

## Notion DB設計（3テーブル）

### ①「提案DB」（AIが毎回書き込む）
| フィールド | 内容 |
|-----------|------|
| 事象タイトル | 何があったか一言 |
| 切り口 | A/B/C/D |
| 対象SNS | LinkedIn / X(en) / Facebook |
| ソース | どのデータから来たか |
| ステータス | 提案中 / 採用 / 却下 |
| 修正指示 | 夏本さんが入力 |

### ②「コンテンツ草案DB」（承認後に生成）
| フィールド | 内容 |
|-----------|------|
| 本文（LinkedIn版） | テキスト |
| 本文（X版） | テキスト |
| 本文（Facebook版） | テキスト |
| 画像（LinkedIn） | 添付PNG 1200×628 |
| 画像（X） | 添付PNG 1024×1024 |
| 画像（Facebook） | 添付PNG 1200×630 |
| PDF | 添付PDF（必要な場合） |
| ブラッシュアップ回数 | 0/1/2 |
| 最終承認 | ✅/❌ |

### ③「投稿実績DB」（投稿後）
| フィールド | 内容 |
|-----------|------|
| 投稿日時 | |
| SNS | |
| IMP / クリック / エンゲージ | |
| 切り口 | A/B/C/D |
| 次回反映ポイント | AI分析コメント |

---

## Phase 2 追加要件（技術メモ）

- **Instagram**: 縦長ビジュアル（1080×1350）+ Reels（短尺動画）
- **TikTok**: 縦型短尺動画（9:16）← 動画生成機能が必要
- **VibeCodingX**: ブログ記事形式（長文コンテンツ）
- **YouTube**: 動画コンテンツ（JP）← 最も制作コストが高い・スクリプト生成→動画編集自動化が必要
  チャンネル名「THE AI COMPANY STORY」= AIカンパニー化の実録ドキュメント的コンセプトと推察

---

## 参考資料

- **note記事**: 「Claude CodeとNotionエージェントでX運用を全自動化する方法」
  https://note.com/genai_topic/n/n4b1b1d925a5b
  → Notionカスタムエージェント + Claude Skill + コネクターの実装参考
- **YouTube**: https://youtu.be/eDtd9uryz-0
  → 同記事のPodcast動画版
- **NotebookLM**: https://notebooklm.google.com/notebook/8152d83f-a68e-4d23-8f28-d3f98a2540b1

---

## 決定経緯

- 2026-03-29 全社戦略MTG #3: ClaudeCode主体 → GitHub Actions + Notion移行を決定
- 2026-04-05 全社戦略MTG #4: 完全システム設計確定（自動クロール型・ビジュアル生成込み）

## ステータス

- **設計完了**（2026-04-05）
- **次のステップ**: Notion DBの実際の構築 → GitHub Actions実装
- **担当**: Pd開発セッション or SNS運用セッション
