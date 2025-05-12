export function debounce<T extends unknown[], U>(wait: number, callback: (...args: T) => PromiseLike<U> | U) {
  let timer: ReturnType<typeof setTimeout>;

  return (...args: T): Promise<U> => {
    clearTimeout(timer);

    return new Promise((resolve) => {
      timer = setTimeout(() => resolve(callback(...args)), wait);
    });
  };
}
