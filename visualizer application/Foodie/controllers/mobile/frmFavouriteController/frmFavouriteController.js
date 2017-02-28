define({
    //frmFavourite
    //Type your controller code here 
    restaurantList: [],
  /********************************************************************************
   *	Name	:	navigateToFormHome
   *	Author	:	Kony
   *	Purpose	:	To navigate to the home form.
   ********************************************************************************/
    navigateTofrmHome: function() {
        try {
            var navigateObj = new kony.mvc.Navigation("frmHome");
            navigateObj.navigate();
        } catch (exp) {
            kony.print(JSON.stringify(exp));
        }
    },
    /****************************************************************
     *	Name	:	onFetchData
     *	Author	:	Kony
     *	Purpose	:	To store the backend response data.
     *****************************************************************/
    onFetchData: function(sc, ec) {
        var myController = this;
        function success(data) {
            kony.print("in sc of frmRestaurant controller:" + JSON.stringify(data));
            myController.restaurantList = data._raw_response_.segRestaurant.records;
            sc(data);
        }
        function error(err) {
            kony.print("in error of frmRestaurant controller:" + JSON.stringify(err.getRootErrorObj()));
            ec(err);
        }
        kony.model.ApplicationContext.showLoadingScreen("Loading restaurants ...");
        this.fetchData(success, error);
    },
  	/****************************************************************
     *	Name	:	fetchRestaurant
     *	Author	:	Kony
     *	Purpose	:	To fetch the details of restaurant.
     *****************************************************************/
    fetchRestaurant: function() {
        var selectedRowIndex = this.view.segRestaurant.selectedRowIndex[1];
        var controllerScope = this;
        kony.print("in fetchRestaurant");
        function successCB(dataModel) {
            var resDataObject = new kony.sdk.dto.DataObject("Restaurant");
            var params = {};
            params.dataObject = resDataObject;
            params.headers = {
                "user-key": RESTAURANT_CONFIG.USER_KEY
            };
            params.queryParams = {
                restaurant_id: controllerScope.restaurantList[selectedRowIndex].restaurant_id
            };
            dataModel.fetch(params, function(successResponse) {
                kony.print("$$$$$$$$ fetch success $$$$$$$" + JSON.stringify(successResponse));
                try {
                    var navigateTofrmDetails = new kony.mvc.Navigation("frmResDetails");
                    var resObj = successResponse[0];
                    navigateTofrmDetails.navigate(resObj);
                } catch (exp) {
                    kony.print(JSON.stringify(exp));
                }
            }, function(errorResponse) {
                kony.print("$$$$$$$$$$$$$$$ errorResponse $$$$$$$$ " + JSON.stringify(errorResponse.getRootErrorObj()));
            });
        }
        function errorCB(err) {
            kony.print("$$$$$$$$$$$ err  $$$$$$$$$ " + JSON.stringify(err.getRootErrorObj()));
        }
        kony.model.ApplicationContext.createModel("Restaurant", "RestaurantDetails", {
            "access": "online"
        }, {}, successCB, errorCB);

    },
	/****************************************************************
     *	Name	:	removeFavouriteRestaurant
     *	Author	:	Kony
     *	Purpose	:	To remove the restaurant from favourite list.
     *****************************************************************/
    removeFavouriteRestaurant: function(widget, data) {
      var controllerScope=this;
        function successCB(dataModel) {
            var resDataObject = new kony.sdk.dto.DataObject("Restaurant");
            resDataObject.setRecord(data["widgetInfo"]["selectedRowItems"][0]["primaryKeyValueMap"]);
            var params = {};
            params.dataObject = resDataObject;
            dataModel.remove(params, function(successResponse) {
                    kony.print("$$$$$$$$ fetch success $$$$$$$" + JSON.stringify(successResponse));
                    var sectionIndex = data["sectionIndex"];
                    var rowIndex = parseInt(data["rowIndex"]);
                    var seg = data["widgetInfo"];
                    var transformProp1 = kony.ui.makeAffineTransform();
                    transformProp1.scale(1, 0);
                    var transformProp3 = kony.ui.makeAffineTransform();
                    transformProp3.scale(1, 1);
                    var animDefinitionOne = {
                        0: {
                            "transform": transformProp3
                        },
                        100: {
                            "transform": transformProp1
                        }
                    };
                    var animDefinition = kony.ui.createAnimation(animDefinitionOne);
                    var animConfig = {
                        "duration": 0.3,
                        "iterationCount": 1,
                        "delay": 0,
                        "fillMode": kony.anim.FORWARDS
                    };
                    var finalAnimation = {
                        definition: animDefinition,
                        config: animConfig
                    };
                    kony.print("\nrow index:-" + parseInt(rowIndex));
                    controllerScope.view.segRestaurant.removeAt(rowIndex, 0, finalAnimation);
              		kony.model.ApplicationContext.dismissLoadingScreen();
                },
                function(errorResponse) {
                    kony.print("$$$$$$$$$$$$$$$ errorResponse $$$$$$$$ " + JSON.stringify(errorResponse.getRootErrorObj()));
              		kony.model.ApplicationContext.dismissLoadingScreen();
                });
        }
        function errorCB(err) {
            kony.print("$$$$$$$$$$$ err  $$$$$$$$$ " + JSON.stringify(err.getRootErrorObj()));
          kony.model.ApplicationContext.dismissLoadingScreen();
        }
      kony.model.ApplicationContext.showLoadingScreen("Removing ...");
        kony.model.ApplicationContext.createModel("Restaurant", "FavouriteRestaurant", {
            "access": "online"
        }, {}, successCB, errorCB);
    }
});