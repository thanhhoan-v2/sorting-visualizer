import { ChevronDownIcon } from "lucide-react";

interface VisualizationProps {
  array: number[];
  comparingIndices: number[];
  sorting: boolean;
  COLOR_COMPARING: string;
  COLOR_SORTING: string;
  COLOR_SORTED: string;
}

export function Visualization({
  array,
  comparingIndices,
  sorting,
  COLOR_COMPARING,
  COLOR_SORTING,
  COLOR_SORTED,
}: VisualizationProps) {
  return (
    <div className="flex justify-center items-end space-x-1 mx-auto max-w-[80vw] h-64">
      {array.map((value: number, idx: number) => (
        <div key={idx} className="flex flex-col items-center">
          {comparingIndices.includes(idx) && <ChevronDownIcon />}
          <div
            className={`w-8 rounded-lg transition-all duration-500 ${
              comparingIndices.includes(idx)
                ? COLOR_COMPARING
                : sorting
                ? COLOR_SORTING
                : COLOR_SORTED
            }`}
            style={{ height: `${value}px` }}
          />
        </div>
      ))}
    </div>
  );
}
