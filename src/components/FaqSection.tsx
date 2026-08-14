import React, { useState } from 'react';
import { ChevronDown, Sparkles, HelpCircle, Search } from 'lucide-react';
import { FAQ_ITEMS } from '../data/initialData';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: 'All FAQs' },
    { id: 'bridal', label: 'Bridal Makeover' },
    { id: 'hair-skin', label: 'Hair & Skin Care' },
    { id: 'booking', label: 'Appointments & Trials' },
    { id: 'general', label: 'Hygiene & Brands' }
  ];

  const filteredFaqs = FAQ_ITEMS.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div id="faq-section" className="space-y-8 py-6 max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#E0A96D]/15 text-[#8C5E35] dark:text-[#E0A96D] text-xs font-semibold uppercase tracking-wider">
          <HelpCircle className="w-3.5 h-3.5" />
          Got Questions?
        </div>
        <h3 className="font-serif text-3xl font-bold text-stone-900 dark:text-white">
          Frequently Asked Questions
        </h3>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
          Everything you need to know about bridal packages, trials, hair treatments, and VIP salon hygiene.
        </p>
      </div>

      {/* Search Bar & Category Filter */}
      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search FAQs (e.g. trials, airbrush, destination wedding)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm rounded-2xl bg-white dark:bg-[#1C1A1B] border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D] shadow-sm"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
        </div>

        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-stone-900 text-white dark:bg-[#E0A96D] dark:text-stone-950 shadow-sm'
                  : 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.id}
                className="bg-white dark:bg-[#1C1A1B] rounded-2xl border border-stone-200/80 dark:border-stone-800/90 overflow-hidden shadow-sm transition-all duration-200"
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-serif text-sm sm:text-base font-semibold text-stone-900 dark:text-stone-100 hover:text-[#8C5E35] dark:hover:text-[#E0A96D] transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#E0A96D] shrink-0" />
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-stone-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-[#E0A96D]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed border-t border-stone-100 dark:border-stone-800/50 animate-in fade-in duration-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p className="text-center text-xs text-stone-400 py-8">No questions found matching your search term.</p>
        )}
      </div>
    </div>
  );
};
