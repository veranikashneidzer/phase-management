sap.ui.define([
	"sap/ui/model/type/Currency",
	"sap/ui/core/format/DateFormat",
	"sap/ui/core/date/UI5Date"
], (Currency, DateFormat, UI5Date) => {
	"use strict";

	return {
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

		formatDate(sDate) {
			const oDateFormat = DateFormat.getInstance({pattern: "dd MMMM yyyy"});
			const sFormattedDate = UI5Date.getInstance(sDate);
			return oDateFormat.format(sFormattedDate);
		}
	};
});