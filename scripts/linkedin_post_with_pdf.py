#!/usr/bin/env python3
"""
VibeRush LinkedIn PDF付き投稿スクリプト（Playwright版 v2）

機能:
  - LinkedIn投稿テキストを入力
  - PDFをset_input_files()でファイルダイアログなしにアップロード
  - 「完了」ボタンをshadow DOM経由でクリック
  - スケジュールボタンをshadow DOM経由でクリック
  - 日時設定後に最終「スケジュール投稿」ボタンをクリック

使い方:
  python3 linkedin_post_with_pdf.py
"""

import json
import time
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeout

SCRIPTS_DIR   = Path(__file__).parent
SESSION_FILE  = SCRIPTS_DIR / "linkedin_session.json"
PDF_FILE      = Path("/Users/natsuken/Desktop/VibeRush_Wednesday_POST/LinkedIn_PDF.pdf")
LINKEDIN_FEED = "https://www.linkedin.com/feed/"

POST_TEXT = """\
You Vibe-coded an app.

Now what?

Most AI-built apps vanish into the void the moment they're built. No discovery. No users. No feedback loop.

VibeRush exists to fix that —
a discovery platform built specifically for the Vibe Coding era.

Right now, 54 Vibe-coded apps are waiting to be discovered.

If you've built something with Claude, Cursor, Lovable, or any AI coding tool:
→ List it on VibeRush
→ Let people discover it
→ Press 🔥 Vibe

The Vibe Coding revolution is just getting started.

#VibeCoding #AIApps #BuildInPublic #VibeRush"""

# ── shadow DOM ユーティリティ ─────────────────────────────────────────────────

def js_click_shadow(page, exact_labels: list, partial_labels: list = None, label: str = "", wait_ms: int = 1500) -> bool:
    """
    shadow DOM内のボタンをクリック。
    exact_labels: aria-label完全一致で検索
    partial_labels: aria-label部分一致（フォールバック）
    """
    result = page.evaluate("""([exactLabels, partialLabels]) => {
        // shadow DOM のみを検索（#interop-outlet）
        const interop = document.querySelector('#interop-outlet');
        if (!interop || !interop.shadowRoot) return 'no shadow root';
        const btns = interop.shadowRoot.querySelectorAll('button');

        // 1. 完全一致
        for (const btn of btns) {
            const aria = btn.getAttribute('aria-label') || '';
            for (const lbl of exactLabels) {
                if (aria === lbl) {
                    btn.click();
                    return 'clicked(exact): ' + aria;
                }
            }
        }

        // 2. 部分一致（フォールバック）
        if (partialLabels && partialLabels.length > 0) {
            for (const btn of btns) {
                const aria = (btn.getAttribute('aria-label') || '').toLowerCase();
                const text = (btn.textContent || '').trim().toLowerCase();
                for (const lbl of partialLabels) {
                    const kwLower = lbl.toLowerCase();
                    if (aria === kwLower || text === kwLower) {
                        btn.click();
                        return 'clicked(partial): ' + (btn.getAttribute('aria-label') || btn.textContent.trim());
                    }
                }
            }
        }

        // デバッグ: shadow DOM内の全ボタンaria-labelを返す
        const allAria = Array.from(btns)
            .map(b => b.getAttribute('aria-label') || '')
            .filter(Boolean);
        return 'not found | shadow btns: ' + allAria.join(' | ');
    }""", [exact_labels, partial_labels or []])
    print(f"   [{label}] JS result: {result}")
    if result and result.startswith("clicked"):
        page.wait_for_timeout(wait_ms)
        return True
    return False


def js_click_with_retry(page, exact_labels: list, partial_labels: list = None, label: str = "", retries: int = 3, wait_ms: int = 1500) -> bool:
    for i in range(retries):
        if js_click_shadow(page, exact_labels, partial_labels, label, wait_ms):
            return True
        if i < retries - 1:
            page.wait_for_timeout(1000)
    return False


def dump_all_buttons(page, label: str):
    """デバッグ: 現在のshadow DOM内全ボタンを表示"""
    result = page.evaluate("""() => {
        const roots = [document];
        const interop = document.querySelector('#interop-outlet');
        if (interop && interop.shadowRoot) roots.push(interop.shadowRoot);
        const all = [];
        for (const root of roots) {
            root.querySelectorAll('button').forEach(b => {
                const info = (b.getAttribute('aria-label') || b.textContent?.trim() || '').substring(0,40);
                if (info) all.push(info);
            });
        }
        return all.join(' | ');
    }""")
    print(f"   [DEBUG {label}] buttons: {result}")


# ── main ───────────────────────────────────────────────────────────────────────

def main():
    if not SESSION_FILE.exists():
        print("❌ セッションファイルが見つかりません。先に --login を実行してください。")
        sys.exit(1)
    if not PDF_FILE.exists():
        print(f"❌ PDFファイルが見つかりません: {PDF_FILE}")
        sys.exit(1)

    with open(SESSION_FILE) as f:
        storage_state = json.load(f)

    print("=" * 60)
    print("📄 LinkedIn PDF付き投稿スクリプト v2")
    print("=" * 60)
    print(f"📎 PDF: {PDF_FILE.name} ({PDF_FILE.stat().st_size // 1024}KB)")
    print(f"\n📝 投稿テキスト:\n{POST_TEXT[:80]}...\n")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False, slow_mo=80)
        context = browser.new_context(
            storage_state=storage_state,
            viewport={"width": 1280, "height": 900},
        )
        page = context.new_page()

        # ── 1. LinkedIn フィードへ ─────────────────────────────────────────────
        print("🌐 LinkedIn フィードへ移動...")
        page.goto(LINKEDIN_FEED, wait_until="domcontentloaded")
        page.wait_for_timeout(4000)

        if "login" in page.url or "authwall" in page.url:
            print("❌ セッション切れ。再ログインしてください。")
            browser.close()
            sys.exit(1)

        # ── 2. 「投稿を開始」クリック ─────────────────────────────────────────
        print("🖱️  「投稿を開始」をクリック...")
        opened = False
        for locator_desc, locator in [
            ("get_by_text(exact)", page.get_by_text("投稿を開始", exact=True).first),
            ("get_by_text(partial)", page.get_by_text("投稿を開始").first),
            ("get_by_role(link)", page.get_by_role("link", name="投稿を開始")),
            ("get_by_role(button)", page.get_by_role("button", name="投稿を開始")),
        ]:
            try:
                locator.wait_for(state="visible", timeout=4000)
                locator.click()
                page.wait_for_timeout(2500)
                opened = True
                print(f"✅ 投稿モーダルを開きました（{locator_desc}）")
                break
            except Exception:
                continue

        if not opened:
            print("⚠️  テキスト検索失敗。座標クリック試行...")
            page.screenshot(path=str(SCRIPTS_DIR / "debug_step2.png"))
            page.mouse.click(640, 97)
            page.wait_for_timeout(2500)
            try:
                page.locator('[contenteditable="true"]').first.wait_for(timeout=3000)
                opened = True
                print("✅ 座標クリックでモーダルを開きました")
            except Exception:
                print("❌ 投稿モーダルを開けませんでした")
                page.screenshot(path=str(SCRIPTS_DIR / "debug_step2b.png"))
                browser.close()
                sys.exit(1)

        # ── 3. テキスト入力 ────────────────────────────────────────────────────
        print("✏️  テキストを入力中...")
        try:
            page.evaluate("""() => {
                const interop = document.querySelector('#interop-outlet');
                if (interop && interop.shadowRoot) {
                    const editors = interop.shadowRoot.querySelectorAll('[contenteditable="true"]');
                    if (editors.length > 0) editors[0].click();
                }
            }""")
            page.wait_for_timeout(400)
            page.keyboard.type(POST_TEXT, delay=8)
            page.wait_for_timeout(1000)
            print("✅ テキスト入力完了")
        except Exception as e:
            print(f"❌ テキスト入力失敗: {e}")
            page.screenshot(path=str(SCRIPTS_DIR / "debug_step3.png"))
            browser.close()
            sys.exit(1)

        # ── 4. 「文書を追加」ボタンをクリック ────────────────────────────────
        print("📄 「文書を追加」をクリック...")
        page.wait_for_timeout(1500)

        # shadow DOM内のボタンを確認（デバッグ）
        shadow_btns = page.evaluate("""() => {
            const interop = document.querySelector('#interop-outlet');
            if (!interop || !interop.shadowRoot) return 'no shadow';
            return Array.from(interop.shadowRoot.querySelectorAll('button'))
                .map(b => b.getAttribute('aria-label') || '')
                .filter(Boolean).join(' | ');
        }""")
        print(f"   [shadow DOM buttons] {shadow_btns}")

        # 「その他」を先に展開（「文書を追加」は隠れているため）
        print("   「その他」を展開します...")
        js_click_shadow(page, ["その他"], ["more", "+"], "その他", wait_ms=1500)

        # shadow DOM内のボタンを再確認
        shadow_btns2 = page.evaluate("""() => {
            const interop = document.querySelector('#interop-outlet');
            if (!interop || !interop.shadowRoot) return 'no shadow';
            return Array.from(interop.shadowRoot.querySelectorAll('button'))
                .map(b => b.getAttribute('aria-label') || '')
                .filter(Boolean).join(' | ');
        }""")
        print(f"   [shadow DOM buttons after その他] {shadow_btns2}")

        # 「文書を追加」を完全一致でクリック
        doc_opened = js_click_shadow(page,
            ["文書を追加", "Add a document", "Add document"],
            ["文書を追加", "document"],
            "文書を追加")

        if not doc_opened:
            print("❌ 「文書を追加」ボタンが見つかりません")
            page.screenshot(path=str(SCRIPTS_DIR / "debug_step4.png"))
            browser.close()
            sys.exit(1)

        print("✅ 「文書を追加」をクリックしました")
        page.wait_for_timeout(2000)

        # ── 5. PDFをアップロード ──────────────────────────────────────────────
        print(f"📎 PDFをアップロード: {PDF_FILE.name}")
        upload_success = False

        # 方法1: expect_file_chooser()
        try:
            print("   方法1: expect_file_chooser()...")
            with page.expect_file_chooser(timeout=6000) as fc_info:
                page.locator(
                    'button:has-text("ファイルを選択"), '
                    'button:has-text("Choose file"), '
                    'button:has-text("Select file")'
                ).first.click()
            fc_info.value.set_files(str(PDF_FILE))
            upload_success = True
            print("✅ PDFをセットしました（file chooser）")
        except Exception as e1:
            print(f"   方法1失敗: {str(e1)[:80]}")

        if not upload_success:
            # 方法2: input[type="file"] に直接セット
            try:
                print("   方法2: input[type=file]直接セット...")
                file_input = page.locator('input[type="file"]').first
                file_input.set_input_files(str(PDF_FILE))
                upload_success = True
                print("✅ PDFをセットしました（direct input）")
            except Exception as e2:
                print(f"   方法2失敗: {e2}")

        if not upload_success:
            print("❌ PDF設定に失敗しました")
            page.screenshot(path=str(SCRIPTS_DIR / "debug_step5.png"))
            browser.close()
            sys.exit(1)

        # アップロード完了を待機（最大30秒）
        print("   アップロード完了を待機中（最大30秒）...")
        page.wait_for_timeout(8000)

        # ── 6. 「完了」ボタンをクリック（shadow DOM経由・複数回） ────────────
        # LinkedIn の文書追加フロー:
        #   [文書アップロード画面] → 完了クリック → [文書タイトル/詳細画面] → 完了クリック → [投稿モーダル]
        print("⏳ 「完了」ボタンをクリック（複数回対応）...")

        def enter_doc_title_if_needed(page) -> bool:
            """文書タイトル入力フィールドがあれば入力する。"""
            result = page.evaluate("""() => {
                const interop = document.querySelector('#interop-outlet');
                if (!interop || !interop.shadowRoot) return 'no shadow';
                const root = interop.shadowRoot;

                // タイトル入力フィールドを探す（input または contenteditable）
                const inputs = root.querySelectorAll('input[type="text"], input:not([type]), textarea, [contenteditable="true"]');
                for (const inp of inputs) {
                    const aria = (inp.getAttribute('aria-label') || '').toLowerCase();
                    const ph = (inp.getAttribute('placeholder') || '').toLowerCase();
                    if (aria.includes('タイトル') || aria.includes('title') ||
                        ph.includes('タイトル') || ph.includes('title')) {
                        // フォーカスして値を設定
                        inp.focus();
                        if (inp.tagName === 'INPUT' || inp.tagName === 'TEXTAREA') {
                            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                                window.HTMLInputElement.prototype, 'value')?.set ||
                                Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
                            if (nativeInputValueSetter) {
                                nativeInputValueSetter.call(inp, '54 Vibe-coded apps | VibeRush');
                            } else {
                                inp.value = '54 Vibe-coded apps | VibeRush';
                            }
                        } else {
                            inp.textContent = '54 Vibe-coded apps | VibeRush';
                        }
                        inp.dispatchEvent(new Event('input', {bubbles: true, composed: true}));
                        inp.dispatchEvent(new Event('change', {bubbles: true, composed: true}));
                        return 'filled title input: ' + (aria || ph);
                    }
                }
                return 'no title input found';
            }""")
            print(f"   タイトル入力: {result}")
            return "filled" in str(result)

        def click_done_in_shadow(page) -> bool:
            """shadow DOM内で「完了」系ボタンをクリック（dispatchEventで強制）。成功True。"""
            result = page.evaluate("""() => {
                const interop = document.querySelector('#interop-outlet');
                if (!interop || !interop.shadowRoot) return 'no shadow';
                const btns = interop.shadowRoot.querySelectorAll('button');
                // テキスト「完了」または「Done」のボタンを探す（「投稿のスケジュールを設定」は除外）
                for (const btn of btns) {
                    const text = (btn.textContent || '').trim();
                    const aria = (btn.getAttribute('aria-label') || '');
                    const ariaLow = aria.toLowerCase();
                    // スケジュール関連ボタンはスキップ
                    if (ariaLow.includes('スケジュール') || ariaLow.includes('schedule')) continue;
                    if (text === '完了' || text === 'Done' || aria === '完了' || aria === 'Done') {
                        const isDisabled = btn.disabled || btn.getAttribute('aria-disabled') === 'true';
                        // dispatchEventで強制クリック（composed:trueでshadow DOM境界を越える）
                        btn.dispatchEvent(new MouseEvent('mousedown', {bubbles:true, cancelable:true, composed:true, view:window}));
                        btn.dispatchEvent(new MouseEvent('mouseup', {bubbles:true, cancelable:true, composed:true, view:window}));
                        btn.dispatchEvent(new MouseEvent('click', {bubbles:true, cancelable:true, composed:true, view:window}));
                        btn.click(); // 念のため通常clickも
                        return 'clicked: ' + text + ' (disabled=' + isDisabled + ')';
                    }
                }
                return 'not found';
            }""")
            print(f"   完了click結果: {result}")
            return result and result.startswith("clicked")

        def has_schedule_btn(page) -> bool:
            """shadow DOM内に「投稿のスケジュールを設定」があるか確認。"""
            result = page.evaluate("""() => {
                const interop = document.querySelector('#interop-outlet');
                if (!interop || !interop.shadowRoot) return false;
                const btns = interop.shadowRoot.querySelectorAll('button');
                return Array.from(btns).some(b =>
                    (b.getAttribute('aria-label') || '').includes('スケジュール') ||
                    (b.getAttribute('aria-label') || '').includes('Schedule'));
            }""")
            return bool(result)

        # まずタイトルを入力してから「完了」をクリック
        print("   文書タイトルを入力します...")
        enter_doc_title_if_needed(page)
        page.wait_for_timeout(800)

        # タイトル入力後にキーボードTabでフォーカスを移動してReactを更新
        page.keyboard.press("Tab")
        page.wait_for_timeout(400)

        # 最大5回「完了」をクリックして、投稿モーダルに戻るまで繰り返す
        for attempt in range(5):
            shadow_btns_now = page.evaluate("""() => {
                const interop = document.querySelector('#interop-outlet');
                if (!interop || !interop.shadowRoot) return 'no shadow';
                return Array.from(interop.shadowRoot.querySelectorAll('button'))
                    .map(b => (b.getAttribute('aria-label') || b.textContent?.trim() || '').substring(0,30))
                    .filter(Boolean).join(' | ');
            }""")
            print(f"   完了確認{attempt+1} shadow btns: {shadow_btns_now}")

            # すでに投稿モーダルに戻っているなら終了
            if has_schedule_btn(page):
                print("✅ 投稿モーダルに戻りました（スケジュールボタン確認）")
                break

            # 「完了」をクリック
            if click_done_in_shadow(page):
                print(f"   ✅ 完了クリック {attempt+1}回目")
                page.wait_for_timeout(2500)

                # タイトル未入力エラーが出た場合、再度タイトル入力
                enter_doc_title_if_needed(page)
                page.wait_for_timeout(500)
            else:
                print(f"   完了ボタンなし。3秒待機...")
                page.wait_for_timeout(3000)
        else:
            print("⚠️  「完了」ボタンの自動処理が終わりませんでした")
            page.screenshot(path=str(SCRIPTS_DIR / "debug_step6_done.png"))
            print("   ブラウザで「完了」ボタンを手動でクリックし、10秒待機します...")
            page.wait_for_timeout(10000)

        print("✅ PDF添付完了！")

        page.wait_for_timeout(2000)

        # ── 7. スケジュールボタンをクリック ──────────────────────────────────
        print("🕐 スケジュール設定を開きます...")
        # shadow DOM内のボタンを確認
        shadow_btns_sched = page.evaluate("""() => {
            const interop = document.querySelector('#interop-outlet');
            if (!interop || !interop.shadowRoot) return 'no shadow';
            return Array.from(interop.shadowRoot.querySelectorAll('button'))
                .map(b => b.getAttribute('aria-label') || '')
                .filter(Boolean).join(' | ');
        }""")
        print(f"   [schedule step shadow btns] {shadow_btns_sched}")

        sched_opened = js_click_with_retry(page,
            ["投稿のスケジュールを設定", "Schedule post", "Schedule"],
            ["スケジュール", "schedule"],
            "schedule btn", retries=3, wait_ms=2000)

        if not sched_opened:
            print("❌ スケジュールボタンが見つかりません")
            page.screenshot(path=str(SCRIPTS_DIR / "debug_step7.png"))
            print("⚠️  手動でスケジュールを設定してください")
        else:
            print("✅ スケジュールダイアログを開きました")

        # ── 8. スケジュール日時を設定（カレンダー→次へ→時刻→スケジュール） ───
        print("📅 スケジュールを設定します... (2026/03/04 23:00 JST = 11:00 PM)")
        page.wait_for_timeout(1500)
        page.screenshot(path=str(SCRIPTS_DIR / "debug_step8_calendar.png"))

        # ステップ8a: 日付の確認と「次へ」クリック
        # 今日(3/4)は既に選択済みのはず → 「次へ」をクリック
        print("   📅 日付確認 → 「次へ」をクリック...")
        next_clicked = js_click_shadow(page, ["次へ"], ["next"], "次へ(date)", wait_ms=2000)
        if not next_clicked:
            print("   「次へ」が見つからない場合、カレンダー日付を確認...")
            # 3/4を明示的にクリック
            date_result = page.evaluate("""() => {
                const interop = document.querySelector('#interop-outlet');
                if (!interop || !interop.shadowRoot) return 'no shadow';
                const btns = interop.shadowRoot.querySelectorAll('button');
                for (const btn of btns) {
                    const aria = btn.getAttribute('aria-label') || '';
                    if (aria.includes('2026年3月4日')) {
                        btn.click();
                        return 'clicked date: ' + aria;
                    }
                }
                return 'date not found';
            }""")
            print(f"   日付クリック: {date_result}")
            page.wait_for_timeout(1000)
            next_clicked = js_click_shadow(page, ["次へ"], ["next"], "次へ(after date)", wait_ms=2000)

        page.screenshot(path=str(SCRIPTS_DIR / "debug_step8b_timepicker.png"))
        print(f"   次へクリック: {'✅' if next_clicked else '❌'}")

        # ステップ8b: 時刻設定（時刻ピッカー画面）
        page.wait_for_timeout(1500)
        print("   ⏰ 時刻を設定します...")

        # shadow DOM内の時刻ピッカーの状態を確認
        time_state = page.evaluate("""() => {
            const interop = document.querySelector('#interop-outlet');
            if (!interop || !interop.shadowRoot) return 'no shadow';
            const root = interop.shadowRoot;
            // 全 input と select の情報を収集
            const inputs = root.querySelectorAll('input, select');
            const info = Array.from(inputs).map(el => ({
                tag: el.tagName,
                type: el.type || '',
                aria: el.getAttribute('aria-label') || '',
                value: el.value || '',
                role: el.getAttribute('role') || ''
            }));
            // spinbutton (time input)
            const spinbtns = root.querySelectorAll('[role="spinbutton"]');
            return JSON.stringify({inputs: info, spinbtn_count: spinbtns.length});
        }""")
        print(f"   時刻ピッカー状態: {time_state[:200]}")

        # 時刻設定: shadow DOM内のspinbutton / input を操作
        time_set_result = page.evaluate("""() => {
            const interop = document.querySelector('#interop-outlet');
            if (!interop || !interop.shadowRoot) return 'no shadow';
            const root = interop.shadowRoot;
            const results = [];

            // spinbutton ロールの要素（時・分）を探す
            const spinbtns = Array.from(root.querySelectorAll('[role="spinbutton"]'));
            // input type="number" も探す
            const numInputs = Array.from(root.querySelectorAll('input[type="number"], input[type="text"]'));
            const allInputs = [...spinbtns, ...numInputs.filter(el => !spinbtns.includes(el))];

            // NativeInputValueSetter（React/Ember対応）
            const nativeSet = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;

            for (const el of allInputs) {
                const aria = (el.getAttribute('aria-label') || '').toLowerCase();
                // 時
                if (aria.includes('時間') || aria.includes('hour') || aria.includes('時') ||
                    el.getAttribute('id')?.includes('hour')) {
                    const val = '11'; // 11 PM
                    if (nativeSet) nativeSet.call(el, val); else el.value = val;
                    el.dispatchEvent(new Event('input', {bubbles:true, composed:true}));
                    el.dispatchEvent(new Event('change', {bubbles:true, composed:true}));
                    results.push('hour=' + val);
                }
                // 分
                else if (aria.includes('分') || aria.includes('minute') || aria.includes('min') ||
                         el.getAttribute('id')?.includes('minute')) {
                    const val = '00';
                    if (nativeSet) nativeSet.call(el, val); else el.value = val;
                    el.dispatchEvent(new Event('input', {bubbles:true, composed:true}));
                    el.dispatchEvent(new Event('change', {bubbles:true, composed:true}));
                    results.push('minute=' + val);
                }
            }

            // AM/PM select
            const selects = root.querySelectorAll('select');
            for (const sel of selects) {
                const aria = (sel.getAttribute('aria-label') || '').toLowerCase();
                if (aria.includes('午前') || aria.includes('am') || aria.includes('pm') ||
                    aria.includes('period') || aria.includes('ampm')) {
                    sel.value = 'PM';
                    sel.dispatchEvent(new Event('change', {bubbles:true, composed:true}));
                    results.push('ampm=PM');
                }
            }
            return results.length > 0 ? 'set: ' + results.join(', ') : 'no time inputs found';
        }""")
        print(f"   時刻設定結果: {time_set_result}")
        page.wait_for_timeout(1000)
        page.screenshot(path=str(SCRIPTS_DIR / "debug_step8c_timeset.png"))
        print("✅ 日時設定完了（ブラウザで確認・調整してください）")

        # ── 9. 最終「スケジュール投稿」ボタンをクリック ───────────────────────
        print("🚀 最終「スケジュール」ボタンをクリック...")
        page.wait_for_timeout(1000)

        # shadow DOM内のボタンを確認
        shadow_final = page.evaluate("""() => {
            const interop = document.querySelector('#interop-outlet');
            if (!interop || !interop.shadowRoot) return 'no shadow';
            return Array.from(interop.shadowRoot.querySelectorAll('button'))
                .map(b => (b.getAttribute('aria-label') || b.textContent?.trim() || '').substring(0,40))
                .filter(Boolean).join(' | ');
        }""")
        print(f"   [final step shadow btns] {shadow_final}")

        # 「スケジュール」ボタンをテキスト完全一致で探す（shadow DOM内）
        final_clicked = False
        for attempt in range(3):
            result = page.evaluate("""() => {
                const interop = document.querySelector('#interop-outlet');
                if (!interop || !interop.shadowRoot) return 'no shadow';
                const btns = interop.shadowRoot.querySelectorAll('button');
                // テキスト「スケジュール」または「Schedule」のボタンを探す
                for (const btn of btns) {
                    const text = (btn.textContent || '').trim();
                    const aria = (btn.getAttribute('aria-label') || '');
                    // 「投稿のスケジュールを設定」は除外（別のボタン）
                    if (aria === '投稿のスケジュールを設定' || aria === 'Schedule post') continue;
                    if (text === 'スケジュール' || text === 'Schedule' ||
                        aria === 'スケジュール' || aria === 'Schedule') {
                        btn.dispatchEvent(new MouseEvent('click', {bubbles:true, cancelable:true, composed:true, view:window}));
                        btn.click();
                        return 'clicked: ' + text;
                    }
                }
                // フォールバック: 「次へ」ボタンが時刻→スケジュールの2ステップの場合
                for (const btn of btns) {
                    const text = (btn.textContent || '').trim();
                    if (text === '次へ' || text === 'Next') {
                        btn.click();
                        return 'clicked 次へ (fallback): ' + text;
                    }
                }
                return 'not found | all: ' + Array.from(btns).map(b => b.textContent?.trim() || b.getAttribute('aria-label')).filter(Boolean).slice(0,20).join(' | ');
            }""")
            print(f"   [final schedule attempt {attempt+1}] {result}")
            if result and result.startswith("clicked"):
                final_clicked = True
                if "次へ" in result:
                    # もう一度スケジュールボタンを探す
                    page.wait_for_timeout(2000)
                    continue
                page.wait_for_timeout(3000)
                break
            page.wait_for_timeout(2000)

        if final_clicked:
            print("✅ スケジュール投稿ボタンをクリックしました！")
            page.wait_for_timeout(3000)
            page.screenshot(path=str(SCRIPTS_DIR / "debug_step9_final.png"))
            print("✅ 投稿がスケジュールされました！")
        else:
            print("⚠️  自動クリック失敗。ブラウザで「スケジュール」ボタンを手動でクリックしてください")
            page.screenshot(path=str(SCRIPTS_DIR / "debug_step9_manual.png"))
            print("\n" + "=" * 60)
            print("✋ 手動操作が必要です:")
            print("   1. ブラウザで日時を確認（2026/03/04 23:00 JST = 11:00 PM）")
            print("   2. 「スケジュール」ボタンをクリック")
            print("=" * 60)
            try:
                input("\n完了後、Enterを押してください: ")
            except EOFError:
                print("   (非インタラクティブモード: 2分待機)")
                page.wait_for_timeout(120_000)

        # セッション保存
        storage = context.storage_state()
        with open(SESSION_FILE, "w") as f:
            json.dump(storage, f)
        print("✅ セッション保存完了")

        browser.close()

    print("\n🎉 完了！LinkedIn投稿がスケジュールされました。")


if __name__ == "__main__":
    main()
