# 技術メモ

## OG画像システム（share-product + og-image Edge Functions）

### デプロイ後の必須手順
毎回 `supabase functions deploy` 後、**JWT検証が自動ON**になる。
必ずDashboard → Functions → [function名] → Details → Verify JWT → OFFにする。

### og-image フォントロード（resvg-wasm v2.6.2）
- **NG**: `@font-face { src: url('data:...') }` をSVGに埋め込む → 動作しない
- **OK**: `fontBuffers: [Uint8Array]` オプションでResvgコンストラクタに渡す
- Interフォント: `https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2`

### LinkedIn og:url の罠
- `og:url` を設定するとLinkedInはそのURLをcanonical扱いし、**そのURLのOGタグ**を優先する
- `viberush.io/share/{id}` はSPAなので一般的なOGタグが返る → 製品カードが表示されない
- **解決策**: `og:url` を完全に削除 → LinkedInはフェッチURLをそのままcanonicalとして使う
- 注意: 旧URLは一度キャッシュされると変更不可。新規URLは問題なし。

### X OG画像 コールドスタート問題と解決策（2026-03-09完了）
- **原因**: Supabase Edge FunctionはマルチインスタンスでWASM初期化に5-10秒かかる
  → share-productのwarm-upが1インスタンスを温めても、Xのbotが別インスタンスに当たりコールド
- **解決策**: og-imageにStorageキャッシュ追加
  1. og-image呼び出し時、まず `og-images` バケット（Public）を確認
  2. キャッシュヒット → Storage から即返却（WASMなし）
  3. キャッシュミス → WASM生成 → Storageに保存（fire-and-forget） → PNG返却
- **結果**: 投稿前Xプレビューでは画像表示なし（X仕様）、投稿後ツイートでは正しく表示 ✅
- **Storageバケット**: `og-images` (Public, VibeLaunch project)

### OG画像カードデザイン（次フェーズ v2予定）
- プロダクト名・主要エレメントを中央揃え
- 背景に特定イラストを貼り付け
- カテゴリ別にフォントカラー・背景色を変化させる

### Supabase CLI
- CLIのアクセストークン未設定のため、Dashboardからデプロイ（Code タブ → ⌘A+⌘V → Deploy updates）
- デプロイ後は必ずJWT → OFF確認


## LinkedIn ブラウザ自動化

### Shadow DOM アクセスパターン
```javascript
// 基本パターン
const sr = document.querySelector('#interop-outlet').shadowRoot;

// ボタンをaria-labelで探す
const btn = Array.from(sr.querySelectorAll('button'))
  .find(b => b.getAttribute('aria-label') === 'ターゲットラベル');
btn.click();

// テキストで探す
const btn2 = Array.from(sr.querySelectorAll('button'))
  .find(b => b.textContent?.trim() === 'スケジュール');
btn2.click();
```

### ⚠️ 投稿テキスト入力 — 必須手順（2026/3/7確認）

**NG: MCP `type` アクション / `execCommand('insertText')`**
- MCP `type` アクションはShadow DOM境界を越えられず、Quillエディタに届かない（空になる）
- `execCommand` はフォーカスが不正確だと1行のみになる

**✅ 正解: Quill API `insertText()` を直接使う**
```javascript
(function() {
  const sr = document.querySelector('#interop-outlet').shadowRoot;
  const quill = sr.querySelector('.ql-container').__quill;
  quill.setText(''); // クリア
  quill.insertText(0, postText, 'user'); // 'user'ソース指定が必須
})()
```
- `'user'` ソース指定でEmber.jsのイベントシステムに変更通知 → 「投稿」ボタンが有効化
- 改行 `\n` が正しく複数段落として処理される
- `#ハッシュタグ` が自動認識される（太字スタイル付与）
- エディタのariaLabel: `'コンテンツ作成用テキストエディター'`、class: `ql-editor`

### 主要ボタン aria-label（変動する可能性あり）
- `'文書を追加'` — PDF添付
- `'その他'` — ツールバー展開（文書追加はここから）
- `'投稿のスケジュールを設定'` — スケジュール設定
- `'スケジュール'` — 最終確定ボタン（テキスト検索で探す）

### スケジュール入力フィールド
- 日付: `#share-post__scheduled-date`（形式: yyyy/m/d）
- 時刻: `#share-post__scheduled-time`（形式: HH:MM）
- ※Ember.jsのためJS直接代入は無効 → triple_click + type で物理入力

### PDF添付
- ファイル入力: `#ember314-upload-element`（番号は毎回変わる可能性）
- CSPでlocalhost fetchはブロックされる → 手動ファイルピッカーで選択

### スケジュールエラー対処
- エラー「10分後から3ヶ月後まで」→ Emberが値を認識していない
- 対処: ダイアログを閉じて再度開き、triple_click + type で再入力

## Chrome Headless PDF生成

### コマンド
```bash
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --headless \
  --print-to-pdf="/Users/natsuken/Desktop/VibeRush_Monday_POST/LinkedIn_PDF.pdf" \
  --print-to-pdf-no-header \
  http://localhost:8899/LinkedIn_PDF.html
```

### ポイント
- `--print-to-pdf-no-header`: ヘッダー/フッター除去
- 背景色（dark theme）が保持される（⌘+Pは白背景になるので非推奨）
- サーバー起動が必要: `python3 -m http.server 8899 --directory [dir]`

## X (Twitter) スケジュール設定

### 手順
- x.com で投稿作成 → 「ポストを予約」ボタン（ref_58など）
- ドロップダウン: Day / Hour / Minute を個別に設定
- 「確認する」ボタンで確定
- 画像添付: Chrome MCPのscreenshot IDが必要なため手動ドラッグを推奨

## ローカルサーバー
```bash
# 起動
python3 -m http.server 8899 --directory ~/Desktop/VibeRush_Monday_POST/

# CORS有効版（必要な場合）
python3 -m http.server 8900  # CORSヘッダー付きカスタムサーバー

# 停止
pkill -f "python3 -m http.server"
```

## Google Docs 操作
- タイトル変更: `document.querySelector('.docs-title-input')` でJS操作可
- 本文入力: execCommandは効かない → Chrome MCPの`type`アクションで直接入力
