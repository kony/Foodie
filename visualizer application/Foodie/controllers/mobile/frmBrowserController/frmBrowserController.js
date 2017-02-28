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
     kony.model.ApplicationContext.showLoadingScreen("Retrieving location...");
     try {
       kony.location.getCurrentPosition(geoSuccessCallBack.bind(this), geoErrorCallBack.bind(this), positionoptions);
     } catch (exception) {
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
        var modelContext = new kony.model.ModelContext();
        modelContext.setRequestOptions("segRestaurant", params);
        navigateObj.setFormConfig(frmHomeConfig);
        navigateObj.setModelContext(modelContext);
        try {
          kony.model.ApplicationContext.dismissLoadingScreen();
          navigateObj.navigate(imageUrl);
        } catch (exp) {
          kony.print("Error in navigating the form");
        }
    },
  	/****************************************************************
     *	Name	:	updateUser
     *	Author	:	Kony
     *	Purpose	:	To update the existing user.
     *****************************************************************/
  	updateUser:function(profile){
      var first_name=profile.user_attributes.name.familyName;
      var last_name=profile.user_attributes.name.givenName;
      var full_name=profile.user_attributes.displayName;
      email=profile.user_attributes.emails[0].value;
      imageUrl=profile.user_attributes.image.url;
      imageUrl=imageUrl.replace("?sz=50","?sz=150");
      var controllerScope=this;
      function successCB(dataModel){
        var userDataObject = new kony.sdk.dto.DataObject("User");
        var user = {};
        user["email"] = profile.user_attributes.emails[0].value;
        user["firstName"] = profile.user_attributes.name.familyName;
        user["imageUrl"] = imageUrl;
        user["lastName"] = profile.user_attributes.name.givenName;
        user["device_id"]=kony.os.deviceInfo().deviceid;
        user["mob"] = "";
        userDataObject.setRecord(user);
        dataModel.completeUpdate({
          dataObject: userDataObject
      	}, function(successResponse){
          kony.print("$$$$$$$$ user creation success $$$$$$$"+JSON.stringify(successResponse));
          kony.store.setItem("EMAIL",user["email"]);
          kony.store.setItem("FNAME",user["firstName"]);
          kony.store.setItem("LNAME",user["lastName"]);
          kony.store.setItem("IMAGE_URL",user["imageUrl"]);
          kony.store.setItem("MOB",user["mob"]);
          kony.model.ApplicationContext.dismissLoadingScreen();
          controllerScope.getCurrentLocation();
        }, function(errorResponse){
          kony.model.ApplicationContext.dismissLoadingScreen();
          kony.print("$$$$$$$$$$$$$$$ user creation failed errorResponse $$$$$$$$ "+JSON.stringify(errorResponse.getRootErrorObj()));
        });
      }
      function errorCB(err){
        kony.model.ApplicationContext.dismissLoadingScreen();
        kony.print("$$$$$$$$$$$ err  $$$$$$$$$ "+JSON.stringify(err.getRootErrorObj()));
      }
      try{
        kony.model.ApplicationContext.showLoadingScreen("Creating account..");
        kony.model.ApplicationContext.createModel("User","Profile", {"access": "online"},
                                       {},successCB,errorCB);
      }catch(exp){
        kony.print("Exception while creating data model");
        kony.model.ApplicationContext.dismissLoadingScreen();
      }
  },
  /****************************************************************
   *	Name	:	createUser
   *	Author	:	Kony
   *	Purpose	:	To create the new user.
   *****************************************************************/
  createUser:function(profile){
  	var first_name=profile.user_attributes.name.familyName;
   	var last_name=profile.user_attributes.name.givenName;
   	var full_name=profile.user_attributes.displayName;
   	email=profile.user_attributes.emails[0].value;
   	imageUrl=profile.user_attributes.image.url;
   	imageUrl=imageUrl.replace("?sz=50","?sz=150");
   	var controllerScope=this;
    function successCB(dataModel){
      var userDataObject = new kony.sdk.dto.DataObject("User");
      var user = {};
      user["email"] = profile.user_attributes.emails[0].value;
      user["firstName"] = profile.user_attributes.name.familyName;
      user["imageUrl"] = imageUrl;
      user["lastName"] = profile.user_attributes.name.givenName;
      user["device_id"]=kony.os.deviceInfo().deviceid;
      user["mob"] = "";
      userDataObject.setRecord(user);
      dataModel.create({
        dataObject: userDataObject
      	}, function(successResponse){
        kony.print("$$$$$$$$ user creation success $$$$$$$"+JSON.stringify(successResponse));
        kony.store.setItem("EMAIL",user["email"]);
        kony.store.setItem("FNAME",user["firstName"]);
        kony.store.setItem("LNAME",user["lastName"]);
        kony.store.setItem("IMAGE_URL",user["imageUrl"]);
        kony.store.setItem("MOB",user["mob"]);
        kony.model.ApplicationContext.dismissLoadingScreen();
        controllerScope.getCurrentLocation();
        }, function(errorResponse){
        kony.model.ApplicationContext.dismissLoadingScreen();
        kony.print("$$$$$$$$$$$$$$$ user creation failed errorResponse $$$$$$$$ "+JSON.stringify(errorResponse.getRootErrorObj()));
        });
      }
      function errorCB(err){
        kony.model.ApplicationContext.dismissLoadingScreen();
        kony.print("$$$$$$$$$$$ err  $$$$$$$$$ "+JSON.stringify(err.getRootErrorObj()));
      }
    try{
      kony.model.ApplicationContext.showLoadingScreen("Creating account..");
      kony.model.ApplicationContext.createModel("User","Profile", {"access": "online"},
                                       {},successCB,errorCB);
    }catch(exp){
      kony.print("Exception while creating data model");
      kony.model.ApplicationContext.dismissLoadingScreen();
    }
  },
  /****************************************************************
   *	Name	:	displayGoogleProfile
   *	Author	:	Kony
   *	Purpose	:	To get the user detail from google OAuth response.
   *****************************************************************/
  displayGoogleProfile:function (profile){	
    var controllerScope=this;
    function successCB(dataModel){
      var userDataObject = new kony.sdk.dto.DataObject("User");
      var params = {};
      params.dataObject = userDataObject;
      params.queryParams = {
        "$filter": "device_id eq "+"'"+kony.os.deviceInfo().deviceid+"'"
      };
      dataModel.fetch(params, function(successResponse){
        kony.print("$$$$$$$$ user fetched success $$$$$$$"+JSON.stringify(successResponse));
        var length=successResponse.length;
        for(var i=0;i<length;i++){
          if(successResponse[i]["device_id"]==kony.os.deviceInfo().deviceid){
            controllerScope.updateUser(profile);
            return;
          }
        }
        controllerScope.createUser(profile);
      }, function(errorResponse){
        kony.print("$$$$$$$$$$$$$$$ fetch failed $$$$$$$$ "+JSON.stringify(errorResponse.getRootErrorObj()));
        alert("Something went wrong,please try later");
      });
    }
    function errorCB(err){
      kony.print("$$$$$$$$$$$ err $$$$$$$$$ "+JSON.stringify(err.getRootErrorObj()));
    }
    try{
      kony.model.ApplicationContext.createModel("User","Profile", {"access": "online"},
                                       {},successCB,errorCB);
    }catch(exp){
      kony.print("Exception while creating data model");
    }
  },
  /****************************************************************
   *	Name	:	profile
   *	Author	:	Kony
   *	Purpose	:	To get the user profile from identity service.
   *****************************************************************/
   profile:function(){
     var controllerScope=this;
     auth_client.getProfile(false, function(profile) {
       controllerScope.displayGoogleProfile(profile);
       kony.model.ApplicationContext.dismissLoadingScreen();
      }, function(error) {
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
    var client = kony.sdk.getCurrentInstance();
    var auth_client=client.getIdentityService(provider.googleProvider);
    auth_client.logout(function(response) {
      kony.print("Logout success" + JSON.stringify(response));
      kony.store.clear();
	}, function(error) {
		kony.print("Logout failure" + JSON.stringify(error));
	}, options);
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
        controllerScope.profile();
      },function(error) {
        kony.model.ApplicationContext.dismissLoadingScreen();
        alert("login failure"+error.message);
    });
    } catch (exception) {
      kony.model.ApplicationContext.dismissLoadingScreen();
      alert(exception.message);
    }
  }
 });