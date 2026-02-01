import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const faqItems = [
  {
    question: "Vibe Codingとは何ですか？",
    answer:
      "AI（Lovable, Cursor, Bolt等）と対話しながら、プログラミングの細部ではなく「何を作りたいか」というビジョンに集中し、思考の速度でアプリを構築する新しい開発スタイルです。",
  },
  {
    question: "誰でも投稿できますか？",
    answer:
      "はい。AIを使って構築したアプリであれば、プロの開発者から、今日初めてAIに触れた方まで誰でも大歓迎です。",
  },
  {
    question: "投稿に費用はかかりますか？",
    answer:
      "完全無料です。Vibe Codingの熱狂を共有することが私たちの目的です。",
  },
  {
    question: "投稿したアプリの権利はどうなりますか？",
    answer:
      "投稿されたアプリの権利はすべて作成者に帰属します。ここはあくまで「お披露目の場」です。",
  },
];

export function FAQSection() {
  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 rounded-full bg-secondary border border-border text-sm text-muted-foreground">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>FAQ</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
            よくある質問
          </h2>
          <p className="text-muted-foreground">
            VibeRushについて気になることはここで解決
          </p>
        </div>

        {/* Accordion */}
        <Accordion type="single" collapsible className="w-full space-y-3">
          {faqItems.map((item, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-card border border-border rounded-lg px-6 data-[state=open]:shadow-card-hover transition-shadow"
            >
              <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline py-5">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
