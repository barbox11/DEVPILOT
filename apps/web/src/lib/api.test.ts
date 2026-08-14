import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const store = new Map<string, string>();

const localStorageMock = {
  getItem: (key: string) => store.get(key) ?? null,
  setItem: (key: string, value: string) => {
    store.set(key, value);
  },
  removeItem: (key: string) => {
    store.delete(key);
  },
};

beforeEach(() => {
  store.clear();
  vi.stubGlobal("window", { localStorage: localStorageMock });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

import { getToken, setToken, TOKEN_KEY } from "./api";

describe("api client (token)", () => {
  it("devuelve null sin token guardado", () => {
    expect(getToken()).toBeNull();
  });

  it("persiste y recupera el token", () => {
    setToken("abc123");
    expect(getToken()).toBe("abc123");
    expect(store.get(TOKEN_KEY)).toBe("abc123");
  });

  it("elimina el token al pasar null", () => {
    setToken("abc123");
    setToken(null);
    expect(getToken()).toBeNull();
    expect(store.has(TOKEN_KEY)).toBe(false);
  });
});
