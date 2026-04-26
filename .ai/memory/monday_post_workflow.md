# 週次 Monday POST ワークフロー（毎週日曜夜に実施）

## 前提
- 投稿本文にリンクを入れない（アルゴリズム対策）→ 公開後にリプライでURL追加
- CTA: 🔥 Vibeボタン（ログイン不要）
- フィーチャーメーカー: 3名（weekly）

## ① コンテンツ企画・テキスト作成
- 今週フィーチャーする3メーカーを選定
- X投稿テキスト（短め）とLinkedIn投稿テキスト（長め）を作成
- 各メーカーの製品URLをviberush.ioから取得しておく

## ② X用画像生成（DALL-E 3）
- サイズ: 1792x1024
- テーマ: ダークネイビー背景、製品カード3枚レイアウト
- 保存先: ~/Desktop/VibeRush_Monday_POST/X_post_image.png
- ※画像のX投稿への添付は手動ドラッグ（Chrome MCPではfile attach不可）

## ③ LinkedIn用PDF生成
1. Markdown → HTML生成（ダークネイビーテーマ）
   - 保存先: ~/Desktop/VibeRush_Monday_POST/LinkedIn_PDF.html
2. ローカルサーバー起動（HTMLプレビュー用）
   ```
   python3 -m http.server 8899 --directory ~/Desktop/VibeRush_Monday_POST/
   ```
3. Chrome HeadlessでPDF生成（背景色保持）
   ```
   /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
     --headless \
     --print-to-pdf="/Users/natsuken/Desktop/VibeRush_Monday_POST/LinkedIn_PDF.pdf" \
     --print-to-pdf-no-header \
     http://localhost:8899/LinkedIn_PDF.html
   ```
4. 完了後にサーバーを停止: `pkill -f "python3 -m http.server"`

## ④ 最終校正
- テキスト、画像、PDFの内容・誤字脱字を確認

## ⑤ X投稿スケジュール設定
1. x.com にアクセス → 投稿作成
2. テキストを貼り付け
3. 画像を手動ドラッグで添付（X_post_image.png）
4. 「ポストを予約」ボタン → 日時設定
   - 日: 翌月曜日
   - 時: 22時
   - 分: 00分
5. 「確認する」で確定

## ⑥ LinkedIn投稿スケジュール設定
1. linkedin.com/feed/ → 「投稿を開始」クリック
2. テキストを入力（Shadow DOM外でも入力可能）
3. 「その他」→「文書を追加」でPDF添付（手動ファイル選択）
   - Shadow DOM経由JS: `document.querySelector('#interop-outlet').shadowRoot`
   - ファイル入力: `#ember314-upload-element`（番号は変動する可能性あり）
4. 文書タイトルを設定（例: "VibeRush Weekly Vibe Drop — Week of March X, 2026"）
5. スケジュールボタンをクリック（Shadow DOMのJSまたは手動）
6. 日付: triple_click → 入力 → カレンダーで日付クリック確定
7. 時刻: triple_click → 23:00 入力
8. 「次へ」→「スケジュール」ボタンクリック（最終確定は手動推奨）

## ⑦ 投稿公開後（月曜日）
X・LinkedIn両方の投稿にリプライ/コメントで製品URLを追加:
```
🔥 FynloAPI: viberush.io/product/[id]
⚡ Velociti: viberush.io/product/[id]
🎵 Vinyl Vault Records: viberush.io/product/[id]
```
※製品URLはviberush.ioの各プロダクトページから取得

## WorkLog記録
- 作業後にGoogle Docs「VibeRushYYMMDDworkLog」として記録
- フォーマット: MEMORY.md参照
