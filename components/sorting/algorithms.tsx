export async function bubbleSort(
  array: number[],
  setArray: (arr: number[]) => void,
  setComparingIndices: (indices: number[]) => void,
  shouldStop: boolean,
  sleep: () => Promise<void>
) {
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
}

export async function quickSort(
  array: number[],
  setArray: (arr: number[]) => void,
  setComparingIndices: (indices: number[]) => void,
  shouldStop: boolean,
  sleep: () => Promise<void>,
  low: number = 0,
  high: number = array.length - 1
) {
  if (low < high && !shouldStop) {
    const pi = await partition(
      array,
      low,
      high,
      setArray,
      setComparingIndices,
      shouldStop,
      sleep
    );
    await quickSort(
      array,
      setArray,
      setComparingIndices,
      shouldStop,
      sleep,
      low,
      pi - 1
    );
    await quickSort(
      array,
      setArray,
      setComparingIndices,
      shouldStop,
      sleep,
      pi + 1,
      high
    );
  }
  return array;
}

async function partition(
  array: number[],
  low: number,
  high: number,
  setArray: (arr: number[]) => void,
  setComparingIndices: (indices: number[]) => void,
  shouldStop: boolean,
  sleep: () => Promise<void>
) {
  const pivot = array[high];
  let i = low - 1;

  for (let j = low; j < high; j++) {
    if (shouldStop) return i + 1;
    setComparingIndices([j, high]);
    if (array[j] < pivot) {
      i++;
      [array[i], array[j]] = [array[j], array[i]];
      setArray([...array]);
      await sleep();
    }
  }
  [array[i + 1], array[high]] = [array[high], array[i + 1]];
  setArray([...array]);
  await sleep();
  return i + 1;
}

export async function mergeSort(
  array: number[],
  setArray: (arr: number[]) => void,
  setComparingIndices: (indices: number[]) => void,
  shouldStop: boolean,
  sleep: () => Promise<void>,
  start: number = 0,
  end: number = array.length - 1
) {
  if (start < end && !shouldStop) {
    const mid = Math.floor((start + end) / 2);
    await mergeSort(
      array,
      setArray,
      setComparingIndices,
      shouldStop,
      sleep,
      start,
      mid
    );
    await mergeSort(
      array,
      setArray,
      setComparingIndices,
      shouldStop,
      sleep,
      mid + 1,
      end
    );
    await merge(
      array,
      start,
      mid,
      end,
      setArray,
      setComparingIndices,
      shouldStop,
      sleep
    );
  }
  return array;
}

async function merge(
  array: number[],
  start: number,
  mid: number,
  end: number,
  setArray: (arr: number[]) => void,
  setComparingIndices: (indices: number[]) => void,
  shouldStop: boolean,
  sleep: () => Promise<void>
) {
  const left = array.slice(start, mid + 1);
  const right = array.slice(mid + 1, end + 1);
  let i = 0,
    j = 0,
    k = start;

  while (i < left.length && j < right.length && !shouldStop) {
    setComparingIndices([start + i, mid + 1 + j]);
    if (left[i] <= right[j]) {
      array[k] = left[i];
      i++;
    } else {
      array[k] = right[j];
      j++;
    }
    setArray([...array]);
    await sleep();
    k++;
  }

  while (i < left.length && !shouldStop) {
    array[k] = left[i];
    setArray([...array]);
    await sleep();
    i++;
    k++;
  }

  while (j < right.length && !shouldStop) {
    array[k] = right[j];
    setArray([...array]);
    await sleep();
    j++;
    k++;
  }
}

export async function selectionSort(
  array: number[],
  setArray: (arr: number[]) => void,
  setComparingIndices: (indices: number[]) => void,
  shouldStop: boolean,
  sleep: () => Promise<void>
) {
  const arr = [...array];

  for (let i = 0; i < arr.length - 1 && !shouldStop; i++) {
    let minIdx = i;
    for (let j = i + 1; j < arr.length && !shouldStop; j++) {
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
}

export async function insertionSort(
  array: number[],
  setArray: (arr: number[]) => void,
  setComparingIndices: (indices: number[]) => void,
  shouldStop: boolean,
  sleep: () => Promise<void>
) {
  const arr = [...array];

  for (let i = 1; i < arr.length && !shouldStop; i++) {
    const current = arr[i];
    let j = i - 1;

    while (j >= 0 && arr[j] > current && !shouldStop) {
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
}
