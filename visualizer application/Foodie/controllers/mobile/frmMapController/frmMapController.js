define({ 
 //Type your controller code here 
  /*"btnClick":function btnClick(){
    alert("clicked");
  },*/
  /***************************************************************************************
   *	Name	:	onNavigate
   *	Author	:	Kony
   *	Purpose	:	To initialize the segment widget of the form when user navigate to it.
   ***************************************************************************************/
  onNavigate:function(restaurantObj){
    var controlerScope=this;
    var locationList=[];
    var location=new Object();
    	location={
          "lat":restaurantObj["locationObj"][0]["latitude"],
          "lon":restaurantObj["locationObj"][0]["longitude"],
          "calloutData": {"lblName":restaurantObj["name"],
                          "lblRating":restaurantObj["user_rating"][0]["aggregate_rating"],
                          "lblCusines":restaurantObj["cuisines"],
                          "imgIcon":{"src":restaurantObj["thumb"]},
                          "btnMapTemplate":{"text":"Get Directions","onClick":controlerScope.btnClick}
                         },
          "image":"restaurant.png",
          "showcallout":true
        };
    var deviceLocation=new Object();
    deviceLocation={
          "lat":RESTAURANT_CONFIG.LATITUDE,
          "lon":RESTAURANT_CONFIG.LONGITUDE,
          "image":"pinb.png",
          "name":"current location",
          "desc":" ",
          "showcallout":true
        };
    locationList.push(location);
    locationList.push(deviceLocation);
    this.view.mapLocation.containerHeight=100;
    this.view.mapLocation.locationData=locationList;
    this.view.mapLocation.navigateTo(0,true);
  },
  /***************************************************************************************
   *	Name	:	navigateTofrmFavourite
   *	Author	:	Kony
   *	Purpose	:	To navigate to the Favourite form.
   ***************************************************************************************/
  navigateTofrmFavourite:function(){
    try {
      var navigateTofrmMap = new kony.mvc.Navigation("frmFavourite");
      navigateTofrmMap.navigate();
    } catch (exp) {
      kony.print(JSON.stringify(exp));
    }
  },
  /***************************************************************************************
   *	Name	:	navigateTofrmHome
   *	Author	:	Kony
   *	Purpose	:	To navigate to the home form.
   ***************************************************************************************/
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
   *	Purpose	:	To fetch the favourite restaurants of the user.
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
  /*getDirection: function(widget,data){
    alert("setting direction");
  }*/
 });