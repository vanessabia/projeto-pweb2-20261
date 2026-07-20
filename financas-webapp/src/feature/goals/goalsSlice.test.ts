import { describe, expect, it } from "vitest";
import goalsReducer from "./goalsSlice";

describe("goalsSlice", () => {
  it("should return the initial state", () => {
    const state = goalsReducer(undefined, {
      type: "@@INIT",
    });

    expect(state).toEqual({
      goals: [],
      loading: false,
      error: null,
    });
  });
});