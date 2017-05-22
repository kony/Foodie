define({ 

 //Type your controller code 
  myValidator:"",
  /********************************************************************************
   *	Name	:	onNavigate
   *	Author	:	Kony
   *	Purpose	:	To initialize the widget of this form when user naviagte to it.
   ********************************************************************************/
  onNavigate:function(){
    this.view.imgProfile.src=kony.store.getItem("IMAGE_URL");
    this.view.txtBoxFname.text=kony.store.getItem("FNAME");
    this.view.txtBoxLname.text=kony.store.getItem("LNAME");
    this.view.txtBoxEmail.text=kony.store.getItem("EMAIL");
    this.view.txtBoxMob.text=kony.store.getItem("MOB");
    myValidator=require("mValidator");
    var custmetrics=[{"edit profile":"form edit profile"}];
    KNYMetricsService.sendCustomMetrics("frmEditProfile",custmetrics);
    KNYMetricsService.flushEvents();
  },
  /********************************************************************************
   *	Name	:	navigateToFormHome
   *	Author	:	Kony
   *	Purpose	:	To navigate to the home form.
   ********************************************************************************/
  navigateToFormHome:function(){
     try {
       var navigateObject = new kony.mvc.Navigation("frmHome");
       navigateObject.navigate();
     } catch (exp) {
       kony.print(JSON.stringify(exp));
     }
  },
  /********************************************************************************
   *	Name	:	updateDetails
   *	Author	:	Kony
   *	Purpose	:	To update the user profile details.
   ********************************************************************************/
  updateDetails:function(){
    var controllerScope=this;
    var user = {};
    if(myValidator.validateName(this.view.txtBoxFname.text))
      user["firstName"] = this.view.txtBoxFname.text;
    else{
      alert("please enter valid first name");
      return;
    }
    if(myValidator.validateName(this.view.txtBoxLname.text))
      user["lastName"] = this.view.txtBoxLname.text;
    else{
      alert("please enter valid last name");
      return;
    }
    if(myValidator.validateEmail(this.view.txtBoxEmail.text))
      user["email"] = this.view.txtBoxEmail.text;
    else{
      alert("please enter valid email");
      return;
    }
    if(myValidator.validateMob(this.view.txtBoxMob.text))
      user["mob"] = this.view.txtBoxMob.text;
    else{
      alert("please enter valid mobile number");
      return;
    }
    user["imageUrl"]=kony.store.getItem("IMAGE_URL");
    user["device_id"]=kony.os.deviceInfo().deviceid;
    var fullName=" "+user["firstName"]+" "+user["lastName"];
    var custmetrics=[{"update profile":"updated"},{"username": fullName}];
          KNYMetricsService.sendCustomMetrics("frmEditProfile",custmetrics);
          KNYMetricsService.flushEvents();
    
    this.searchUser(user);
  },
  /****************************************************************
     *	Name	:	updateUser
     *	Author	:	Kony
     *	Purpose	:	To update the existing user.
     *****************************************************************/
  	updateUser:function(user){
      var controllerScope=this;
      function successCB(dataModel){
        var userDataObject = new kony.sdk.dto.DataObject("User");
        userDataObject.setRecord(user);
        dataModel.completeUpdate({
          dataObject: userDataObject
      	}, function(successResponse){
          kony.print("$$$$$$$$ user updation success $$$$$$$"+JSON.stringify(successResponse));
          kony.store.setItem("EMAIL",user["email"]);
          kony.store.setItem("FNAME",user["firstName"]);
          kony.store.setItem("LNAME",user["lastName"]);
          kony.store.setItem("IMAGE_URL",user["imageUrl"]);
          kony.store.setItem("MOB",user["mob"]);
          
          
          /*var custmetrics3=[{"update":Save}];
          KNYMetricsService.sendCustomMetrics("frmEditProfile",custmetrics3);
          KNYMetricsService.flushEvents();*/
          
          kony.model.ApplicationContext.dismissLoadingScreen();
          alert("profile updated!");
          //controllerScope.getCurrentLocation();
        }, function(errorResponse){
          kony.model.ApplicationContext.dismissLoadingScreen();
          kony.print("$$$$$$$$$$$$$$$ user updation failed errorResponse $$$$$$$$ "+JSON.stringify(errorResponse.getRootErrorObj()));
        });
      }
      function errorCB(err){
        kony.model.ApplicationContext.dismissLoadingScreen();
        kony.print("$$$$$$$$$$$ err  $$$$$$$$$ "+JSON.stringify(err.getRootErrorObj()));
      }
      try{
        kony.model.ApplicationContext.showLoadingScreen("updating account..");
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
  createUser:function(user){
   	var controllerScope=this;
    function successCB(dataModel){
      var userDataObject = new kony.sdk.dto.DataObject("User");
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
        
        /* var custmetrics=[{"username": user["firstName"]+" "+user["lastName"]},{"update":"updated"}];
         KNYMetricsService.sendCustomMetrics("frmEditProfile",custmetrics);
         KNYMetricsService.flushEvents();*/
        
        kony.model.ApplicationContext.dismissLoadingScreen();
        alert("profile created!");
        //controllerScope.getCurrentLocation();
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
   *	Name	:	searchUser
   *	Author	:	Kony
   *	Purpose	:	To get the user detail from google OAuth response.
   *****************************************************************/
  searchUser:function(user){	
    var controllerScope=this;
    function successCB(dataModel){
      var userDataObject = new kony.sdk.dto.DataObject("User");
      var params = {};
      params.dataObject = userDataObject;
      params.queryParams = {
        "$filter": "device_id eq "+"'"+kony.os.deviceInfo().deviceid+"'"
      };
      dataModel.fetch(params, function(successResponse){
        kony.model.ApplicationContext.dismissLoadingScreen();
        kony.print("$$$$$$$$ user fetched success $$$$$$$"+JSON.stringify(successResponse));
        var length=successResponse.length;
        for(var i=0;i<length;i++){
          if(successResponse[i]["device_id"]==kony.os.deviceInfo().deviceid){
            controllerScope.updateUser(user);
            return;
          }
        }
        controllerScope.createUser(user);
      }, function(errorResponse){
        kony.model.ApplicationContext.dismissLoadingScreen();
        kony.print("$$$$$$$$$$$$$$$ fetch failed $$$$$$$$ "+JSON.stringify(errorResponse.getRootErrorObj()));
        alert("Something went wrong,please try later");
      });
    }
    function errorCB(err){
      kony.model.ApplicationContext.dismissLoadingScreen();
      kony.print("$$$$$$$$$$$ err $$$$$$$$$ "+JSON.stringify(err.getRootErrorObj()));
    }
    try{
      kony.model.ApplicationContext.showLoadingScreen("please wait..");
      kony.model.ApplicationContext.createModel("User","Profile", {"access": "online"},
                                       {},successCB,errorCB);
    }catch(exp){
      kony.model.ApplicationContext.dismissLoadingScreen();
      kony.print("Exception while creating data model");
    }
  }
 });