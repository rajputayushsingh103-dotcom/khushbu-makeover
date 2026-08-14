import React, { useState } from 'react';
import { Sparkles, BookOpen, Clock, ArrowRight, User, Calendar, X } from 'lucide-react';
import { BlogPost } from '../types';
import { BLOG_POSTS } from '../data/initialData';

interface BlogSectionProps {
  onOpenBooking: () => void;
}

export const BlogSection: React.FC<BlogSectionProps> = ({ onOpenBooking }) => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  return (
    <div id="blog-section" className="space-y-8 py-6">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#E0A96D]/15 text-[#8C5E35] dark:text-[#E0A96D] text-xs font-semibold uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5" />
          The Beauty Journal
        </div>
        <h3 className="font-serif text-3xl font-bold text-stone-900 dark:text-white">
          Bridal & Skincare Insights
        </h3>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
          Expert beauty tips, skincare countdowns, hair trend guides, and behind-the-scenes secrets from Khushboo Sharma.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {BLOG_POSTS.map(post => (
          <article
            key={post.id}
            onClick={() => setSelectedPost(post)}
            className="group bg-white dark:bg-[#1C1A1B] rounded-3xl overflow-hidden border border-stone-200/80 dark:border-[#E0A96D]/20 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-stone-950">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#E0A96D] text-stone-950 shadow-md">
                  {post.category}
                </span>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-3 text-[11px] text-stone-400 mb-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#E0A96D]" />
                    {post.date}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#E0A96D]" />
                    {post.readTime}
                  </span>
                </div>

                <h4 className="font-serif text-lg font-bold text-stone-900 dark:text-white group-hover:text-[#8C5E35] dark:group-hover:text-[#E0A96D] transition-colors leading-snug">
                  {post.title}
                </h4>

                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-2 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                <span className="text-xs text-stone-500 font-medium">By {post.author}</span>
                <span className="text-xs font-bold text-[#8C5E35] dark:text-[#E0A96D] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Read Article <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Blog Detail Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div
            className="relative w-full max-w-3xl bg-[#FAF7F5] dark:bg-[#1A1818] rounded-3xl overflow-hidden shadow-2xl border border-[#E0A96D]/30 text-stone-900 dark:text-stone-100 my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Image */}
            <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-black">
              <img
                src={selectedPost.image}
                alt={selectedPost.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 text-white hover:bg-black flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#E0A96D] text-stone-950 inline-block">
                  {selectedPost.category}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold leading-tight">
                  {selectedPost.title}
                </h2>
                <div className="flex items-center gap-4 text-xs text-stone-300">
                  <span>By {selectedPost.author}</span>
                  <span>•</span>
                  <span>{selectedPost.date}</span>
                  <span>•</span>
                  <span>{selectedPost.readTime}</span>
                </div>
              </div>
            </div>

            {/* Article Content */}
            <div className="p-6 sm:p-10 space-y-6">
              <div className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-line">
                {selectedPost.content}
              </div>

              {/* In-Article Booking Box */}
              <div className="p-6 rounded-2xl bg-[#E0A96D]/15 dark:bg-[#E0A96D]/10 border border-[#E0A96D]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-serif text-base font-bold text-stone-900 dark:text-white">Ready to Transform Your Wedding Look?</h4>
                  <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">Book your private consultation with Khushboo Sharma today.</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedPost(null);
                    onOpenBooking();
                  }}
                  className="px-6 py-2.5 rounded-full bg-[#E0A96D] text-stone-950 font-bold text-xs shadow-md hover:scale-105 transition-transform shrink-0"
                >
                  Reserve Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
