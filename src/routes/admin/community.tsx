import React, { useState, useEffect, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Eye,
  ArrowLeft,
  Scroll,
  MessageSquareHeart,
  User,
  Mail,
  MapPin,
  BookOpen,
  Sparkles,
  Star,
  Trash2,
  Save,
  Check,
  X,
  FileText,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type HeritageContributionData,
  type CommunityReview,
  type ContributionStatus,
  CONTRIBUTION_TYPES,
  CONTRIBUTIONS_STORAGE_KEY,
  REVIEWS_STORAGE_KEY,
  CONTRIBUTIONS_EVENT,
  REVIEWS_EVENT,
  DEFAULT_APPROVED_REVIEWS,
} from "@/types/community";

export const Route = createFileRoute("/admin/community")({
  head: () => ({
    meta: [
      { title: "Community Heritage Review — NAVYUVA Admin" },
      {
        name: "description",
        content: "Administrative review and verification portal for NAVYUVA community submissions.",
      },
    ],
  }),
  component: AdminCommunityPage,
});
function AdminCommunityPage() {
  const [activeTab, setActiveTab] = useState<"contributions" | "reviews">("contributions");

  // Contributions state
  const [contributions, setContributions] = useState<HeritageContributionData[]>([]);
  const [contribStatusFilter, setContribStatusFilter] = useState<string>("all");
  const [contribCategoryFilter, setContribCategoryFilter] = useState<string>("all");
  const [contribSearchQuery, setContribSearchQuery] = useState("");
  const [selectedContribution, setSelectedContribution] = useState<HeritageContributionData | null>(null);

  // Review modal state
  const [adminNoteInput, setAdminNoteInput] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectionReasonInput, setRejectionReasonInput] = useState("");
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);

  // Reviews state
  const [reviews, setReviews] = useState<CommunityReview[]>([]);
  const [reviewStatusFilter, setReviewStatusFilter] = useState<string>("all");
  const [reviewSearchQuery, setReviewSearchQuery] = useState("");

  // Load contributions and reviews
  const loadData = () => {
    try {
      const storedContribs = localStorage.getItem(CONTRIBUTIONS_STORAGE_KEY);
      if (storedContribs) {
        const parsed = JSON.parse(storedContribs);
        if (Array.isArray(parsed)) {
          setContributions(parsed);
        }
      } else {
        setContributions([]);
      }
    } catch {
      setContributions([]);
    }

    try {
      const storedReviews = localStorage.getItem(REVIEWS_STORAGE_KEY);
      if (storedReviews) {
        const parsed = JSON.parse(storedReviews);
        if (Array.isArray(parsed)) {
          setReviews(parsed);
        }
      } else {
        setReviews(DEFAULT_APPROVED_REVIEWS);
      }
    } catch {
      setReviews(DEFAULT_APPROVED_REVIEWS);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener(CONTRIBUTIONS_EVENT, loadData);
    window.addEventListener(REVIEWS_EVENT, loadData);
    window.addEventListener("storage", loadData);

    return () => {
      window.removeEventListener(CONTRIBUTIONS_EVENT, loadData);
      window.removeEventListener(REVIEWS_EVENT, loadData);
      window.removeEventListener("storage", loadData);
    };
  }, []);

  // Sync selected contribution changes
  useEffect(() => {
    if (selectedContribution) {
      setAdminNoteInput(selectedContribution.adminNote ?? "");
      setRejectionReasonInput(selectedContribution.rejectionReason ?? "");
    }
  }, [selectedContribution]);

  // Statistics calculation
  const stats = useMemo(() => {
    const totalContrib = contributions.length;
    const pendingContrib = contributions.filter(
      (c) => c.status === "pending" || c.status === "under_review",
    ).length;
    const approvedContrib = contributions.filter((c) => c.status === "approved").length;
    const rejectedContrib = contributions.filter((c) => c.status === "rejected").length;

    const totalRev = reviews.length;
    const pendingRev = reviews.filter((r) => r.status === "pending").length;
    const approvedRev = reviews.filter((r) => r.status === "approved").length;
    const rejectedRev = reviews.filter((r) => r.status === "rejected").length;

    return {
      totalContrib,
      pendingContrib,
      approvedContrib,
      rejectedContrib,
      totalRev,
      pendingRev,
      approvedRev,
      rejectedRev,
    };
  }, [contributions, reviews]);

  // Filtered contributions
  const filteredContributions = useMemo(() => {
    return contributions.filter((c) => {
      // Status filter
      if (contribStatusFilter === "pending") {
        if (c.status !== "pending" && c.status !== "under_review") return false;
      } else if (contribStatusFilter !== "all" && c.status !== contribStatusFilter) {
        return false;
      }

      // Category filter
      if (contribCategoryFilter !== "all" && c.type !== contribCategoryFilter) {
        return false;
      }

      // Search query
      if (contribSearchQuery.trim()) {
        const q = contribSearchQuery.toLowerCase();
        const matchesId = c.id.toLowerCase().includes(q);
        const matchesTitle = c.title.toLowerCase().includes(q);
        const matchesName = c.name.toLowerCase().includes(q);
        const matchesCategory = c.type.toLowerCase().includes(q);
        const matchesLoc = (c.location ?? "").toLowerCase().includes(q);
        if (!matchesId && !matchesTitle && !matchesName && !matchesCategory && !matchesLoc) {
          return false;
        }
      }

      return true;
    });
  }, [contributions, contribStatusFilter, contribCategoryFilter, contribSearchQuery]);

  // Filtered reviews
  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      if (reviewStatusFilter !== "all" && r.status !== reviewStatusFilter) {
        return false;
      }
      if (reviewSearchQuery.trim()) {
        const q = reviewSearchQuery.toLowerCase();
        const matchesName = r.name.toLowerCase().includes(q);
        const matchesMsg = r.message.toLowerCase().includes(q);
        const matchesId = r.id.toLowerCase().includes(q);
        if (!matchesName && !matchesMsg && !matchesId) return false;
      }
      return true;
    });
  }, [reviews, reviewStatusFilter, reviewSearchQuery]);

  // Save updated contribution
  const updateContributionStatus = (
    id: string,
    newStatus: ContributionStatus,
    reason?: string,
    note?: string,
  ) => {
    const updated = contributions.map((c) => {
      if (c.id === id) {
        return {
          ...c,
          status: newStatus,
          rejectionReason: reason !== undefined ? reason : c.rejectionReason,
          adminNote: note !== undefined ? note : c.adminNote,
          reviewedAt: new Date().toISOString(),
        };
      }
      return c;
    });

    localStorage.setItem(CONTRIBUTIONS_STORAGE_KEY, JSON.stringify(updated));
    setContributions(updated);
    window.dispatchEvent(new CustomEvent(CONTRIBUTIONS_EVENT));

    const updatedSelected = updated.find((c) => c.id === id) || null;
    setSelectedContribution(updatedSelected);
    setShowApproveConfirm(false);
    setIsRejecting(false);
  };

  const handleSaveAdminNote = (id: string) => {
    const updated = contributions.map((c) => {
      if (c.id === id) {
        return {
          ...c,
          adminNote: adminNoteInput.trim(),
        };
      }
      return c;
    });

    localStorage.setItem(CONTRIBUTIONS_STORAGE_KEY, JSON.stringify(updated));
    setContributions(updated);
    window.dispatchEvent(new CustomEvent(CONTRIBUTIONS_EVENT));

    if (selectedContribution && selectedContribution.id === id) {
      setSelectedContribution({
        ...selectedContribution,
        adminNote: adminNoteInput.trim(),
      });
    }
  };

  // Review status actions
  const updateReviewStatus = (id: string, newStatus: "approved" | "rejected") => {
    const updated = reviews.map((r) => {
      if (r.id === id) {
        return {
          ...r,
          status: newStatus,
          reviewedAt: new Date().toISOString(),
        };
      }
      return r;
    });

    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(updated));
    setReviews(updated);
    window.dispatchEvent(new CustomEvent(REVIEWS_EVENT));
  };

  const deleteReview = (id: string) => {
    const updated = reviews.filter((r) => r.id !== id);
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(updated));
    setReviews(updated);
    window.dispatchEvent(new CustomEvent(REVIEWS_EVENT));
  };

  // Demo helper: seed sample submission if empty
  const handleSeedDemoData = () => {
    const sampleSubmissions: HeritageContributionData[] = [
      {
        id: "NV-DEMO-001",
        name: "Rajesh Varma",
        email: "rajesh.varma@heritage.org",
        type: "Historical Monument",
        title: "Rani ki Vav Stepwell Hydraulic Architecture",
        message:
          "Rani ki Vav in Patan, Gujarat, was constructed during the Chaulukya dynasty (c. 1063 CE) by Queen Udayamati. It is designed as an inverted temple highlighting the sanctity of water, with seven levels of stairs and over 500 principal sculptures.",
        location: "Patan, Gujarat, India",
        source: "ASI Monograph 2014 & UNESCO World Heritage Dossier",
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        status: "pending",
        adminNote: "Source appears credible. Excellent candidate for future Monument archive.",
      },
      {
        id: "NV-DEMO-002",
        name: "Ananya Deshmukh",
        email: "ananya.archaeology@gmail.com",
        type: "Archaeological Site",
        title: "Dholavira Ancient Water Reservoirs & Cascades",
        message:
          "Dholavira in Khadir Bet features one of the world's earliest sophisticated water conservation systems, with 16 stone reservoirs and storm-water channels cut directly into the bedrock.",
        location: "Kutch, Gujarat, India",
        source: "Archaeological Survey of India Excavation Reports",
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
        status: "approved",
        adminNote: "Verified against ASI reports.",
        reviewedAt: new Date().toISOString(),
      },
      {
        id: "NV-DEMO-003",
        name: "Vikram Sengupta",
        email: "vikram.s@historybuff.in",
        type: "Artifact",
        title: "Chola Lost-Wax Bronze Nataraja Metallurgy",
        message:
          "10th century Chola bronze casting using the Madhuchishtavidhana (cire perdue) process produced spiritually dynamic sculptures with precise metallurgical alloy compositions (Panchaloha).",
        location: "Thanjavur, Tamil Nadu",
        source: "National Museum New Delhi Art Catalogue",
        createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
        status: "pending",
      },
    ];

    localStorage.setItem(CONTRIBUTIONS_STORAGE_KEY, JSON.stringify(sampleSubmissions));
    setContributions(sampleSubmissions);
    window.dispatchEvent(new CustomEvent(CONTRIBUTIONS_EVENT));
  };
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Admin Demo Header Banner */}
      <div className="border-b border-primary/20 bg-stone-950/90 px-4 py-2 text-xs backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2 text-gold">
            <ShieldAlert className="h-4 w-4" />
            <span className="font-serif font-bold uppercase tracking-wider">
              NAVYUVA Heritage Archive Moderation Desk
            </span>
            <span className="rounded bg-primary/20 px-2 py-0.5 font-mono text-[10px] text-primary">
              Demo Admin Portal
            </span>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Public Site</span>
          </Link>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Title & Subtitle */}
        <div className="flex flex-col justify-between gap-4 border-b border-border/50 pb-6 md:flex-row md:items-end">
          <div>
            <span className="font-serif text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              Administration & Curation
            </span>
            <h1 className="mt-1 font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Community Heritage Review
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Review, verify, and curate contributions submitted by the NAVYUVA community.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {contributions.length === 0 && (
              <Button
                onClick={handleSeedDemoData}
                variant="outline"
                size="sm"
                className="gap-1.5 border-primary/40 text-primary hover:bg-primary hover:text-black"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Load Sample Demo Data
              </Button>
            )}
            <div className="rounded-lg border border-border/60 bg-stone-900/80 px-3 py-1.5 text-right font-mono text-xs">
              <span className="text-stone-400">Total Submissions:</span>{" "}
              <strong className="text-primary">{stats.totalContrib + stats.totalRev}</strong>
            </div>
          </div>
        </div>

        {/* Statistics Metric Cards */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {/* Card 1: Total Contributions */}
          <div className="rounded-xl border border-border/60 bg-stone-950/80 p-4 backdrop-blur-sm">
            <span className="font-serif text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Total Contributions
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-serif text-2xl font-bold text-foreground sm:text-3xl">
                {stats.totalContrib}
              </span>
              <Scroll className="h-5 w-5 text-primary/60" />
            </div>
          </div>

          {/* Card 2: Pending Review */}
          <div className="relative overflow-hidden rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="font-serif text-[11px] font-semibold uppercase tracking-wider text-amber-400">
                Pending Review
              </span>
              {stats.pendingContrib > 0 && (
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                </span>
              )}
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-serif text-2xl font-bold text-amber-300 sm:text-3xl">
                {stats.pendingContrib}
              </span>
              <Clock className="h-5 w-5 text-amber-400/70" />
            </div>
            {stats.pendingContrib > 0 && (
              <p className="mt-1 text-[10px] text-amber-400/80">
                New contributions awaiting verification
              </p>
            )}
          </div>

          {/* Card 3: Approved */}
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 backdrop-blur-sm">
            <span className="font-serif text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
              Approved
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-serif text-2xl font-bold text-emerald-300 sm:text-3xl">
                {stats.approvedContrib}
              </span>
              <CheckCircle2 className="h-5 w-5 text-emerald-400/70" />
            </div>
          </div>

          {/* Card 4: Rejected */}
          <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-4 backdrop-blur-sm">
            <span className="font-serif text-[11px] font-semibold uppercase tracking-wider text-rose-400">
              Rejected
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-serif text-2xl font-bold text-rose-300 sm:text-3xl">
                {stats.rejectedContrib}
              </span>
              <XCircle className="h-5 w-5 text-rose-400/70" />
            </div>
          </div>
        </div>

        {/* Navigation Tabs (Contributions vs Reviews) */}
        <div className="mt-8 flex border-b border-border/50">
          <button
            onClick={() => setActiveTab("contributions")}
            className={`flex items-center gap-2 border-b-2 px-6 py-3 font-serif text-sm font-semibold uppercase tracking-wider transition-colors ${
              activeTab === "contributions"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Scroll className="h-4 w-4" />
            Contributions ({stats.totalContrib})
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`flex items-center gap-2 border-b-2 px-6 py-3 font-serif text-sm font-semibold uppercase tracking-wider transition-colors ${
              activeTab === "reviews"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <MessageSquareHeart className="h-4 w-4" />
            Reviews & Feedback ({stats.totalRev})
            {stats.pendingRev > 0 && (
              <span className="rounded-full bg-amber-500/20 px-2 py-0.5 font-mono text-[10px] text-amber-400">
                {stats.pendingRev} pending
              </span>
            )}
          </button>
        </div>
        {/* TAB 1: CONTRIBUTIONS */}
        {activeTab === "contributions" && (
          <div className="mt-6 space-y-6">
            {/* Filter & Search Bar */}
            <div className="flex flex-col gap-4 rounded-xl border border-border/50 bg-stone-950/70 p-4 sm:flex-row sm:items-center sm:justify-between">
              {/* Status Filter Buttons */}
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: "all", label: "All" },
                  { id: "pending", label: "Under Review" },
                  { id: "approved", label: "Approved" },
                  { id: "rejected", label: "Rejected" },
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setContribStatusFilter(st.id)}
                    className={`rounded-lg px-3 py-1.5 font-serif text-xs font-semibold uppercase tracking-wider transition-all ${
                      contribStatusFilter === st.id
                        ? "bg-primary text-black"
                        : "bg-stone-900 text-stone-400 hover:bg-stone-800 hover:text-foreground"
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>

              {/* Category Dropdown & Search Input */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Select
                  value={contribCategoryFilter}
                  onValueChange={setContribCategoryFilter}
                >
                  <SelectTrigger className="h-9 w-[180px] border-border/60 bg-stone-900 text-xs">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent className="border-border bg-stone-950 text-foreground">
                    <SelectItem value="all">All Categories</SelectItem>
                    {CONTRIBUTION_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    value={contribSearchQuery}
                    onChange={(e) => setContribSearchQuery(e.target.value)}
                    placeholder="Search ID, title, name..."
                    className="h-9 border-border/60 bg-stone-900 pl-8 text-xs"
                  />
                  {contribSearchQuery && (
                    <button
                      onClick={() => setContribSearchQuery("")}
                      className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Contributions Table / Cards */}
            {filteredContributions.length === 0 ? (
              <div className="rounded-xl border border-border/50 bg-stone-950/60 p-12 text-center">
                <Scroll className="mx-auto h-10 w-10 text-muted-foreground/40" />
                <h3 className="mt-3 font-serif text-base font-bold text-foreground">
                  No Contributions Found
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {contributions.length === 0
                    ? "No community contributions submitted yet."
                    : "No contributions match the selected filter criteria."}
                </p>
                {contributions.length === 0 && (
                  <Button
                    onClick={handleSeedDemoData}
                    variant="outline"
                    size="sm"
                    className="mt-4 gap-1.5 border-primary/40 text-primary hover:bg-primary hover:text-black"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Load Sample Demo Data
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-border/60 bg-stone-950/80 shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-border/50 bg-stone-900/90 font-serif text-[11px] uppercase tracking-wider text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3.5 font-semibold">Ref ID</th>
                        <th className="px-4 py-3.5 font-semibold">Date</th>
                        <th className="px-4 py-3.5 font-semibold">Contributor</th>
                        <th className="px-4 py-3.5 font-semibold">Category</th>
                        <th className="px-4 py-3.5 font-semibold">Title</th>
                        <th className="px-4 py-3.5 font-semibold">Location</th>
                        <th className="px-4 py-3.5 font-semibold">Status</th>
                        <th className="px-4 py-3.5 text-right font-semibold">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {filteredContributions.map((item) => {
                        const isPending = item.status === "pending" || item.status === "under_review";
                        const isApproved = item.status === "approved";
                        const isRejected = item.status === "rejected";

                        return (
                          <tr
                            key={item.id}
                            className="transition-colors hover:bg-stone-900/50"
                          >
                            <td className="whitespace-nowrap px-4 py-3.5 font-mono text-stone-300">
                              {item.id}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3.5 text-muted-foreground">
                              {new Date(item.createdAt).toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                              })}
                            </td>
                            <td className="px-4 py-3.5 font-medium text-foreground">
                              {item.name}
                            </td>
                            <td className="px-4 py-3.5">
                              <span className="inline-block rounded border border-primary/20 bg-stone-900 px-2 py-0.5 font-serif text-[10px] text-primary">
                                {item.type}
                              </span>
                            </td>
                            <td className="max-w-[220px] truncate px-4 py-3.5 font-medium text-foreground">
                              {item.title}
                            </td>
                            <td className="max-w-[140px] truncate px-4 py-3.5 text-stone-400">
                              {item.location || "—"}
                            </td>
                            <td className="px-4 py-3.5">
                              {isPending && (
                                <span className="inline-flex items-center gap-1 rounded border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-amber-400">
                                  <Clock className="h-3 w-3" />
                                  UNDER REVIEW
                                </span>
                              )}
                              {isApproved && (
                                <span className="inline-flex items-center gap-1 rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-emerald-400">
                                  <CheckCircle2 className="h-3 w-3" />
                                  APPROVED
                                </span>
                              )}
                              {isRejected && (
                                <span className="inline-flex items-center gap-1 rounded border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-rose-400">
                                  <XCircle className="h-3 w-3" />
                                  REJECTED
                                </span>
                              )}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3.5 text-right">
                              <Button
                                onClick={() => setSelectedContribution(item)}
                                size="sm"
                                variant="outline"
                                className="h-7 gap-1 border-primary/30 text-primary hover:bg-primary hover:text-black"
                              >
                                <Eye className="h-3.5 w-3.5" />
                                Inspect
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
        {/* TAB 2: REVIEWS */}
        {activeTab === "reviews" && (
          <div className="mt-6 space-y-6">
            {/* Review Filter Bar */}
            <div className="flex flex-col gap-4 rounded-xl border border-border/50 bg-stone-950/70 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: "all", label: "All Reviews" },
                  { id: "pending", label: "Pending" },
                  { id: "approved", label: "Approved (Public)" },
                  { id: "rejected", label: "Rejected" },
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setReviewStatusFilter(st.id)}
                    className={`rounded-lg px-3 py-1.5 font-serif text-xs font-semibold uppercase tracking-wider transition-all ${
                      reviewStatusFilter === st.id
                        ? "bg-primary text-black"
                        : "bg-stone-900 text-stone-400 hover:bg-stone-800 hover:text-foreground"
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  value={reviewSearchQuery}
                  onChange={(e) => setReviewSearchQuery(e.target.value)}
                  placeholder="Search reviewer or text..."
                  className="h-9 border-border/60 bg-stone-900 pl-8 text-xs"
                />
              </div>
            </div>

            {/* Review Grid Cards */}
            {filteredReviews.length === 0 ? (
              <div className="rounded-xl border border-border/50 bg-stone-950/60 p-12 text-center">
                <MessageSquareHeart className="mx-auto h-10 w-10 text-muted-foreground/40" />
                <h3 className="mt-3 font-serif text-base font-bold text-foreground">
                  No Reviews Found
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  No community reviews match your filter selection.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredReviews.map((rev) => {
                  const isPending = rev.status === "pending";
                  const isApproved = rev.status === "approved";
                  const isRejected = rev.status === "rejected";

                  return (
                    <div
                      key={rev.id}
                      className="flex flex-col justify-between rounded-xl border border-border/60 bg-stone-950/80 p-5 shadow-md transition-all hover:border-primary/40"
                    >
                      <div>
                        {/* Top: Stars & Status */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-0.5 text-gold">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3.5 w-3.5 ${
                                  i < rev.rating
                                    ? "fill-gold text-gold"
                                    : "text-stone-700"
                                }`}
                              />
                            ))}
                          </div>

                          {isPending && (
                            <span className="rounded border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-amber-400">
                              PENDING
                            </span>
                          )}
                          {isApproved && (
                            <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-emerald-400">
                              APPROVED (PUBLIC)
                            </span>
                          )}
                          {isRejected && (
                            <span className="rounded border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-rose-400">
                              REJECTED
                            </span>
                          )}
                        </div>

                        {/* Message */}
                        <p className="mt-3 text-xs leading-relaxed text-stone-200">
                          &ldquo;{rev.message}&rdquo;
                        </p>

                        {/* Reviewer Details */}
                        <div className="mt-4 border-t border-border/30 pt-3 text-[11px] text-muted-foreground">
                          <div className="font-serif font-semibold text-foreground">
                            {rev.name}
                          </div>
                          {rev.email && (
                            <div className="text-stone-500">{rev.email}</div>
                          )}
                          <div className="mt-1 font-mono text-[10px] text-stone-500">
                            {new Date(rev.createdAt).toLocaleString()}
                          </div>
                        </div>
                      </div>

                      {/* Admin Moderation Actions */}
                      <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-3">
                        <div className="flex items-center gap-1.5">
                          {rev.status !== "approved" && (
                            <Button
                              onClick={() => updateReviewStatus(rev.id, "approved")}
                              size="sm"
                              className="h-7 bg-emerald-600 font-serif text-[11px] text-white hover:bg-emerald-500"
                            >
                              <Check className="mr-1 h-3 w-3" />
                              Approve
                            </Button>
                          )}
                          {rev.status !== "rejected" && (
                            <Button
                              onClick={() => updateReviewStatus(rev.id, "rejected")}
                              size="sm"
                              variant="outline"
                              className="h-7 border-rose-500/40 font-serif text-[11px] text-rose-400 hover:bg-rose-950"
                            >
                              <X className="mr-1 h-3 w-3" />
                              Reject
                            </Button>
                          )}
                        </div>

                        <button
                          onClick={() => deleteReview(rev.id)}
                          className="text-stone-500 transition-colors hover:text-rose-400"
                          title="Delete review"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* CONTRIBUTION DETAIL MODAL / DRAWER */}
        {selectedContribution && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-primary/30 bg-stone-950 p-6 shadow-2xl sm:p-8">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-border/50 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-primary">
                      {selectedContribution.id}
                    </span>
                    <span className="rounded border border-primary/20 bg-stone-900 px-2 py-0.5 font-serif text-[10px] text-primary">
                      {selectedContribution.type}
                    </span>
                  </div>
                  <h3 className="mt-1 font-serif text-xl font-bold text-foreground sm:text-2xl">
                    {selectedContribution.title}
                  </h3>
                </div>

                <button
                  onClick={() => {
                    setSelectedContribution(null);
                    setShowApproveConfirm(false);
                    setIsRejecting(false);
                  }}
                  className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-stone-900 hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Status Banner */}
              <div className="mt-4 flex items-center justify-between rounded-lg border border-border/50 bg-stone-900/60 p-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Current Moderation Status:</span>
                  {selectedContribution.status === "pending" || selectedContribution.status === "under_review" ? (
                    <span className="inline-flex items-center gap-1 font-mono font-semibold text-amber-400">
                      <Clock className="h-3.5 w-3.5" />
                      UNDER REVIEW
                    </span>
                  ) : selectedContribution.status === "approved" ? (
                    <span className="inline-flex items-center gap-1 font-mono font-semibold text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      APPROVED
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 font-mono font-semibold text-rose-400">
                      <XCircle className="h-3.5 w-3.5" />
                      REJECTED
                    </span>
                  )}
                </div>

                <span className="font-mono text-stone-500 text-[11px]">
                  Submitted: {new Date(selectedContribution.createdAt).toLocaleString()}
                </span>
              </div>

              {/* Metadata Grid */}
              <div className="mt-4 grid gap-3 rounded-lg border border-border/40 bg-stone-900/30 p-4 text-xs sm:grid-cols-2">
                <div className="flex items-center gap-2 text-stone-300">
                  <User className="h-4 w-4 text-primary/70 shrink-0" />
                  <span>
                    Contributor: <strong className="text-foreground">{selectedContribution.name}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-stone-300">
                  <Mail className="h-4 w-4 text-primary/70 shrink-0" />
                  <span>
                    Email: <span className="text-foreground">{selectedContribution.email || "Not provided"}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-stone-300">
                  <MapPin className="h-4 w-4 text-primary/70 shrink-0" />
                  <span>
                    Location: <span className="text-foreground">{selectedContribution.location || "Not specified"}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-stone-300">
                  <BookOpen className="h-4 w-4 text-primary/70 shrink-0" />
                  <span>
                    Source: <span className="text-foreground">{selectedContribution.source || "None provided"}</span>
                  </span>
                </div>
              </div>

              {/* Historical Information Text */}
              <div className="mt-5 space-y-2">
                <label className="flex items-center gap-1.5 font-serif text-xs font-semibold uppercase tracking-wider text-primary">
                  <FileText className="h-4 w-4" />
                  Historical Information / Details
                </label>
                <div className="rounded-xl border border-border/50 bg-stone-900/80 p-4 text-sm leading-relaxed text-stone-200 shadow-inner">
                  {selectedContribution.message}
                </div>
              </div>

              {/* Rejection Reason display if rejected */}
              {selectedContribution.rejectionReason && (
                <div className="mt-4 rounded-lg border border-rose-500/30 bg-rose-950/20 p-3 text-xs text-rose-300">
                  <strong className="font-serif uppercase tracking-wider">Rejection Reason:</strong>{" "}
                  {selectedContribution.rejectionReason}
                </div>
              )}

              {/* Admin Notes Section */}
              <div className="mt-5 space-y-2 border-t border-border/40 pt-4">
                <div className="flex items-center justify-between">
                  <label className="font-serif text-xs font-semibold uppercase tracking-wider text-stone-400">
                    Internal Admin Note <span className="text-[10px] font-normal lowercase">(not visible publicly)</span>
                  </label>
                  <span className="text-[10px] text-stone-500">e.g. &ldquo;Source verified via ASI records&rdquo;</span>
                </div>
                <div className="flex gap-2">
                  <Input
                    value={adminNoteInput}
                    onChange={(e) => setAdminNoteInput(e.target.value)}
                    placeholder="Write internal curation / verification notes..."
                    className="border-border/60 bg-stone-900 text-xs"
                  />
                  <Button
                    onClick={() => handleSaveAdminNote(selectedContribution.id)}
                    size="sm"
                    variant="outline"
                    className="border-border text-xs gap-1"
                  >
                    <Save className="h-3.5 w-3.5" />
                    Save Note
                  </Button>
                </div>
              </div>

              {/* Confirmation Prompts */}
              {showApproveConfirm && (
                <div className="mt-5 rounded-xl border border-emerald-500/40 bg-emerald-950/40 p-4 animate-in fade-in duration-200">
                  <h4 className="font-serif text-sm font-bold text-emerald-400">
                    Approve this contribution?
                  </h4>
                  <p className="mt-1 text-xs text-stone-300">
                    Approving accepts this submission into the verified moderation archive. Note: Contributions are not automatically injected into museum exhibits without editorial review.
                  </p>
                  <div className="mt-3 flex gap-2">
                    <Button
                      onClick={() => updateContributionStatus(selectedContribution.id, "approved", undefined, adminNoteInput)}
                      className="bg-emerald-600 text-white hover:bg-emerald-500 font-serif text-xs font-semibold"
                    >
                      <Check className="mr-1.5 h-3.5 w-3.5" />
                      Confirm Approval
                    </Button>
                    <Button
                      onClick={() => setShowApproveConfirm(false)}
                      variant="outline"
                      className="border-border text-xs"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {isRejecting && (
                <div className="mt-5 rounded-xl border border-rose-500/40 bg-rose-950/40 p-4 animate-in fade-in duration-200">
                  <h4 className="font-serif text-sm font-bold text-rose-400">
                    Reject this contribution
                  </h4>
                  <p className="mt-1 text-xs text-stone-300">
                    Provide an optional reason or note for rejecting this submission:
                  </p>
                  <Input
                    value={rejectionReasonInput}
                    onChange={(e) => setRejectionReasonInput(e.target.value)}
                    placeholder="e.g. Duplicate submission, unverified claim, incorrect historical date..."
                    className="mt-2 border-rose-500/40 bg-stone-900 text-xs"
                  />
                  <div className="mt-3 flex gap-2">
                    <Button
                      onClick={() => updateContributionStatus(selectedContribution.id, "rejected", rejectionReasonInput, adminNoteInput)}
                      className="bg-rose-600 text-white hover:bg-rose-500 font-serif text-xs font-semibold"
                    >
                      <X className="mr-1.5 h-3.5 w-3.5" />
                      Confirm Rejection
                    </Button>
                    <Button
                      onClick={() => setIsRejecting(false)}
                      variant="outline"
                      className="border-border text-xs"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {!showApproveConfirm && !isRejecting && (
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border/50 pt-5">
                  <div className="flex flex-wrap items-center gap-2">
                    {selectedContribution.status !== "approved" && (
                      <Button
                        onClick={() => setShowApproveConfirm(true)}
                        className="bg-emerald-600 font-serif text-xs font-semibold text-white hover:bg-emerald-500 gap-1.5"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Approve Contribution
                      </Button>
                    )}

                    {selectedContribution.status !== "rejected" && (
                      <Button
                        onClick={() => setIsRejecting(true)}
                        variant="outline"
                        className="border-rose-500/40 font-serif text-xs font-semibold text-rose-400 hover:bg-rose-950/60 gap-1.5"
                      >
                        <XCircle className="h-4 w-4" />
                        Reject Contribution
                      </Button>
                    )}

                    {selectedContribution.status !== "pending" && selectedContribution.status !== "under_review" && (
                      <Button
                        onClick={() => updateContributionStatus(selectedContribution.id, "pending", "", adminNoteInput)}
                        variant="outline"
                        className="border-border text-xs gap-1.5 text-stone-300"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        Reopen to Review
                      </Button>
                    )}
                  </div>

                  <Button
                    onClick={() => setSelectedContribution(null)}
                    variant="ghost"
                    className="text-muted-foreground text-xs"
                  >
                    Close
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
