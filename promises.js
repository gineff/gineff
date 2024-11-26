function once(fn) {
  let hasBeenCalled = false; // Flag to track if fn has already been called
  let result; // To store the result of the first call

  return function (...args) {
    if (!hasBeenCalled) {
      hasBeenCalled = true;
      result = fn(...args); // Call the original function
      return result;
    }
    return undefined; // Subsequent calls return undefined
  };
}

function memoize(fn) {
  let memoMap = new Map();

  return function (...args) {
    let possibleKey = JSON.stringify(args);
    if (memoMap.has(possibleKey)) {
      return memoMap.get(possibleKey);
    } else {
      memoMap.set(possibleKey, fn(...args));
      return memoMap.get(possibleKey);
    }
  };
}

/** promise */

var addTwoPromises = async function (promise1, promise2) {
  return Promise.all([promise1, promise2]).then(([val1, val2]) => val1 + val2);
};

async function sleep(millis) {
  await new Promise((resolve) => setTimeout(resolve, millis));
}

var cancellable = function (fn, args, t) {
  const timeout = setTimeout(fn, t, ...args);
  return () => clearTimeout(timeout);
};

var cancellable = function (fn, args, t) {
  fn(...args);
  const interval = setInterval(fn, t, ...args);

  return () => clearInterval(interval);
};

var timeLimit = function (fn, t) {
  return async function (...args) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject("Time Limit Exceeded");
      }, t);

      fn(...args)
        .then((result) => {
          clearTimeout(timer);
          resolve(result);
        })
        .catch((err) => {
          clearTimeout(timer);
          reject(err);
        });
    });
  };
};

/** */
var TimeLimitedCache = function () {
  this.cache = {};
  this.unexpiredKeysCount = 0;
};

TimeLimitedCache.prototype.set = function (key, value, duration) {
  let existed = false;
  if (key in this.cache) {
    existed = true;
    this.unexpiredKeysCount -= 1;
    clearTimeout(this.cache[key].timeout);
  }

  const timeout = setTimeout(() => {
    this.unexpiredKeysCount -= 1;
    delete this.cache[key];
  }, duration);
  this.cache[key] = { value, timeout };
  this.unexpiredKeysCount += 1;
  return existed;
};

TimeLimitedCache.prototype.get = function (key) {
  if (key in this.cache) {
    return this.cache[key].value;
  }
  return -1;
};

TimeLimitedCache.prototype.count = function () {
  return this.unexpiredKeysCount;
};

/** */

var debounce = function (fn, t) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), t);
  };
};

var promiseAll = async function (functions) {
  return new Promise((resolve, reject) => {
    let ans = [],
      j = functions.length;
    functions.forEach((func, i) => {
      func()
        .then((res) => {
          (ans[i] = res), --j === 0 && resolve(ans);
        })
        .catch(reject);
    });
  });
};

var promiseAll = function (functions) {
  return new Promise((resolve, reject) => {
    const res = new Array(functions.length);
    let cnt = 0;
    functions.forEach((fn, i) => {
      fn()
        .then((val) => {
          cnt++;
          res[i] = val;
          if (cnt == functions.length) resolve(res);
        }) // then
        .catch((err) => reject(err));
    });
  });
};

/** JSON */

var isEmpty = function (obj) {
  const long = Array.isArray(obj) ? obj.length : Object.keys(obj).length;

  return long === 0 ? true : false;
};

var chunk = function (arr, size) {
  return [...Array(Math.ceil(arr.length / size))].map((_, i) =>
    arr.slice(i * size, i * size + size)
  );
};

Array.prototype.last = function () {
  const arr = this;
  return arr.length === 0 ? -1 : arr.pop();
};

Array.prototype.groupBy = function (fn) {
  const groups = {};
  this.forEach((value) => {
    const key = fn(value)((groups[key] ??= [])).push(value);
  });
  return groups;
};

var sortBy = function (arr, fn) {
  return arr.sort((a, b) => fn(a) - fn(b));
};

var join = function (arr1, arr2) {
  const map = new Map();

  const addToMap = (arr) => {
    arr.forEach((obj) => {
      if (map.has(obj.id)) {
        Object.assign(map.get(obj.id), obj);
      } else {
        map.set(obj.id, { ...obj });
      }
    });
  };

  addToMap(arr1);
  addToMap(arr2);

  return Array.from(map.values()).sort((a, b) => a.id - b.id);
};

var flat = function (arr, n) {
  if (n <= 0) return arr;
  let ans = [];
  arr.forEach((value) => {
    if (typeof value == "object") {
      ans.push(...flat(value, n - 1));
    } else {
      ans.push(value);
    }
  });
  return ans;
};

var compactObject = function (obj) {
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      if (!obj[i]) {
        obj.splice(i, 1);
        i--;
      }
      if (typeof obj[i] === "object") compactObject(obj[i]);
    }
  } else {
    for (const key in obj) {
      if (!obj[key]) {
        delete obj[key];
      }
      if (typeof obj[key] === "object") compactObject(obj[key]);
    }
  }
  return obj;
};

class EventEmitter {
  constructor() {
    this.event = {};
  }

  subscribe(eventName, callback) {
    if (!this.event[eventName]) {
      this.event[eventName] = [];
    }

    this.event[eventName].push(callback);

    return {
      unsubscribe: () => {
        this.event[eventName] = this.event[eventName].filter(
          (item) => item !== callback
        );

        if (this.event[eventName].length === 0) {
          delete this.event[eventName];
        }
      },
    };
  }

  emit(eventName, args = []) {
    if (this.event[eventName]) {
      return this.event[eventName].map((cb) => cb(...args));
    }

    return [];
  }
}

var ArrayWrapper = function (nums) {
  this.fullValue = nums;
};

ArrayWrapper.prototype.valueOf = function () {
  let result = 0;
  for (let i of this.fullValue) {
    result = result + i;
  }
  return result;
};

ArrayWrapper.prototype.toString = function () {
  return JSON.stringify(this.fullValue);
};

class Calculator {
  constructor(value) {
    this.result = value;
  }

  add(value) {
    this.result += value;
    return this;
  }

  subtract(value) {
    this.result -= value;
    return this;
  }

  multiply(value) {
    this.result *= value;
    return this;
  }

  divide(value) {
    if (value === 0) {
      throw new Error("Division by zero is not allowed");
    }
    this.result /= value;
    return this;
  }

  power(value) {
    this.result **= value;
    return this;
  }

  getResult() {
    return this.result;
  }
}
