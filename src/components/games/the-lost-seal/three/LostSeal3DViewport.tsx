import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from "react";
import { Compass, Box } from "lucide-react";
import { ThreeLostSealEngine } from "./ThreeLostSealEngine";
import type { InteractiveEntity3D } from "./types3D";

export interface LostSeal3DViewportRef {
  markEntityInspected: (id: string) => void;
  openGate: (gateId: string) => void;
}

interface LostSeal3DViewportProps {
  onInteract: (entity: InteractiveEntity3D) => void;
  isModalOpen: boolean;
}

export const LostSeal3DViewport = forwardRef<LostSeal3DViewportRef, LostSeal3DViewportProps>(
  ({ onInteract, isModalOpen }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const engineRef = useRef<ThreeLostSealEngine | null>(null);
    const [nearbyEntity, setNearbyEntity] = useState<InteractiveEntity3D | null>(null);

    useImperativeHandle(ref, () => ({
      markEntityInspected: (id: string) => {
        engineRef.current?.markEntityInspected(id);
      },
      openGate: (gateId: string) => {
        engineRef.current?.openGate(gateId);
      },
    }));

    useEffect(() => {
      if (!canvasRef.current) return;

      const engine = new ThreeLostSealEngine(canvasRef.current, {
        onNearbyEntityChange: (ent) => {
          setNearbyEntity(ent);
        },
        onInteract: (ent) => {
          onInteract(ent);
        },
      });

      engineRef.current = engine;

      return () => {
        engine.destroy();
        engineRef.current = null;
      };
    }, [onInteract]);

    useEffect(() => {
      engineRef.current?.setModalOpen(isModalOpen);
    }, [isModalOpen]);

    return (
      <div className="relative w-full overflow-hidden rounded-3xl border-2 border-primary/50 bg-[#120d09] shadow-2xl">
        <canvas
          ref={canvasRef}
          className="w-full h-[520px] sm:h-[600px] block cursor-crosshair focus:outline-none"
          tabIndex={0}
        />

        {/* 3D Contextual Interaction Prompt Overlay */}
        {nearbyEntity && !isModalOpen && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-16 pointer-events-none z-20 animate-bounce">
            <div className="flex items-center gap-2 rounded-xl border border-primary bg-black/90 px-4 py-2 text-xs font-bold text-foreground shadow-2xl backdrop-blur-md">
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-primary text-black font-mono text-[11px]">
                E
              </span>
              <span className="text-gold font-serif">{nearbyEntity.promptLabel}</span>
            </div>
          </div>
        )}

        {/* Top-Right 3D Engine Badge */}
        <div className="absolute top-3 right-3 pointer-events-none z-10 flex items-center gap-1.5 rounded-full border border-primary/40 bg-black/75 px-3 py-1 text-[11px] font-semibold text-primary backdrop-blur-md shadow-md">
          <Box className="h-3.5 w-3.5 text-gold animate-pulse" />
          <span>WebGL 3D Engine • 60 FPS</span>
        </div>

        {/* Bottom Control Helpers bar overlay */}
        <div className="absolute bottom-3 inset-x-3 pointer-events-none flex items-center justify-between z-10">
          <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-black/80 px-3.5 py-1.5 backdrop-blur-md text-[11px] text-muted-foreground shadow-lg">
            <span className="font-mono text-primary font-bold">WASD / Arrow Keys</span>
            <span>— 3D Movement</span>
            <span className="mx-1 opacity-40">|</span>
            <span className="font-mono text-gold font-bold">[E]</span>
            <span>— Interact When Near</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 rounded-xl border border-primary/30 bg-black/80 px-3 py-1.5 backdrop-blur-md text-[11px] text-primary shadow-lg">
            <Compass className="h-3.5 w-3.5" />
            <span>Third-Person 3D Expedition</span>
          </div>
        </div>
      </div>
    );
  },
);

LostSeal3DViewport.displayName = "LostSeal3DViewport";
