# Analytics + Build Foundation セッション向けブリーフィング
# 自動統計収集システム 設計・実装指示

作成: 2026-03-09 | 作成元: PMセッション

---

## 🎯 背景・目的

Close The Loopサイクルを半自動で回すため、**XとLinkedInの毎日の投稿統計データを自動収集し、Googleスプレッドシートに記録する仕組み**を構築する。

SNS Ope.セッションと連携：
- SNS Ope.セッション → 投稿後にP列（投稿URL）を記録
- Analytics セッション → P列のURLを読み、各プラットフォームのAPIまたはブラウザ経由でスタッツを取得 → L/M/N/O列に書き込み

---

## 📊 収集対象データ

| 媒体 | データ項目 | 収集方法 |
|------|----------|---------|
| X (Twitter) | インプレッション、いいね、RT、リプライ、URLクリック | Twitter API v2 (organic_metrics) |
| LinkedIn | インプレッション、リアクション、コメント、シェア、クリック | Playwright browser automation |

---

## 🏗️ 推奨アーキテクチャ

```
[毎日 or 週次 cron/手動実行]
    ↓
daily_analytics.py
    ├─ sheets_reader.py  → P列（投稿URL/ID）を読み込む
    ├─ x_stats.py        → Twitter API v2 で各ツイートのメトリクスを取得
    ├─ linkedin_stats.py → Playwright でLinkedIn投稿ページからスタッツをスクレイプ
    └─ sheets_writer.py  → L/M/N/O列に書き込み
```

---

## 🔧 技術詳細

### X (Twitter) 統計収集

既存の OAuth 1.0a 認証情報（`.env`）を流用可能。

```python
# scripts/x_stats.py
import tweepy, os
from dotenv import load_dotenv

load_dotenv()

client = tweepy.Client(
    consumer_key=os.getenv("X_API_KEY"),
    consumer_secret=os.getenv("X_API_SECRET"),
    access_token=os.getenv("X_ACCESS_TOKEN"),
    access_token_secret=os.getenv("X_ACCESS_TOKEN_SECRET")
)

def get_tweet_stats(tweet_id: str) -> dict:
    tweet = client.get_tweet(
        tweet_id,
        tweet_fields=["public_metrics", "organic_metrics"],
        user_auth=True  # organic_metricsにはuser_auth=Trueが必要
    )
    pub = tweet.data.public_metrics or {}
    org = tweet.data.organic_metrics or {}
    return {
        "impressions": org.get("impression_count", 0),
        "url_clicks": org.get("url_link_clicks", 0),
        "likes": pub.get("like_count", 0),
        "retweets": pub.get("retweet_count", 0),
        "replies": pub.get("reply_count", 0),
    }

# tweet_id はURLから: https://x.com/xxx/status/[tweet_id]
```

### LinkedIn 統計収集

既存の `linkedin_comment_browser.py` の Playwright セッションを流用。

```python
# scripts/linkedin_stats.py
# Playwright で投稿ページを開き、スタッツ領域をスクレイプ
# 投稿URL例: https://www.linkedin.com/posts/kenji-viberush_xxx
# 投稿ページの .social-details-social-counts などから取得
# セッション: scripts/linkedin_session.json を再利用
```

⚠️ LinkedIn の公式分析APIはPartnerプログラム申請必須のため、ブラウザ自動化が現実的。

### Google Sheets 書き込み

**方法1（推奨）: gspread + Service Account**
```bash
pip install gspread oauth2client
# scripts/google-service-account.json が必要（Google Cloud Consoleで作成）
```

**方法2（代替）: Apps Script Webhook**
- Apps Script に `doPost()` エンドポイントを作成
- Python から `requests.post(webhook_url, json=data)` で書き込み
- Service Account 不要。既存のスプレッドシートに直接書き込める

---

## 📋 スプレッドシート列構成

スプレッドシート: https://docs.google.com/spreadsheets/d/1_pmkLULg6Zq2XU97ukYX21VLheY-WhXydAfHVUUp7GU/edit
シート: `Week of 3/9`（以降の週も同形式）

| 列 | 内容 | 担当 |
|----|------|------|
| L | IMP（インプレッション） | Analytics → 自動書き込み |
| M | リーチ / クリック | Analytics → 自動書き込み |
| N | エンゲージメント（いいね+RT等） | Analytics → 自動書き込み |
| O | CTR% | 自動計算（=M/L*100） |
| **P** | **投稿URL** | **SNS Ope.セッションが投稿後に手動記録** |
| Q | GA4セッション数 | Analytics → 週次で手動 or GA4 API |

---

## ✅ 実装ステップ（優先順）

1. **`x_stats.py`** — Twitter API v2 `organic_metrics` で各ツイートの統計取得
2. **Sheets書き込みの方式決定** — gspread（Service Account）vs Apps Script Webhook
3. **`linkedin_stats.py`** — Playwright でLinkedIn投稿ページからスタッツスクレイプ
4. **`daily_analytics.py`** — 上記を統合。P列URLを読んで → 取得 → 書き込みまで1コマンドで実行
5. **cron設定** — 毎日深夜（例: 02:00 JST）に自動実行

---

## 🔗 参照ファイル
- 既存スクリプト: `scripts/x_post.py`（tweepy OAuth設定の参考）
- 既存スクリプト: `scripts/linkedin_comment_browser.py`（Playwright session参考）
- 技術メモ: `memory/technical_notes.md`
- SNS Ope.引き継ぎ: `memory/sns_ope_handoff_week0309.md`（P列仕様）
