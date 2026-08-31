import React, { useState, useEffect } from "react";
import {
  Landmark,
  Scroll,
  Send,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  BookOpen,
  MapPin,
  FileText,
  User,
  Mail,
  RotateCcw,
  Clock,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SectionHeading } from "@/components/home/SectionHeading";

export const CONTRIBUTION_TYPES = [
  "Historical Monument",
  "Artifact",
  "Historical Event",
  "Civilization",
  "Architecture",
  "Archaeological Site",
  "Historical Figure",
  "Historical Fact",
  "Correction",
  "General Feedback",
  "Other",
] as const;

export type ContributionType = (typeof CONTRIBUTION_TYPES)[number];

export interface HeritageContributionData {
  id: string;
  name: string;
  email: string;
  type: ContributionType;
  title: string;
  message: string;
  location: string;
  source: string;
  createdAt: string;
  status: "pending" | "reviewed" | "approved";
}

interface FormErrors {
  name?: string;
  email?: string;
  type?: string;
  title?: string;
  message?: string;
}

const STORAGE_KEY = "navyuva_community_contributions_v1";

const ARCHIVE_PILLS = [
  "Monuments",
  "Artifacts",
  "Architecture",
  "Civilizations",
  "Stories",
  "Facts",
];

export function HeritageContribution() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState<ContributionType | "">("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [location, setLocation] = useState("");
  const [source, setSource] = useState("");

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmitted, setLastSubmitted] = useState<HeritageContributionData | null>(null);
  const [recentContributions, setRecentContributions] = useState<HeritageContributionData[]>([]);
  const [showRecentDrawer, setShowRecentDrawer] = useState(false);

  // Load existing contributions on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setRecentContributions(parsed);
        }
      }
    } catch {
      // Ignore local storage parse errors
    }
  }, []);

  const clearError = (field: keyof FormErrors) => {
    setErrors((prev) => {
      const updated = { ...prev };
      delete updated[field];
      return updated;
    });
  };

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!name.trim()) {
      errs.name = "Please enter your name.";
    }
    if (!type) {
      errs.type = "Please select a contribution category.";
    }
    if (!title.trim()) {
      errs.title = "Please provide a title or subject.";
    } else if (title.trim().length < 3) {
      errs.title = "Title should be at least 3 characters.";
    }
    if (!message.trim()) {
      errs.message = "Please share the historical information or details.";
    } else if (message.trim().length < 15) {
      errs.message = "Please provide more details (at least 15 characters).";
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

    // Simulate realistic processing transition
    setTimeout(() => {
      const newContribution: HeritageContributionData = {
        id: `NV-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
        name: name.trim(),
        email: email.trim(),
        type: type as ContributionType,
        title: title.trim(),
        message: message.trim(),
        location: location.trim(),
        source: source.trim(),
        createdAt: new Date().toISOString(),
        status: "pending",
      };

      try {
        const existing = localStorage.getItem(STORAGE_KEY);
        const parsed: HeritageContributionData[] = existing ? JSON.parse(existing) : [];
        const updated = [newContribution, ...parsed];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        setRecentContributions(updated);
      } catch {
        // Fallback for private mode or storage limit
      }

      setLastSubmitted(newContribution);
      setIsSubmitting(false);

      // Reset form fields
      setName("");
      setEmail("");
      setType("");
      setTitle("");
      setMessage("");
      setLocation("");
      setSource("");
      setErrors({});
    }, 600);
  };

  const handleResetForm = () => {
    setLastSubmitted(null);
    setErrors({});
  };

  return (
    <section
      id="community-contribution"
      className="relative border-t border-border/50 bg-gradient-to-b from-stone-950 via-background to-black py-24 sm:py-28"
      aria-label="Community Heritage Contribution"
    >
      {/* Decorative ambient backdrop */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-20 right-10 h-72 w-72 rounded-full bg-gold/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Archival Category Badge Row */}
        <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
          {ARCHIVE_PILLS.map((pill, idx) => (
            <React.Fragment key={pill}>
              <span className="inline-flex items-center rounded-full border border-primary/20 bg-stone-900/60 px-3 py-1 font-serif text-[11px] font-medium tracking-wider text-primary backdrop-blur-sm transition-colors hover:border-primary/40 hover:bg-stone-800/80">
                {pill}
              </span>
              {idx < ARCHIVE_PILLS.length - 1 && (
                <span className="text-xs text-primary/40 select-none">•</span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Section Heading */}
        <SectionHeading
          eyebrow="Community Heritage Archive"
          title="Help Us Preserve History"
          subtitle="Know a story, monument, artifact, or historical fact we haven't covered? Share it with us and help expand NAVYUVA's heritage archive."
          className="max-w-3xl"
        />

        {/* Main Contribution Card */}
        <div className="mt-12 overflow-hidden rounded-2xl border border-border/70 bg-stone-950/90 shadow-2xl shadow-black/80 backdrop-blur-md">
          {/* Card Accent Top Bar */}
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

          <div className="p-6 sm:p-10">
            {lastSubmitted ? (
              /* Success State */
              <div className="py-6 text-center animate-in fade-in zoom-in-95 duration-500">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-primary shadow-lg shadow-primary/10">
                  <CheckCircle2 className="h-9 w-9 text-primary animate-in zoom-in duration-300" />
                </div>

                <span className="mt-4 inline-block font-serif text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                  Contribution Received
                </span>

                <h3 className="mt-2 font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  Thank You for Preserving History
                </h3>

                <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Your contribution has been received. Our team can review it for historical accuracy
                  before adding it to the NAVYUVA archive.
                </p>

                {/* Contribution Receipt Card */}
                <div className="mx-auto mt-8 max-w-lg rounded-xl border border-primary/20 bg-stone-900/80 p-5 text-left shadow-inner">
                  <div className="flex items-center justify-between border-b border-border/40 pb-3">
                    <span className="font-mono text-xs text-muted-foreground">
                      Reference ID: <strong className="text-foreground">{lastSubmitted.id}</strong>
                    </span>
                    <span className="inline-flex items-center gap-1 rounded border border-primary/30 bg-primary/10 px-2 py-0.5 font-serif text-[10px] font-semibold text-primary">
                      <Clock className="h-3 w-3" />
                      Status: Under Review
                    </span>
                  </div>

                  <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                    <div>
                      <span className="text-stone-400">Category:</span>{" "}
                      <span className="font-medium text-foreground">{lastSubmitted.type}</span>
                    </div>
                    <div>
                      <span className="text-stone-400">Title:</span>{" "}
                      <span className="font-medium text-foreground">{lastSubmitted.title}</span>
                    </div>
                    {lastSubmitted.location && (
                      <div>
                        <span className="text-stone-400">Location:</span>{" "}
                        <span className="text-foreground">{lastSubmitted.location}</span>
                      </div>
                    )}
                    <p className="mt-2 text-stone-300 line-clamp-3 italic">
                      &ldquo;{lastSubmitted.message}&rdquo;
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Button
                    onClick={handleResetForm}
                    className="gap-2 bg-primary text-black font-semibold hover:bg-primary/90"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Share Another Contribution
                  </Button>

                  {recentContributions.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowRecentDrawer(!showRecentDrawer)}
                      className="border-border text-muted-foreground hover:text-foreground"
                    >
                      <Layers className="mr-2 h-4 w-4" />
                      {showRecentDrawer ? "Hide Archive Feed" : `View Stored Submissions (${recentContributions.length})`}
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              /* Contribution Form State */
              <div>
                {/* Header inside Card */}
                <div className="border-b border-border/40 pb-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/30 bg-stone-900 text-primary">
                      <Landmark className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-serif text-2xl font-bold tracking-wide text-foreground">
                        Share Your Heritage
                      </h3>
                      <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
                        Your knowledge could become part of someone&apos;s journey through Indian history.
                      </p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-6">
                  {/* Grid Row 1: Name & Email */}
                  <div className="grid gap-5 sm:grid-cols-2">
                    {/* FIELD 1: Name */}
                    <div className="space-y-2">
                      <Label htmlFor="contrib-name" className="flex items-center gap-1.5 text-xs font-serif uppercase tracking-wider text-foreground">
                        <User className="h-3.5 w-3.5 text-primary" />
                        Your Name <span className="text-primary">*</span>
                      </Label>
                      <Input
                        id="contrib-name"
                        type="text"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (errors.name) clearError("name");
                        }}
                        placeholder="Your name"
                        disabled={isSubmitting}
                        aria-required="true"
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? "name-error" : undefined}
                        className="border-border/60 bg-stone-900/70 text-foreground placeholder:text-stone-500 focus-visible:border-primary focus-visible:ring-primary/40"
                      />
                      {errors.name && (
                        <p id="name-error" className="text-xs text-destructive">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* FIELD 2: Email */}
                    <div className="space-y-2">
                      <Label htmlFor="contrib-email" className="flex items-center gap-1.5 text-xs font-serif uppercase tracking-wider text-foreground">
                        <Mail className="h-3.5 w-3.5 text-primary/70" />
                        Email Address <span className="text-xs font-normal normal-case text-muted-foreground">(optional)</span>
                      </Label>
                      <Input
                        id="contrib-email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.email) clearError("email");
                        }}
                        placeholder="Your email (optional)"
                        disabled={isSubmitting}
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? "email-error" : undefined}
                        className="border-border/60 bg-stone-900/70 text-foreground placeholder:text-stone-500 focus-visible:border-primary focus-visible:ring-primary/40"
                      />
                      {errors.email && (
                        <p id="email-error" className="text-xs text-destructive">
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Grid Row 2: Contribution Type & Title */}
                  <div className="grid gap-5 sm:grid-cols-2">
                    {/* FIELD 3: Contribution Type */}
                    <div className="space-y-2">
                      <Label htmlFor="contrib-type" className="flex items-center gap-1.5 text-xs font-serif uppercase tracking-wider text-foreground">
                        <Scroll className="h-3.5 w-3.5 text-primary" />
                        Contribution Type <span className="text-primary">*</span>
                      </Label>
                      <Select
                        value={type}
                        onValueChange={(val) => {
                          setType(val as ContributionType);
                          if (errors.type) clearError("type");
                        }}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger
                          id="contrib-type"
                          aria-required="true"
                          aria-invalid={!!errors.type}
                          className="border-border/60 bg-stone-900/70 text-foreground focus:border-primary focus:ring-primary/40"
                        >
                          <SelectValue placeholder="Select contribution category" />
                        </SelectTrigger>
                        <SelectContent className="border-border bg-stone-950 text-foreground">
                          {CONTRIBUTION_TYPES.map((t) => (
                            <SelectItem key={t} value={t} className="focus:bg-stone-900 focus:text-primary">
                              {t}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.type && (
                        <p id="type-error" className="text-xs text-destructive">
                          {errors.type}
                        </p>
                      )}
                    </div>

                    {/* FIELD 4: Title */}
                    <div className="space-y-2">
                      <Label htmlFor="contrib-title" className="flex items-center gap-1.5 text-xs font-serif uppercase tracking-wider text-foreground">
                        <Sparkles className="h-3.5 w-3.5 text-primary" />
                        Title / Subject <span className="text-primary">*</span>
                      </Label>
                      <Input
                        id="contrib-title"
                        type="text"
                        value={title}
                        onChange={(e) => {
                          setTitle(e.target.value);
                          if (errors.title) clearError("title");
                        }}
                        placeholder="e.g. Rani ki Vav, Dholavira Reservoirs, Chola Bronze..."
                        disabled={isSubmitting}
                        aria-required="true"
                        aria-invalid={!!errors.title}
                        aria-describedby={errors.title ? "title-error" : undefined}
                        className="border-border/60 bg-stone-900/70 text-foreground placeholder:text-stone-500 focus-visible:border-primary focus-visible:ring-primary/40"
                      />
                      {errors.title && (
                        <p id="title-error" className="text-xs text-destructive">
                          {errors.title}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Grid Row 3: Location & Source */}
                  <div className="grid gap-5 sm:grid-cols-2">
                    {/* FIELD 6: Location */}
                    <div className="space-y-2">
                      <Label htmlFor="contrib-location" className="flex items-center gap-1.5 text-xs font-serif uppercase tracking-wider text-foreground">
                        <MapPin className="h-3.5 w-3.5 text-primary/70" />
                        Location / Region <span className="text-xs font-normal normal-case text-muted-foreground">(optional)</span>
                      </Label>
                      <Input
                        id="contrib-location"
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="City / State / Country"
                        disabled={isSubmitting}
                        className="border-border/60 bg-stone-900/70 text-foreground placeholder:text-stone-500 focus-visible:border-primary focus-visible:ring-primary/40"
                      />
                    </div>

                    {/* FIELD 7: Source / Reference */}
                    <div className="space-y-2">
                      <Label htmlFor="contrib-source" className="flex items-center gap-1.5 text-xs font-serif uppercase tracking-wider text-foreground">
                        <BookOpen className="h-3.5 w-3.5 text-primary/70" />
                        Source / Reference <span className="text-xs font-normal normal-case text-muted-foreground">(optional)</span>
                      </Label>
                      <Input
                        id="contrib-source"
                        type="text"
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                        placeholder="Book, museum, website, archaeological report, etc."
                        disabled={isSubmitting}
                        className="border-border/60 bg-stone-900/70 text-foreground placeholder:text-stone-500 focus-visible:border-primary focus-visible:ring-primary/40"
                      />
                    </div>
                  </div>

                  {/* FIELD 5: Message / Historical Information */}
                  <div className="space-y-2">
                    <Label htmlFor="contrib-message" className="flex items-center gap-1.5 text-xs font-serif uppercase tracking-wider text-foreground">
                      <FileText className="h-3.5 w-3.5 text-primary" />
                      Historical Information / Details <span className="text-primary">*</span>
                    </Label>
                    <Textarea
                      id="contrib-message"
                      rows={5}
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                        if (errors.message) clearError("message");
                      }}
                      placeholder="Tell us what you know. You can share historical information, sources, stories, locations, artifacts, monuments, corrections, or suggestions..."
                      disabled={isSubmitting}
                      aria-required="true"
                      aria-invalid={!!errors.message}
                      aria-describedby={errors.message ? "message-error" : undefined}
                      className="resize-y border-border/60 bg-stone-900/70 text-foreground placeholder:text-stone-500 focus-visible:border-primary focus-visible:ring-primary/40"
                    />
                    {errors.message && (
                      <p id="message-error" className="text-xs text-destructive">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  {/* Submit & Helper Message */}
                  <div className="flex flex-col items-center justify-between gap-4 border-t border-border/40 pt-6 sm:flex-row">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                      <span>We review community contributions before adding information to NAVYUVA.</span>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting}
                      className="w-full gap-2 bg-primary font-serif font-semibold text-black hover:bg-primary/90 sm:w-auto"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Submit Contribution
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Optional Drawer / Feed of Stored Submissions (Visible when toggled) */}
        {showRecentDrawer && recentContributions.length > 0 && (
          <div className="mt-8 rounded-xl border border-border/60 bg-stone-950/80 p-6 backdrop-blur-sm animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-primary">
                Community Contribution Submissions ({recentContributions.length})
              </h4>
              <span className="font-mono text-xs text-muted-foreground">
                Stored in Local Archive
              </span>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {recentContributions.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg border border-border/40 bg-stone-900/60 p-3 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-foreground">{item.title}</span>
                    <span className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-[10px] text-primary">
                      {item.type}
                    </span>
                  </div>
                  <p className="mt-1 text-muted-foreground line-clamp-2">{item.message}</p>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-stone-500">
                    <span>By: {item.name}</span>
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}