/**
 * Basic setup test to ensure Jest is working correctly
 */

describe("Application Setup", () => {
  it("should have a working test environment", () => {
    expect(true).toBe(true);
  });

  it("should be able to import React", () => {
    const React = require("react");
    expect(React).toBeDefined();
  });

  it("should have correct Node environment", () => {
    expect(process.env.NODE_ENV).toBeDefined();
  });
});
