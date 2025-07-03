"use client";

import { useState, memo } from "react";
import { FaChevronDown } from "react-icons/fa";
import { cn } from "@/lib/utils";

interface AccordionItem {
  question: string;
  answer: string;
}

interface CleanAccordionProps {
  items: AccordionItem[];
  className?: string;
}

export function CleanAccordion({ items, className }: CleanAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={cn("space-y-2", className)}>
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          item={item}
          isOpen={openIndex === index}
          onToggle={() => toggleItem(index)}
          index={index}
        />
      ))}
    </div>
  );
}

interface AccordionItemProps {
  item: AccordionItem;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}

const AccordionItem = memo(({ item, isOpen, onToggle, index }: AccordionItemProps) => (
  <div className="border border-[#2a2d36] rounded-md overflow-hidden">
    <button
      className="flex justify-between items-center w-full p-4 text-left bg-[#1D1F23] text-white hover:bg-[#23262e] transition-colors border-b border-[#2a2d36]"
      onClick={onToggle}
      aria-expanded={isOpen}
      aria-controls={`accordion-content-${index}`}
      id={`accordion-header-${index}`}
    >
      <span className="font-medium text-white">{item.question}</span>
      <FaChevronDown
        className={cn(
          "h-5 w-5 text-gray-400 transition-transform duration-200",
          isOpen ? "transform rotate-180" : ""
        )}
      />
    </button>
    <div
      id={`accordion-content-${index}`}
      className={cn(
        "overflow-hidden transition-all duration-200 ease-out",
        isOpen ? "max-h-96" : "max-h-0"
      )}
      aria-labelledby={`accordion-header-${index}`}
      aria-hidden={!isOpen}
    >
      <div className="p-4 pt-0 text-gray-300 bg-[#1D1F23]">{item.answer}</div>
    </div>
  </div>
));
AccordionItem.displayName = "AccordionItem";