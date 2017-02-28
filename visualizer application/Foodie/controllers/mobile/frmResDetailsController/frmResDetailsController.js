define({
    //Type your controller code here 
  restaurantObj:{},
  /****************************************************************
   *	Name	:	showRestaurantMenu
   *	Author	:	Kony
   *	Purpose	:	To show the menu of the restaurant.
   *****************************************************************/
  showRestaurantMenu:function(){
    try {
      var navigateObj = new kony.mvc.Navigation("frmRestaurantMenu");
      navigateObj.navigate(this.restaurantObj);
    } catch (exp) {
      kony.print(JSON.stringify(exp));
    }
  },
  /************************************************************************************
   *	Name	:	onNavigate
   *	Author	:	Kony
   *	Purpose	:	To initialize the widget of this formwhen the user navigates to it.
   ************************************************************************************/
    onNavigate: function(restaurantParameter) {
      var restaurant;
      if(restaurantParameter!==undefined){
  		this.restaurantObj=restaurantParameter;
        restaurant=restaurantParameter;
      }else{
        restaurant=this.restaurantObj;
      }
        kony.print("in the onNavigate of frmResDetails :" + JSON.stringify(restaurant));
        this.view.imgResIcon.src = restaurant["featured_image"];
      	if(restaurant["user_rating"].length!==undefined){
          this.view.lblRating.text = restaurant["user_rating"][0]["aggregate_rating"];
          this.view.lblUserRating.text = restaurant["user_rating"][0]["rating_text"];
          this.view.lblVotes.text = restaurant["user_rating"][0]["votes"];
        }else{
          this.view.lblRating.text = restaurant["user_rating"]["aggregate_rating"];
          this.view.lblUserRating.text = restaurant["user_rating"]["rating_text"];
          this.view.lblVotes.text = restaurant["user_rating"]["votes"];
        }
        this.view.lblName.text = restaurant["name"];
        this.view.lblCusines.text = restaurant["cuisines"];
      if(restaurant["locationObj"]!==undefined){
        this.view.lblAddress.text = restaurant["locationObj"][0]["address111"];
      }else{
        this.view.lblAddress.text = restaurant["location"]["address111"];
      }
        
        this.view.lblCost.text = restaurant["currency"] + " " + restaurant["average_cost_for_two"] + " for 2 people.";
    },
  /************************************************************************
   *	Name	:	makeRestaurantFavourite
   *	Author	:	Kony
   *	Purpose	:	To add the restaurant to the favourite list of the user.
   *************************************************************************/
   	makeRestaurantFavourite:function(){
      var controllerScope=this;
      function successCB(dataModel){
		var resDataObject = new kony.sdk.dto.DataObject("Restaurant");
    	var restaurant = {};
    	restaurant["aggregate_rating"] = controllerScope.restaurantObj["user_rating"][0]["aggregate_rating"];
    	restaurant["cuisines"] = controllerScope.restaurantObj["cuisines"];
        restaurant["device_id"] = kony.os.deviceInfo().deviceid;
        restaurant["name"] = controllerScope.restaurantObj["name"];
        restaurant["restaurant_id"] = controllerScope.restaurantObj["id"];
        restaurant["thumb"] = controllerScope.restaurantObj["thumb"];
        resDataObject.setRecord(restaurant);
    	dataModel.create({
        	dataObject: resDataObject
    	}, function(successResponse){
          kony.print("$$$$$$$$ creation success $$$$$$$"+JSON.stringify(successResponse));
          alert("restaurant added to your favourite list.");
          kony.model.ApplicationContext.dismissLoadingScreen();
        }, function(errorResponse){
          kony.print("$$$$$$$$$$$$$$$ errorResponse $$$$$$$$ "+JSON.stringify(errorResponse.getRootErrorObj()));
          //alert("unable to add to ");
          kony.model.ApplicationContext.dismissLoadingScreen();
        });
      }
      function errorCB(err){
        kony.print("$$$$$$$$$$$ err  $$$$$$$$$ "+JSON.stringify(err.getRootErrorObj()));
        kony.model.ApplicationContext.dismissLoadingScreen();
      }
      kony.model.ApplicationContext.showLoadingScreen("Please wait ..");
      kony.model.ApplicationContext.createModel("Restaurant","FavouriteRestaurant", {"access": "online"},
                                       {},successCB,errorCB);
    },
  /****************************************************************
   *	Name	:	locateRestaurant
   *	Author	:	Kony
   *	Purpose	:	To navigate the user to the map form.
   *****************************************************************/
    locateRestaurant:function(){
      try {
        var navigateTofrmMap = new kony.mvc.Navigation("frmMap");
        navigateTofrmMap.navigate(this.restaurantObj);
      } catch (exp) {
        kony.print(JSON.stringify(exp));
      }
    },
  /****************************************************************
   *	Name	:	navigateTofrmHome
   *	Author	:	Kony
   *	Purpose	:	To navigate the user to home form.
   *****************************************************************/
  navigateTofrmHome:function(){
    try {
      var navigateObj = new kony.mvc.Navigation("frmHome");
      navigateObj.navigate();
    } catch (exp) {
      kony.print(JSON.stringify(exp));
    }
  },
  /****************************************************************
   *	Name	:	getFavouriteRestaurant
   *	Author	:	Kony
   *	Purpose	:	To fetch the favoutite restaurants of the user.
   *****************************************************************/
    getFavouriteRestaurant: function() {
        var params = {};
        params.queryParams = {
            "$filter": "device_id eq "+"'"+kony.os.deviceInfo().deviceid+"'"
        };
        var navigateTofrmFavourite = new kony.mvc.Navigation("frmFavourite");
        var modelContext = new kony.model.ModelContext();
        modelContext.setRequestOptions("segRestaurant", params);
        navigateTofrmFavourite.setFormConfig(frmFavouriteConfig);
        navigateTofrmFavourite.setModelContext(modelContext);
        try {
            navigateTofrmFavourite.navigate();
        } catch (exp) {
            kony.print("Error in navigating the form");
        }
    }
});