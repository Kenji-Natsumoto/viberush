#!/usr/bin/env python3
"""
LinkedIn OAuth 2.0 認証スクリプト（初回のみ実行）

実行すると：
  1. ブラウザで LinkedIn 認証ページが開く
  2. ログイン・アプリ許可をする
  3. アクセストークンを取得して scripts/.env に自動保存

前提:
  - scripts/.env に LINKEDIN_CLIENT_ID と LINKEDIN_CLIENT_SECRET が設定済みであること
  - LinkedIn Developer App で Redirect URL に http://localhost:8788/callback が登録済みであること
  - App Products に「Share on LinkedIn」または「Sign In with LinkedIn using OpenID Connect」が追加済みであること
"""

import os
import sys
import json
import urllib.parse
import webbrowser
from http.server import HTTPServer, BaseHTTPRequestHandler

import requests
from dotenv import load_dotenv, set_key

DOTENV_PATH = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(DOTENV_PATH)

CLIENT_ID     = os.getenv("LINKEDIN_CLIENT_ID")
CLIENT_SECRET = os.getenv("LINKEDIN_CLIENT_SECRET")

REDIRECT_URI = "http://localhost:8788/callback"
SCOPES       = ["w_member_social"]   # Share on LinkedIn Product で使えるスコープのみ

AUTH_URL    = "https://www.linkedin.com/oauth/v2/authorization"
TOKEN_URL   = "https://www.linkedin.com/oauth/v2/accessToken"
ME_URL      = "https://api.linkedin.com/v2/me"  # 旧API: w_member_social で Person URN 取得

# コールバックで受け取る認可コード
auth_code = None


class CallbackHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        global auth_code
        parsed = urllib.parse.urlparse(self.path)
        params = urllib.parse.parse_qs(parsed.query)

        if "code" in params:
            auth_code = params["code"][0]
            self.send_response(200)
            self.end_headers()
            self.wfile.write(
                "<html><body><h2>✅ 認証成功！ターミナルに戻ってください。</h2>"
                "<p>このウィンドウは閉じて大丈夫です。</p></body></html>".encode()
            )
        else:
            error = params.get("error", ["unknown"])[0]
            self.send_response(400)
            self.end_headers()
            self.wfile.write(
                f"<html><body><h2>❌ 認証失敗: {error}</h2></body></html>".encode()
            )

    def log_message(self, format, *args):
        pass  # サーバーログを抑制


def main():
    if not CLIENT_ID or not CLIENT_SECRET:
        print("❌ エラー: scripts/.env に以下を設定してください：")
        print("   LINKEDIN_CLIENT_ID=<your_client_id>")
        print("   LINKEDIN_CLIENT_SECRET=<your_client_secret>")
        print("\n取得方法: https://www.linkedin.com/developers/apps")
        sys.exit(1)

    # ── Step 1: 認可URL 生成 ──────────────────────────────
    params = {
        "response_type": "code",
        "client_id":     CLIENT_ID,
        "redirect_uri":  REDIRECT_URI,
        "scope":         " ".join(SCOPES),
        "state":         "viberush_linkedin_auth",
    }
    auth_page_url = f"{AUTH_URL}?{urllib.parse.urlencode(params)}"

    print("=" * 60)
    print("🔐 LinkedIn OAuth 2.0 認証")
    print("=" * 60)
    print("ブラウザで認証ページを開きます...")
    print(f"URL: {auth_page_url}")
    webbrowser.open(auth_page_url)

    # ── Step 2: コールバックサーバーで認可コード受信 ──────
    print("\n⏳ ブラウザでの認証を待機中 (localhost:8788)...")
    print("   (ブラウザが開かない場合は上記URLを手動でコピーしてください)")
    server = HTTPServer(("localhost", 8788), CallbackHandler)
    server.handle_request()  # 1リクエストのみ処理

    if not auth_code:
        print("❌ 認可コードの取得に失敗しました。")
        sys.exit(1)

    print(f"✅ 認可コード取得: {auth_code[:10]}...")

    # ── Step 3: アクセストークン取得 ─────────────────────
    token_resp = requests.post(TOKEN_URL, data={
        "grant_type":    "authorization_code",
        "code":          auth_code,
        "redirect_uri":  REDIRECT_URI,
        "client_id":     CLIENT_ID,
        "client_secret": CLIENT_SECRET,
    })

    if token_resp.status_code != 200:
        print(f"❌ トークン取得失敗: {token_resp.status_code}")
        print(token_resp.text)
        sys.exit(1)

    token_data   = token_resp.json()
    access_token = token_data["access_token"]
    expires_in   = token_data.get("expires_in", 0)
    print(f"✅ アクセストークン取得! (有効期限: {expires_in // 86400}日 ≈ 60日)")

    # ── Step 4: Person URN 取得 (/v2/me 旧API) ────────────
    me_resp = requests.get(ME_URL, headers={
        "Authorization": f"Bearer {access_token}",
        "X-Restli-Protocol-Version": "2.0.0",
    })

    person_id = None
    if me_resp.status_code == 200:
        me_data   = me_resp.json()
        person_id = me_data.get("id")
        print(f"✅ LinkedIn メンバーID取得: {person_id}")
    else:
        print(f"⚠️  メンバーID取得失敗 ({me_resp.status_code})")
        print(f"   → LINKEDIN_PERSON_URN を手動で .env に設定してください")

    # ── Step 5: .env に保存 ────────────────────────────────
    set_key(DOTENV_PATH, "LINKEDIN_ACCESS_TOKEN", access_token)
    if person_id:
        set_key(DOTENV_PATH, "LINKEDIN_PERSON_URN", f"urn:li:person:{person_id}")

    print("\n" + "=" * 60)
    print("🎉 .env に保存完了!")
    print(f"   LINKEDIN_ACCESS_TOKEN = {access_token[:20]}...")
    if person_id:
        print(f"   LINKEDIN_PERSON_URN   = urn:li:person:{person_id}")
    else:
        print("   ⚠️  LINKEDIN_PERSON_URN は手動設定が必要です")
    print("=" * 60)
    print("\n次回から linkedin_comment.py でコメント投稿できます。")
    print("⚠️  アクセストークンは約60日で失効します。期限が来たら再実行してください。")


if __name__ == "__main__":
    main()
