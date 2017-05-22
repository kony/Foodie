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
    //alert("WIP"); 
    // callbackiPhoneSetCallbacks();
    callbackiPhoneRegister();
  }
}
/**
 * Name		:	callbackiPhoneRegister
 * Author	:	Kony
 * Purpose	:	It register the device to the APNS.
**/
function callbackiPhoneRegister()
{
	kony.print("\n\n\n<--------in callbackiPhoneRegister--------->\n\n\n");
	var notificationTypes = [0, 1, 2];
	kony.push.register(notificationTypes);
	//alert("Registration Done !!!");
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
      alert("Subscription Success!");
      kony.application.dismissLoadingScreen();
      var custmetrics=[{"subscribed for push":"btnSubscribe"}];
      KNYMetricsService.sendCustomMetrics("frmHome",custmetrics9);
      KNYMetricsService.flushEvents();
      
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
          //alert("WIP"); 
           callbackiPhoneSetCallbacks();
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
  unsubscribePushNotification();
  kony.application.dismissLoadingScreen();
}
function unregFailureAndroidCallback(){
  kony.print("unregFailure");
  kony.application.dismissLoadingScreen();
}
/**
 * Name		:	callbackiPhoneSetCallbacks
 * Author	:	Kony
 * Purpose	:	It sets the callback function for registration,push notification events.
**/
function callbackiPhoneSetCallbacks(){
  kony.print("\n\n\n<--------in callbackiPhoneSetCallbacks--------->\n\n\n");
  var callbacksTable = {onsuccessfulregistration: regSuccessiPhoneCallback,onfailureregistration: regFailureiPhoneCallback,
							onlinenotification: onlinePushNotificationiPhoneCallback,offlinenotification: offlinePushNotificationiPhoneCallback,
							onsuccessfulderegistration: unregSuccessiPhoneCallback,onfailurederegistration: unregFailureiPhoneCallback };
		kony.push.setCallbacks(callbacksTable);
}
/**
 * Name		:	unregSuccessiPhoneCallback
 * Author	:	Kony
 * Purpose	:	Callback for the successful deregistration from the APNS.
**/
function unregSuccessiPhoneCallback()
{
	kony.application.dismissLoadingScreen();
   kony.print("---------callback Unregisterd Sucesfully!! apns");
  unsubscribePushNotification();
	//unsubscribeKMS();
	
}
/**
 * Name		:	unregFailureiPhoneCallback
 * Author	:	Kony
 * Purpose	:	Callback for the unsuccessful deregistration event.
**/
function unregFailureiPhoneCallback(errormsg)
{
	//alert(" Unregistration Failed!!");
	//alert("Error message: "+JSON.stringify(errormsg));
	kony.print(errormsg);
	kony.application.dismissLoadingScreen();
}
/**
 * Name		:	offlinePushNotificationiPhoneCallback
 * Author	:	Kony
 * Purpose	:	Callback function for the push message recieving event while offline.
**/
function offlinePushNotificationiPhoneCallback(msg)
{
	kony.print("************ JS offlinePushNotificationCallback() called *********");
	//alert("Message: "+msg["alert"]);
	kony.print("\n received push:-"+JSON.stringify(msg));
	kony.print(msg);
	 if(kony.os.deviceInfo().name=="iPhone"){
      		kony.application.setApplicationBadgeValue("0");
      	}
}
/**
 * Name		:	offlinePushNotificationiPhoneCallback
 * Author	:	Kony
 * Purpose	:	Callback function for the push message recieving event while offline.
**/
function offlinePushNotificationiPhoneCallback(msg)
{
	kony.print("************ JS offlinePushNotificationCallback() called *********");
	//alert("Message: "+msg["alert"]);
	kony.print("\n received push:-"+JSON.stringify(msg));
	kony.print(msg);
	 if(kony.os.deviceInfo().name=="iPhone"){
      		kony.application.setApplicationBadgeValue("0");
      	}
}
/**
 * Name		:	onlinePushNotificationiPhoneCallback
 * Author	:	Kony
 * Purpose	:	Callback function for the push message recieving event while online.
**/
function onlinePushNotificationiPhoneCallback(msg)
{
	kony.print("************ JS onlinePushNotificationCallback() called *********");
	kony.print("\n received push:-"+JSON.stringify(msg));
	if(msg["isRichPush"]!=undefined){
		displayRichPush(msg);
	}else
	//alert("Message: "+msg["content"]);
	if(msg["alert"]["title"]!=undefined){
		var basicConf = {message: msg["alert"]["body"],alertType: constants.ALERT_TYPE_INFO,
		alertTitle:msg["alert"]["title"]};//,yesLabel:"OK",noLabel:"Don't Allow","alertIcon": "conf.png",alertHandler: handle2};

	//Defining pspConf parameter for alert
	var pspConf = {};
	//Alert definition
	kony.ui.Alert(basicConf,pspConf);
	}else
		alert("Message: "+msg["alert"]);
}
/**
 * Name		:	regFailureiPhoneCallback
 * Author	:	Kony
 * Purpose	:	Callback function for the unsuccessful registration event.
**/
function regFailureiPhoneCallback(errormsg)
{
	kony.print("\n\n************ JS regFailureCallback() called *********");
	kony.print("Error message: "+JSON.stringify(errormsg));
	kony.application.dismissLoadingScreen();
	alert("Unable to register..");
	audiencePushSubs=false;
	//alert("Error message: "+JSON.stringify(errormsg));
}
/**
 * Name		:	regSuccessiPhoneCallback
 * Author	:	Kony
 * Purpose	:	Callback function for successful registration on the APNS.
**/
function regSuccessiPhoneCallback(regId){
  kony.print("\n\n\n<--------in regSuccessiPhoneCallback--------->\n\n\n");
  kony.print("\n Registerd to iPhone push server : "+regId);
    //alert("registered successfully");
  kony.application.dismissLoadingScreen();
  kony.application.showLoadingScreen("sknLoading","please wait..",constants.LOADING_SCREEN_POSITION_FULL_SCREEN, true, true,null);
  regId = regId.replace(/ /g, "");
  // subscribeKMS(regId,"iphone");
  kony.store.setItem("isFirstTime","true");
  //pushSubscription(regId,"iphone");
  subscribeForPushNotification(regId);
}