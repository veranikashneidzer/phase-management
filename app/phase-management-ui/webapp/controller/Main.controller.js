sap.ui.define([
  "phasemanagementui/controller/BaseController",
  "sap/ui/model/json/JSONModel",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/ui/model/Sorter",
  "sap/ui/core/format/DateFormat",
  "sap/ui/Device",
], (BaseController,
  JSONModel,
  Filter,
  FilterOperator,
  Sorter,
  DateFormat,
  Device) => {
  "use strict";

  return BaseController.extend("phasemanagementui.controller.Main", {
    onInit() {
      this.oDataModel = this.getOwnerComponent().getModel("DataModel");
      this.oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();

      this.configModel = new JSONModel({});
      this.getView().setModel(this.configModel, "configModel");

      this.mGroupFunctions = {
        currency: function (oContext) {
          const sCurrency = oContext.getProperty("currency");
          return {
            key: sCurrency,
            text: sCurrency
          };
        },
        startDate: function (oContext) {
          const oDate = (new Date(oContext.getProperty("startDate")));
          const iYear = oDate.getFullYear();
          const iMonth = oDate.getMonth() + 1;
          const sMonthName = DateFormat.getInstance({ pattern: "MMMM" }).format(oDate);
          return {
            key: iYear + "-" + iMonth,
            text: `Start date in ${sMonthName} ${iYear}`
          };
        },
        endDate: function (oContext) {
          const oDate = (new Date(oContext.getProperty("endDate")));
          const iYear = oDate.getFullYear();
            const iMonth = oDate.getMonth() + 1;
            const sMonthName = DateFormat.getInstance({ pattern: "MMMM" }).format(oDate);
            return {
              key: iYear + "-" + iMonth,
              text: `End date in ${sMonthName} ${iYear}`
            };
        }
      };
    },

    onSearchContracts(oEvent) {
      const sQuery = oEvent.getSource().getValue?.();
      const oBinding = this.byId("contractsList").getBinding("items");
      const aFilters = sQuery ? [
        new Filter("description", FilterOperator.Contains, sQuery)
      ] : [];

      oBinding.filter(aFilters);
    },

    async onOpenViewSettings(oEvent) {
      const sTabId = oEvent.getSource().getId().split("--").pop();
      try {
        if (!this.oViewSettingsDialog) {
          this.oViewSettingsDialog ??= await this.loadFragment({
            name: "phasemanagementui.view.fragments.ViewSettingsDialog",
            id: 'viewSettingsDialog',
          });
        }

        this.oViewSettingsDialog.open(sTabId === "groupButton" ? "group" : "filter");
      } catch (error) {
        Log.error("Cannot load view settings dialog", error);
      }
    },

    onConfirmViewSettingsDialog(oEvent) {
      const oViewSettingsDialog = this.oViewSettingsDialog;
      const oList = this.byId("contractsList");
      const oBinding = oList.getBinding("items");

      const sSortPath = oViewSettingsDialog.getSelectedFilterItems()[0]?.getKey() || "";
      if (sSortPath === "activeContracts") {
        oBinding.filter([new Filter("status", FilterOperator.EQ, 'Active')]);
      } else if (sSortPath === "inactiveContracts") {
        oBinding.filter([new Filter("status", FilterOperator.EQ, 'Inactive')]);
      } else if (sSortPath === "draftContracts") {
        oBinding.filter([new Filter("status", FilterOperator.EQ, 'Draft')]);
      } else {
        oBinding.filter([]);
      }

      const mParams = oEvent.getParameters();

      if (mParams.groupItem) {
        const aGroups = [];
        const sPath = mParams.groupItem.getKey();
        const bDescending = mParams.groupDescending;
        const vGroup = this.mGroupFunctions[sPath];
        aGroups.push(new Sorter(sPath, bDescending, vGroup));

        oBinding.sort(aGroups);
      } else {
        oBinding.sort([]);
      }

      this.onSearchContracts(oEvent);
    },

    onSelectContract(oEvent) {
      const oList = this.byId("contractsList");
      const oBinding = oList.getBinding("items");
      const nListContractId = oEvent.getSource().getId().split("-").pop();
        
      this.getView().getModel("oAppModel").setProperty("/layout", "TwoColumnsMidExpanded");
      this.getOwnerComponent().getRouter().navTo("contract", {
        contractId :oBinding.getCurrentContexts()[nListContractId].getObject().ID
      });
    },

    onAddContract() {
      this.getView().getModel("oAppModel").setProperty("/layout", "TwoColumnsMidExpanded");

      this.getOwnerComponent().getRouter().navTo("contract", {
        contractId: "newContract",
      });
    }
  })
});;