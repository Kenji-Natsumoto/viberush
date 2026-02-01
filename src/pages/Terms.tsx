import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";

export default function Terms() {
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
          <h1 className="text-4xl font-bold text-foreground mb-8">Terms of Service</h1>
          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-muted-foreground">
            <p className="text-sm">Last updated: {new Date().toLocaleDateString('ja-JP')}</p>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">1. サービスの利用について</h2>
              <p>
                VibeRush（以下「本サービス」）は、AIを活用して構築されたアプリケーションを共有・発見するためのコミュニティプラットフォームです。本サービスを利用することにより、以下の利用規約に同意したものとみなされます。
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">2. 投稿コンテンツについて</h2>
              <p>
                ユーザーが投稿したコンテンツ（アプリ情報、スクリーンショット、説明文、プロンプト等）の著作権は、投稿者に帰属します。ただし、本サービス上での表示・共有に必要な範囲で、非独占的な利用権を本サービスに許諾するものとします。
              </p>
              <p>以下のコンテンツの投稿は禁止されています：</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>違法なコンテンツ、または違法行為を助長するもの</li>
                <li>第三者の著作権、商標権、その他の知的財産権を侵害するもの</li>
                <li>誹謗中傷、差別的表現、ヘイトスピーチを含むもの</li>
                <li>マルウェア、スパム、フィッシングに関連するもの</li>
                <li>ポルノグラフィーその他の成人向けコンテンツ</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">3. ユーザーの責任</h2>
              <p>
                ユーザーは、自身が投稿するコンテンツについて全責任を負います。投稿されたアプリやリンク先のサービスにより生じた損害について、本サービスは一切の責任を負いません。
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">4. アカウントの管理</h2>
              <p>
                ユーザーは、自身のアカウント情報を適切に管理する責任を負います。アカウントの不正使用が発覚した場合は、速やかに本サービスに報告してください。
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">5. サービスの変更・中断</h2>
              <p>
                本サービスは、事前の通知なくサービス内容の変更、一時的な中断、または終了を行う場合があります。これにより生じた損害について、本サービスは責任を負いません。
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">6. 免責事項</h2>
              <p>
                本サービスは「現状有姿」で提供されます。本サービスの利用により生じた直接的・間接的な損害について、本サービスは一切の責任を負いません。
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">7. 規約の変更</h2>
              <p>
                本規約は予告なく変更される場合があります。変更後も本サービスを継続して利用することにより、変更後の規約に同意したものとみなされます。
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">8. お問い合わせ</h2>
              <p>
                本規約に関するお問い合わせは、Contactページよりご連絡ください。
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
