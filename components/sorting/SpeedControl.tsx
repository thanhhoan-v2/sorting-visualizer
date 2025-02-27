import { Slider } from "@/components/ui/slider";

interface SpeedControlProps {
  speed: number;
  setSpeed: (speed: number) => void;
  sorting: boolean;
}

export function SpeedControl({ speed, setSpeed, sorting }: SpeedControlProps) {
  return (
    <div className="flex flex-col items-center gap-2 mx-auto max-w-xs">
      <h1 className="font-medium text-sm">Animation Speed</h1>
      <Slider
        value={[speed]}
        onValueChange={(value) => setSpeed(value[0])}
        min={1}
        max={99}
        step={1}
        disabled={sorting}
        className="w-full"
      />
      <div className="flex justify-between w-full text-gray-500 text-xs">
        <span className="text-2xl">🐢</span>
        <span className="text-2xl">🐇</span>
        <span className="text-2xl">🐆</span>
      </div>
    </div>
  );
}
