---
name: SNS投稿ワークフロー自動化プロジェクト
description: AI-Nativeなを実現するためのSNS投稿ワークフロー自動化計画と確定事項
type: project
originSessionId: 59c6f224-696b-45da-9cd5-fb6f8ac1f292
---
2026-04-20に設計確定。2026-04-21 14:00以降に着手予定。

現状の課題: Claude Code + Notionの二重管理。夏本が原稿作成・フォーマット変換・コピペ・ステータス更新を手動で行っている。

目標: 夏本の作業を「ネタ出し」と「承認/差し戻し」のみに限定。

**確定アーキテクチャ:**
- 自動化エンジン: GitHub Actions + Claude API（Claude Code CLIではなく）
- トリガー: Notion ステータス変更（Webhook）
- Step 1: Notion Webhook → GitHub Actions 接続
- Step 2: Claude API でテキスト生成 + DALL-E APIで画像生成（同時実行）
- Step 3: 承認トリガーで各プラットフォームAPIに直接投稿 → Notion自動更新

**画像生成の組み込み:**
- タイミング: Step 2（テキスト生成と同時）
- 保管先: `content/images/`（git管理、Supabase Storage不使用）
- 「画像のみ再生成」用のNotionステータス値を追加予定

**Why:** ClaudeCodeはセッション指示が毎回必要。NotionはリッチテキストでないためSNS投稿フォームへの変換が手動になる。GitHub Actionsがこの両問題を解消する。

**How to apply:** 4/21午後からStep 1着手。既存スクリプト（x_post.py、linkedin playwright等）をGitHub Actionsランナーに移植する方針。
