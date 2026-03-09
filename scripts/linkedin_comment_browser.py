#!/usr/bin/env python3
"""
VibeRush LinkedIn コメント投稿スクリプト（ブラウザ自動化版）

使い方:
  初回: python linkedin_comment_browser.py --login
        → ブラウザが開くのでLinkedInにログインしてEnterを押す

  通常: python linkedin_comment_browser.py <post_url>
        例: python linkedin_comment_browser.py "https://www.linkedin.com/feed/update/urn:li:ugcPost:7234567890/"

特徴:
  - LinkedIn APIのパートナー認証不要
  - ログインセッションを保存して再利用（再ログイン不要）
  - 実際のブラウザ操作でコメントを投稿
"""

import os
import sys
import time
from pathlib import Path
from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeout

# セッション保存先
SCRIPTS_DIR   = Path(__file__).parent
SESSION_FILE  = SCRIPTS_DIR / "linkedin_session.json"
LINKEDIN_HOME = "https://www.linkedin.com/feed/"

# ============================================================
# コメント内容をここに記入（毎回編集する）
# ============================================================

COMMENT_TEXT = """
👇 Explore all Vibe-coded apps:
https://viberush.io/explore?utm_source=linkedin&utm_campaign=wed_0304
""".strip()

# ============================================================


def save_session(page):
    """現在のブラウザセッション（Cookie等）をファイルに保存"""
    storage = page.context.storage_state()
    import json
    with open(SESSION_FILE, "w") as f:
        json.dump(storage, f)
    print(f"✅ セッションを保存しました: {SESSION_FILE}")


def login_flow():
    """初回ログインフロー: ブラウザを開いてユーザーに手動ログインしてもらう"""
    print("=" * 60)
    print("🔐 LinkedIn ログイン（初回のみ）")
    print("=" * 60)
    print("\nブラウザが開きます。LinkedIn にログインしてください。")
    print("ログインが完了すると自動的にセッションが保存されます。")
    print("（最大120秒待機）\n")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False, slow_mo=200)
        context = browser.new_context(viewport={"width": 1280, "height": 800})
        page    = context.new_page()

        page.goto("https://www.linkedin.com/login")

        # LinkedIn フィードページに到達したらログイン完了と判断
        try:
            page.wait_for_url("**/feed/**", timeout=120_000)
            print("✅ ログイン検知！セッションを保存します...")
        except PlaywrightTimeout:
            # タイムアウトしても今の状態で保存を試みる
            print("⏰ タイムアウト。現在のセッションを保存します...")

        # セッション保存
        save_session(page)
        page.wait_for_timeout(1000)
        browser.close()

    print("✅ ログイン完了！次回から --login なしで使えます。")


def post_comment(post_url: str):
    """指定のLinkedIn投稿URLにコメントを投稿する"""

    if not SESSION_FILE.exists():
        print("❌ セッションファイルが見つかりません。")
        print("   先に以下を実行してログインしてください:")
        print("   python linkedin_comment_browser.py --login")
        sys.exit(1)

    import json
    with open(SESSION_FILE) as f:
        storage_state = json.load(f)

    print("=" * 60)
    print("💬 LinkedIn コメント投稿（ブラウザ自動化）")
    print("=" * 60)
    print(f"📌 投稿URL: {post_url}")
    print(f"\n📝 コメント:\n{COMMENT_TEXT}\n")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False, slow_mo=150)
        context = browser.new_context(
            storage_state=storage_state,
            viewport={"width": 1280, "height": 800},
        )
        page = context.new_page()

        # ── 1. 投稿ページへ移動 ────────────────────────────
        print("🌐 投稿ページへ移動中...")
        page.goto(post_url, wait_until="domcontentloaded")
        page.wait_for_timeout(3000)

        # ログイン確認
        if "login" in page.url or "authwall" in page.url:
            print("❌ セッションが切れています。再ログインしてください:")
            print("   python linkedin_comment_browser.py --login")
            browser.close()
            sys.exit(1)

        # ── 2. 「コメント」ボタンをクリック ───────────────
        print("🖱️  コメントボタンを探しています...")
        try:
            # コメントボタンのセレクタ（複数候補）
            comment_btn = page.locator(
                'button:has-text("コメント"), '
                'button:has-text("Comment"), '
                '[aria-label*="comment" i], '
                '[aria-label*="コメント"]'
            ).first
            comment_btn.wait_for(timeout=8000)
            comment_btn.click()
            print("✅ コメントボタンクリック")
        except PlaywrightTimeout:
            print("⚠️  コメントボタンが見つかりません。投稿を再表示してみます...")
            # フィードページから投稿を探す
            page.goto(LINKEDIN_HOME)
            page.wait_for_timeout(2000)
            page.goto(post_url, wait_until="domcontentloaded")
            page.wait_for_timeout(3000)
            comment_btn = page.locator(
                'button:has-text("コメント"), button:has-text("Comment")'
            ).first
            comment_btn.click()

        page.wait_for_timeout(1500)

        # ── 3. コメント入力欄にテキストを入力 ─────────────
        print("✏️  コメントを入力中...")
        try:
            editor = page.locator(
                '.comments-comment-box__form .ql-editor, '
                '[data-placeholder*="comment" i], '
                '[contenteditable="true"]'
            ).first
            editor.wait_for(timeout=6000)
            editor.click()
            editor.type(COMMENT_TEXT, delay=30)
            print("✅ テキスト入力完了")
        except PlaywrightTimeout:
            print("❌ コメント入力欄が見つかりません")
            page.screenshot(path=str(SCRIPTS_DIR / "debug_screenshot.png"))
            print("   デバッグ用スクリーンショット: scripts/debug_screenshot.png")
            browser.close()
            sys.exit(1)

        page.wait_for_timeout(1000)

        # ── 4. 投稿ボタンをクリック ───────────────────────
        print("📤 コメントを投稿中...")
        try:
            submit_btn = page.locator(
                'button.comments-comment-box__submit-button, '
                'button:has-text("投稿する"), '
                'button:has-text("Post")'
            ).first
            submit_btn.wait_for(timeout=5000)

            print(f"\n⚠️  投稿内容確認:")
            print(f"   {COMMENT_TEXT[:80]}...")
            print("\n3秒後に投稿されます。中止する場合は Ctrl+C を押してください...")
            time.sleep(3)

            submit_btn.click()
            page.wait_for_timeout(3000)
            print("✅ コメント投稿完了！")

            # セッション更新保存
            save_session(page)

        except PlaywrightTimeout:
            print("❌ 投稿ボタンが見つかりません")
            page.screenshot(path=str(SCRIPTS_DIR / "debug_screenshot.png"))
            browser.close()
            sys.exit(1)

        page.wait_for_timeout(2000)
        browser.close()

    print("\n🎉 完了！")


def main():
    if len(sys.argv) < 2 or sys.argv[1] == "--help":
        print(__doc__)
        print("使い方:")
        print("  初回ログイン: python linkedin_comment_browser.py --login")
        print("  コメント投稿: python linkedin_comment_browser.py <post_url>")
        sys.exit(0)

    if sys.argv[1] == "--login":
        login_flow()
    else:
        post_comment(sys.argv[1])


if __name__ == "__main__":
    main()
