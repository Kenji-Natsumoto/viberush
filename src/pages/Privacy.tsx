import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center h-16">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>
          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-muted-foreground">
            <p className="text-sm">Last updated: {new Date().toLocaleDateString('ja-JP')}</p>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">1. はじめに</h2>
              <p>
                VibeRush（以下「本サービス」）は、ユーザーのプライバシーを尊重し、個人情報の保護に努めています。本プライバシーポリシーでは、収集する情報、その利用方法、およびユーザーの権利について説明します。
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">2. 収集する情報</h2>
              <p>本サービスでは、以下の情報を収集する場合があります：</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>アカウント情報：</strong>メールアドレス、ユーザー名など、アカウント作成時に提供される情報</li>
                <li><strong>投稿情報：</strong>アプリの説明、スクリーンショット、URL、プロンプトなど、ユーザーが自発的に投稿する情報</li>
                <li><strong>利用データ：</strong>アクセスログ、IPアドレス、ブラウザ情報、閲覧履歴などの技術的情報</li>
                <li><strong>Cookie：</strong>ログイン状態の維持やサービス改善のために使用</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">3. 情報の利用目的</h2>
              <p>収集した情報は、以下の目的で利用されます：</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>サービスの提供・運営・改善</li>
                <li>ユーザーサポートの提供</li>
                <li>サービスに関する通知・お知らせの送信</li>
                <li>不正利用の防止・セキュリティの確保</li>
                <li>利用状況の分析・統計データの作成</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">4. 情報の共有</h2>
              <p>
                本サービスは、以下の場合を除き、ユーザーの個人情報を第三者と共有しません：
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>ユーザーの同意がある場合</li>
                <li>法令に基づく開示要求があった場合</li>
                <li>サービス運営に必要な業務委託先との共有（機密保持契約に基づく）</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">5. データの保護</h2>
              <p>
                本サービスは、収集した情報を不正アクセス、紛失、破壊から保護するために、適切なセキュリティ対策を講じています。ただし、インターネット上での完全なセキュリティを保証することはできません。
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">6. ユーザーの権利</h2>
              <p>ユーザーは以下の権利を有します：</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>自身の個人情報へのアクセス権</li>
                <li>個人情報の訂正・削除の要求権</li>
                <li>データ処理への異議申立権</li>
                <li>アカウントの削除要求権</li>
              </ul>
              <p>
                これらの権利を行使する場合は、Contactページよりご連絡ください。
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">7. 未成年者について</h2>
              <p>
                本サービスは13歳未満の方による利用を想定していません。13歳未満の方から個人情報を収集したことが判明した場合、速やかに削除します。
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">8. ポリシーの変更</h2>
              <p>
                本プライバシーポリシーは、必要に応じて更新される場合があります。重要な変更がある場合は、サービス上でお知らせします。
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">9. お問い合わせ</h2>
              <p>
                プライバシーに関するお問い合わせは、Contactページよりご連絡ください。
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
