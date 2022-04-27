/**
 * Utility Class - Provides generic utility functions
 */
 sap.ui.define([
	"./Constants",
	"./Utility"
], function (Constants, Utility) {
	'use strict';

	var util = {
		/**
		 * Return the current user language as specified in the user settings.
		 * @returns {string} the language parameter as expected by the services input
		 */
		getLanguage: function () {
			var sapLanguage = sap.ui.getCore().getConfiguration().getLanguage().toUpperCase();
			if (sapLanguage && ["EN", "FR"].indexOf(sapLanguage) !== -1) {
				return sapLanguage;
			}
			return "EN";
		},

		/**
		 * Parses the specified string into floating-point number 
		 * @param {string} sValue The string o be parsed 
		 * @return {float}  The corresponding floating point number, or 0.0 if the string could not be parsed.
		 */
		parseFloatValue: function (sValue) {
			var fResult = parseFloat(sValue);

			if (isNaN(fResult)) {
				fResult = 0.0;
			}
			return fResult;
		},
		
		/**
		 * The following function will treat the first element of the array as the keys for the objects properties. 
		 * It will then loop over the remaining elements, and convert them into an object using these keys.
		 * */
		convertToArrayOfObjects: function (data) {
			var keys = data.shift(),
				i = 0,
				k = 0,
				obj = null,
				output = [];

			for (i = 0; i < data.length; i++) {
				obj = {};
				for (k = 0; k < keys.length; k++) {
					obj[keys[k]] = data[i][k];
				}
				output.push(obj);
			}
			return output;
		},

		generateRandomString: function (sLength) {
			var result = '';
			var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
			var charactersLength = characters.length;
			for (var i = 0; i < sLength; i++) {
				result += characters.charAt(Math.floor(Math.random() *
					charactersLength));
			}
			return result;
		},

		
		/**
		 * Return the unique values of the specified key from the object array
		 * @returns {distinct[]} the array of distinct values
		 */
		getDistinctValuesOf: function (oArray, sKey, bNoBlank) {
			var unique = [];
			var distinct = [];
			var val = "";
			for (var i = 0; i < oArray.length; i++) {
				val = oArray[i][sKey];
				val = (val === undefined) ? "" : val;
				if (!(val.trim() === "" && bNoBlank)) {
					if (!unique[oArray[i][sKey]]) {
						distinct.push(oArray[i][sKey]);
						unique[oArray[i][sKey]] = 1;
					}
				}
			}
			return distinct;
		},
		
		/**
		 * To remove leading zeroes from the value 
		 * **/
		trimLeadingZeros: function (sVal) {
			sVal = sVal.toString();
			var c;
			for (var i = 0; i < sVal.length; i++) {
				c = sVal.charAt(i);
				if (c !== '0') {
					return sVal.substring(i);
				}
			}
			return sVal;
		},		

		/**
		 * Remove leading zeros from string
		 * @param  {string} sValue a string that contains leading zeros
		 * @return {string}        a string without leading zeros
		 *
		 * @public
		 */
		noLeadingZerosFromString: function (sValue) {
			var sResult = "";
			if (sValue) {
				sResult = sValue.replace(/^0+/, '');
				// if only zeros, return original values
				if (!sResult) {
					sResult = sValue;
				}
			}
			return sResult;
		},


		/**
		 * Validates the specified field and sets the error state of that field accordingly.
		 * 
		 * @param {string} field The field.
		 * @param {boolean} isNumeric If true, the field is numeric.
		 * @param {boolean} mustBeGreaterThanZero If true, the field must have a numeric value that's greater than zero (ignored if isNumeric is false).
		 * @param {boolean} canBeEmpty If true, the field can be "" or null
		 * @param {boolean} isComboBox If true, the field is a combo box, We will validate the selected value is part of the list.
		 * @param {boolean} isSearchField If true, the field is a search field
		 * @result {boolean} true if the value is valid and false otherwise.
		 */
		validateField: function (field, isNumeric, mustBeGreaterThanZero, canBeEmpty, isComboBox, isSearchField) {
			var result = false;

			if (field) {
				// get the value entered in the field 
				var value = field.getValue().trim();

				// validate numeric value
				if (isNumeric) {
					var numValue = Utility.parseFloat(value);
					if (isNaN(numValue)) {
						if (!isSearchField) {
							field.setValueState(sap.ui.core.ValueState.Error);
						}
						return result;
					}
				}

				// if the value is empty the return the field's error state accordingly
				if (!canBeEmpty && !isSearchField && (!value || value === "" || (isNumeric && mustBeGreaterThanZero && Utility.parseFloat(
						value) <= 0))) {
					field.setValueState(sap.ui.core.ValueState.Error);
				} else {
					if (isComboBox) {
						var selectedKey = field.getSelectedKey();
						if (!selectedKey) {
							field.setValueState(sap.ui.core.ValueState.Error);
							return result;
						}
					}
					result = true;
					if (!isSearchField) {
						field.setValueState(sap.ui.core.ValueState.None);
					}
				}
			}
			return result;
		},

		/**
		 * For checking if a string is empty, null or undefined, use:
		 * @param {string} the string to check
		 */
		isEmpty: function (str) {
			return (!str || 0 === str.length);
		}
	};
	return util;
});