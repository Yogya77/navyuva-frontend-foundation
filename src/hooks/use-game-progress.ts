import { useState, useEffect, useCallback } from "react";

export interface GameScoreRecord {
  score: number;
  maxScore: number;
  accuracy: number;
  completedAt: string;
}

export interface GameProgressState {
  completedGameIds: string[];
  gameScores: Record<string, GameScoreRecord>;
  unlockedArtifactIds: string[];
  cluesCollected: number;
  totalScore: number;
}

export interface GameRewardPayload {
  artifactId?: string | undefined;
  clueCount?: number | undefined;
}

const STORAGE_KEY = "navyuva_heritage_progress_v1";
const PROGRESS_EVENT = "navyuva:progress-changed";

// Default starter state: Curated Harappan photographic exhibits unlocked
const DEFAULT_STATE: GameProgressState = {
  completedGameIds: [],
  gameScores: {},
  unlockedArtifactIds: [
    "seal",
    "seal-unicorn",
    "seal-seven-figures",
    "seal-confronting-bulls",
    "harappa-tablets",
    "figurine-mother-goddess",
    "figurine-lady-rosettes",
    "figurine-archaic-head",
    "mask-horned",
    "figurine-painted-bearer",
    "figurine-bull-toy",
    "tablet-hunting-plaque",
    "jewelry-royal-necklace",
    "jewelry-bronze-bangles",
    "blade",
  ],
  cluesCollected: 0,
  totalScore: 0,
};

function loadProgressFromStorage(): GameProgressState {
  if (typeof window === "undefined") {
    return DEFAULT_STATE;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    return {
      completedGameIds: Array.isArray(parsed.completedGameIds) ? parsed.completedGameIds : [],
      gameScores: parsed.gameScores || {},
      unlockedArtifactIds: Array.isArray(parsed.unlockedArtifactIds)
        ? parsed.unlockedArtifactIds
        : DEFAULT_STATE.unlockedArtifactIds,
      cluesCollected: typeof parsed.cluesCollected === "number" ? parsed.cluesCollected : 0,
      totalScore: typeof parsed.totalScore === "number" ? parsed.totalScore : 0,
    };
  } catch (err) {
    console.warn("Failed to load NAVYUVA game progress from localStorage:", err);
    return DEFAULT_STATE;
  }
}

function saveProgressToStorage(state: GameProgressState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent(PROGRESS_EVENT, { detail: state }));
  } catch (err) {
    console.warn("Failed to save NAVYUVA game progress to localStorage:", err);
  }
}

export function useGameProgress() {
  const [progress, setProgress] = useState<GameProgressState>(loadProgressFromStorage);

  useEffect(() => {
    // Sync with initial client storage
    setProgress(loadProgressFromStorage());

    const handleUpdate = () => {
      setProgress(loadProgressFromStorage());
    };

    window.addEventListener(PROGRESS_EVENT, handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener(PROGRESS_EVENT, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const completeGame = useCallback(
    (gameId: string, score: number, maxScore: number, reward?: GameRewardPayload | undefined) => {
      setProgress((prev) => {
        const accuracy = maxScore > 0 ? Math.round((score / maxScore) * 100) : 100;
        const prevBest = prev.gameScores[gameId]?.score || 0;
        const newScoreRecord: GameScoreRecord = {
          score: Math.max(score, prevBest),
          maxScore,
          accuracy,
          completedAt: new Date().toISOString(),
        };

        const isNewlyCompleted = !prev.completedGameIds.includes(gameId);
        const nextCompleted = isNewlyCompleted
          ? [...prev.completedGameIds, gameId]
          : prev.completedGameIds;

        const nextUnlockedArtifacts = [...prev.unlockedArtifactIds];
        if (reward?.artifactId && !nextUnlockedArtifacts.includes(reward.artifactId)) {
          nextUnlockedArtifacts.push(reward.artifactId);
        }

        const additionalClues = isNewlyCompleted ? (reward?.clueCount ?? 0) : 0;
        const nextClues = prev.cluesCollected + additionalClues;

        const nextGameScores = {
          ...prev.gameScores,
          [gameId]: newScoreRecord,
        };

        const nextTotalScore = Object.values(nextGameScores).reduce(
          (acc, item) => acc + item.score,
          0,
        );

        const nextState: GameProgressState = {
          completedGameIds: nextCompleted,
          gameScores: nextGameScores,
          unlockedArtifactIds: nextUnlockedArtifacts,
          cluesCollected: nextClues,
          totalScore: nextTotalScore,
        };

        saveProgressToStorage(nextState);
        return nextState;
      });
    },
    [],
  );

  const isArtifactUnlocked = useCallback(
    (artifactId: string): boolean => {
      return progress.unlockedArtifactIds.includes(artifactId);
    },
    [progress.unlockedArtifactIds],
  );

  const isGameCompleted = useCallback(
    (gameId: string): boolean => {
      return progress.completedGameIds.includes(gameId);
    },
    [progress.completedGameIds],
  );

  const getGameScore = useCallback(
    (gameId: string): GameScoreRecord | undefined => {
      return progress.gameScores[gameId];
    },
    [progress.gameScores],
  );

  const resetProgress = useCallback(() => {
    saveProgressToStorage(DEFAULT_STATE);
    setProgress(DEFAULT_STATE);
  }, []);

  return {
    progress,
    completeGame,
    isArtifactUnlocked,
    isGameCompleted,
    getGameScore,
    resetProgress,
  };
}
