/**
 * Formatter Class - Provides data formatting functions
 */
 sap.ui.define([
	"sap/ui/base/Object", 
	"sap/ui/core/format/DateFormat",
	"./Constants",
    "./Utility"
], function (Object, DateFormat, Constants, Utility) {
	'use strict';
	var vformatter = DateFormat.getDateTimeInstance({pattern: Constants.DATE_FORMAT}, 
								sap.ui.getCore().getConfiguration().getLocale()); 
	return {
		/**
		 * format Quantity field
		 * @public
		 * @returns formatted Quantity value
		 */
		formatToSAPQuantity: function (sQty) {
			return sQty + '.000';
		},

		parseSAPQuantity: function(qty){
			return (!qty) ? "" : parseInt(qty,10);
		},
		
		/**
		 * Converts a given string to title case
		 * ex: 'joHN smITh' becomes 'John Smith' 
		 */
		toTitleCase: function (str) {
			return str.replace(
				/\w\S*/g,
				function (txt) {
					return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
				}
			);
		},
		
		/**
		 * Format EDM date to String Date
		 * **/		
		toFormattedDate: function(oDate) {
			if (!oDate) {
				return oDate;
			}
			return vformatter.format(new Date(oDate));
		},

		/**
		 * Format String date to EDM Date
		 * **/			
		toEDMDate: function (sDate) {
			if (!sDate) {
				return sDate;
			}			
			return formatter.parse(sDate); // returns: Sat Aug 01 2020 00:00:00 <timezone information, ex: GMT-0400>
		},
		
		yyyyMMddToFormattedDate: function (sDate) {
			if (!sDate) {
				return sDate;
			}			
			var sFormatter = DateFormat.getDateTimeInstance({ pattern: "yyyyMMdd"}, 
							sap.ui.getCore().getConfiguration().getLocale());
			var oDateEDM = sFormatter.parse(sDate); // parse to, for ex: Sat Aug 01 2020 00:00:00 <timezone information,ex:GMT-0400>
			return formatter.format(new Date(oDateEDM)); // returns: 2020-08-01 format
		},

		hhmmssToFormattedTime: function (sTime) {
			if (!sTime) {
				return sTime;
			}			
			return sTime.substring(0, 2) + ":" + sTime.substring(2, 4) + ":" + sTime.substring(4, 6);
		},

		/**
		 * Format JSON date to EDM Date
		 * **/		
		convertJSONToEDMDate: function(jDate){
			// var jDate = "/Date(1402166783294)/"; //JSON Date
			var sNumber = jDate.replace(/[^0-9]+/g,'');
			var iNumber = sNumber * 1; //trick seventeen
			var oDate = new Date(iNumber);	
			return oDate;
		},
		
		/**
		 * Format EDM date to EDM Date with timestamp set to 00:00:00
		 * This is used to fix the date increment happening after the date value is passed to OData
		 * Issue ex: Wed Jul 07 2021 20:00:00 GMT-0400 gets converted to Wed Jul 08 2021 00:00:00 GMT-0400
		 * To avoid the above issue, this function can be used to remove timestamp.  
		 * Result: Wed Jul 07 2021 00:00:00 GMT-0400
		 * **/			
		toEDMDateZeroHour: function(oDate){
			if (!oDate) {
				return null;
			}			
			return this.toEDMDate(this.toFormattedDate(oDate));
		},
		
		/**
		 * To remove leading zeroes from the value 
		 * **/
		trimLeadingZeros: function (sVal) {
			return Utility.trimLeadingZeros(sVal);	
		},	
		
	
		getTextCategory: function (sEqCategory) {
			return (sEqCategory === Constants.EQCAT_CUST_OWNED)? 
				this.getResourceBundleText("label.catRadio") : this.getResourceBundleText("label.catMobility");
		},
		
		compareValues: function (sVal1, sVal2) {
			return (sVal1 === sVal2);
		},

        set2Decimals: function (sVal) {
            return parseFloat(sVal).toFixed(2);
        }
	};
});