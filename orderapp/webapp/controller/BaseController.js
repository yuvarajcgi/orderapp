sap.ui.define([
	"jquery.sap.global",
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"../utils/Constants",
	"../utils/Utility"
], function (jQuery, Controller, MessageToast, JSONModel, History, Constants, Utility) {
	"use strict";

	return Controller.extend("test.orderapp.controller.BaseController", {
		/**
		 * Convenience method for accessing the router in every controller of the application.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter: function () {
			return this.getOwnerComponent().getRouter();
		},

		/**
		 * Convenience method to get the resource bundle.
		 * @public
		 * @returns resource text in the i18n resourceModel that corresponds to the sKey
		 */
		getResourceBundleText: function (sKey) {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle().getText(sKey);
		},

		/**
		 * Convenience method to get a resource text from the message bundle based on the provided key
		 * @public
		 * @returns messageText in the message Bundle that corresponds to the sKey
		 */
		getMessageBundleText: function (sKey) {
			jQuery.sap.require("jquery.sap.resources");
			var sLocale = sap.ui.getCore().getConfiguration().getLanguage();
			var oBundle = jQuery.sap.resources({
				url: "i18n/messageBundle.properties",
				locale: sLocale
			});
			return oBundle.getText(sKey);
		},

		/**
		 * Navigates back in the browser history, if the entry was created by this app.
		 * If not, it navigates to a route passed to this function.
		 * 
		 * @public
		 * @param {string} sRoute the name of the route if there is no history entry
		 * @param {object} mData the parameters of the route, if the route does not need parameters, it may be omitted.
		 */
		onNavBack1: function (sRoute, mData) {
			var oHistory, sPreviousHash;
			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();
			sRoute = (sRoute === undefined || sRoute === "") ? "RouteMain" : sRoute;
			if (sPreviousHash !== undefined && !sRoute) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo(sRoute, mData, true /*no history*/ );
			}
		},

		onNavBack: function (sRoute, mData) {
			this.getRouter().navTo("RouteMain" );
		},

		/**
		 * Validation method to check if the entered value in combobox field matches with one of the keys
		 * @public
		 * @returns {boolean} the resourceModel of the component
		 */
		validateComboBox: function (oField, sMsgKey) {
			var sSelectedKey = oField.getSelectedKey();
			var sValue = oField.getValue();
			if (!sSelectedKey && sValue) {
				oField.setValueState(sap.ui.core.ValueState.Error);
				oField.setValueStateText(this.getMessageBundleText(sMsgKey));
				return false;
			} else {
				oField.setValueState(sap.ui.core.ValueState.None);
				oField.setValueStateText("");
			}
			return true;
		},
		
		checkOnSelection: function(oEvent){
			var oInput = oEvent.getSource();
	        var bValid = oInput.getSelectedKey();
	        oInput.setValueState(!bValid ? "Error" : "None");	
	        return bValid;			
		},

		/**
		 * Validation method to check if the entered value in input field matches with one of the entries
		 * @public
		 * @returns {boolean} the resourceModel of the component
		 */
		validateSuggestions: function (oField, sKeyName, data, sMsgKey) {
			var sValue = oField.getValue();
			var found = false;
			for (var i = 0; i < data.length; i++) {
				if (data[i][sKeyName] === sValue) {
					found = true;
				}
			}
			if (!found) {
				oField.setValueState(sap.ui.core.ValueState.Error);
				oField.setValueStateText(this.getMessageBundleText(sMsgKey));
			} else {
				oField.setValueState(sap.ui.core.ValueState.None);
				oField.setValueStateText("");
			}
			return found;
		},

		/**
		 * Validation method to check if value in the provided field is empty
		 * @public
		 * @returns {boolean} the resourceModel of the component
		 */
		validateFieldNotEmpty: function (oField, sMsgKey) {
			var sValue = oField.getValue();
			if (sValue === null || sValue === "") {
				// oField.setValueState(sap.ui.core.ValueState.Error);
				// oField.setValueStateText(this.getMessageBundleText(sMsgKey));	
				MessageToast.show(this.getMessageBundleText(sMsgKey));
				return false;
			}
			return true;
		},

		/**
		 * Validation method to check if value in the provided field contains only letters and numbers
		 * @public
		 * @returns {boolean} the resourceModel of the component
		 */
		validateIsAlphaNumeric: function (oField, sMsgKey, bAllowSpace, bAllowAsterisk) {
			var sValue = oField.getValue();
			var bIsValid = false;
			var letterNumber;

			//initialize value state with no error
			oField.setValueState(sap.ui.core.ValueState.None);
			oField.setValueStateText("");

			if (bAllowSpace) {
				letterNumber = /^[0-9a-zA-Z ]+$/;
			} else {
				letterNumber = /^[0-9a-zA-Z]+$/;
			}
			if ((sValue.trim() === "" && bAllowSpace) || (sValue.indexOf("*") >= 0 && bAllowAsterisk) || (sValue.match(letterNumber))) {
				bIsValid = true;
			} else {
				oField.setValueState(sap.ui.core.ValueState.Error);
				oField.setValueStateText(this.getMessageBundleText(sMsgKey));
				// MessageToast.show(this.getMessageBundleText(sMsgKey));
				bIsValid = false;
			}
			return bIsValid;
		},

		/**
		 * Validate field value greater than zero
		 * @public
		 * @returns {boolean}
		 */
		validateGTZero: function (oField, sMsgKey) {
			var sValue = Utility.parseFloatValue(oField.getValue());
			if (sValue <= 0) {
				oField.setValueState(sap.ui.core.ValueState.Error);
				oField.setValueStateText(this.getMessageBundleText(sMsgKey));
				return false;
			} else {
				oField.setValueState(sap.ui.core.ValueState.None);
				oField.setValueStateText("");
			}
			return true;
		},

		resetValueState: function (oField) {
			oField.setValueState(sap.ui.core.ValueState.None);
			oField.setValueStateText("");
		},

		toPrint: function (sPrintTitle, sPrintArea) {
			var aStylePath = [];
			var sAppUrl = sap.ui.require.toUrl(Constants.APP_URL);
			aStylePath.push(this.createLinkTag(sAppUrl + "/css/style.css"));
			// aStylePath.push(this.createLinkTag(sAppUrl + "/css/printstyle.css"));
			aStylePath.push(this.createLinkTag(sAppUrl + "/css/sapuilayout.css"));
			aStylePath.push(this.createLinkTag(sAppUrl + "/css/sapuicore.css"));
			aStylePath.push(this.createLinkTag(sAppUrl + "/css/sapm.css"));

			var headContent = "<html><head><title>" + sPrintTitle + "</title>" + aStylePath.join(" ") + "</head><body>";
			var closeContent = "</body></html>";
			var oTarget = this.getView().byId(sPrintArea);
			if (oTarget) {
				var $domTarget = oTarget.$()[0];
				var sBodyContent = $domTarget.innerHTML;
				var htmlPage = headContent + sBodyContent + closeContent;
				var printWindow = window.open("", sPrintTitle);
				printWindow.document.write(htmlPage);
				printWindow.onload = setTimeout(function () {
					printWindow.print();
				}, 2000);
			} else {
				//For technical team only
				jQuery.sap.log.error(sPrintTitle + ": toPrint() needs a valid target container!");
			}
		},

		createLinkTag: function (sCSSPath) {
			return "<link type='text/css' rel='stylesheet' href='" + sCSSPath + "'/>";
		},

		handleError: function (oError, that) {
			var arr = JSON.parse(oError.responseText).error.innererror.errordetails;
			var sErrMsg = '';
			for (var i = 1; i < arr.length; i++) {
				sVal = sVal + '\n' + arr[i].message + '\n';
			}			
			var msgTitle = that.getResourceBundleText("title_Error");
			sap.m.MessageBox.error(sVal, {
				title: msgTitle, // default
				onClose: null, // default
				styleClass: "", // default
				actions: sap.m.MessageBox.Action.CLOSE, // default
				emphasizedAction: null, // default
				initialFocus: null, // default
				textDirection: sap.ui.core.TextDirection.Inherit // default
			});			
		}
	});
});