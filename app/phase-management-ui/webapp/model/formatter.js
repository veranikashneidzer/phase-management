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

		formatDateByPattern(sDate, sPattern) {
			const oDateFormat = DateFormat.getInstance({pattern: sPattern});
			const sFormattedDate = UI5Date.getInstance(sDate);
			return oDateFormat.format(sFormattedDate);
		},

		formatDate(sDate) {
			return this.formatDateByPattern(sDate, "dd MMMM yyyy");
		},

		calculateTotalPrice(dStartDate, dEndDate, fMonthlyPrice) {
			const oStartDate = (new Date(dStartDate)).getFullYear();
			const oEndDate = (new Date(dEndDate)).getFullYear();
			const iMonths = (oEndDate - oStartDate) * 12 + ( (new Date(dEndDate)).getMonth() - (new Date(dStartDate)).getMonth() ) + 1;
			return iMonths * `${fMonthlyPrice}`.replace(',', '');
		},
	};
});