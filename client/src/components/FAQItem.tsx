import { useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type FAQItemProps = {
  question: string;
  answer: string;
};

export default function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full justify-between items-center p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 focus:outline-none"
      >
        <span className="text-lg font-medium text-neutral-900">{question}</span>
        <i className={cn(
          "text-primary text-2xl",
          isOpen ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"
        )}></i>
      </button>
      <div className={cn(
        "mt-2 p-4 bg-neutral-50 rounded-lg",
        isOpen ? "block" : "hidden"
      )}>
        <p className="text-neutral-700">
          {answer}
        </p>
      </div>
    </div>
  );
}
