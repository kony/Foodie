define({ 
  /***************************************************************************************
   *	Name	:	onNavigate
   *	Author	:	Kony
   *	Purpose	:	To set the request url config when the user navigate to it.
   ***************************************************************************************/
  onNavigate:function(){
    var custmetrics=[{"payment":"form payment"}];
    KNYMetricsService.sendCustomMetrics("frmPayment",custmetrics);
    KNYMetricsService.flushEvents();
  },
  /***************************************************************************************
   *	Name	:	navigateTofrmHome
   *	Author	:	Kony
   *	Purpose	:	To navigate the user to Home form.
   ***************************************************************************************/
   navigateTofrmHome: function() {
     var controllerScope=this;
        try {
          alert("order placed successfully.");
          var custmetrics=[{"order placed":"placed"}];
          KNYMetricsService.sendCustomMetrics("frmPayment",custmetrics);
          KNYMetricsService.flushEvents();
          var navigateObj = new kony.mvc.Navigation("frmHome");
          navigateObj.navigate();
        } catch (exp) {
            kony.print(JSON.stringify(exp));
        }
    },

 });