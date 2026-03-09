#!/usr/bin/env python3
"""
VibeRush X (Twitter) 自動投稿スクリプト
使い方:
  python x_post.py                                      # テキストのみ・リプライあり
  python x_post.py --images path/to/img.png             # 画像1枚付き投稿
  python x_post.py --images img1.png img2.png img3.png  # 画像複数枚（最大4枚）
  python x_post.py --no-reply                           # リプライなし（エンゲージメント投稿用）
  python x_post.py --images img.png --no-reply          # 画像付き・リプライなし

動作:
  - メイン投稿（リンクなし）を投稿
  - --no-reply なし: 5分待機 → 自分の投稿にリプライ（リンク付き）
  - --no-reply あり: メイン投稿のみ（コメント誘導型投稿に使用）
"""

import os
import time
import argparse
import tweepy
from dotenv import load_dotenv

# .env 読み込み
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

API_KEY             = os.getenv("X_API_KEY")
API_KEY_SECRET      = os.getenv("X_API_KEY_SECRET")
ACCESS_TOKEN        = os.getenv("X_ACCESS_TOKEN")
ACCESS_TOKEN_SECRET = os.getenv("X_ACCESS_TOKEN_SECRET")

# ============================================================
# 投稿内容をここに記入（毎回編集する）
# ============================================================

MAIN_POST = """
🔥 What got Vibed this week?

Top 3 apps most Vibed:

1️⃣ CodeBuddy – AI coding assistant
2️⃣ LaunchKit – AI app boilerplate
3️⃣ Plinq – Women's safety in Brazil

Solo builders proving fast shipping works.

(Links in the comments 👇)
#VibeRush #VibeCoding #AI
""".strip()

REPLY_POST = """
🔥 Start using your favorite apps with Vibe! → https://viberush.io/?utm_source=twitter&utm_medium=social&utm_campaign=mon_0309&utm_content=main#launches
(Free registration, takes 30 seconds)
""".strip()

# リプライまでの待機時間（秒）
WAIT_SECONDS = 5 * 60  # 5分

# ============================================================


def get_clients():
    """tweepy v1.1 API（メディアアップロード用）と v2 Client を返す"""
    auth = tweepy.OAuth1UserHandler(
        API_KEY, API_KEY_SECRET,
        ACCESS_TOKEN, ACCESS_TOKEN_SECRET
    )
    api_v1 = tweepy.API(auth)

    client_v2 = tweepy.Client(
        consumer_key=API_KEY,
        consumer_secret=API_KEY_SECRET,
        access_token=ACCESS_TOKEN,
        access_token_secret=ACCESS_TOKEN_SECRET,
    )
    return api_v1, client_v2


def upload_media(api_v1: tweepy.API, image_paths: list) -> list:
    """複数画像をアップロードしてmedia_idリストを返す（最大4枚）"""
    media_ids = []
    for image_path in image_paths[:4]:
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"画像ファイルが見つかりません: {image_path}")
        print(f"🖼️  画像アップロード中: {image_path}")
        media = api_v1.media_upload(filename=image_path)
        print(f"✅ メディアアップロード完了: media_id={media.media_id}")
        media_ids.append(media.media_id)
    return media_ids


def post_main(client_v2: tweepy.Client, media_ids=None) -> str:
    """メイン投稿（リンクなし）。投稿IDを返す"""
    if not MAIN_POST:
        raise ValueError("MAIN_POST が空です。スクリプト内の投稿内容を設定してください。")

    kwargs = {"text": MAIN_POST}
    if media_ids:
        kwargs["media_ids"] = media_ids

    response = client_v2.create_tweet(**kwargs)
    tweet_id = response.data["id"]
    print(f"✅ メイン投稿完了: https://x.com/VibeRush_Kenji/status/{tweet_id}")
    return tweet_id


def post_reply(client_v2: tweepy.Client, reply_to_id: str):
    """リプライ投稿（リンク付き）"""
    if not REPLY_POST:
        raise ValueError("REPLY_POST が空です。スクリプト内のリプライ内容を設定してください。")

    response = client_v2.create_tweet(
        text=REPLY_POST,
        in_reply_to_tweet_id=reply_to_id,
    )
    tweet_id = response.data["id"]
    print(f"✅ リプライ投稿完了: https://x.com/VibeRush_Kenji/status/{tweet_id}")
    return tweet_id


def main():
    parser = argparse.ArgumentParser(description="VibeRush X 投稿スクリプト")
    parser.add_argument("--images", type=str, nargs="+", default=None,
                        help="添付画像のパス（最大4枚・スペース区切り）")
    parser.add_argument("--no-reply", action="store_true",
                        help="リプライ投稿をスキップ（エンゲージメント投稿用）")
    args = parser.parse_args()

    # 認証情報チェック
    if not all([API_KEY, API_KEY_SECRET, ACCESS_TOKEN, ACCESS_TOKEN_SECRET]):
        print("❌ エラー: scripts/.env に X API credentials が設定されていません。")
        return

    api_v1, client_v2 = get_clients()

    # 画像アップロード（指定があれば）
    media_ids = None
    if args.images:
        media_ids = upload_media(api_v1, args.images)

    # 1. メイン投稿
    print("📤 メイン投稿中...")
    tweet_id = post_main(client_v2, media_ids=media_ids)

    # 2. リプライ（--no-reply でスキップ）
    if args.no_reply:
        print("\n🎉 完了！（リプライなしモード）")
        return

    # 3. 待機 → リプライ
    print(f"⏳ {WAIT_SECONDS // 60}分待機中...")
    for remaining in range(WAIT_SECONDS, 0, -30):
        print(f"   残り {remaining}秒...")
        time.sleep(min(30, remaining))

    print("💬 リプライ（リンク付き）投稿中...")
    post_reply(client_v2, tweet_id)

    print("\n🎉 完了！")


if __name__ == "__main__":
    main()
