import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const faqItems = [
  {
    question: "What is Vibe Coding?",
    answer:
      "Vibe Coding is a new development style where you collaborate with AI tools (like Lovable, Cursor, Bolt, etc.) to build apps at the speed of thought—focusing on your vision rather than implementation details.",
  },
  {
    question: "Can anyone submit an app?",
    answer:
      "Yes! Whether you're a professional developer or someone who just discovered AI today, if you've built something with AI, you're welcome here.",
  },
  {
    question: "Does it cost anything to submit?",
    answer:
      "Completely free. Our mission is to share the excitement of Vibe Coding with the world.",
  },
  {
    question: "Who owns the rights to submitted apps?",
    answer:
      "All rights remain with the creator. VibeRush is simply a stage to showcase your work.",
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
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground">
            Everything you need to know about VibeRush
          </p>
        </div>

        {/* Accordion */}
        <Accordion type="single" collapsible className="w-full space-y-3">
          {faqItems.map((item, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-card border border-border rounded-lg px-4 sm:px-6 data-[state=open]:shadow-card-hover transition-shadow"
            >
              <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline py-4 sm:py-5 text-sm sm:text-base">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4 sm:pb-5 text-sm sm:text-base leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
