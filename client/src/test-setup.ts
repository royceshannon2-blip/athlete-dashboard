import '@testing-library/jest-dom';

// Provide a reliable localStorage in Node 26+ where the native experimental
// localStorage is undefined without --localstorage-file and DOM environments
// can't override the native property descriptor.
(function setupLocalStorage() {
  const store: Record<string, string> = {};
  const mock: Storage = {
    getItem(key: string): string | null { return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null; },
    setItem(key: string, value: string): void { store[key] = String(value); },
    removeItem(key: string): void { delete store[key]; },
    clear(): void { Object.keys(store).forEach((k) => delete store[k]); },
    get length(): number { return Object.keys(store).length; },
    key(index: number): string | null { return Object.keys(store)[index] ?? null; },
  };
  try {
    Object.defineProperty(globalThis, 'localStorage', { value: mock, writable: true, configurable: true });
  } catch {
    (globalThis as Record<string, unknown>).localStorage = mock;
  }
})();
