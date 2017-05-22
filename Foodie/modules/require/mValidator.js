define( {
  
  validateName:function(param){
    if(param===undefined || param===null){
      return false;
    }
    param=param.trim();
    if(param===""){
      return false;
    }
    return true;
  },
  validateEmail:function(param){
    var emailReg=/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    if(param===undefined || param===null){
      return false;
    }
    param=param.trim();
    if(param==="")
      return false;
    if(emailReg.test(param)===false){
      return false;
    }
    return true;
  },
  validateMob:function(param){
    var mobReg=/^(\+)(\d{1,3})(\d{10})$/;
    if(param===undefined || param===null){
      return false;
    }
    param=param.trim();
    if(param==="")
      return false;
    if(mobReg.test(param)===false){
      return false;
    }
    return true;
  }
});