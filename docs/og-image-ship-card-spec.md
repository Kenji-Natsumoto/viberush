# OG画像（SHIPカード）実装仕様書

**プロジェクト**: VibeRush — OG Image / SHIPカード機能
**作成日**: 2026-03-09
**作成者**: 秋元（AI）/ 夏本 健司
**ステータス**: 📝 仕様確定済み → 実装フェーズへ
**優先度**: P0

---

## 1. 目的・背景

### 1.1 現状の問題

VibeRushはSPA（Single Page Application）のため、`/product/:id` にアクセスしても
HTMLの `<meta og:*>` タグは常に `index.html` の静的なもの（全SHIP共通）しか存在しない。

X（Twitter）・LinkedIn・Slack等のリンクプレビュー生成クローラーは
JavaScriptを実行しないため、どのプロダクトをシェアしても**同じカード**が表示される。

### 1.2 解決後のゴール

| 変更前 | 変更後 |
|--------|--------|
| シェアしても全部同じOGカード | 各プロダクト固有のSHIPカードが表示 |
| `viberush.io/product/:id` をシェア | `viberush.io/share/:id` をシェア |
| OG画像 = サイト共通のロゴ | OG画像 = プロダクト名・ツール・Vibeスコア入りカード |

---

## 2. アーキテクチャ概要

```
SNS投稿 / クリップボードコピー
    ↓
viberush.io/share/:id
    ↓（Supabase Edge Function: share-product）
DBからプロダクト情報取得
    ↓
【クローラーの場合】
OG meta タグ付きHTML返却（JSリダイレクトなし）
  <meta og:title = "ProductName — VibeRush">
  <meta og:description = "tagline">
  <meta og:image = "https://[supabase]/functions/v1/og-image/:id">
  <meta og:url = "https://viberush.io/share/:id">

【ブラウザの場合】
meta refresh + JSで /product/:id へリダイレクト

OG画像URL: [supabase]/functions/v1/og-image/:id
    ↓（Supabase Edge Function: og-image）
プロダクト情報でSVGテンプレート生成
    ↓
resvg-wasm でSVG→PNG変換
    ↓
image/png を返却（Cache-Control: 1日）
```

---

## 3. データ構造（利用するフィールド）

`products` テーブルから取得するフィールド：

| フィールド | 型 | OGカードでの用途 |
|-----------|-----|-----------------|
| `id` | UUID | URL識別子 |
| `name` | TEXT | カードタイトル（大） |
| `tagline` | TEXT | サブタイトル |
| `icon_url` | TEXT | プロダクトアイコン（右上） |
| `tools_used` | TEXT[] | ツールバッジ（最大3個） |
| `time_to_build` | TEXT | "Built in X hours" |
| `vibe_score` | INTEGER | ⚡ Vibe スコア |
| `votes_count` | INTEGER | ▲ 投票数 |
| `proxy_creator_name` | TEXT | Maker名（nullの場合は "Vibe Coder"） |
| `created_at` | TIMESTAMPTZ | Ship日付 |

---

## 4. OG画像デザイン仕様（SHIPカード）

### 4.1 サイズ・フォーマット

- **サイズ**: 1200 × 630 px（Twitter/LinkedIn OG標準）
- **フォーマット**: PNG
- **背景**: ダークグラデーション（VibeRushブランドカラー）

### 4.2 レイアウト（ASCII モックアップ）

```
┌──────────────────────────────────────────────────────────────────────────┐
│  VibeRush.io                                          [icon 80×80]       │
│  ─────────────────────────────────────────────────────────────────────── │
│                                                                           │
│  🚀 ProductName                                                           │
│     (font-size: 48px bold, white)                                         │
│                                                                           │
│  Tagline goes here — max 2 lines truncated                                │
│  (font-size: 24px, gray)                                                  │
│                                                                           │
│  ─────────────────────────────────────────────────────────────────────── │
│  [Lovable] [Supabase] [React]   ⚡ 42 Vibes   ⏱ Built in 3 hours        │
│                                                                           │
│  Shipped on VibeRush  ·  by MakerName  ·  Mar 9, 2026                   │
└──────────────────────────────────────────────────────────────────────────┘
```

### 4.3 カラーパレット

| 要素 | 色 |
|------|-----|
| 背景グラデーション | `#0a0a0a` → `#1a1a2e`（斜め45度）|
| アクセントライン | `#6366f1`（primary = indigo） |
| タイトル文字 | `#ffffff` |
| サブタイトル文字 | `#a1a1aa`（muted-foreground） |
| ツールバッジ | `#1e1e2e` 背景 + `#6366f1` 枠線 |
| Vibeスコア | `#facc15`（yellow） |
| フッター文字 | `#71717a` |
| ブランドロゴ | `#6366f1` テキスト |

---

## 5. Supabase Edge Functions 仕様

### 5.1 `og-image` — OG画像生成

**エンドポイント**: `GET /functions/v1/og-image/:id`
**認証**: 不要（public, anon key不要）
**レスポンス**: `Content-Type: image/png`

```
Cache-Control: public, max-age=86400, s-maxage=86400
```

**処理フロー**:
```
1. path から product id を取得
2. supabase-js（service role）でproductsテーブルから1件取得
3. SVGテンプレートにデータを埋め込み（文字列置換）
4. @resvg/resvg-wasm でSVG→PNG変換
5. PNG バイナリを返却
```

**エラー処理**:
- product が見つからない場合 → デフォルトOG画像（VibeRushブランドカード）を返す
- 変換エラー → 500 + fallback画像

**フォント**:
- Noto Sans（Google Fonts CDN）または Inter
- Base64でEdge Functionにバンドル（外部fetch不要）

### 5.2 `share-product` — シェアページHTML返却

**エンドポイント**: `GET /functions/v1/share-product?id=:id`

> ⚠️ Supabase Edge Functionsはパスパラメータに制限があるため、
> クエリパラメータ形式を採用。フロントのシェアURLは `/share/:id` だが、
> Supabase側のルーティングは `?id=` で受け取る。
> （Supabase Edge Functions Router設定で `/share/*` → `share-product` に転送）

**認証**: 不要（public）
**レスポンス**: `Content-Type: text/html`

**返却HTMLテンプレート**:
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>{name} — VibeRush</title>

  <!-- OG Tags -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="{name} — VibeRush">
  <meta property="og:description" content="{tagline}">
  <meta property="og:image" content="{SUPABASE_URL}/functions/v1/og-image/{id}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:url" content="https://viberush.io/share/{id}">
  <meta property="og:site_name" content="VibeRush">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{name} — VibeRush">
  <meta name="twitter:description" content="{tagline}">
  <meta name="twitter:image" content="{SUPABASE_URL}/functions/v1/og-image/{id}">
  <meta name="twitter:site" content="@VibeRush_Kenji">

  <!-- Redirect -->
  <meta http-equiv="refresh" content="0;url=https://viberush.io/product/{id}">
</head>
<body>
  <script>window.location.replace("https://viberush.io/product/{id}");</script>
  <p>Redirecting to <a href="https://viberush.io/product/{id}">{name} on VibeRush</a>...</p>
</body>
</html>
```

---

## 6. フロントエンド変更仕様

### 6.1 シェアURL変更（ProductDetail.tsx）

**変更箇所**: `handleShareToX` 関数

```typescript
// 変更前
const shareUrl = window.location.href; // /product/:id

// 変更後
const shareUrl = `https://viberush.io/share/${product.id}`;
```

### 6.2 シェアボタン追加（ProductDetail.tsx）

現在「Share on X」ボタンのみ → **LinkedIn シェアも追加**

```typescript
// LinkedIn シェア
const handleShareToLinkedIn = () => {
  const shareUrl = `https://viberush.io/share/${product.id}`;
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
  window.open(linkedInUrl, "_blank", "noopener,noreferrer");
};
```

### 6.3 「Copy Share Link」ボタン修正

既存の「Copy Short URL」 → シェアURLを `/share/:id` ベースに変更

```typescript
// コピーするURLを share URL に
const shareUrl = `https://viberush.io/share/${product.id}`;
navigator.clipboard.writeText(shareUrl);
```

### 6.4 App.tsx ルーティング追加

```tsx
// ShortUrlRedirect と同じパターンで追加
<Route path="/share/:id" element={<ShareRedirect />} />
```

`ShareRedirect` コンポーネント: Edge Functionにリダイレクトする薄いラッパー
（実際のOGレンダリングはEdge Functionで行うため、フロント側は単純リダイレクトのみ）

---

## 7. 実装フェーズ計画

### Phase 1（本日 3/9）— MVP: シェアURL + メタタグHTML返却

**目標**: OGカードが正しいタイトル・説明で表示される（画像は既存のicon_urlを流用）

実装内容:
- [ ] `share-product` Edge Function 作成
  - OG meta タグ付きHTML返却（og:image = icon_urlを使用）
  - ブラウザリダイレクト
- [ ] フロントエンド: シェアURLを `/share/:id` に変更
- [ ] ローカルテスト（curl でmetaタグ確認）

**検証方法**:
```bash
curl -L "https://nfchuijfdygiclaqecvk.supabase.co/functions/v1/share-product?id=<product-id>"
# → OG meta タグが含まれるHTMLを確認
```

X Card Validator: https://cards-dev.twitter.com/validator
LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/

---

### Phase 2（3/10〜3/12）— カスタムOG画像生成

**目標**: SHIPカードデザインの画像が表示される

実装内容:
- [ ] `og-image` Edge Function 作成（SVGテンプレート + resvg-wasm）
- [ ] フォントをBase64でバンドル
- [ ] アイコン画像をfetchして埋め込み（base64変換）
- [ ] `share-product` の og:image URLを `og-image/:id` に更新

---

### Phase 3（3/13〜3/14）— 仕上げ・運用

**目標**: SNSシェアの完全自動化・品質保証

実装内容:
- [ ] LinkedIn シェアボタン追加（ProductDetail.tsx）
- [ ] 「Shipped on VibeRush」バッジ生成（Maker向け埋め込みコード）
- [ ] OGカード画像キャッシュ確認（CDN / Supabase Edge Cache）
- [ ] X Card Validator / LinkedIn Post Inspector での全プロダクト検証
- [ ] メモリ・仕様書の最終更新

---

## 8. 技術的注意点

### 8.1 Supabase Edge Functions のパス制約

- Edge Functionsのエンドポイントは `/functions/v1/{function-name}` 固定
- `/share/:id` → `share-product` へのルーティングは **Supabase Routing Rules** または
  **フロントエンド側の `ShortUrlRedirect` 相当コンポーネント**で対応
- 推奨: フロントに `ShareRedirect.tsx` を追加し、そこからEdge Functionを呼び出す形に

### 8.2 CORS設定

Edge Functionsは以下のCORSヘッダーが必要:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Headers: authorization, x-client-info, apikey, content-type
```

### 8.3 アイコン画像のEdge Functionでの取得

DiceBear SVGや外部URLのアイコンを `og-image` 内でfetchする際:
- SVGはSVG内にそのまま埋め込み可能
- PNG/JPGは base64 に変換してSVGの `<image>` タグに埋め込む

### 8.4 resvg-wasm のバンドルサイズ

- WASM ファイルが大きいため、初回コールドスタートに2〜3秒かかる可能性
- 対策: `keepAlive` 設定（Supabase Edge Functions の warm 設定）
- またはWASMファイルをSupabase Storageに置いてfetchする方式も検討

### 8.5 テキストのXSS対策

SVGテンプレートへの埋め込み時は必ずHTMLエスケープ:
```typescript
const escape = (str: string) =>
  str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
```

---

## 9. Lovableプロンプト（Phase 1 実装用）

```
以下の機能を実装してください：

【目的】
VibeRushでSNSシェア時にプロダクト固有のOGカードが表示されるようにする。

【フロントエンド変更】
1. `src/pages/ProductDetail.tsx` の `handleShareToX` 関数を修正:
   - `const shareUrl = window.location.href;` を
   - `const shareUrl = \`https://viberush.io/share/${product.id}\`;` に変更

2. 「Copy Short URL」ボタンのロジックも `/share/${product.id}` を使うよう修正

3. `src/App.tsx` に以下のルートを追加:
   - path: `/share/:id`
   - コンポーネント: `<ShareRedirect />` (新規作成)

4. `src/pages/ShareRedirect.tsx` を新規作成:
   - useParams で id を取得
   - Supabase Edge Function URL `https://nfchuijfdygiclaqecvk.supabase.co/functions/v1/share-product?id={id}` にwindow.location.hrefを変更
   - ローディング中は簡易スピナーを表示

【Supabase Edge Function】
`supabase/functions/share-product/index.ts` を新規作成:
- GETリクエストを受け取る
- クエリパラメータ `id` からproduct IDを取得
- supabase-jsでproductsテーブルから該当レコードを取得 (name, tagline, icon_url, id)
- 以下のHTMLを返す（Content-Type: text/html）:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>{name} — VibeRush</title>
  <meta property="og:type" content="website">
  <meta property="og:title" content="{name} — Shipped on VibeRush">
  <meta property="og:description" content="{tagline}">
  <meta property="og:image" content="{icon_url}">
  <meta property="og:url" content="https://viberush.io/share/{id}">
  <meta property="og:site_name" content="VibeRush">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{name} — Shipped on VibeRush">
  <meta name="twitter:description" content="{tagline}">
  <meta name="twitter:image" content="{icon_url}">
  <meta name="twitter:site" content="@VibeRush_Kenji">
  <meta http-equiv="refresh" content="0;url=https://viberush.io/product/{id}">
</head>
<body>
  <script>window.location.replace("https://viberush.io/product/{id}");</script>
</body>
</html>
```

- CORS ヘッダーを付与（Access-Control-Allow-Origin: *）
- productが見つからない場合は /explore にリダイレクト

Supabase URLは: https://nfchuijfdygiclaqecvk.supabase.co
Supabase anon key はSupabase環境変数 SUPABASE_ANON_KEY を使用。
```

---

## 10. 検証チェックリスト

### Phase 1 完了条件
- [ ] `curl "https://nfchuijfdygiclaqecvk.supabase.co/functions/v1/share-product?id=<id>"` でOGタグ付きHTMLが返る
- [ ] `<meta property="og:title">` にプロダクト名が入っている
- [ ] ブラウザで `viberush.io/share/:id` にアクセスすると `/product/:id` にリダイレクトされる
- [ ] ProductDetail の「Share on X」ボタンが `/share/:id` URLを使っている

### Phase 2 完了条件
- [ ] `viberush.io/og/:id` で1200×630のPNG画像が返る
- [ ] X Card Validator でカード表示確認
- [ ] LinkedIn Post Inspector でカード表示確認
- [ ] プロダクト名・タグライン・ツールが画像内に正しく表示されている

---

*保存先: `/Users/natsuken/_01VibeRush/docs/og-image-ship-card-spec.md`*
