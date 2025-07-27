'use client'
import { ChevronDown, Search } from 'lucide-react';
import  { useMemo, useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import SectionHeading from '../ui/SectionHeading';

export interface FAQItem {
  question: string;
  answer: string;
  categories?: string[];
}

interface FAQSectionProps {
  title: string;
  subtitle: string;
  items: FAQItem[];
  searchable?: boolean;
  accordionType?: 'custom' | 'shadcn';
}

const FAQSection = ({
                                                 title,
                                                 subtitle,
                                                 items,
                                                 searchable = false,
                                                 accordionType = 'shadcn'
                                               }: FAQSectionProps) => {
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleItem = (index: number) => {
    setOpenItems((prev) => {
      if (prev.includes(index)) {
        return prev.filter((item) => item !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;

    const query = searchQuery.toLowerCase().trim();
    return items.filter(
      item =>
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query)
    );
  }, [items, searchQuery]);

  return (
    <section className="container section-padding">
      <SectionHeading
        title={title}
        subtitle={subtitle}
        centered={true}
      />

      {searchable && (
        <div className="max-w-md mx-auto mb-8">
          <div className="flex items-center border rounded-md overflow-hidden bg-white">
            <div className="pl-3">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <Input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto">
        {accordionType === 'shadcn' ? (
          <Accordion type="single" collapsible className="w-full">
            {filteredItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="text-muted-foreground py-2">
                    {item.answer}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="divide-y divide-border">
            {filteredItems.map((item, index) => (
              <div key={index} className="py-5">
                <button
                  onClick={() => toggleItem(index)}
                  className="flex w-full justify-between items-center text-left"
                >
                  <h3 className="text-lg font-medium">{item.question}</h3>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 text-muted-foreground transition-transform",
                      openItems.includes(index) && "transform rotate-180"
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "mt-2 text-muted-foreground overflow-hidden transition-all duration-300",
                    openItems.includes(index) ? "max-h-96" : "max-h-0"
                  )}
                >
                  <p className="py-3">{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredItems.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No questions matching your search.</p>
            <p className="mt-2">
              <a href="/contact" className="text-brand hover:underline">Contact our support team</a> for more help.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FAQSection;
