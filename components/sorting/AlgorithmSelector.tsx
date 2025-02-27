import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SortingAlgorithm } from "../types/sorting";

interface AlgorithmSelectorProps {
  algorithm: SortingAlgorithm;
  setAlgorithm: (algorithm: SortingAlgorithm) => void;
  sorting: boolean;
}

export function AlgorithmSelector({
  algorithm,
  setAlgorithm,
  sorting,
}: AlgorithmSelectorProps) {
  return (
    <Select
      value={algorithm}
      onValueChange={(e) => setAlgorithm(e as SortingAlgorithm)}
      disabled={sorting}
    >
      <SelectTrigger className="w-[300px]">
        <SelectValue placeholder="Select an algorithm" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="bubble">Bubble Sort</SelectItem>
        <SelectItem value="quick">Quick Sort</SelectItem>
        <SelectItem value="merge">Merge Sort</SelectItem>
        <SelectItem value="selection">Selection Sort</SelectItem>
        <SelectItem value="insertion">Insertion Sort</SelectItem>
      </SelectContent>
    </Select>
  );
}
