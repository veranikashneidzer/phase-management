sap.ui.define([
	"sap/ui/model/type/Currency",
	"sap/ui/core/format/DateFormat",
	"sap/ui/core/date/UI5Date"
], (Currency, DateFormat, UI5Date) => {
	"use strict";

	const _getDeliveryStatus = (dRequiredDate, dShippedDate) => {
		let sDeliveryText = "inTime";

		if (!dShippedDate) {
			return "";
		}

		if (dRequiredDate - dShippedDate > 0 && dRequiredDate - dShippedDate <= 7 * 24 * 60 * 60 * 1000) {
			sDeliveryText = "urgent";
		} else if (dRequiredDate < dShippedDate) {
			sDeliveryText = "tooLate";
		}

		return sDeliveryText;
	};

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
			const oDateFormat = DateFormat.getInstance({
				format: "yyyy"
			});
			const sFormattedDate = UI5Date.getInstance(sDate);
			return oDateFormat.format(sFormattedDate);
		}
	};
});