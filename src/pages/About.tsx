import { Link } from "react-router-dom";
import { ArrowLeft, Zap, Rocket, Users, Sparkles, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";

const principles = [
  {
    icon: Rocket,
    title: "実践第一",
    description: "考えるよりも、まず作る。失敗を恐れず、とにかく手を動かす。",
  },
  {
    icon: Zap,
    title: "完璧よりスピード",
    description: "100%を目指すより、80%で素早くリリース。改善は後からでもできる。",
  },
  {
    icon: Users,
    title: "AIとの共生",
    description: "AIは敵ではなく、最高のパートナー。共に創造する未来を信じる。",
  },
];

export default function About() {
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

      <main>
        {/* Hero */}
        <section className="py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full bg-secondary border border-border text-sm text-muted-foreground">
              <Heart className="h-3.5 w-3.5 text-destructive" />
              <span>About VibeRush</span>
            </div>

            {/* MTP */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
              <span className="bg-gradient-to-r from-primary via-muted-foreground to-primary bg-clip-text text-transparent">
                "Unleash the world's creativity
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary via-muted-foreground to-primary bg-clip-text text-transparent">
                through the speed of thought."
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              思考の速度で、世界の創造力を解き放つ。
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16 bg-secondary/30">
          <div className="max-w-3xl mx-auto px-4">
            <div className="bg-card border border-border rounded-2xl p-8 md:p-12 shadow-card">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="h-5 w-5 text-upvote" />
                <h2 className="text-2xl font-bold text-foreground">Our Story</h2>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  このVibeRush自体も、最初のプロトタイプは<span className="text-foreground font-semibold">Vibe Codingにより</span>わずか<span className="text-foreground font-semibold">1時間足らず</span>で誕生しました。
                </p>
                <p>
                  私たちは、バグに悩み、プロンプトを工夫し、形になった瞬間のあの<span className="text-foreground font-semibold">震えるような喜び</span>を、あなたと完全に共有しています。
                </p>
                <p className="text-foreground font-medium pt-4 border-t border-border">
                  私たちは、あなたの挑戦を誰よりも理解し、応援するコミュニティです。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Principles */}
        <section className="py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">行動指針</h2>
              <p className="text-muted-foreground">私たちが大切にしている3つの価値観</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {principles.map((principle, index) => (
                <div
                  key={index}
                  className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-card-hover transition-shadow"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary mb-4">
                    <principle.icon className="h-6 w-6 text-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {principle.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{principle.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to join the rush?</h2>
            <p className="text-primary-foreground/80 mb-8">
              あなたのVibe Codingプロジェクトを世界に披露しよう
            </p>
            <Link to="/">
              <Button
                size="lg"
                variant="secondary"
                className="gap-2"
              >
                <Rocket className="h-4 w-4" />
                アプリを投稿する
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
