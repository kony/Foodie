define({ 
 //Type your controller code here 
  cityList:[],
  cityMaster:[] ,
  cuisineList:[],
  cuisineMaster:[],
  restaurantList:[],
  
  /**********************************************************************************
   *	Name	:	navigateTofrmHome
   *	Author	:	Kony
   *	Purpose	:	To Navigate the user to form Home.
   ***********************************************************************************/
  navigateTofrmHome: function() {
    try {
      var navigateObj = new kony.mvc.Navigation("frmHome");
      navigateObj.navigate();
    } catch (exp) {
      kony.print(JSON.stringify(exp));
    }
  },
  /**********************************************************************************
   *	Name	:	onMyRowClick
   *	Author	:	Kony
   *	Purpose	:	To Navigate to the frmResdetails form on row click of the segment.
   ***********************************************************************************/
  onMyRowClick: function() {
    var selectedRowIndex = this.view.segRestaurant.selectedRowIndex[1];
    try {
      var navigateTofrmDetails = new kony.mvc.Navigation("frmResDetails");
      var resObj = this.restaurantList[selectedRowIndex];
      navigateTofrmDetails.navigate(resObj);
    } catch (exp) {
      kony.print(JSON.stringify(exp));
    }
  },
  /**********************************************************************************
   *	Name	:	searchRestaurant
   *	Author	:	Kony
   *	Purpose	:	Search for the restaurant on selected user inputs.
   ***********************************************************************************/
  searchRestaurant:function(){
    var cityIndex ;
    var selectedKeyValue;
    var entity_id;
    try{
      cityIndex=this.view.segCity.selectedRowIndex[1];
      entity_id=this.cityList[cityIndex]["entity_id"];
      selectedKeyValue=this.view.lstBoxCuisines.selectedKeyValue;
      //alert("selectedRowIndex:"+cityIndex+"\nselectedCusines :"+selectedKeyValue[1]);
      var controllerScope=this;
      var client = kony.sdk.getCurrentInstance();
      var intgService;
      	intgService = client.getIntegrationService(RESTAURANT_CONFIG.RESTAURANT_INTEGRATION_SERVICE);
		intgService.invokeOperation(RESTAURANT_CONFIG.GET_RESTAURANT_OPERATION ,
             {"user-key":RESTAURANT_CONFIG.USER_KEY },
             {"entity_id":entity_id,"entity_type":"group","cuisines":selectedKeyValue[1]},
              function(response){
          		if(response.restaurants===undefined){
                  alert("No result found");
                  return;
                }
    			controllerScope.restaurantList=response.restaurants;
         		kony.print("success response: "+JSON.stringify(response));
          		var resObj={};
  				var resList=[];
  				for(var i=0;i<controllerScope.restaurantList.length;i++){
    				resObj={
      					"imgResIcon":{"src":controllerScope.restaurantList[i]["thumb"]},
      					"lblResName":{"text":controllerScope.restaurantList[i]["name"]},
      					"lblRating":{"text":controllerScope.restaurantList[i]["user_rating"]["aggregate_rating"]},
                      	"lblCuisines":{"text":controllerScope.restaurantList[i]["cuisines"]}
    				};
    				resList.push(resObj);
  				}
          controllerScope.view.segRestaurant.removeAll();
          controllerScope.view.segRestaurant.addAll(resList);
          controllerScope.showRestaurant();
        },controllerScope.integFailureCallback);
	 }catch(excp){
	 	kony.print(JSON.stringify(excp));
	 }
  },
  /**********************************************************************************
   *	Name	:	segOnRowClick
   *	Author	:	Kony
   *	Purpose	:	To load the cuisines for the selected city.
   ***********************************************************************************/
  segOnRowClick:function(){
    var selectedRowIndex = this.view.segCity.selectedRowIndex[1];
    this.view.txtBoxCity.text=this.cityList[selectedRowIndex]["title"];
    var custmetrics=[{"searched city":this.cityList[selectedRowIndex]["title"]}];
    KNYMetricsService.sendCustomMetrics("frmOrder",custmetrics);
    KNYMetricsService.flushEvents();
    this.hideCity();
    this.view.flxCuisines.setVisibility(true);
    this.loadCuisines();
  },
  /**********************************************************************************
   *	Name	:	loadCuisines
   *	Author	:	Kony
   *	Purpose	:	To load the cuisines.
   ***********************************************************************************/
  loadCuisines:function(){
    this.view.lstBoxCuisines.selectedKey=null;
    var cityIndex=this.view.segCity.selectedRowIndex[1];
    var cityId=this.cityList[cityIndex]["city_id"];
    var controllerScope=this;
    var client = kony.sdk.getCurrentInstance();
    var intgService;
    try{
      	kony.model.ApplicationContext.showLoadingScreen("retrieving cuisines in the city..");
      	intgService = client.getIntegrationService(RESTAURANT_CONFIG.RESTAURANT_INTEGRATION_SERVICE);
		intgService.invokeOperation(RESTAURANT_CONFIG.GET_CUISINES_OPERATION,
             {"user-key":RESTAURANT_CONFIG.USER_KEY},
             {"city_id":cityId},
              function(response){
    			controllerScope.cuisineList=response.cuisines;
    			var arr=[];
    			for(var i=0;i<controllerScope.cuisineList.length;i++){
      				arr=[];
      				arr.push(controllerScope.cuisineList[i]["cuisine_id"]);
      				arr.push(controllerScope.cuisineList[i]["cuisine_name"]);
      				controllerScope.cuisineMaster.push(arr);
    			}
          controllerScope.view.lstBoxCuisines.masterData=controllerScope.cuisineMaster;
          kony.print("success response: "+JSON.stringify(response));
          kony.model.ApplicationContext.dismissLoadingScreen();
        },controllerScope.integFailureCallback);
	 }catch(excp){
       kony.model.ApplicationContext.dismissLoadingScreen();
       kony.print(JSON.stringify(excp));
	 }
  },
  /**********************************************************************************
   *	Name	:	integFailureCallback
   *	Author	:	Kony
   *	Purpose	:	failure callback for the integration service.
   ***********************************************************************************/
  integFailureCallback:function(err){
    kony.print("error response: "+JSON.stringify(resperronse));
    kony.model.ApplicationContext.dismissLoadingScreen();
    alert("No result found");
  },
  /**********************************************************************************
   *	Name	:	getCity
   *	Author	:	Kony
   *	Purpose	:	Search the city for the givent input parameters.
   ***********************************************************************************/
  getCity:function(){
    this.view.flxCuisines.setVisibility(false);
    this.hideRestaurant();
    var controllerScope=this;
    var client = kony.sdk.getCurrentInstance();
    var intgService;
    var cityKey=this.view.txtBoxCity.text;
    if(cityKey===""||cityKey===null){
      alert("please enter city name..");
      return;
    }
    try{
      	intgService = client.getIntegrationService(RESTAURANT_CONFIG.RESTAURANT_INTEGRATION_SERVICE);
		intgService.invokeOperation(RESTAURANT_CONFIG.GET_CITY_OPERATION,
             {"user-key":RESTAURANT_CONFIG.USER_KEY},
             {"city":cityKey,"count":"5"},
              function(response){
    			controllerScope.cityList=response.cities;
          		var cityObj={};
          		var cities=[];
    			for(var i=0;i<controllerScope.cityList.length;i++){
      				cityObj={};
                  	cityObj={
      					"lblTitle":{"text":controllerScope.cityList[i]["title"]},
      					"lblCity":{"text":controllerScope.cityList[i]["city_name"]}
    				};
                  cities.push(cityObj);
    			}
    			controllerScope.view.segCity.removeAll();
          		controllerScope.view.segCity.addAll(cities);
    			kony.print("success response: "+JSON.stringify(response));
          		controllerScope.showCity();
  				},controllerScope.integFailureCallback);
	 }catch(excp){
	 	kony.print(JSON.stringify(excp));
	 }
  },
  /**********************************************************************************
   *	Name	:	hideCity
   *	Author	:	Kony
   *	Purpose	:	To hide the flex container having city list.
   ***********************************************************************************/
  hideCity:function(){
    this.view.flxCityContainer2.animate(kony.ui.createAnimation({
      100: {
        top: "100%",
        "stepConfig": {}
      }}), {
      delay: 0,
      fillMode: kony.anim.FILL_MODE_FORWARDS,
      duration: .40
    }, {
      animationEnd: function() {}
    });
  },
  /**********************************************************************************
   *	Name	:	showCity
   *	Author	:	Kony
   *	Purpose	:	To show the flex container having city list.
   ***********************************************************************************/
  showCity:function(){
    this.view.flxCityContainer2.animate(kony.ui.createAnimation({
      100: {
        top: "70%",
        "stepConfig": {}
      }
    }),{
      delay: 0,
      fillMode: kony.anim.FILL_MODE_FORWARDS,
      duration: .40
    }, {
      animationEnd: function() {}
    });
  },
  /**********************************************************************************
   *	Name	:	hideRestaurant
   *	Author	:	Kony
   *	Purpose	:	To hide the flex container having list of restaurant.
   ***********************************************************************************/
   hideRestaurant:function(){
    this.view.flxRestaurantContainer.animate(kony.ui.createAnimation({
      100: {
        top: "100%",
        "stepConfig": {}
      }}), {
      delay: 0,
      fillMode: kony.anim.FILL_MODE_FORWARDS,
      duration: .40
    }, {
      animationEnd: function() {}
    });
  },
  /**********************************************************************************
   *	Name	:	showRestaurant
   *	Author	:	Kony
   *	Purpose	:	To show the flex container having list of restaurant.
   ***********************************************************************************/
  showRestaurant:function(){
    this.view.flxRestaurantContainer.animate(kony.ui.createAnimation({
      100: {
        top: "30%",
        "stepConfig": {}
      }
    }),{
      delay: 0,
      fillMode: kony.anim.FILL_MODE_FORWARDS,
      duration: .40
    }, {
      animationEnd: function() {}
    });
  },
  /****************************************************************
   *	Name	:	getFavouriteRestaurant
   *	Author	:	Kony
   *	Purpose	:	To load and display the favourite restaurnat of the user.
   *****************************************************************/
   getFavouriteRestaurant: function() {
        var params = {};
        params.queryParams = {
            "$filter": "device_id eq "+"'"+kony.os.deviceInfo().deviceid+"'"
        };
        var navigateTofrmFavourite = new kony.mvc.Navigation("frmFavourite");
        var modelContext = new kony.model.ModelContext();
       // modelContext.setRequestOptions("segRestaurant", params);
        //navigateTofrmFavourite.setFormConfig(frmFavouriteConfig);
        //navigateTofrmFavourite.setModelContext(modelContext);
        try {
            navigateTofrmFavourite.navigate();
        } catch (exp) {
            kony.print("Error in navigating the form");
        }
    },
 });