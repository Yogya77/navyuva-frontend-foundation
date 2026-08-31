import React, { useState, useEffect } from "react";
import {
  Star,
  MessageSquareHeart,
  Send,
  CheckCircle2,
  ShieldCheck,
  User,
  Mail,
  RotateCcw,
  Sparkles,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SectionHeading } from "@/components/home/SectionHeading";
import {
  type CommunityReview,
  REVIEWS_STORAGE_KEY,
  REVIEWS_EVENT,
  DEFAULT_APPROVED_REVIEWS,
} from "@/types/community";

interface ReviewErrors {
  name?: string | undefined;
  rating?: string | undefined;
  message?: string | undefined;
  email?: string | undefined;
}

export function CommunityReviews() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [message, setMessage] = useState("");

  const [errors, setErrors] = useState<ReviewErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [allReviews, setAllReviews] = useState<CommunityReview[]>([]);

  // Load reviews from localStorage
  useEffect(() => {
    const loadReviews = () => {
      try {
        const raw = localStorage.getItem(REVIEWS_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setAllReviews(parsed);
            return;
          }
        }
        // Initialize default approved reviews if empty
        localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(DEFAULT_APPROVED_REVIEWS));
        setAllReviews(DEFAULT_APPROVED_REVIEWS);
      } catch {
        setAllReviews(DEFAULT_APPROVED_REVIEWS);
      }
    };

    loadReviews();
    window.addEventListener(REVIEWS_EVENT, loadReviews);
    window.addEventListener("storage", loadReviews);

    return () => {
      window.removeEventListener(REVIEWS_EVENT, loadReviews);
      window.removeEventListener("storage", loadReviews);
    };
  }, []);

  const clearError = (field: keyof ReviewErrors) => {
    setErrors((prev) => {
      const updated = { ...prev };
      delete updated[field];
      return updated;
    });
  };

  const validate = (): boolean => {
    const errs: ReviewErrors = {};
    if (!name.trim()) {
      errs.name = "Please enter your name.";
    }
    if (rating < 1 || rating > 5) {
      errs.rating = "Please select a star rating.";
    }
    if (!message.trim()) {
      errs.message = "Please share your experience or review.";
    } else if (message.trim().length < 10) {
      errs.message = "Review should be at least 10 characters.";
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = "Please enter a valid email address.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const newReview: CommunityReview = {
        id: `REV-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
        name: name.trim(),
        email: email.trim() || undefined,
        rating,
        message: message.trim(),
        createdAt: new Date().toISOString(),
        status: "pending",
      };

      try {
        const raw = localStorage.getItem(REVIEWS_STORAGE_KEY);
        const existing: CommunityReview[] = raw ? JSON.parse(raw) : DEFAULT_APPROVED_REVIEWS;
        const updated = [newReview, ...existing];
        localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(updated));
        setAllReviews(updated);
        window.dispatchEvent(new CustomEvent(REVIEWS_EVENT));
      } catch {
        // Fallback for storage limits
      }

      setIsSubmitting(false);
      setSubmittedSuccess(true);
      setName("");
      setEmail("");
      setRating(5);
      setMessage("");
      setErrors({});
    }, 500);
  };

  const approvedReviews = allReviews.filter((r) => r.status === "approved");

  return (
    <section
      id="community-reviews"
      className="relative border-t border-border/40 bg-stone-950/60 py-24 sm:py-28"
      aria-label="Community Reviews & Feedback"
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <SectionHeading
          eyebrow="Community Feedback"
          title="Share Your NAVYUVA Experience"
          subtitle="Explore what heritage enthusiasts say about our digital preservation journeys and contribute your voice."
          className="max-w-3xl"
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:items-start">
          {/* Left Column: Review Submission Form (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="overflow-hidden rounded-2xl border border-border/70 bg-stone-950/90 p-6 shadow-xl backdrop-blur-md sm:p-8">
              <div className="flex items-center gap-3 border-b border-border/40 pb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/30 bg-stone-900 text-primary">
                  <MessageSquareHeart className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-foreground">Write a Review</h3>
                  <p className="text-xs text-muted-foreground">Your opinion helps improve NAVYUVA.</p>
                </div>
              </div>

              {submittedSuccess ? (
                <div className="py-8 text-center animate-in fade-in zoom-in-95 duration-400">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-primary">
                    <CheckCircle2 className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="mt-4 font-serif text-xl font-bold text-foreground">
                    Thank You for Your Feedback!
                  </h4>
                  <p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    Your review has been submitted for moderation and will appear publicly once verified by our team.
                  </p>
                  <Button
                    onClick={() => setSubmittedSuccess(false)}
                    variant="outline"
                    className="mt-6 gap-2 border-primary/30 text-primary hover:bg-primary hover:text-black"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Submit Another Review
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
                  {/* Star Rating Picker */}
                  <div className="space-y-1.5">
                    <Label className="flex items-center gap-1.5 text-xs font-serif uppercase tracking-wider text-foreground">
                      <Sparkles className="h-3.5 w-3.5 text-primary" />
                      Your Rating <span className="text-primary">*</span>
                    </Label>
                    <div className="flex items-center gap-1.5 pt-1">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const active = (hoverRating || rating) >= star;
                        return (
                          <button
                            key={star}
                            type="button"
                            onClick={() => {
                              setRating(star);
                              if (errors.rating) clearError("rating");
                            }}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="p-1 text-stone-600 transition-colors hover:scale-110 focus:outline-none"
                            aria-label={`${star} star rating`}
                          >
                            <Star
                              className={`h-6 w-6 transition-colors ${
                                active ? "fill-gold text-gold" : "text-stone-600"
                              }`}
                            />
                          </button>
                        );
                      })}
                      <span className="ml-2 font-mono text-xs text-muted-foreground">
                        ({rating} of 5 Stars)
                      </span>
                    </div>
                    {errors.rating && (
                      <p className="text-xs text-destructive">{errors.rating}</p>
                    )}
                  </div>

                  {/* Name */}
                  <div className="space-y-1.5">
                    <Label htmlFor="review-name" className="flex items-center gap-1.5 text-xs font-serif uppercase tracking-wider text-foreground">
                      <User className="h-3.5 w-3.5 text-primary" />
                      Your Name <span className="text-primary">*</span>
                    </Label>
                    <Input
                      id="review-name"
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) clearError("name");
                      }}
                      placeholder="Your name"
                      disabled={isSubmitting}
                      className="border-border/60 bg-stone-900/70 text-foreground placeholder:text-stone-500 focus-visible:border-primary focus-visible:ring-primary/40"
                    />
                    {errors.name && (
                      <p className="text-xs text-destructive">{errors.name}</p>
                    )}
                  </div>

                  {/* Email (Optional) */}
                  <div className="space-y-1.5">
                    <Label htmlFor="review-email" className="flex items-center gap-1.5 text-xs font-serif uppercase tracking-wider text-foreground">
                      <Mail className="h-3.5 w-3.5 text-primary/70" />
                      Email Address <span className="text-[11px] font-normal normal-case text-muted-foreground">(optional, never published)</span>
                    </Label>
                    <Input
                      id="review-email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) clearError("email");
                      }}
                      placeholder="Your email (optional)"
                      disabled={isSubmitting}
                      className="border-border/60 bg-stone-900/70 text-foreground placeholder:text-stone-500 focus-visible:border-primary focus-visible:ring-primary/40"
                    />
                    {errors.email && (
                      <p className="text-xs text-destructive">{errors.email}</p>
                    )}
                  </div>

                  {/* Review / Feedback */}
                  <div className="space-y-1.5">
                    <Label htmlFor="review-message" className="flex items-center gap-1.5 text-xs font-serif uppercase tracking-wider text-foreground">
                      <MessageSquareHeart className="h-3.5 w-3.5 text-primary" />
                      Review / Feedback <span className="text-primary">*</span>
                    </Label>
                    <Textarea
                      id="review-message"
                      rows={4}
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                        if (errors.message) clearError("message");
                      }}
                      placeholder="Share your thoughts about NAVYUVA's games, historical accuracy, or platform experience..."
                      disabled={isSubmitting}
                      className="resize-y border-border/60 bg-stone-900/70 text-foreground placeholder:text-stone-500 focus-visible:border-primary focus-visible:ring-primary/40"
                    />
                    {errors.message && (
                      <p className="text-xs text-destructive">{errors.message}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full gap-2 bg-primary font-serif font-semibold text-black hover:bg-primary/90"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Submit Review
                        </>
                      )}
                    </Button>
                    <div className="mt-2 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
                      <ShieldCheck className="h-3.5 w-3.5 text-primary/70 shrink-0" />
                      <span>Reviews are moderated before publication.</span>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Right Column: Approved Community Reviews Showcase (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-foreground">
                  Verified Community Voices
                </h3>
                <p className="text-xs text-muted-foreground">
                  Reflections from heritage enthusiasts, educators, and explorers.
                </p>
              </div>
              <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-serif text-xs font-semibold text-primary">
                {approvedReviews.length} {approvedReviews.length === 1 ? "Review" : "Reviews"}
              </span>
            </div>

            {approvedReviews.length === 0 ? (
              <div className="mt-6 rounded-xl border border-border/40 bg-stone-950/40 p-8 text-center">
                <Quote className="mx-auto h-8 w-8 text-muted-foreground/40" />
                <p className="mt-2 text-sm text-muted-foreground">
                  No public reviews published yet. Be the first to share your experience!
                </p>
              </div>
            ) : (
              <div className="mt-6 grid gap-4 sm:grid-cols-1">
                {approvedReviews.slice(0, 5).map((rev) => (
                  <div
                    key={rev.id}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border/50 bg-stone-950/80 p-5 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
                  >
                    <div>
                      {/* Top Bar: Stars + Badge */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-gold">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < rev.rating
                                  ? "fill-gold text-gold"
                                  : "text-stone-700"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="rounded border border-primary/20 bg-stone-900 px-2 py-0.5 font-serif text-[10px] font-medium tracking-wide text-primary">
                          Community Review
                        </span>
                      </div>

                      {/* Review Body */}
                      <p className="mt-3 text-sm leading-relaxed text-stone-300">
                        &ldquo;{rev.message}&rdquo;
                      </p>
                    </div>

                    {/* Contributor Footer */}
                    <div className="mt-4 flex items-center justify-between border-t border-border/30 pt-3 text-xs text-muted-foreground">
                      <span className="font-serif font-semibold text-foreground">
                        — {rev.name}
                      </span>
                      <span className="font-mono text-[11px]">
                        {new Date(rev.createdAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}