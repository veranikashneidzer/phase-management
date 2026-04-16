sap.ui.define([
  "sap/ui/model/type/Currency",
  "sap/ui/core/format/DateFormat",
  "sap/ui/core/date/UI5Date"
], function (Currency, DateFormat, UI5Date) {
  "use strict";

  const formatter = {
    getStatusState(sStatus) {
      switch (sStatus) {
        case "Draft":
          return "Warning";
        case "Inactive":
          return "Error";
        default:
          return "Success";
      }
    },

    formatDateByPattern(sDate, sPattern) {
      const oDateFormat = DateFormat.getInstance({ pattern: sPattern });
      const sFormattedDate = UI5Date.getInstance(sDate);
      return oDateFormat.format(sFormattedDate);
    },

    formatDate(sDate) {
      return this.formatDateByPattern(sDate, "dd MMMM yyyy");
    },

    calculateTotalPrice(dStartDate, dEndDate, fMonthlyPrice) {
      const start = new Date(dStartDate);
      const end = new Date(dEndDate);

      const months =
        (end.getFullYear() - start.getFullYear()) * 12 +
        (end.getMonth() - start.getMonth()) + 1;

      return months * Number(String(fMonthlyPrice).replace(",", ""));
    }
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = formatter;
  }

  return formatter;
});