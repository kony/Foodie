define({ 
  /****************************************************************
   *	Name	:	login
   *	Author	:	Kony
   *	Purpose	:	To navigate to the browser form.
   *****************************************************************/
  login:function(provider){
    try {
      var navigateObj = new kony.mvc.Navigation("frmBrowser");
      var data={
        "provider":provider,
      	"operation":"login"
      };
      var custmetrics=[{"login form":"frmLogin"}];
      KNYMetricsService.sendCustomMetrics("frmLogin",custmetrics);
      KNYMetricsService.flushEvents();
      navigateObj.navigate(data);
    }catch (exp) {
     kony.print(JSON.stringify(exp));
    }
  }
 });