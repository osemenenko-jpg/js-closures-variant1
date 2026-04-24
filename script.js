/**
 * Практична робота 9
 * Варіант 1: Counter Factory + Мемоізація
 */

// ---------- Counter Factory ----------

function createCounter(initial = 0) {
  let count = initial;
  const startValue = initial;

  return {
    increment() {
      count++;
      return count;
    },
    decrement() {
      count--;
      return count;
    },
    get() {
      return count;
    },
    reset() {
      count = startValue;
      return count;
    }
  };
}

function createLimitedCounter(min, max) {
  let count = min;

  return {
    increment() {
      if (count < max) count++;
      return count;
    },
    decrement() {
      if (count > min) count--;
      return count;
    },
    get() {
      return count;
    },
    reset() {
      count = min;
      return count;
    }
  };
}

function createStepCounter(step = 1) {
  let count = 0;

  return {
    increment() {
      count += step;
      return count;
    },
    decrement() {
      count -= step;
      return count;
    },
    get() {
      return count;
    },
    reset() {
      count = 0;
      return count;
    }
  };
}

// ---------- Memoization ----------

function memoize(fn) {
  const cache = {};

  return function (...args) {
    const key = JSON.stringify(args);

    if (key in cache) {
      return cache[key];
    }

    const result = fn(...args);
    cache[key] = result;
    return result;
  };
}

function memoizeExpiring(fn, ttlMs) {
  const cache = {};

  return function (...args) {
    const key = JSON.stringify(args);
    const now = Date.now();

    if (cache[key] && now - cache[key].time < ttlMs) {
      return cache[key].value;
    }

    const value = fn(...args);
    cache[key] = {
      value,
      time: now
    };

    return value;
  };
}

// ---------- Fibonacci ----------

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const memoizedFibonacci = memoize(function fib(n) {
  if (n <= 1) return n;
  return memoizedFibonacci(n - 1) + memoizedFibonacci(n - 2);
});

// ---------- Demo ----------

function runDemo() {
  const output = document.getElementById('output');
  let text = '';

  // Counter
  const counter = createCounter(5);
  text += 'Базовий лічильник:\n';
  text += `Початкове значення: ${counter.get()}\n`;
  text += `Increment: ${counter.increment()}\n`;
  text += `Decrement: ${counter.decrement()}\n`;
  text += `Reset: ${counter.reset()}\n\n`;

  // Limited Counter
  const limited = createLimitedCounter(0, 3);
  text += 'Лічильник з межами 0–3:\n';
  text += `${limited.increment()}\n`;
  text += `${limited.increment()}\n`;
  text += `${limited.increment()}\n`;
  text += `${limited.increment()} — не виходить за максимум\n\n`;

  // Step Counter
  const stepCounter = createStepCounter(5);
  text += 'Лічильник з кроком 5:\n';
  text += `${stepCounter.increment()}\n`;
  text += `${stepCounter.increment()}\n`;
  text += `${stepCounter.decrement()}\n\n`;

  // Memoization
  const expensiveSum = memoize((a, b) => {
    console.log('Обчислення...');
    return a + b;
  });

  text += 'Мемоізація:\n';
  text += `sum(10, 20): ${expensiveSum(10, 20)}\n`;
  text += `sum(10, 20) з кешу: ${expensiveSum(10, 20)}\n\n`;

  // Fibonacci Benchmark
  const start = performance.now();
  const fib = memoizedFibonacci(40);
  const end = performance.now();

  text += 'Benchmark Fibonacci:\n';
  text += `fibonacci(40): ${fib}\n`;
  text += `Час: ${(end - start).toFixed(2)} ms\n`;

  // ✅ ВАЖНО: правильный вывод
  output.innerText = text;
}