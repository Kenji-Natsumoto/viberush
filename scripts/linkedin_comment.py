#!/usr/bin/env python3
"""
VibeRush LinkedIn コメント投稿スクリプト

使い方:
  python linkedin_comment.py <post_url_or_urn>

  例1 (URL指定):
    python linkedin_comment.py "https://www.linkedin.com/feed/update/urn:li:ugcPost:7234567890123456789/"

  例2 (URN直接指定):
    python linkedin_comment.py "urn:li:ugcPost:7234567890123456789"

動作:
  - 指定した LinkedIn 投稿に COMMENT_TEXT をコメントとして投稿する
  - 投稿公開後（月曜日）に実行する

前提:
  - linkedin_auth.py を実行済みで .env に LINKEDIN_ACCESS_TOKEN / LINKEDIN_PERSON_URN があること
"""

import os
import sys
import re
import urllib.parse

import requests
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

ACCESS_TOKEN = os.getenv("LINKEDIN_ACCESS_TOKEN")
PERSON_URN   = os.getenv("LINKEDIN_PERSON_URN")

# ============================================================
# コメント内容をここに記入（毎回編集する）
# ============================================================

COMMENT_TEXT = """
👇 Explore all Vibe-coded apps:
https://viberush.io/explore?utm_source=linkedin&utm_campaign=wed_0304
""".strip()

# ============================================================

LINKEDIN_VERSION = "202405"
COMMENT_API      = "https://api.linkedin.com/rest/socialActions/{post_urn}/comments"


def extract_urn(input_str: str) -> str:
    """
    LinkedIn投稿URLまたはURN文字列からURNを抽出する。

    対応フォーマット:
      - https://www.linkedin.com/feed/update/urn:li:ugcPost:XXXXX/
      - https://www.linkedin.com/feed/update/urn:li:share:XXXXX/
      - urn:li:ugcPost:XXXXX
      - urn:li:share:XXXXX
    """
    # URN が直接含まれているか確認
    urn_match = re.search(r"(urn:li:(?:ugcPost|share|activity):\d+)", input_str)
    if urn_match:
        return urn_match.group(1)

    raise ValueError(
        f"URLまたはURNを解析できませんでした: {input_str}\n"
        "LinkedIn投稿URLか urn:li:ugcPost:XXXX 形式で指定してください。"
    )


def post_comment(post_urn: str, text: str) -> dict:
    """
    LinkedIn 投稿にコメントを追加する。
    post_urn: 例 "urn:li:ugcPost:7234567890123456789"
    """
    encoded_urn = urllib.parse.quote(post_urn, safe="")
    url = COMMENT_API.format(post_urn=encoded_urn)

    headers = {
        "Authorization":              f"Bearer {ACCESS_TOKEN}",
        "X-Restli-Protocol-Version":  "2.0.0",
        "LinkedIn-Version":            LINKEDIN_VERSION,
        "Content-Type":               "application/json",
    }
    payload = {
        "actor":   PERSON_URN,
        "message": {"text": text},
    }

    resp = requests.post(url, headers=headers, json=payload)

    if resp.status_code == 401:
        print("❌ 401 Unauthorized: アクセストークンが無効または期限切れです。")
        print("   linkedin_auth.py を再実行してトークンを更新してください。")
        sys.exit(1)
    elif resp.status_code == 403:
        print("❌ 403 Forbidden: w_member_social スコープが不足しています。")
        print("   LinkedIn Developer App で 'Share on LinkedIn' Product を追加してください。")
        sys.exit(1)

    resp.raise_for_status()
    return resp.json() if resp.text else {"status": "ok"}


def main():
    # ── 認証情報チェック ──────────────────────────────────
    if not ACCESS_TOKEN or not PERSON_URN:
        print("❌ エラー: scripts/.env に認証情報がありません。")
        print("   先に以下を実行してください:")
        print("   python linkedin_auth.py")
        sys.exit(1)

    # ── 引数チェック ──────────────────────────────────────
    if len(sys.argv) < 2:
        print("使い方: python linkedin_comment.py <post_url_or_urn>")
        print()
        print("例 (URL):")
        print('  python linkedin_comment.py "https://www.linkedin.com/feed/update/urn:li:ugcPost:7234567890/"')
        print()
        print("例 (URN):")
        print('  python linkedin_comment.py "urn:li:ugcPost:7234567890123456789"')
        sys.exit(1)

    input_arg = sys.argv[1]

    # ── URN 抽出 ──────────────────────────────────────────
    try:
        post_urn = extract_urn(input_arg)
    except ValueError as e:
        print(f"❌ {e}")
        sys.exit(1)

    print("=" * 60)
    print("💬 LinkedIn コメント投稿")
    print("=" * 60)
    print(f"📌 投稿URN: {post_urn}")
    print(f"👤 アクター: {PERSON_URN}")
    print(f"\n📝 コメント内容:\n{COMMENT_TEXT}\n")

    # ── コメント投稿 ──────────────────────────────────────
    result = post_comment(post_urn, COMMENT_TEXT)

    print("✅ コメント投稿完了!")
    if result:
        print(f"   レスポンス: {result}")


if __name__ == "__main__":
    main()
