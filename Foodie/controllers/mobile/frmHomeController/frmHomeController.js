define({
  restaurantList: [],
  image_url:"",
  lat:"",
  lon:"",
  fetchNearByRestaurant:function(){
    var controllerScope = this;
        kony.print("in fetchRestaurant");
        function successCB(dataModel) {
            var resDataObject = new kony.sdk.dto.DataObject("NearByRestaurant");
            var params = {};
            params.dataObject = resDataObject;
            params.headers = {
              "user-key": RESTAURANT_CONFIG.USER_KEY,
              "Accept": "application/json"
            };
            params.queryParams = {
            	latitude: controllerScope.lat,
            	longitude: controllerScope.lon
        	};
            dataModel.fetch(params, function(response) {
                kony.print("$$$$$$$$ fetch success $$$$$$$" + JSON.stringify(response));
              controllerScope.restaurantList=response;
              var length=response.length;
              var resObj={};
              var resList=[];
              for(var i=0;i<length;i++){
                resObj={
      				"imgResIcon":{"src":response[i]["thumb"]},
      				"lblResName":{"text":response[i]["name"]},
      				"lblRating":{"text":response[i]["user_rating"][0]["aggregate_rating"]},
      				"lblCuisines":{"src":response[i]["cuisines"]},
      				"lblLine":{"text":" "}
                };
    			resList.push(resObj);
               }
              controllerScope.view.segRestaurant.removeAll();
              controllerScope.view.segRestaurant.addAll(resList);
            }, function(errorResponse) {
                kony.print("$$$$$$$$$$$$$$$ errorResponse $$$$$$$$ " + JSON.stringify(errorResponse.getErrorObj()));
            });
        }
        function errorCB(err) {
            kony.print("$$$$$$$$$$$ err  $$$$$$$$$ " + JSON.stringify(err.getErrorObj()));
        }
        kony.model.ApplicationContext.createModel("NearByRestaurant", "NearByRestaurant", {
            "access": "online"
        }, {}, successCB, errorCB);
    
  },
  /****************************************************************
   *	Name	:	onNavigate
   *	Author	:	Kony
   *	Purpose	:	To set the image url for the master image widget.
   *****************************************************************/
  onNavigate:function(data){
    if(data ===undefined || data===null)
      return;
    this.image_url=data["IMAGE_URL"];
   	this.lat=data["LATITUDE"];
    this.lon=data["LONGITUDE"];
    this.fetchNearByRestaurant();
    /*var custmetrics2=[{"home form":"in home form"}];
    KNYMetricsService.sendCustomMetrics("frmHome",custmetrics2);
    KNYMetricsService.flushEvents();*/
    
  },
  /****************************************************************
   *	Name	:	navigateToFormProfile
   *	Author	:	Kony
   *	Purpose	:	To navigate to the profile form.
   *****************************************************************/
  navigateToFormProfile: function() {
    try {
      var navigateObject = new kony.mvc.Navigation("frmProfile");
      this.hideMenu();
      navigateObject.navigate();
    } catch (exp) {
      kony.print(JSON.stringify(exp));
    }
  },
  /****************************************************************
   *	Name	:	setGestureRecognizer
   *	Author	:	Kony
   *	Purpose	:	To set the Gesture Recognizer to this form.
   *****************************************************************/
  setGestureRecognizer: function() {   
    var controllerScope = this;
    function swipeGestureHandler(commonWidget, gestureInfo, context) {
      kony.print("\n swipe performed\n");
      try {
        var direction = "";
        var GesType = "" + gestureInfo.gestureType;
        var animObj;
        if (GesType == constants.GESTURE_TYPE_SWIPE) {
          var swipeDirection = "" + gestureInfo.swipeDirection; //Read swipe direction
          if (swipeDirection == "1") {
            controllerScope.hideMenu();
          } else if (swipeDirection == "2") {
            controllerScope.showMenu();
          }
        }
      } catch (exp) {
        alert("error while performing animation" + JSON.stringify(exp));
      }
    }
    try {
      kony.print("$$$$$$$$$$$$$ in setGestureRecognizer $$$$$$$");
      this.view.addGestureRecognizer(constants.GESTURE_TYPE_SWIPE, {
                fingers: 1,
                swipedistance: 50,
                swipevelocity: 75
            }, swipeGestureHandler);
        } catch (err) {
            alert("error while regestering the gestures:" + err);
        }
    },
    /****************************************************************
     *	Name	:	onMyRowClick
     *	Author	:	Kony
     *	Purpose	:	To Navigate to the frmResdetails form on row click of the segment.
     *****************************************************************/
    onMyRowClick: function() {
        var selectedRowIndex = this.view.segRestaurant.selectedRowIndex[1];
        try {
            var navigateTofrmDetails = new kony.mvc.Navigation("frmResDetails");
            var resObj = this.restaurantList[selectedRowIndex];
          	
            navigateTofrmDetails.navigate(resObj);
        } catch (exp) {
            kony.print(JSON.stringify(exp));
        }
      this.hideMenu();
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
        this.fetchData(success.bind(this), error);
    },
  /****************************************************************
   *	Name	:	searchRestaurant
   *	Author	:	Kony
   *	Purpose	:	To navigate to search Restaurant form.
   *****************************************************************/
  searchRestaurant:function(){
    try {
      var navigateObj = new kony.mvc.Navigation("frmSearchRestaurant");
      this.hideMenu();
      navigateObj.navigate();
    }catch (exp) {
     kony.print(JSON.stringify(exp));
    }
  },
  /****************************************************************
   *	Name	:	masterFunction
   *	Author	:	Kony
   *	Purpose	:	To initialize the master's widget.
   *****************************************************************/
  masterFunction:function(){
    this.view.MasterMenu.imgLogo.src=this.image_url;
	this.setGestureRecognizer();
  },
  /****************************************************************
   *	Name	:	signOut
   *	Author	:	Kony
   *	Purpose	:	To perform sign out.
   *****************************************************************/
  signOut:function(){
   try {
     var navigateObject = new kony.mvc.Navigation("frmLogin");
     var data={
       //"provider":"GoogleOauth",
      "operation":"logOut"
      };
     this.hideMenu();
     //navigateObject.navigate(data);
     navigateObject.navigate();
   } catch (exp) {
     kony.print(JSON.stringify(exp));
   }
  },
  /****************************************************************
   *	Name	:	getNearByRestaurant
   *	Author	:	Kony
   *	Purpose	:	To fetch the near by restaurants of the device.
   *****************************************************************/
    getFavouriteRestaurant: function() {
      this.hideMenu();
        var params = {};
        params.queryParams = {
          "$filter": "device_id eq "+"'"+kony.os.deviceInfo().deviceid+"'"
        };
        var navigateTofrmFavourite = new kony.mvc.Navigation("frmFavourite");
        //var modelContext = new kony.model.ModelContext();
        //modelContext.setRequestOptions("segRestaurant", params);
        //navigateTofrmFavourite.setFormConfig(frmFavouriteConfig);
        //navigateTofrmFavourite.setModelContext(modelContext);
        try {
            navigateTofrmFavourite.navigate();
        } catch (exp) {
            kony.print("Error in navigating the form");
        }
    },
  /****************************************************************
   *	Name	:	hideMenu
   *	Author	:	Kony
   *	Purpose	:	To hide the Menu of the form.
   *****************************************************************/
  	hideMenu:function(){
    	this.view.MasterMenu.animate(kony.ui.createAnimation({
      	100: {
        	left: "-100%",
        	"stepConfig": {}
      		}}), {
      		delay: 0,
      	fillMode: kony.anim.FILL_MODE_FORWARDS,
      	duration: .40
    	}, {
      	animationEnd: function() {}
    	});
  	},
  /****************************************************************
   *	Name	:	showMenu
   *	Author	:	Kony
   *	Purpose	:	To show the Menu of the form.
   *****************************************************************/
  showMenu:function(){
    this.view.MasterMenu.animate(kony.ui.createAnimation({
      100: {
        left: "0%",
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
});