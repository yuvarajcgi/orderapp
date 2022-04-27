sap.ui.define([    
    "./BaseController",
    "sap/ui/model/odata/v2/ODataModel",
	"sap/ui/core/Fragment",
    "../utils/Utility",
    "../utils/Constants",
    "../utils/MyFormatter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController, ODataModel, Fragment, Utility, Constants, MyFormatter) {
        "use strict";

        return BaseController.extend("test.orderapp.controller.OrderDetails", {
            formatter: MyFormatter,
            onInit: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("RouteOrderDetails").attachMatched(this._onRouteMatched, this);  
                //Initialize busy indicator
                this.oGlobalBusyDialog = new sap.m.BusyDialog();
            },

            _onRouteMatched: function (oEvent) {                
                var orderHdrModel = sap.ui.getCore().getModel("OrderModel");
                this.getView().setModel(orderHdrModel, "OrderHDRModel");
                if (typeof orderHdrModel === "undefined"){
                    sap.m.MessageToast.show("Session has expired!");
                    this.onNavBack();
                    return;
                }
                var oArguments = oEvent.getParameter("arguments");
                var orderNo = parseInt(oArguments.orderNo);               
                this._getOrderDetails(orderNo);
            },  
            
            _getOrderDetails: function (vOrderId) {
                var that = this;
                var oDataModel = new ODataModel(Constants.SURL, false);
                var oFilter = [];

                this.oGlobalBusyDialog.open();

                oFilter.push(new sap.ui.model.Filter("OrderID", "EQ", vOrderId));
                oDataModel.read("/Order_Details", {
                    filters: oFilter,
                    success: function onSuccess(oData, oResponse) {
                        that.oGlobalBusyDialog.close();
                        var oModelOrderDetails = new sap.ui.model.json.JSONModel();
                        oModelOrderDetails.setData({
                            results: oData.results
                        });
                        var oTable = that.getView().byId("tbl_orderDetails");
                        oTable.setModel(oModelOrderDetails);
                        oTable.bindRows("/results");
                        oTable.setVisibleRowCount(oData.results.length);
                    },
                    error: function onError(oError) {
                        that.oGlobalBusyDialog.close();
                        that.handleError(oError, that);
                    }
                });           
            },
            
            onShowProduct: function (oEvent) {
                var rowData = oEvent.getSource().getBindingContext();
                var prodId = this.getView().byId("tbl_orderDetails").getModel().getProperty("ProductID", rowData);

                this._getProductDetails(prodId);
                // this._openDialogProdDetails();                
            },
 
            _getProductDetails: function (vProductId) {
                var that = this;
                var oDataModel = new sap.ui.model.odata.v2.ODataModel(Constants.SURL, false);
                var oFilter = [];

                this.oGlobalBusyDialog.open();

                oFilter.push(new sap.ui.model.Filter("ProductID", "EQ", vProductId));
                oDataModel.read("/Products", {
                    filters: oFilter,
                    success: function onSuccess(oData, oResponse) {
                        that.oGlobalBusyDialog.close();
                        var oModelProdDetails = new sap.ui.model.json.JSONModel();
                        oModelProdDetails.setData(oData.results[0]);
                        that._getCategoryInfo(oData.results[0].CategoryID);
                        that._getSupplierInfo(oData.results[0].SupplierID);
                        that.getView().setModel(oModelProdDetails, "ProductModel");
                    },
                    error: function onError(oError) {
                        that.oGlobalBusyDialog.close();
                        that.handleError(oError, that);
                    }
                });
            },         

            _openDialogProdDetails: function () {
                var oView = this.getView();
                var fragmentProdDetails = "test.orderapp.view.fragment.ProductDetail";

                if(!this.byId("dlg_prodDetail")) {
                    Fragment.load({
                        id: oView.getId(),
                        name: fragmentProdDetails,
                        type: "XML",
                        controller: this
                    }).then(
                        function (oDialog) {
                            oView.addDependent(oDialog);
                            oDialog.open();
                        }
                    );
                } else {
                    this.byId("dlg_prodDetail").open();
                }
            },

            onCloseProdDetail: function (oEvent) {
                this.byId("dlg_prodDetail").close();
            },   
            
            _getCategoryInfo: function (vCategoryId) {
                var that = this;
                var oDataModel = new sap.ui.model.odata.v2.ODataModel(Constants.SURL, false);
                var oFilter = [];

                this.oGlobalBusyDialog.open();

                oFilter.push(new sap.ui.model.Filter("CategoryID", "EQ", vCategoryId));
                oDataModel.read("/Categories", {
                    filters: oFilter,
                    success: function onSuccess(oData, oResponse) {
                        that.oGlobalBusyDialog.close();
                        var oModelCategory = new sap.ui.model.json.JSONModel();
                        oModelCategory.setData(oData.results[0]);
                        that.getView().setModel(oModelCategory, "CategoryModel");
                    },
                    error: function onError(oError) {
                        that.oGlobalBusyDialog.close();
                        that.handleError(oError, that);
                    }
                });               
            },

            _getSupplierInfo: function (vSupplierId) {
                var that = this;
                var oDataModel = new sap.ui.model.odata.v2.ODataModel(Constants.SURL, false);
                var oFilter = [];

                this.oGlobalBusyDialog.open();

                oFilter.push(new sap.ui.model.Filter("SupplierID", "EQ", vSupplierId));
                oDataModel.read("/Suppliers", {
                    filters: oFilter,
                    success: function onSuccess(oData, oResponse) {
                        that.oGlobalBusyDialog.close();
                        var oModelSupplier = new sap.ui.model.json.JSONModel();
                        oModelSupplier.setData(oData.results[0]);
                        that.getView().setModel(oModelSupplier, "SupplierModel");
                    },
                    error: function onError(oError) {
                        that.oGlobalBusyDialog.close();
                        that.handleError(oError, that);
                    }
                });               
            },            
        });
    });
