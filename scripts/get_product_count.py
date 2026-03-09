#!/usr/bin/env python3
"""
VibeRush プロダクト数自動取得スクリプト
使い方: python get_product_count.py
出力例: VibeRushに登録中のプロダクト数: 54
"""

import os
import requests
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

SUPABASE_URL      = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")


def get_product_count() -> int:
    """productsテーブルの件数を取得"""
    url = f"{SUPABASE_URL}/rest/v1/products?select=id"
    headers = {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
        "Prefer": "count=exact",
        "Range": "0-0",  # データ本体は1件だけ取得、件数はヘッダーで取る
    }
    response = requests.get(url, headers=headers)
    response.raise_for_status()

    # Content-Range: 0-0/54 のような形式で件数が返る
    content_range = response.headers.get("Content-Range", "")
    if "/" in content_range:
        total = int(content_range.split("/")[1])
        return total

    # フォールバック: レスポンスボディの件数
    return len(response.json())


def main():
    if not SUPABASE_URL or not SUPABASE_ANON_KEY:
        print("❌ エラー: scripts/.env に SUPABASE_URL と SUPABASE_ANON_KEY を設定してください。")
        return

    count = get_product_count()
    print(f"✅ VibeRushに登録中のプロダクト数: {count}")
    print(f"   → 投稿テンプレートに使う数値: {count} apps")
    return count


if __name__ == "__main__":
    main()
