sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
], (BaseController, JSONModel) => {
  "use strict";

  return BaseController.extend("phasemanagementui.controller.App", {
    onInit() {
      const oAppModel = new JSONModel({
        layout : "OneColumn",
      });
      this.getView().setModel(oAppModel, "oAppModel");
    }
  });
});