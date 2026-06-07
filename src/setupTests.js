import 'jest-localstorage-mock';
import '@testing-library/jest-dom';

// Polyfill crypto.randomUUID for jsdom environment
if (typeof crypto === 'undefined' || !crypto.randomUUID) {
  global.crypto = {
    ...global.crypto,
    randomUUID: () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    }),
  };
}

beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});
