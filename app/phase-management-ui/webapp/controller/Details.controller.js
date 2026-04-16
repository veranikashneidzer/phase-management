sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/m/MessageToast",
  "sap/m/MessageBox",
  "sap/m/library",
  "sap/base/Log",
  "phasemanagementui/model/formatter",
], function (
  Controller,
  JSONModel,
  MessageToast,
  MessageBox,
  mobileLibrary,
  Log,
  formatter
) {
  "use strict";

  return Controller.extend("phasemanagementui.controller.Details", {
    onInit: function () {
      this.getOwnerComponent().getRouter().getRoute("contract").attachPatternMatched(this._onObjectMatched, this);

      const oDetailConfigModel = new JSONModel({
        isContractCreation: false,
        isEditMode: false,
      });

      this.getView().setModel(oDetailConfigModel, "oDetailConfigModel");

      this.oDataModel = this.getOwnerComponent().getModel("DataModel");
      this.oDetailConfigModel = this.getView().getModel("oDetailConfigModel");
      this.oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
    },

    _onObjectMatched: function (oEvent) {
      const oArguments = oEvent.getParameter("arguments");
      const sContractId = oArguments.contractId;
      const sQuery = oArguments["?query"];
      this.getView().unbindElement("DataModel");

      if (sContractId === "newContract") {
        this.oDetailConfigModel.setProperty("/isContractCreation", true);
        this.oDetailConfigModel.setProperty("/isEditMode", true);
        const oContext = this.oDataV4Model.bindList("/Contracts").create(null, true);
        oContext.oCreatedPromise.catch((oError) => {
          if (!oError.canceled) {
            Log.error(oError.message);
          }
        });
        this.getView().setBindingContext(oContext, "DataModel");
      } else {
        this.oDetailConfigModel.setProperty("/isContractCreation", false);
        this.oDetailConfigModel.setProperty("/isEditMode", false);
        this.getView().bindElement({
          path: `/Contracts(${sContractId})`,
          model: "DataModel"
        });
      }

      this.getView().getModel("oAppModel").setProperty("/layout", "TwoColumnsMidExpanded");

      if (sQuery && sQuery.isEditMode) {
        this.oDetailConfigModel.setProperty("/isEditMode", true);
      }
    },

    onCancelEdit() {
      if (this.oDetailConfigModel.getProperty("/isContractCreation")) {
        this.onCloseContract();
      } else {
        this.oDataModel.resetChanges();
        this.oDetailConfigModel.setProperty("/isEditMode", false);
      }
      this.getOwnerComponent().getRouter().navTo("contract", { contractId: this.getView().getBindingContext("DataModel").getObject().ID });
    },

    _validateControl(oControl) {
      let isValid = false;

      if (oControl.isA("sap.m.Input")) {
        const inputValue = oControl.getValue();
        isValid = oControl.getType() === "Number" ? Number(inputValue) && inputValue > 0 : !!(`${inputValue}`.length);
        oControl.setValueState(isValid ? "None" : "Error");
        return isValid;
      } else if (oControl.isA("sap.m.DatePicker")) {
        isValid = oControl.isValidValue() && !!oControl.getValue().length;
        oControl.setValueState(isValid ? "None" : "Error");
        return isValid;
      } else {
        return true;
      }
    },

    onControlChanged(oEvent) {
      const oControl = oEvent.getSource();
      this._validateControl(oControl);
    },

    validateForm() {
      const aControls = this.getView().byId("headerContent").getContent()[0].getContent();
      let isAllControlsValid = true;

      aControls.forEach((oControl) => {
        const isValid = this._validateControl(oControl);

        if (!isValid) {
          isAllControlsValid = false;
        }
      });

      return isAllControlsValid;
    },

    onSaveButtonPress(oEvent) {
      if (!this.validateForm()) {
        return;
      }

      const bIsCreate = this.oDetailConfigModel.getProperty("/isContractCreation");
      const sSuccessMsg = this.oBundle.getText(bIsCreate ? "createSuccessMessage" : "editSuccessMessage");
      const sErrorMsg = this.oBundle.getText(bIsCreate ? "createErrorMessage" : "editErrorMessage");

      try {
        if (bIsCreate) {
          const sSuccessMsg = this.oBundle.getText("createSuccessMessage");
          const sErrorMsg = this.oBundle.getText("createErrorMessage");
          const sStartDateErrorMsg = this.oBundle.getText("startDateShouldBeEarlierThanEndDate");

          const startDate = formatter.formatDateByPattern(this.byId("startDateControl").getDateValue(), "yyyy-MM-dd");
          const endDate = formatter.formatDateByPattern(this.byId("endDateControl").getDateValue(), "yyyy-MM-dd");
          const startDateInMiliseconds = (new Date(startDate)).getTime();
          const endDateYearInMiliseconds = (new Date(endDate)).getTime();

          if (startDateInMiliseconds > endDateYearInMiliseconds) {
            MessageBox.error(sStartDateErrorMsg);
            return;
          }

          const oNewEntry = {
            description: this.byId("descriptionControl").getValue(),
            startDate,
            endDate,
            currency: this.byId("currencyControl").getSelectedKey(),
            status: this.byId("statusControl").getSelectedKey()
          };

          const oContext = this.oDataModel.bindList("/Contracts").create(oNewEntry, true);
          oContext.created().then(() => {
            MessageToast.show(sSuccessMsg);
            this.getOwnerComponent().getRouter().navTo("contract", { contractId: oContext.getObject().ID });
            this.oDataModel.refresh();
          }).catch(() => {
            MessageBox.error(sErrorMsg);
          });
        } else {
          const oContext = this.getView().getBindingContext("DataModel");
          const sSuccessMsg = this.oBundle.getText("saveSuccessMessage");

          this.oDetailConfigModel.setProperty("/isEditMode", false);
          this.oDetailConfigModel.setProperty("/isContractCreation", false);

          const sContractId = oContext.getObject().ID;

          this.getOwnerComponent()
            .getRouter()
            .navTo("contract", { contractId: sContractId });

          this.oDataModel.refresh();

        }
      } catch (error) {
        Log.error(bIsCreate ? "Can not create an contract" : "can not update the contract", error);
      }
    },

    onDeleteContract() {
      const oBundle = this.getView().getModel("i18n").getResourceBundle();

      MessageBox.confirm(oBundle.getText("contractDeleteConfirmationDialogText"), {
        actions: [MessageBox.Action.YES, MessageBox.Action.CLOSE],
        onClose: (sAction) => {
          if (sAction === MessageBox.Action.YES) {
            this._onDeleteContract();
          }
        },
      });
    },

    _onDeleteContract() {
      const oContext = this.getView().getBindingContext("DataModel");

      if (!oContext) {
        return;
      }

      const sSuccessMsg = this.oBundle.getText("deletionSuccessMessage");
      const sErrorMsg = this.oBundle.getText("deletionErrorMessage");

      oContext.delete()
        .then(() => {
          MessageToast.show(sSuccessMsg);
          this.onCloseDetailsPage();

          this.oDataModel.refresh();
        })
        .catch(() => {
          MessageBox.error(sErrorMsg);
        });
    },

    onCloseContract() {
      this.onCloseDetailsPage();
      this.oDataModel.resetChanges();
    },

    onCloseDetailsPage() {
      this.oDetailConfigModel.setProperty("/isEditMode", false);
      this.getView().getModel("oAppModel").setProperty("/layout", "OneColumn");
      this.getOwnerComponent().getRouter().navTo("RouteMain");
    },

    onEditContract(oEvent) {
      const sContractID = oEvent.getSource().getBindingContext("DataModel").getObject().ID;
      this.getOwnerComponent().getRouter().navTo("contract", {
        contractId: sContractID,
        query: {
          isEditMode: true
        }
      });
    },

    async onDeletePhases() {
      const oList = this.byId("phasesTable");
      const aPhasesContexts = oList.getSelectedItems().map((item) => item.getBindingContext("DataModel"));

      try {
        aPhasesContexts.forEach((product) => product.delete("defferedGroup"));

        await this.oDataModel.submitBatch("defferedGroup");

        const sSuccessMsg = this.oBundle.getText(oList.getSelectedItems().length > 1 ? "phasesDeletionSuccessMessagePlural" : "phasesDeletionSuccessMessageSingular");
        MessageToast.show(sSuccessMsg);
      } catch {
        const sErrorMsg = this.oBundle.getText("deletionPhaseErrorMessage");
        MessageBox.error(sErrorMsg)
      }

      oList.removeSelections();
    },

    onDeletePhaseFromContract() {
      const oBundle = this.getView().getModel("i18n").getResourceBundle();
      const oList = this.byId("phasesTable");
      const aPhases = oList.getSelectedItems();

      if (aPhases.length === 0 || aPhases.length > 1) {
        const sErrorMsg = this.oBundle.getText("editPhaseAmountErrorMessage");
        MessageBox.error(sErrorMsg)
      } else {
        MessageBox.confirm(oBundle.getText("productsDeleteConfirmationDialogText"), {
          actions: [MessageBox.Action.YES, MessageBox.Action.CLOSE],
          onClose: (sAction) => {
            if (sAction === MessageBox.Action.YES) {
              this.onDeletePhases();
            }
          },
        });
      }
    },

    // setInitialControlsValueState() {
    //   const aControls = this.PhaseChangingDialog.getContent()[0].getItems();

    //   aControls.forEach((oControl) => {
    //     oControl.setValueState("None");
    //   });
    // },

  //   async _onOpenPhaseDataCreateEditDialog(oSource = null, bIsCreate = true) {
  //   let oContext = {};

  //     try {
  //       if (!this.PhaseChangingDialog) {
  //         this.PhaseChangingDialog ??= await this.loadFragment({
  //           name: "phasemanagementui.view.fragments.PhaseChangingDialog",
  //           id: 'productCreationV4Dialog',
  //         });
  //       }

  //       if (bIsCreate) {
  //         const oList = this.byId("phasesTable");
  //         oList.removeSelections();

  //         oContext = this.oDataV4Model.bindList("/Phases").create(null, true);
  //       } else {
  //         oContext = oSource.getParent().getBindingContext("DataModel");
  //       }

  //       this.PhaseChangingDialog.setBindingContext(oContext, "DataModel");

  //       this.oDetailConfigModel.setProperty('/buttonSubmitText', this.oBundle.getText(bIsCreate ? "dialogAddButtonText" : "dialogSaveButtonText"));
  //       this.oDetailConfigModel.setProperty('/headerText', this.oBundle.getText(bIsCreate ? "phaseCreationDialogHeaderText" : "phaseEditDialogHeaderText"));
       
  //       this.setInitialControlsValueState();
  //       this.PhaseChangingDialog.open();
  //     } catch {
  //       Log.error("Cannot load phase change dialog");
  //     }
  // },

    // async onEditPhaseInContract(oEvent) {
    //   const oList = this.byId("phasesTable");
    //   const aPhases = oList.getSelectedItems()

    //   if (aPhases.length === 0 || aPhases.length > 1) {
    //     const sErrorMsg = this.oBundle.getText("editPhaseAmountErrorMessage");
    //     MessageBox.error(sErrorMsg)
    //   } else {
    //     this._onOpenPhaseDataCreateEditDialog(oEvent.getSource(), false);
    //   }
    // },

    // onAddPhaseToContract() {
    //   this._onOpenPhaseDataCreateEditDialog(null, true);
    // },

    // async onSubmitPhaseChanging() {
    //   const sText = oEvent.getSource().getText();
    //   const bIsCreate = sText === this.oBundle.getText("dialogAddButtonText");

    //   if (!this.validateForm()) {
    //     return;
    //   }

    //   const sSuccessMsg = this.oBundle.getText(bIsCreate ? "createPhaseSuccessMessage" : "editPhaseSuccessMessage");
    //   const sErrorMsg = this.oBundle.getText(bIsCreate ? "createPhaseErrorMessage" : "editPhaseErrorMessage");

    //   try {
    //     await this.oDataV4Model.submitBatch("defferedGroup");
    //     MessageToast.show(sSuccessMsg);
    //     this.oProductV4DataCreateEditDialog.close();

    //     this.byId("productsListV4").getBinding("items").refresh();
    //   } catch {
    //     MessageBox.error(sErrorMsg);
    //   }
    // },

    // onCancelPhaseChanging() {
    //   this.PhaseCreateEditDialog.close();
    //   this.oDataModel.resetChanges();
    // }
  });
});