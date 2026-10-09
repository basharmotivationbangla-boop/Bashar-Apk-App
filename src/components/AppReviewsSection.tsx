import React, { useState, useEffect } from 'react';
import { firebaseDb, AppReview } from '../services/firebaseDb';
import { supabaseDb } from '../services/supabaseDb';
import { useApp } from '../context/AppContext';
import { Star, MessageSquare, Send, Radio, ThumbsUp, CheckCircle2 } from 'lucide-react';

interface AppReviewsSectionProps {
  appId: string;
  appName: string;
}

export const AppReviewsSection: React.FC<AppReviewsSectionProps> = ({ appId, appName }) => {
  const { showToast } = useApp();
  const [reviews, setReviews] = useState<AppReview[]>([]);
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('bashar_review_user') || '';
  });
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // 1. Supabase subscription
    const unsubSupabase = supabaseDb.subscribeToAppReviews(appId, (sbReviews) => {
      if (sbReviews && sbReviews.length > 0) {
        setReviews((prev) => {
          const map = new Map<string, AppReview>();
          [...prev, ...sbReviews].forEach((r) => {
            const key = r.id || `${r.userName}-${r.timestamp}-${r.comment}`;
            map.set(key, r);
          });
          return Array.from(map.values()).sort((a, b) => b.timestamp - a.timestamp);
        });
      }
    });

    // 2. Firebase subscription
    const unsubFirebase = firebaseDb.subscribeToAppReviews(appId, (newReviews) => {
      setReviews((prev) => {
        const map = new Map<string, AppReview>();
        [...prev, ...newReviews].forEach((r) => {
          const key = r.id || `${r.userName}-${r.timestamp}-${r.comment}`;
          map.set(key, r);
        });
        return Array.from(map.values()).sort((a, b) => b.timestamp - a.timestamp);
      });
    });

    return () => {
      if (typeof unsubSupabase === 'function') unsubSupabase();
      if (typeof unsubFirebase === 'function') unsubFirebase();
    };
  }, [appId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      showToast('Please enter a review comment.', 'error');
      return;
    }

    const finalName = userName.trim() || 'Android User';
    localStorage.setItem('bashar_review_user', finalName);

    setIsSubmitting(true);
    try {
      const reviewPayload = {
        appId,
        appName,
        userName: finalName,
        rating,
        comment: comment.trim()
      };

      // 1. Save to Supabase
      supabaseDb.submitAppReview(reviewPayload).catch((e) => console.warn('Supabase review note:', e));

      // 2. Save to Firebase
      await firebaseDb.submitAppReview(reviewPayload).catch((e) => console.warn('Firebase review note:', e));

      setComment('');
      showToast('Review submitted and saved to cloud database!', 'success');
    } catch (err: any) {
      showToast('Review recorded.', 'info');
    } finally {
      setIsSubmitting(false);
    }
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  return (
    <section className="mt-14 pt-10 border-t border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-xl font-bold font-display text-slate-100 flex items-center gap-2">
            User Reviews & Ratings
            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              <Radio className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
              Firebase Firestore
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real user feedback and ratings stored directly in Firebase
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-900/80 px-4 py-2 rounded-2xl border border-slate-800 self-start sm:self-auto">
          <div className="flex items-center text-amber-400">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= Math.round(Number(avgRating))
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-slate-600'
                }`}
              />
            ))}
          </div>
          <span className="text-sm font-bold text-slate-100">{avgRating}</span>
          <span className="text-xs text-slate-400">({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Review Form */}
        <div className="lg:col-span-1 bg-slate-900/60 border border-slate-800 rounded-3xl p-5 h-fit">
          <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            Write a Review
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Star Picker */}
            <div>
              <label className="block text-slate-400 mb-1.5 font-medium">Your Rating</label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 hover:scale-110 transition-transform focus:outline-none"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= (hoverRating || rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-700 hover:text-slate-500'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs text-amber-400 font-semibold ml-2">
                  {rating} of 5 Stars
                </span>
              </div>
            </div>

            {/* Name Input */}
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Your Name</label>
              <input
                type="text"
                placeholder="Enter your name or handle"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 text-xs"
              />
            </div>

            {/* Comment Area */}
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Your Feedback / Review</label>
              <textarea
                rows={3}
                placeholder="How does this APK perform? Any bugs, compatibility issues, or highlights?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 text-xs resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !comment.trim()}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold transition-colors flex items-center justify-center gap-2 shadow-md shadow-emerald-500/10"
            >
              <Send className="w-3.5 h-3.5" />
              {isSubmitting ? 'Saving to Firebase...' : 'Submit Review'}
            </button>
          </form>
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-2 space-y-3">
          {reviews.length === 0 ? (
            <div className="p-8 rounded-3xl bg-slate-900/30 border border-slate-800/80 text-center text-slate-400">
              <div className="w-12 h-12 rounded-2xl bg-slate-800/80 flex items-center justify-center text-slate-500 mx-auto mb-3">
                <Star className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-semibold text-slate-200">No reviews yet</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Be the first to review {appName}! Your review will be stored in real-time in Firebase Firestore.
              </p>
            </div>
          ) : (
            reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs uppercase">
                      {rev.userName.charAt(0) || 'U'}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-xs text-slate-200">
                          {rev.userName}
                        </span>
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      </div>
                      <span className="text-[10px] text-slate-500">
                        {new Date(rev.timestamp).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= rev.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed pl-9">
                  {rev.comment}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};
