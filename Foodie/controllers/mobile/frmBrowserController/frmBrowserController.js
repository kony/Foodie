define({ 
 //Type your controller code here 
  user_obj:{},
  auth_client:"",
  imageUrl:"",
  /****************************************************************
   *	Name	:	getCurrentLocation
   *	Author	:	Kony
   *	Purpose	:	To fetch the current location of the device.
   *****************************************************************/
   getCurrentLocation: function() {
     kony.print("\n\n---in getCurrentLocation---\n\n");
     function geoSuccessCallBack(position) {
       var lat = position.coords.latitude;
       var lon = position.coords.longitude;
       kony.print("latitutde:-" + lat);
       kony.print("longitude:-" + lon);
       RESTAURANT_CONFIG.LATITUDE=lat;
       RESTAURANT_CONFIG.LONGITUDE=lon;
       kony.model.ApplicationContext.dismissLoadingScreen();
       kony.model.ApplicationContext.showLoadingScreen("Retrieving near by restaurant...");
       this.getNearByRestaurant(lat, lon);
     }
     function geoErrorCallBack(positionerror) {
       kony.print("Error occured while retrieving the data:-\n" + "Error code:" + positionerror.code + " : " + positionerror.message);
       kony.print("error:-" + JSON.stringify(positionerror));
       alert(positionerror.message);
       if (positionerror.code == kony.location.PERMISSION_DENIED) {
         alert("PERMISSON IS DENIED");
       } else if (positionerror.code == kony.location.POSITION_UNAVAILABLE) {
         alert("POSITION_UNAVAILABLE");
       } else if (positionerror.code == kony.location.TIMEOUT) {
         alert("TIMEOUT in getting current location");
       }
       kony.model.ApplicationContext.dismissLoadingScreen();
     }
     var positionoptions = {
       timeout: 15000
     }; // 15 secs 
     
     try {
       kony.model.ApplicationContext.showLoadingScreen("Retrieving location...");
       kony.location.getCurrentPosition(geoSuccessCallBack.bind(this), geoErrorCallBack.bind(this), positionoptions);
     } catch (exception) {
       kony.model.ApplicationContext.dismissLoadingScreen();
       alert("Exception is ::" + exception.message);
     }
    },
    /****************************************************************
     *	Name	:	getNearByRestaurant
     *	Author	:	Kony
     *	Purpose	:	To fetch the near by restaurants of the device.
     *****************************************************************/
    getNearByRestaurant: function(lat, lon) {
        var params = {};
        params.headers = {
            "user-key": RESTAURANT_CONFIG.USER_KEY,
            "Accept": "application/json"
        };
        params.queryParams = {
            latitude: lat,
            longitude: lon
        };
        var navigateObj = new kony.mvc.Navigation("frmHome");
       // var modelContext = new kony.model.ModelContext();
        //modelContext.setRequestOptions("segRestaurant", params);
        //navigateObj.setFormConfig(frmHomeConfig);
        //navigateObj.setModelContext(modelContext);
        try {
          kony.model.ApplicationContext.dismissLoadingScreen();
          var data={};
          data["IMAGE_URL"]=imageUrl;
          data["LATITUDE"]=lat;
          data["LONGITUDE"]=lon;
          navigateObj.navigate(data);
        } catch (exp) {
          kony.print("Error in navigating the form");
        }
    },
  /****************************************************************
   *	Name	:	storeUser
   *	Author	:	Kony
   *	Purpose	:	To store the user info.
   *****************************************************************/
  storeUser:function(user){
    kony.store.setItem("EMAIL",user["email"]);
    kony.store.setItem("FNAME",user["firstName"]);
    kony.store.setItem("LNAME",user["lastName"]);
    kony.store.setItem("IMAGE_URL",user["imageUrl"]);
    kony.store.setItem("MOB",user["mob"]);
    
    var custmetrics=[{"logged in":user["email"]}];
    KNYMetricsService.sendCustomMetrics("frmBrowser",custmetrics);
    KNYMetricsService.flushEvents();
    
    kony.model.ApplicationContext.dismissLoadingScreen();
    this.getCurrentLocation();
  },
  /****************************************************************
   *	Name	:	googleProfile
   *	Author	:	Kony
   *	Purpose	:	To fetch the google profile.
   *****************************************************************/
  googleProfile:function(profile){
    var user = {};
    imageUrl=profile.user_attributes.image.url;
   	imageUrl=imageUrl.replace("?sz=50","?sz=150");
    user["email"] = profile.user_attributes.emails[0].value;
    user["firstName"] = profile.user_attributes.name.givenName;
    user["imageUrl"] = imageUrl;
    user["lastName"] = profile.user_attributes.name.familyName;
    user["device_id"]=kony.os.deviceInfo().deviceid;
    user["mob"] = "";
    //this.uploadProfile(user);
    this.storeUser(user);
  },
  /****************************************************************
   *	Name	:	googleProfile
   *	Author	:	Kony
   *	Purpose	:	To fetch the google profile.
   *****************************************************************/
  faceBookProfile:function(profile){
    var user = {};
    imageUrl=profile.picture.url;
    user["email"] = profile.email;
    user["firstName"] = profile.first_name;
    user["imageUrl"] = imageUrl;
    user["lastName"] = profile.last_name;
    user["device_id"]=kony.os.deviceInfo().deviceid;
    user["mob"] = "";
    //this.uploadProfile(user);
    this.storeUser(user);
  },
  /****************************************************************
   *	Name	:	profile
   *	Author	:	Kony
   *	Purpose	:	To get the user profile from identity service for google.
   *****************************************************************/
   profile:function(){
     var controllerScope=this;
     auth_client.getProfile(false,
			controllerScope.googleProfile.bind(controllerScope),
			function(error) {
       			kony.model.ApplicationContext.dismissLoadingScreen();
       			alert("Error occured while fetching the profile.");
    	});
  },
  /*************************************************************************
   *	Name	:	onNavigate
   *	Author	:	Kony
   *	Purpose	:	To perform the login operation on navigate to this form.
   *************************************************************************/
  onNavigate:function(data){
    if(data["operation"]==="login")
    	this.login(data["provider"]);
    else if(data["operation"]==="logOut"){
      	this.signOut();
    }
  },
  /*************************************************************************
   *	Name	:	signOut
   *	Author	:	Kony
   *	Purpose	:	To perform the signOut operation on navigate to this form.
   *************************************************************************/
  signOut:function(){
    var options={};
    options["slo"] = false;
    options["browserWidget"]=this.view.browser;
    //var client = kony.sdk.getCurrentInstance();
    var navigateObj = new kony.mvc.Navigation("frmLogin");
    //navigateObj.navigate();
    var provider=auth_client.getProviderName();
    if(provider===RESTAURANT_CONFIG.FACEBOOK_PROVIDER){
      kony.store.clear();
      navigateObj.navigate();
      //return;
    }else if(provider===RESTAURANT_CONFIG.GOOGLE_PROVIDER){
      auth_client.logout(function(response) {
        kony.print("Logout success" + JSON.stringify(response));
        kony.store.clear();
        navigateObj.navigate();
      }, function(error) {
        kony.print("Logout failure" + JSON.stringify(error));
      }, options);
    }
  },
  /*************************************************************************
   *	Name	:	login
   *	Author	:	Kony
   *	Purpose	:	To perform the login operation in the identiy service.
   *************************************************************************/
  login:function(provider_name){
    var controllerScope=this;
    try { 
      var client = kony.sdk.getCurrentInstance();
      auth_client=client.getIdentityService(provider_name);
      auth_client.login({"browserWidget": controllerScope.view.browser},function(response) {
        kony.model.ApplicationContext.showLoadingScreen("fetching details...");
        kony.print("login success");
        if(provider_name===RESTAURANT_CONFIG.FACEBOOK_PROVIDER){
          auth_client.getBackendToken(false,{},function(response) {
            kony.print("Backend token is  :" + JSON.stringify(response));
            controllerScope.getFaceBookPfofile(response.value);
          },function(error) {
            kony.model.ApplicationContext.dismissLoadingScreen();
            kony.print("Failed to get backend token : " + JSON.stringify(error));
          });
        }else{
        	controllerScope.profile();
        }
      },function(error) {
        kony.model.ApplicationContext.dismissLoadingScreen();
        alert("login failure"+error.message);
    });
    } catch (exception) {
      kony.model.ApplicationContext.dismissLoadingScreen();
      alert(exception.message);
    }
  },
  getFaceBookPfofile:function(access_token){
    var controllerScope=this;
    var client = kony.sdk.getCurrentInstance();
    var intgService=client.getIntegrationService(RESTAURANT_CONFIG.FACEBOOK_INTEGRATION_SERVICE);
    intgService.invokeOperation(RESTAURANT_CONFIG.FACEBOOK_OPERATION_NAME,{},
             {"access_token":access_token},
              controllerScope.faceBookProfile.bind(controllerScope),function(error){
      alert("unable to get profile details:"+JSON.stringify(error));
      kony.model.ApplicationContext.dismissLoadingScreen();
    });
  }
 });