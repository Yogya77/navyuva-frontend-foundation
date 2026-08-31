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

export type ContributionStatus = "pending" | "under_review" | "approved" | "rejected";

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
  status: ContributionStatus;
  adminNote?: string | undefined;
  rejectionReason?: string | undefined;
  reviewedAt?: string | undefined;
}

export type ReviewStatus = "pending" | "approved" | "rejected";

export interface CommunityReview {
  id: string;
  name: string;
  email?: string | undefined;
  rating: number; // 1 to 5
  message: string;
  createdAt: string;
  status: ReviewStatus;
  adminNote?: string | undefined;
  rejectionReason?: string | undefined;
  reviewedAt?: string | undefined;
}

export const CONTRIBUTIONS_STORAGE_KEY = "navyuva_community_contributions_v1";
export const REVIEWS_STORAGE_KEY = "navyuva_community_reviews_v1";
export const CONTRIBUTIONS_EVENT = "navyuva:contributions-changed";
export const REVIEWS_EVENT = "navyuva:reviews-changed";

export const DEFAULT_APPROVED_REVIEWS: CommunityReview[] = [
  {
    id: "REV-INIT-001",
    name: "Aarav Sharma",
    rating: 5,
    message:
      "The interactive 3D exploration of the Harappan Great Bath and Steatite Seals is breathtaking! Brilliant digital heritage preservation for history enthusiasts.",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    status: "approved",
  },
  {
    id: "REV-INIT-002",
    name: "Dr. Meenakshi Sundaram",
    rating: 5,
    message:
      "Incredible archaeological fidelity. Showcasing authentic Indus Valley artifacts with high-res photos and curator insights is highly commendable.",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: "approved",
  },
  {
    id: "REV-INIT-003",
    name: "Priya Nair",
    rating: 5,
    message:
      "Such an engaging and immersive initiative for Indian culture. The mystery progression and clues keep learners completely invested in history.",
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    status: "approved",
  },
];