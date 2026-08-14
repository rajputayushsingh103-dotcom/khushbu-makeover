import React, { useState } from 'react';
import { Star, ThumbsUp, CheckCircle, Sparkles, Plus, X, MessageSquareQuote } from 'lucide-react';
import { Review, Service } from '../types';
import { salonService } from '../services/salonService';

interface ReviewSectionProps {
  reviews: Review[];
  services: Service[];
  onReviewAdded: (newReview: Review) => void;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({
  reviews,
  services,
  onReviewAdded
}) => {
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<number | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [service, setService] = useState(services[0]?.title || 'Signature Royal Bridal Makeup');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '4.9';

  const fiveStarCount = reviews.filter(r => r.rating === 5).length;
  const fourStarCount = reviews.filter(r => r.rating === 4).length;

  const filteredReviews = selectedRatingFilter
    ? reviews.filter(r => r.rating === selectedRatingFilter)
    : reviews;

  const handleLike = (id: string) => {
    salonService.likeReview(id);
    // force update in parent or local
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    setSubmitting(true);
    const newRev = salonService.addReview({
      name,
      city,
      rating,
      service,
      comment
    });

    onReviewAdded(newRev);
    setSubmitting(false);
    setSuccessMessage(true);
    setName('');
    setComment('');

    setTimeout(() => {
      setSuccessMessage(false);
      setShowWriteModal(false);
    }, 2000);
  };

  return (
    <div id="reviews-component" className="space-y-12">
      {/* Top Rating Summary Card */}
      <div className="bg-white dark:bg-[#1C1A1B] rounded-3xl p-6 sm:p-10 border border-stone-200/80 dark:border-[#E0A96D]/20 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Overall Rating Score */}
          <div className="md:col-span-4 text-center md:text-left border-b md:border-b-0 md:border-r border-stone-200 dark:border-stone-800 pb-6 md:pb-0 md:pr-8">
            <span className="text-xs uppercase tracking-widest text-[#B76E79] dark:text-[#E0A96D] font-bold">Client Ratings</span>
            <div className="flex items-baseline justify-center md:justify-start gap-2 mt-1">
              <span className="font-serif text-5xl sm:text-6xl font-bold text-stone-900 dark:text-white">{averageRating}</span>
              <span className="text-stone-400 text-lg">/ 5.0</span>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-1 text-amber-400 my-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400">Based on over 1,250+ bride & client transformations</p>

            <button
              onClick={() => setShowWriteModal(true)}
              className="mt-5 w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#E0A96D] hover:bg-[#C58F5E] text-stone-950 font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Share Your Story</span>
            </button>
          </div>

          {/* Rating Breakdown Bars */}
          <div className="md:col-span-8 space-y-2.5">
            <div className="flex items-center gap-3 text-xs text-stone-600 dark:text-stone-300">
              <span className="w-12 font-medium">5 Stars</span>
              <div className="flex-1 h-3 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#B76E79] to-[#E0A96D] rounded-full" style={{ width: '92%' }} />
              </div>
              <span className="w-10 text-right font-semibold">92%</span>
            </div>

            <div className="flex items-center gap-3 text-xs text-stone-600 dark:text-stone-300">
              <span className="w-12 font-medium">4 Stars</span>
              <div className="flex-1 h-3 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#B76E79] to-[#E0A96D] rounded-full" style={{ width: '7%' }} />
              </div>
              <span className="w-10 text-right font-semibold">7%</span>
            </div>

            <div className="flex items-center gap-3 text-xs text-stone-600 dark:text-stone-300">
              <span className="w-12 font-medium">3 Stars</span>
              <div className="flex-1 h-3 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                <div className="h-full bg-[#E0A96D]/50 rounded-full" style={{ width: '1%' }} />
              </div>
              <span className="w-10 text-right font-semibold">1%</span>
            </div>

            {/* Filter Buttons */}
            <div className="pt-3 flex items-center gap-2">
              <span className="text-xs text-stone-400 font-semibold">Filter:</span>
              <button
                onClick={() => setSelectedRatingFilter(null)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  selectedRatingFilter === null
                    ? 'bg-stone-900 text-white dark:bg-[#E0A96D] dark:text-stone-950'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                }`}
              >
                All Reviews ({reviews.length})
              </button>
              <button
                onClick={() => setSelectedRatingFilter(5)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  selectedRatingFilter === 5
                    ? 'bg-stone-900 text-white dark:bg-[#E0A96D] dark:text-stone-950'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                }`}
              >
                5 Stars Only ({fiveStarCount})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReviews.map(review => (
          <div
            key={review.id}
            className="bg-white dark:bg-[#1C1A1B] rounded-3xl p-6 border border-stone-200/70 dark:border-stone-800 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#B76E79] to-[#E0A96D] text-white font-serif font-bold text-sm flex items-center justify-center shrink-0">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-semibold text-sm text-stone-900 dark:text-white">{review.name}</h4>
                      {review.verified && (
                        <CheckCircle className="w-3.5 h-3.5 text-[#E0A96D] fill-[#E0A96D]/20 shrink-0" title="Verified Client" />
                      )}
                    </div>
                    <span className="text-[11px] text-stone-400">{review.city || 'Mumbai'} • {review.date}</span>
                  </div>
                </div>

                <div className="flex text-amber-400">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>

              {/* Service Tag */}
              <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#E0A96D]/15 text-[#8C5E35] dark:text-[#E0A96D] mb-3">
                {review.service}
              </div>

              {/* Review Text */}
              <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed italic">
                "{review.comment}"
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs text-stone-400">
              <span className="text-[11px]">Verified Salon Experience</span>
              <button
                onClick={() => handleLike(review.id)}
                className="flex items-center gap-1 hover:text-[#E0A96D] transition-colors"
              >
                <ThumbsUp className="w-3 h-3" />
                <span>{review.likes}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Write a Review Modal */}
      {showWriteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div
            className="relative w-full max-w-lg bg-[#FAF7F5] dark:bg-[#1A1818] rounded-3xl p-6 sm:p-8 border border-[#E0A96D]/30 shadow-2xl text-stone-900 dark:text-stone-100"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowWriteModal(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-stone-200 dark:bg-stone-800 flex items-center justify-center text-stone-600 dark:text-stone-300 hover:text-white hover:bg-stone-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5">
              <span className="text-xs uppercase tracking-widest text-[#E0A96D] font-bold">Client Feedback</span>
              <h3 className="font-serif text-2xl font-bold text-stone-900 dark:text-white mt-1">Share Your Salon Experience</h3>
            </div>

            {successMessage ? (
              <div className="p-6 text-center space-y-2">
                <CheckCircle className="w-12 h-12 text-[#E0A96D] mx-auto" />
                <h4 className="font-serif text-xl font-bold text-stone-900 dark:text-white">Thank You for Your Feedback!</h4>
                <p className="text-xs text-stone-500">Your review has been published on Khushboo Makeover.</p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1">Your Rating *</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 hover:scale-125 transition-transform"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= rating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-stone-300 dark:text-stone-700'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-semibold text-[#8C5E35] dark:text-[#E0A96D] ml-2">
                      {rating === 5 ? 'Exceptional (5/5)' : `${rating} Stars`}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Pooja Roy"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 focus:outline-none focus:border-[#E0A96D]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1">City</label>
                    <input
                      type="text"
                      placeholder="e.g. Mumbai"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 focus:outline-none focus:border-[#E0A96D]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1">Service Availed</label>
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 focus:outline-none focus:border-[#E0A96D]"
                  >
                    {services.map(s => (
                      <option key={s.id} value={s.title}>{s.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1">Your Review & Thoughts *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us about the makeup longevity, hair styling, or ambience..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 focus:outline-none focus:border-[#E0A96D]"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowWriteModal(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-500 hover:bg-stone-200 dark:hover:bg-stone-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#B76E79] via-[#C58F5E] to-[#E0A96D] text-white text-xs font-bold shadow-md hover:scale-102 transition-transform"
                  >
                    {submitting ? 'Publishing...' : 'Submit Review'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
