define({ 
  /***************************************************************************************
   *	Name	:	onNavigate
   *	Author	:	Kony
   *	Purpose	:	To initialize the widget of the form when user navigate to it.
   ***************************************************************************************/
  onNavigate:function(){
    this.view.imgProfile.src=kony.store.getItem("IMAGE_URL");
    this.view.lblFNameTxt.text=kony.store.getItem("FNAME");
    this.view.lblLnameTxt.text=kony.store.getItem("LNAME");
    this.view.lblEmailTxt.text=kony.store.getItem("EMAIL");
    this.view.lblMobTxt.text=kony.store.getItem("MOB");
  },
  /***************************************************************************************
   *	Name	:	navigateToFormHome
   *	Author	:	Kony
   *	Purpose	:	To navigate the user to form Home.
   ***************************************************************************************/
  navigateToFormHome:function(){
     try {
       var navigateObject = new kony.mvc.Navigation("frmHome");
       navigateObject.navigate();
     } catch (exp) {
       kony.print(JSON.stringify(exp));
     }
  },
  /***************************************************************************************
   *	Name	:	onNavigate
   *	Author	:	Kony
   *	Purpose	:	To navigate the user to form edit profile.
   ***************************************************************************************/
   navigateToFormEditProfile:function(){
     try {
       var navigateObject = new kony.mvc.Navigation("frmEditProfile");
       navigateObject.navigate();
     } catch (exp) {
       kony.print(JSON.stringify(exp));
     }
  }
 });