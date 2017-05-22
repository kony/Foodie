define({
    //frmFavourite
    //Type your controller code here 
    restaurantList: [],
  /****************************************************************
   *	Name	:	getNearByRestaurant
   *	Author	:	Kony
   *	Purpose	:	To fetch the favourite restaurants of the device.
   *****************************************************************/
    getFavouriteRestaurant: function() {
      var controllerScope=this;
        function successCB(dataModel) {
            var resDataObject = new kony.sdk.dto.DataObject("Restaurant");
            var params = {};
          	params.dataObject = resDataObject;
        	params.queryParams = {
          	"$filter": "device_id eq "+"'"+kony.os.deviceInfo().deviceid+"'" +"and SoftDeleteFlag ne true",
        	};
            dataModel.fetch(params, function(response) {
                kony.print("$$$$$$$$ fetch success $$$$$$$" + JSON.stringify(response));
              	controllerScope.restaurantList=response;
              try{
              	var length=response.length;
              	var resObj={};
              	var resList=[];
              	for(var i=0;i<length;i++){
                	resObj={
      				"imgResIcon":{"src":response[i]["thumb"]},
      				"lblResName":{"text":response[i]["name"]},
      				"lblRating":{"text":response[i]["aggregate_rating"]},
      				"lblCuisines":{"src":response[i]["cuisines"]},
      				"lblLine":{"text":" "},
                    "imgDelete":{"src":"deletee.png"}
                };
    			resList.push(resObj);
               }
              controllerScope.view.segRestaurant.removeAll();
              controllerScope.view.segRestaurant.addAll(resList);
               /* try {
                    var navigateTofrmDetails = new kony.mvc.Navigation("frmResDetails");
                    var resObj = successResponse[0];
                    navigateTofrmDetails.navigate(resObj);
                } catch (exp) {
                    kony.print(JSON.stringify(exp));
                }*/
              }catch(exp){
                kony.print("error ")
              }
            }, function(errorResponse) {
                kony.print("$$$$$$$$$$$$$$$ errorResponse $$$$$$$$ " + JSON.stringify(errorResponse.getErrorObj()));
            });
        }
        function errorCB(err) {
            kony.print("$$$$$$$$$$$ err  $$$$$$$$$ " + JSON.stringify(err.getErrorObj()));
        }
        kony.model.ApplicationContext.createModel("Restaurant", "FavouriteRestaurant", {
            "access": "online"
        }, {}, successCB, errorCB);
      
      
      
      
        //var navigateTofrmFavourite = new kony.mvc.Navigation("frmFavourite");
        //var modelContext = new kony.model.ModelContext();
        //modelContext.setRequestOptions("segRestaurant", params);
        //navigateTofrmFavourite.setFormConfig(frmFavouriteConfig);
        //navigateTofrmFavourite.setModelContext(modelContext);
        /*try {
            navigateTofrmFavourite.navigate();
        } catch (exp) {
            kony.print("Error in navigating the form");
        }*/
    },
  /*************************************************************************
   *	Name	:	onNavigate
   *	Author	:	Kony
   *	Purpose	:	To perform the login operation on navigate to this form.
   *************************************************************************/
  onNavigate:function(data){
    var custmetrics=[{"favourite form":" from favourite"}];
    KNYMetricsService.sendCustomMetrics("frmFavourite",custmetrics);
    KNYMetricsService.flushEvents();
    this.getFavouriteRestaurant();
  },
  
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
      var resObj=controllerScope.restaurantList[parseInt(data["rowIndex"])];
        function successCB(dataModel) {
            var resDataObject = new kony.sdk.dto.DataObject("Restaurant");
           //resDataObject.setRecord(data["widgetInfo"]["selectedRowItems"][0]["primaryKeyValueMap"]);
          resDataObject.setRecord(resObj["primaryKeyValueMap"]);
            var params = {};
            params.dataObject = resDataObject;
          /*params.queryParams={
  				"device_id": kony.os.deviceInfo().deviceid
  				//"restaurant_id":  parseInt(data["rowIndex"])
			}*/
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
              		kony.model.ApplicationContext.dismissLoadingScreen();
                    kony.print("$$$$$$$$$$$$$$$ errorResponse $$$$$$$$ " + JSON.stringify(errorResponse.getErrorObj()));
              		
                });
        }
        function errorCB(err) {
          kony.model.ApplicationContext.dismissLoadingScreen();
            kony.print("$$$$$$$$$$$ err  $$$$$$$$$ " + JSON.stringify(err.getRootErrorObj()));
        }
      kony.model.ApplicationContext.showLoadingScreen("Removing ...");
        kony.model.ApplicationContext.createModel("Restaurant", "FavouriteRestaurant", {
            "access": "online"
        }, {}, successCB, errorCB);
    }
});