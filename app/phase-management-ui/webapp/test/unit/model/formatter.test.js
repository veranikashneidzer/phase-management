const formatter = require("../../../model/formatter");

describe("Formatter", () => {

  // ----------------------------
  // getStatusState
  // ----------------------------

  describe("getStatusState", () => {
    test("returns Warning for Draft", () => {
      expect(formatter.getStatusState("Draft"))
        .toBe("Warning");
    });

    test("returns Error for Inactive", () => {
      expect(formatter.getStatusState("Inactive"))
        .toBe("Error");
    });

    test("returns Success for Active or unknown", () => {
      expect(formatter.getStatusState("Active"))
        .toBe("Success");

      expect(formatter.getStatusState(undefined))
        .toBe("Success");
    });
  });

  // ----------------------------
  // formatDateByPattern
  // ----------------------------

  describe("formatDateByPattern", () => {
    test("formats date using provided pattern", () => {
      const result = formatter.formatDateByPattern(
        "2025-01-15",
        "dd.MM.yyyy"
      );

      expect(result).toBe("15.01.2025");
    });
  });

  // ----------------------------
  // formatDate
  // ----------------------------

  describe("formatDate", () => {
    test("formats date using default pattern", () => {
      const result = formatter.formatDate("2025-01-15");

      expect(result).toBe("15 January 2025");
    });
  });

  // ----------------------------
  // calculateTotalPrice
  // ----------------------------

  describe("calculateTotalPrice", () => {
    test("calculates total price for same year", () => {
      const total = formatter.calculateTotalPrice(
        "2025-01-01",
        "2025-03-31",
        100
      );

      expect(total).toBe(300); // 3 months
    });

    test("calculates total price across years", () => {
      const total = formatter.calculateTotalPrice(
        "2024-11-01",
        "2025-02-28",
        200
      );

      expect(total).toBe(800); // 4 months
    });

    test("handles price passed as string with comma", () => {
      const total = formatter.calculateTotalPrice(
        "2025-01-01",
        "2025-01-31",
        "1,500"
      );

      expect(total).toBe(1500);
    });
  });

});