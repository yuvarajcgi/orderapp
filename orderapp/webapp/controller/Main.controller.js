sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "../utils/Utility",
    "../utils/MyFormatter"
],

    function (BaseController, JSONModel, Utility, MyFormatter) {
        "use strict";

        return BaseController.extend("test.orderapp.controller.Main", {
            formatter: MyFormatter,
            onInit: function () {
                this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
            },
 
            onRowSelect: function (oEvent) {
                var rowData = oEvent.getSource().getBindingContext().getObject();
                var sOrderId = rowData.OrderID;  

                var orderModel = new JSONModel();
                orderModel.setData(rowData);
                sap.ui.getCore().setModel(orderModel, "OrderModel");
                this.getOwnerComponent().getRouter().navTo("RouteOrderDetails", {
                    "orderNo":sOrderId
                });
            }             
            
        });
    });
