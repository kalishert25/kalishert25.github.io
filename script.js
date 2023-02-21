// DOM Elements
const dropDown = document.getElementById("algorithms");
const barCounter = document.getElementById("bar-count");
const speedCounter = document.getElementById("speed");
const increasedDetail = document.getElementById("detail");
const playAudio = document.getElementById("audio");
const sortButton = document.getElementById("sort");
const randomizeButton = document.getElementById("randomize");
const reverseButton = document.getElementById("reverse");
const c = document.getElementById("display");
const ctx = c.getContext("2d");
const audioCtx = new(window.AudioContext)();
const oscillator = audioCtx.createOscillator();
const gainNode = audioCtx.createGain();

gainNode.gain.value = 0.1;

oscillator.type = 'sine';
oscillator.connect(gainNode);
gainNode.connect(audioCtx.destination)



//global vars
let sorting = false;
const width = c.width;
const height = c.height;
let arr;
let startedAudio = false;

//event listeners and canvas display

function displayArray([nums, curr_index]) {
    ctx.clearRect(0, 0, width, height)
    for (let i = 0; i < nums.length; i++) {
        const is_selected = curr_index[0] === i
        ctx.fillStyle = is_selected ? "red" : "black";
        if (playAudio.checked && is_selected) {
            playNote(nums[i] * 256 + 512, speedCounter.value)
        }

        ctx.fillRect(i * width / nums.length, height - (nums[i] * height), width / nums.length, nums[i] * height)
    }

}
const randomizeValues = size => {
    arr = []
    console.log("randomized")
    for (let i = 0; i < 2 ** size; i++) {
        arr.push(Math.random());
    }

}
randomizeValues(barCounter.value)
displayArray([arr, [-1]])
randomizeButton.addEventListener('click', () => {
    console.log(sorting)
    if (!sorting) {
        randomizeValues(barCounter.value)
        displayArray([arr, [-1]])
    }
})
barCounter.addEventListener('change', () => {
    if (!sorting) {
        const max = 2 ** barCounter.value
        const n = arr.length;
        if (n > max) {
            const temp = []
            for (let i = 0; i < max; i++) {
                temp.push(arr[Math.floor(i * n / max)])
            }
            arr = temp
        } else {
            randomizeValues(barCounter.value)
        }

        displayArray([arr, [-1]])

    }
})
reverseButton.addEventListener('click', () => {
    console.log(sorting)
    if (!sorting) {
        for (let i = 0; i < arr.length / 2; i++) {
            [arr[i], arr[arr.length - i - 1]] = [arr[arr.length - i - 1], arr[i]]
        }
        displayArray([arr, [-1]])
    }
})
sortButton.addEventListener('click', () => {
    console.log(sorting)
    if (!sorting) {
        sorting = true;
        let algorithm;
        switch (dropDown.options[dropDown.selectedIndex].value) {
            case "bubble":
                algorithm = bubbleSort;
                break;
            case "selection":
                algorithm = selectionSort;
                break;
            case "insertion":
                algorithm = insertionSort;
                break;
            case "odd-even":
                algorithm = oddEvenSort;
                break;
            case "cocktail":
                algorithm = cocktailSort;
                break;
            case "comb":
                algorithm = combSort;
                break;
            case "merge-recursive":
                algorithm = mergeSortRecursive;
                break;
            case "merge-iterative":
                algorithm = mergeSortIterative;
                break;
            case "quick":
                algorithm = quickSort;
                break;

        }
        sort(algorithm, speedCounter.value);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.03)
        console.log("called")
    }
})
playAudio.addEventListener('click', () => {
    if (!startedAudio) {
        startedAudio = true;
        oscillator.start()
        gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.03)
    } else if (!playAudio.checked) {
        gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.03)
    }
})

function playNote(frequency, duration) {
    // create Oscillator node
    oscillator.frequency.value = frequency
    const currentTime = audioCtx.currentTime;
    // This sets the starting point for the ramp.
    gainNode.gain.setValueAtTime(0.1, currentTime + duration);
    // Finally this schedules the fade out.

    //setTimeout(() => oscillator.stop(), duration);
}
//sorting
function* selectionSort(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
        //find minimum element in unsorted part of array to swap
        let min = i;

        for (let j = i + 1; j < arr.length; j++) {
            if (increasedDetail.checked) yield [arr, [j]];
            if (arr[j] < arr[min]) min = j;
        }

        //swap!
        let curr = arr[i];
        arr[i] = arr[min];
        arr[min] = curr;

        if (!increasedDetail.checked) yield [arr, [i]];

    }
}

function* insertionSort(arr) {
    for (let i = 1; i < arr.length; i++) {

        if (!increasedDetail.checked) yield [arr, [i]];

        let key = arr[i];
        let j = i - 1;

        while (j >= 0 && key < arr[j]) {
            if (increasedDetail.checked) yield [arr, [j]];
            arr[j + 1] = arr[j]
            j--
        }
        arr[j + 1] = key


    }
    yield [arr, [arr.length]];
}

function* bubbleSort(arr) {

    for (let i = 0; i < arr.length; i++) {
        if (!increasedDetail.checked) yield [arr, [arr.length - i - 1]];
        for (let j = 0; j < arr.length - i - 1; j++) {
            if (increasedDetail.checked) yield [arr, [j]];
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
            }
        }
    }
}

function* oddEvenSort(arr) {
    let isSorted = false;
    while (!isSorted) {
        if (!increasedDetail.checked) yield [arr, [-1]];
        isSorted = true;
        for (let i = 1; i < arr.length - 1; i += 2) {
            if (increasedDetail.checked) yield [arr, [i]];
            if (arr[i] > arr[i + 1]) {
                [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]]
                isSorted = false;
            }
        }
        for (let i = 0; i < arr.length - 1; i += 2) {
            if (increasedDetail.checked) yield [arr, [i]];
            if (arr[i] > arr[i + 1]) {
                [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]]
                isSorted = false;
            }
        }
    }
}

function* combSort(arr) {
    const shrink = 1.3;
    let gap = arr.length;
    let sorted = false;
    while (!sorted) {
        if (!increasedDetail.checked) yield [arr, [gap]];
        gap = Math.floor(gap / shrink);
        if (gap <= 1) {
            sorted = true;
            gap = 1;
        }
        for (let i = 0; i < arr.length - gap; i++) {
            if (increasedDetail.checked) yield [arr, [i, gap + i]];
            if (arr[i] > arr[gap + i]) {
                [arr[i], arr[gap + i]] = [arr[gap + i], arr[i]];
                sorted = false
            }
        }
    }
}

function* cocktailSort(arr) {
    let swapped = true;
    let start = 0;
    let end = arr.length;

    while (swapped == true) {
        if (!increasedDetail.checked) yield [arr, [start, end]]

        swapped = false;
        for (let i = start; i < end - 1; ++i) {
            if (increasedDetail.checked) yield [arr, [i]]
            if (arr[i] > arr[i + 1]) {
                let temp = arr[i];
                arr[i] = arr[i + 1];
                arr[i + 1] = temp;
                swapped = true;
            }
        }
        if (swapped == false) break;


        swapped = false;

        end--;

        for (let i = end - 1; i >= start; i--) {
            if (increasedDetail.checked) yield [arr, [i]]
            if (arr[i] > arr[i + 1]) {
                let temp = arr[i];
                arr[i] = arr[i + 1];
                arr[i + 1] = temp;
                swapped = true;
            }
        }

        start++;
    }
    yield [arr, [-1]]
}

function* mergeSortRecursive(arr) {
    // arr is a unique list that all levels in the recursion tree can access:

    function* mergeSortRec(start, end) { // separate function that can take start/end indices
        if (end - start > 1) {
            let middle = ~~((start + end) / 2)
            yield* mergeSortRec(start, middle) // don't provide slice, but index range
            yield* mergeSortRec(middle, end)
            left = arr.slice(start, middle)
            right = arr.slice(middle, end)

            let a = 0
            let b = 0
            let c = start

            while (a < left.length && b < right.length) {
                if (increasedDetail.checked) yield [arr, [Math.max(start, c - 1)]]
                if (left[a] < right[b]) {
                    arr[c] = left[a]
                    a += 1
                } else {
                    arr[c] = right[b]
                    b += 1
                }
                c += 1
            }
            while (a < left.length) {
                if (increasedDetail.checked) yield [arr, [c - 1]]
                arr[c] = left[a]
                a += 1
                c += 1
            }
            while (b < right.length) {
                if (increasedDetail.checked) yield [arr, [c - 1]]
                arr[c] = right[b]
                b += 1
                c += 1
            }

            if (!increasedDetail.checked) yield [arr, [start, end]]
        }
    }
    yield* mergeSortRec(0, arr.length) // call inner function with start/end arguments
}

function* mergeSortIterative(arr) {

    function* merge(temp, from, mid, to) {
        let k = from,
            i = from,
            j = mid + 1
        // loop till no elements are left in the left and right runs
        while (i <= mid && j <= to) {
            if (arr[i] < arr[j]) {
                temp[k] = arr[i]
                i++
            } else {
                temp[k] = arr[j]
                j++
            }
            k++
        }
        //copy remaining
        while (i < arr.length && i <= mid) {
            temp[k] = arr[i]
            k++
            i++
        }
        for (let i = from; i <= to; i++) {
            arr[i] = temp[i]
            if (increasedDetail.checked) yield [arr, [i, to]]
        }
    }

    let low = 0,
        high = arr.length - 1
    const temp = arr.slice(0)

    let m = 1
    while (m <= high - low) {
        for (let i = low; i < high; i += 2 * m) {
            yield* merge(temp, i, i + m - 1, Math.min(i + 2 * m - 1, high))
            if (!increasedDetail.checked) yield [arr, [i]]
        }
        m *= 2
    }
}

function* quickSort(arr) {
    function swap(i, j) {
        let temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }

    function* partition(low, high) {
        let pivot = arr[high];
        let i = (low - 1);

        for (let j = low; j <= high - 1; j++) {
            if (increasedDetail.checked) yield [arr, [j]]
            if (arr[j] < pivot) {
                i++;
                swap(i, j);
            }
        }
        swap(i + 1, high);
        return (i + 1);
    }

    function* quickSortRec(low, high) {
        if (!increasedDetail.checked) yield [arr, [low, high]]
        if (low < high) {
            let pi = yield* partition(low, high);

            yield* quickSortRec(low, pi - 1);
            yield* quickSortRec(pi + 1, high);
        }
    }
    yield* quickSortRec(0, arr.length - 1)
}

function sort(algorithm, delay) {
    sorting = true;
    const gen = algorithm(arr);
    const run = setInterval(() => {
        const curr = gen.next();
        if (curr.done) {
            sorting = false; // TODO keeps calling add clearInterval
            gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.03)
            clearInterval(run)
        } else {
            displayArray(curr.value);
        }




    }, delay);

}

//TODO add Shellsort, heapsort, cyclesort?