"use client";

import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

type FaqAccordionProps = {
  items: Array<{
    question: string;
    answer: string;
  }>;
};

export function FaqAccordion({ items }: FaqAccordionProps) {
  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <details
          key={item.question}
          className="faq-item glass group rounded-[1.75rem] border border-white/10"
          open={index === 0}
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5">
            <span className="text-left text-lg font-semibold text-white">{item.question}</span>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5">
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-[var(--muted-foreground)] transition-transform duration-200",
                  "group-open:rotate-180",
                )}
              />
            </span>
          </summary>
          <div className="px-6 pb-6 text-sm leading-7 text-[var(--muted-foreground)]">
            {item.answer}
          </div>
        </details>
      ))}
    </div>
  );
}
