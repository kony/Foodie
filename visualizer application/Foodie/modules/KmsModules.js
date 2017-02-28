//Type your code here
// Sample code to register to messaging service
	function pushRegistration() {
        kony.print("\n\n----in pushRegister----\n");
        var devName = kony.os.deviceInfo().name;
        kony.application.showLoadingScreen("sknLoading", "subscribing ..", constants.LOADING_SCREEN_POSITION_FULL_SCREEN, true, true, null);
        if (devName === "android") {
            //callbackAndroidSetCallbacks();
            callbackAndroidRegister();
        } else if ((devName == "iPhone") || (devName == "iPhone Simulator") || (devName == "iPad") || (devName == "iPad Simulator")) {
          alert("WIP"); 
          // callbackiPhoneSetCallbacks();
            //callbackiPhoneRegister();
        }
    }
/**
 	* Name		:	callbackAndroidRegister
 	* Author	:	Kony
 	* Purpose	:	This function register the senderID on the google cloud.
	**/
	function callbackAndroidRegister(){
      if(KMSPROP.senderID===""||KMSPROP.senderID===null||KMSPROP.senderID===undefined){
        alert("sender id is missing");
        kony.print("sender id is missing");
        return;
      }
      kony.print("senid:"+KMSPROP.senderID)
      var configToRegister = {senderid:KMSPROP.senderID};
      kony.push.register(configToRegister);
    }
    
var messagingClient = null;
function subscribeForPushNotification(registrationId){
  var UFID = kony.store.getItem("EMAIL");
  var client = kony.sdk.getCurrentInstance();
  var deviceId = kony.os.deviceInfo().deviceid;
  var osType;
  if(kony.os.deviceInfo().name==="android"){
    osType="androidgcm";
  }else if(kony.os.deviceInfo().name==="iPhone")
    osType="iphone";
  try{
    messagingClient = client.getMessagingService();
    messagingClient.register(osType,deviceId, registrationId, UFID, 
                             function(response){
      kony.print("Subscription Success " + JSON.stringify(response));
      kony.application.dismissLoadingScreen();
    },function(error){
      kony.print("Subscription Failure " + JSON.stringify(error));
      kony.application.dismissLoadingScreen();
	});
  }catch(exception){
    kony.print("Exception" + exception.message);
    kony.application.dismissLoadingScreen();
  }
}

// Sample code to unregister from messaging service
function unsubscribePushNotification(){
  messagingClient.unregister(
    	function(response){
          kony.print("Unregistration Success " +JSON.stringify(response));
          kony.application.dismissLoadingScreen();
		},
		function(error){
          kony.print("Unregistration Failure " +JSON.stringify(error)); 
          kony.application.dismissLoadingScreen();
		});
}
/**
 * Name		:	offlinePushNotificationAndroidCallback
 * Author	:	Kony
 * Purpose	:	This function is the callback for the received push msg event while offline
 **/
function offlinePushNotificationAndroidCallback(msg) {
    kony.print("************ JS offlinePushNotificationCallback() called *********");
    kony.print(msg);
    if (msg["content-available"] != 1) {
        alert("Message: " + msg["content"]);
    } else {
        kony.print("silent push received");
    }
}
/**
 * Name		:	onlinePushNotificationAndroidCallback
 * Author	:	Kony
 * Purpose	:	This function is the callback for the received push msg event while online.
 **/
function onlinePushNotificationAndroidCallback(msg) {
    kony.print("************ JS onlinePushNotificationCallback() called *********");
    kony.print(JSON.stringify(msg));
    if (msg["content-available"] != 1) {
        if (msg["isRichPush"] !== undefined) {
            kony.print("rich push message received");
            //displayRichPush(msg);
        } else
            alert("Message: " + msg["content"]);
    } else {
        alert("Silent Push Received");
    }
}
/**
 * Name		:	regFailureAndroidCallback
 * Author	:	Kony
 * Purpose	:	This function is the callback for the registration failure to the GCM server.
 **/
function regFailureAndroidCallback(errormsg) {
    kony.print("Registration Failed:" + JSON.stringify(errormsg));
    kony.application.dismissLoadingScreen();
    alert("Registration Failed ");
}
/**
 * Name		:	regSuccessAndroidCallback
 * Author	:	Kony
 * Purpose	:	This function is the callback for the successful registration of the device to the GCM server & returns the callerID.
 * 
 **/
	function regSuccessAndroidCallback(regId) {
    kony.print("\n\n\n<--------in regSuccessAndroidCallback--------->\n\n\n");
    kony.print("\nRegistration Id-->" + JSON.stringify(regId));
    subscribeForPushNotification(regId);
    //registrationID=regId;
    //kony.store.setItem("isFirstTime","true");
    //pushSubscription(regId,"android");
}
function setCallBacks(){
  //alert("in set call back");
  kony.print("--------------Setting callBacks-------------");
  var devName = kony.os.deviceInfo().name;
  if (devName === "android") {
    callbackAndroidSetCallbacks();
  } else if ((devName == "iPhone") || (devName == "iPhone Simulator") || (devName == "iPad") || (devName == "iPad Simulator")) {
          alert("WIP"); 
          // callbackiPhoneSetCallbacks();
            //callbackiPhoneRegister();
  }
}


/**
 * Name		:	callbackAndroidSetCallbacks
 * Author	:	Kony
 * Purpose	:	This function sets the callback for registration,deregistration & pushnotification events.
 **/
function callbackAndroidSetCallbacks() {
    kony.print("\n\n\n<--------in callbackAndroidSetCallbacks--------->\n\n\n");
    kony.push.setCallbacks({
        onsuccessfulregistration: regSuccessAndroidCallback,
        onfailureregistration: regFailureAndroidCallback,
        onlinenotification: onlinePushNotificationAndroidCallback,
        offlinenotification: offlinePushNotificationAndroidCallback,
        onsuccessfulderegistration: unregSuccessAndroidCallback,
        onfailurederegistration: unregFailureAndroidCallback
    });
}
function unregSuccessAndroidCallback(){
  kony.print("unregSuccess");
  kony.application.dismissLoadingScreen();
}
function unregFailureAndroidCallback(){
  kony.print("unregFailure");
  kony.application.dismissLoadingScreen();
}