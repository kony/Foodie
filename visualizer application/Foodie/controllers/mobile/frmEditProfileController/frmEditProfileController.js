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
    user["device_id"]=kony.os.deviceInfo().deviceid;
    function successCB(dataModel){
      var userDataObject = new kony.sdk.dto.DataObject("User");
      userDataObject.setRecord(user);
      dataModel.completeUpdate({
        dataObject: userDataObject
      	}, function(successResponse){
        kony.print("$$$$$$$$ user update success $$$$$$$"+JSON.stringify(successResponse));
        kony.store.setItem("EMAIL",user["email"]);
        kony.store.setItem("FNAME",user["firstName"]);
        kony.store.setItem("LNAME",user["lastName"]);
        kony.store.setItem("IMAGE_URL",user["imageUrl"]);
        kony.store.setItem("MOB",user["mob"]);
        alert("update success!");
        }, function(errorResponse){
        kony.print("$$$$$$$$$$$$$$$ user updation failed $$$$$$$$ "+JSON.stringify(errorResponse.getRootErrorObj()));
        alert("Something went wrong,please try later");
      });
    }
    function errorCB(err){
      kony.print("$$$$$$$$$$$ err  $$$$$$$$$ "+JSON.stringify(err.getRootErrorObj()));
    }
    try{
      kony.model.ApplicationContext.createModel("User","Profile", {"access": "online"},
                                       {},successCB,errorCB);
    }catch(exp){
      kony.print("Exception while creating data model");
    }
  }
 });