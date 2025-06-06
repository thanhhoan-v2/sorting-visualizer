"use client";

import { AlgorithmSelector } from "@/components/sorting/AlgorithmSelector";
import { SpeedControl } from "@/components/sorting/SpeedControl";
import { Visualization } from "@/components/sorting/Visualization";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Dock, DockIcon, DockItem, DockLabel } from "@/components/ui/dock";
import { BookOpenTextIcon, PauseIcon, PlayIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type SortingAlgorithm =
	| "bubble"
	| "quick"
	| "merge"
	| "selection"
	| "insertion"
	| "heap"
	| "radix"
	| "counting"
	| "bucket"
	| "shell";

const ARRAY_SIZE = 20;
const COLOR_COMPARING = "bg-red-400";
const COLOR_SORTING = "bg-gray-400";
const COLOR_SORTED = "bg-green-400";

const dockIcons = [
	{
		title: "Algorithm Info",
		icon: (
			<BookOpenTextIcon className="w-full h-full text-neutral-600 dark:text-neutral-300" />
		),
		href: "#",
	},
	{
		title: "Start visualize",
		icon: (
			<PlayIcon className="w-full h-full text-neutral-600 dark:text-neutral-400" />
		),
		href: "#",
		action: "start", // Add this to identify the action
	},
];

const algorithmInfo = {
	bubble: {
		title: "Bubble Sort",
		description:
			"Bubble Sort is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
		timeComplexity: "O(n²)",
		spaceComplexity: "O(1)",
	},
	quick: {
		title: "Quick Sort",
		description:
			"Quick Sort is an efficient, in-place sorting algorithm that uses a divide-and-conquer strategy to sort elements. It works by selecting a 'pivot' element and partitioning the other elements into two sub-arrays.",
		timeComplexity: "O(n log n)",
		spaceComplexity: "O(log n)",
	},
	merge: {
		title: "Merge Sort",
		description:
			"Merge Sort is a divide-and-conquer algorithm that recursively breaks down a problem into smaller, more manageable subproblems until they become simple enough to solve directly.",
		timeComplexity: "O(n log n)",
		spaceComplexity: "O(n)",
	},
	selection: {
		title: "Selection Sort",
		description:
			"Selection Sort divides the input list into a sorted and an unsorted region. It repeatedly selects the smallest element from the unsorted region and adds it to the sorted region.",
		timeComplexity: "O(n²)",
		spaceComplexity: "O(1)",
	},
	insertion: {
		title: "Insertion Sort",
		description:
			"Insertion Sort builds the final sorted array one item at a time. It iterates through an input array and removes one element per iteration, finds the place the element belongs in the array, and inserts it there.",
		timeComplexity: "O(n²)",
		spaceComplexity: "O(1)",
	},
	heap: {
		title: "Heap Sort",
		description:
			"Heap Sort uses a binary heap data structure to sort elements. It first builds a max heap from the input data, then repeatedly extracts the maximum element from the heap and places it at the end of the sorted array.",
		timeComplexity: "O(n log n)",
		spaceComplexity: "O(1)",
	},
	radix: {
		title: "Radix Sort",
		description:
			"Radix Sort is a non-comparison based sorting algorithm that sorts data with integer keys by grouping keys by the individual digits which share the same significant position and value.",
		timeComplexity: "O(d × (n + k))",
		spaceComplexity: "O(n + k)",
	},
	counting: {
		title: "Counting Sort",
		description:
			"Counting Sort is a sorting algorithm that sorts the elements of an array by counting the number of occurrences of each unique element in the array. It works well when the range of input data is small.",
		timeComplexity: "O(n + k)",
		spaceComplexity: "O(k)",
	},
	bucket: {
		title: "Bucket Sort",
		description:
			"Bucket Sort distributes the elements of an array into a number of buckets. Each bucket is then sorted individually, either using a different sorting algorithm or recursively applying bucket sort.",
		timeComplexity: "O(n + k)",
		spaceComplexity: "O(n × k)",
	},
	shell: {
		title: "Shell Sort",
		description:
			"Shell Sort is an in-place comparison sort that generalizes insertion sort to allow the exchange of items that are far apart. It starts by sorting pairs of elements far apart from each other, then progressively reducing the gap.",
		timeComplexity: "O(n log² n)",
		spaceComplexity: "O(1)",
	},
};

export default function Home() {
	const [array, setArray] = useState<number[]>([]);
	const [sorting, setSorting] = useState(false);
	const [algorithm, setAlgorithm] = useState<SortingAlgorithm>("bubble");
	const [shouldStop, setShouldStop] = useState(false);
	const sortingRef = useRef(false);
	const [speed, setSpeed] = useState(50);
	const [comparingIndices, setComparingIndices] = useState<number[]>([]);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [selectedAlgorithm, setSelectedAlgorithm] =
		useState<SortingAlgorithm | null>(null);

	useEffect(() => {
		generateNewArray();
	}, []);

	const generateNewArray = () => {
		const newArray = Array.from(
			{ length: ARRAY_SIZE },
			() => Math.floor(Math.random() * 250) + 10
		);
		setArray(newArray);
	};

	// Update the sleep function
	const sleep = async () => {
		if (!sortingRef.current) {
			toast("Sorting process has been stopped.");
			return Promise.reject();
		}
		// Add console.log to debug the speed value
		console.log("Current speed:", speed);
		// Simplify the delay calculation
		const delay = Math.max(5, 500 - speed * 5);
		return new Promise((resolve) => setTimeout(resolve, delay));
	};

	const bubbleSort = async () => {
		const arr = [...array];
		let swapped;

		do {
			if (shouldStop) return;
			swapped = false;
			for (let i = 0; i < arr.length - 1; i++) {
				if (shouldStop) return;
				if (arr[i] > arr[i + 1]) {
					setComparingIndices([i, i + 1]);
					[arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
					swapped = true;
					setArray([...arr]);
					await sleep();
				}
			}
		} while (swapped);

		return arr;
	};

	const quickSort = async (arr: number[], low: number, high: number) => {
		if (shouldStop) return;
		if (low < high) {
			const pi = await partition(arr, low, high);
			if (shouldStop) return;
			await quickSort(arr, low, pi - 1);
			if (shouldStop) return;
			await quickSort(arr, pi + 1, high);
		}
		return arr;
	};

	const partition = async (arr: number[], low: number, high: number) => {
		const pivot = arr[high];
		let i = low - 1;

		for (let j = low; j < high; j++) {
			if (arr[j] < pivot) {
				i++;
				setComparingIndices([j, high]); // Compare with pivot
				[arr[i], arr[j]] = [arr[j], arr[i]];
				setArray([...arr]);
				await sleep();
			}
		}

		setComparingIndices([i + 1, high]); // Compare final swap
		[arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
		setArray([...arr]);
		await sleep();
		return i + 1;
	};

	const mergeSort = async (arr: number[], start: number, end: number) => {
		if (shouldStop) return;
		if (start < end) {
			const mid = Math.floor((start + end) / 2);
			await mergeSort(arr, start, mid);
			if (shouldStop) return;
			await mergeSort(arr, mid + 1, end);
			if (shouldStop) return;
			await merge(arr, start, mid, end);
		}
		return arr;
	};

	const merge = async (
		arr: number[],
		start: number,
		mid: number,
		end: number
	) => {
		if (shouldStop) return;
		const left = arr.slice(start, mid + 1);
		const right = arr.slice(mid + 1, end + 1);
		let i = 0;
		let j = 0;
		let k = start;

		while (i < left.length && j < right.length) {
			if (shouldStop) return;
			setComparingIndices([start + i, mid + 1 + j]); // Compare elements from left and right arrays
			if (left[i] <= right[j]) {
				arr[k] = left[i];
				i++;
			} else {
				arr[k] = right[j];
				j++;
			}
			setArray([...arr]);
			await sleep();
			k++;
		}

		while (i < left.length) {
			if (shouldStop) return;
			setComparingIndices([k, start + i]); // Compare remaining left elements
			arr[k] = left[i];
			setArray([...arr]);
			await sleep();
			i++;
			k++;
		}

		while (j < right.length) {
			if (shouldStop) return;
			setComparingIndices([k, mid + 1 + j]); // Compare remaining right elements
			arr[k] = right[j];
			setArray([...arr]);
			await sleep();
			j++;
			k++;
		}
	};

	const selectionSort = async () => {
		const arr = [...array];

		for (let i = 0; i < arr.length - 1; i++) {
			if (shouldStop) return;
			let minIdx = i;

			for (let j = i + 1; j < arr.length; j++) {
				if (shouldStop) return;
				setComparingIndices([minIdx, j]);
				if (arr[j] < arr[minIdx]) {
					minIdx = j;
				}
				await sleep();
			}

			if (minIdx !== i) {
				[arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
				setArray([...arr]);
				await sleep();
			}
		}
		return arr;
	};

	const insertionSort = async () => {
		const arr = [...array];

		for (let i = 1; i < arr.length; i++) {
			if (shouldStop) return;
			const current = arr[i];
			let j = i - 1;

			while (j >= 0 && arr[j] > current) {
				if (shouldStop) return;
				setComparingIndices([j, j + 1]);
				arr[j + 1] = arr[j];
				setArray([...arr]);
				await sleep();
				j--;
			}

			arr[j + 1] = current;
			setArray([...arr]);
			await sleep();
		}
		return arr;
	};

	const heapSort = async () => {
		const arr = [...array];
		const n = arr.length;

		// Build heap (rearrange array)
		for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
			await heapify(arr, n, i);
		}

		// One by one extract an element from heap
		for (let i = n - 1; i > 0; i--) {
			if (shouldStop) return;
			// Move current root to end
			setComparingIndices([0, i]);
			[arr[0], arr[i]] = [arr[i], arr[0]];
			setArray([...arr]);
			await sleep();

			// Call max heapify on the reduced heap
			await heapify(arr, i, 0);
		}
		return arr;
	};

	const heapify = async (arr: number[], n: number, i: number) => {
		if (shouldStop) return;
		let largest = i; // Initialize largest as root
		const left = 2 * i + 1; // left = 2*i + 1
		const right = 2 * i + 2; // right = 2*i + 2

		// If left child is larger than root
		if (left < n && arr[left] > arr[largest]) {
			largest = left;
		}

		// If right child is larger than largest so far
		if (right < n && arr[right] > arr[largest]) {
			largest = right;
		}

		// If largest is not root
		if (largest !== i) {
			setComparingIndices([i, largest]);
			[arr[i], arr[largest]] = [arr[largest], arr[i]];
			setArray([...arr]);
			await sleep();

			// Recursively heapify the affected sub-tree
			await heapify(arr, n, largest);
		}
	};

	const radixSort = async () => {
		const arr = [...array];
		const max = Math.max(...arr);
		const maxDigits = Math.floor(Math.log10(max)) + 1;

		for (let digit = 0; digit < maxDigits; digit++) {
			if (shouldStop) return;
			await countingSortForRadix(arr, digit);
		}
		return arr;
	};

	const countingSortForRadix = async (arr: number[], digit: number) => {
		const output = new Array(arr.length);
		const count = new Array(10).fill(0);
		const exp = Math.pow(10, digit);

		// Store count of occurrences in count[]
		for (let i = 0; i < arr.length; i++) {
			const index = Math.floor(arr[i] / exp) % 10;
			count[index]++;
		}

		// Change count[i] so that count[i] now contains actual position of this digit in output[]
		for (let i = 1; i < 10; i++) {
			count[i] += count[i - 1];
		}

		// Build the output array
		for (let i = arr.length - 1; i >= 0; i--) {
			if (shouldStop) return;
			const index = Math.floor(arr[i] / exp) % 10;
			setComparingIndices([i, count[index] - 1]);
			output[count[index] - 1] = arr[i];
			count[index]--;
			await sleep();
		}

		// Copy the output array to arr[], so that arr[] now contains sorted numbers according to current digit
		for (let i = 0; i < arr.length; i++) {
			if (shouldStop) return;
			setComparingIndices([i]);
			arr[i] = output[i];
			setArray([...arr]);
			await sleep();
		}
	};

	const countingSort = async () => {
		const arr = [...array];
		const max = Math.max(...arr);
		const min = Math.min(...arr);
		const range = max - min + 1;
		const count = new Array(range).fill(0);
		const output = new Array(arr.length);

		// Store count of each element
		for (let i = 0; i < arr.length; i++) {
			if (shouldStop) return;
			setComparingIndices([i]);
			count[arr[i] - min]++;
			await sleep();
		}

		// Change count[i] so that count[i] now contains actual position of this element in output array
		for (let i = 1; i < count.length; i++) {
			count[i] += count[i - 1];
		}

		// Build the output array
		for (let i = arr.length - 1; i >= 0; i--) {
			if (shouldStop) return;
			setComparingIndices([i, count[arr[i] - min] - 1]);
			output[count[arr[i] - min] - 1] = arr[i];
			count[arr[i] - min]--;
			await sleep();
		}

		// Copy the output array to arr
		for (let i = 0; i < arr.length; i++) {
			if (shouldStop) return;
			setComparingIndices([i]);
			arr[i] = output[i];
			setArray([...arr]);
			await sleep();
		}
		return arr;
	};

	const bucketSort = async () => {
		const arr = [...array];
		if (arr.length <= 1) return arr;

		const max = Math.max(...arr);
		const min = Math.min(...arr);
		const bucketCount = Math.floor(Math.sqrt(arr.length));
		const buckets: number[][] = Array.from({ length: bucketCount }, () => []);

		// Put array elements in different buckets
		for (let i = 0; i < arr.length; i++) {
			if (shouldStop) return;
			setComparingIndices([i]);
			const bucketIndex = Math.floor(((arr[i] - min) / (max - min + 1)) * bucketCount);
			const safeIndex = Math.min(bucketIndex, bucketCount - 1);
			buckets[safeIndex].push(arr[i]);
			await sleep();
		}

		// Sort individual buckets and concatenate
		let index = 0;
		for (let i = 0; i < buckets.length; i++) {
			if (shouldStop) return;
			if (buckets[i].length > 0) {
				// Simple insertion sort for each bucket
				buckets[i].sort((a, b) => a - b);

				for (let j = 0; j < buckets[i].length; j++) {
					if (shouldStop) return;
					setComparingIndices([index]);
					arr[index] = buckets[i][j];
					setArray([...arr]);
					await sleep();
					index++;
				}
			}
		}
		return arr;
	};

	const shellSort = async () => {
		const arr = [...array];
		const n = arr.length;

		// Start with a big gap, then reduce the gap
		for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
			if (shouldStop) return;

			// Do a gapped insertion sort for this gap size
			for (let i = gap; i < n; i++) {
				if (shouldStop) return;
				const temp = arr[i];
				let j = i;

				// Shift earlier gap-sorted elements up until the correct location for arr[i] is found
				while (j >= gap && arr[j - gap] > temp) {
					if (shouldStop) return;
					setComparingIndices([j, j - gap]);
					arr[j] = arr[j - gap];
					setArray([...arr]);
					await sleep();
					j -= gap;
				}

				// Put temp (the original arr[i]) in its correct location
				arr[j] = temp;
				setArray([...arr]);
				await sleep();
			}
		}
		return arr;
	};

	const startSorting = async () => {
		setSorting(true);
		setShouldStop(false);
		sortingRef.current = true;

		try {
			const arrayCopy = [...array];
			switch (algorithm) {
				case "bubble":
					await bubbleSort();
					break;
				case "quick":
					await quickSort(arrayCopy, 0, arrayCopy.length - 1);
					break;
				case "merge":
					await mergeSort(arrayCopy, 0, arrayCopy.length - 1);
					break;
				case "selection":
					await selectionSort();
					break;
				case "insertion":
					await insertionSort();
					break;
				case "heap":
					await heapSort();
					break;
				case "radix":
					await radixSort();
					break;
				case "counting":
					await countingSort();
					break;
				case "bucket":
					await bucketSort();
					break;
				case "shell":
					await shellSort();
					break;
			}
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (error) {
			generateNewArray(); // Reset array when stopped
		} finally {
			setSorting(false);
			setShouldStop(false);
			sortingRef.current = false;
			setComparingIndices([]); // Reset comparing indices
		}
	};

	const stopSorting = () => {
		sortingRef.current = false;
		setShouldStop(true);
		setSorting(false);
		setComparingIndices([]); // Reset comparing indices
		generateNewArray(); // Generate new array immediately when stopped
	};

	return (
		<div className="space-y-4 p-8">
			<h1 className="mb-8 font-bold text-3xl text-center">
				Sorting Visualizer
			</h1>

			<Visualization
				array={array}
				comparingIndices={comparingIndices}
				sorting={sorting}
				COLOR_COMPARING={COLOR_COMPARING}
				COLOR_SORTING={COLOR_SORTING}
				COLOR_SORTED={COLOR_SORTED}
			/>

			<div className="flex flex-wrap justify-center gap-2 space-x-4 mb-8">
				<AlgorithmSelector
					algorithm={algorithm}
					setAlgorithm={setAlgorithm}
					sorting={sorting}
				/>
			</div>

			<SpeedControl speed={speed} setSpeed={setSpeed} sorting={sorting} />

			<div className="flex flex-col items-center gap-2 mx-auto max-w-xs">
				<div className="bottom-2 left-1/2 z-50 fixed -translate-x-1/2">
					<Dock className="items-end pb-3">
						{dockIcons.map((item, idx) => (
							<DockItem
								key={idx}
								className="bg-gray-200 dark:bg-neutral-800 rounded-lg aspect-square"
								onClick={() => {
									if (item.action === "start") {
										// eslint-disable-next-line @typescript-eslint/no-unused-expressions
										sorting ? stopSorting() : startSorting();
									} else if (item.title === "Algorithm Info") {
										setSelectedAlgorithm(algorithm);
										setIsDialogOpen(true);
									}
								}}
							>
								<DockLabel>
									{sorting && item.action === "start" ? "Stop" : item.title}
								</DockLabel>
								<DockIcon>
									{sorting && item.action === "start" ? (
										<PauseIcon className="w-full h-full text-neutral-600 dark:text-neutral-300" />
									) : (
										item.icon
									)}
								</DockIcon>
							</DockItem>
						))}
					</Dock>
				</div>
			</div>

			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle className="font-bold text-xl">
							{selectedAlgorithm && algorithmInfo[selectedAlgorithm].title}
						</DialogTitle>
						<div>
							{selectedAlgorithm && (
								<>
									<div className="mt-4">
										{algorithmInfo[selectedAlgorithm].description}
									</div>
									<div className="mt-4">
										<p className="font-semibold">Time Complexity:</p>
										<p>{algorithmInfo[selectedAlgorithm].timeComplexity}</p>
									</div>
									<div>
										<p className="font-semibold">Space Complexity:</p>
										<p>{algorithmInfo[selectedAlgorithm].spaceComplexity}</p>
									</div>
								</>
							)}
						</div>
					</DialogHeader>
				</DialogContent>
			</Dialog>
		</div>
	);
}
