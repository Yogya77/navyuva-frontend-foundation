import { LostSeal3DAdventure } from "./the-lost-seal/three/LostSeal3DAdventure";

interface TheLostSealGameProps {
  onComplete: (score: number, maxScore: number) => void;
  onExit: () => void;
}

export function TheLostSealGame({ onComplete, onExit }: TheLostSealGameProps) {
  return <LostSeal3DAdventure onComplete={onComplete} onExit={onExit} />;
}
