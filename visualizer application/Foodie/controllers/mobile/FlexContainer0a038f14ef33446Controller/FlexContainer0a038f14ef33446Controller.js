define({ 

 //Type your controller code here 
  testMethod:function(){
    alert("from map template");
  },
  getDirection:function(context){
  this.executeOnParent("getDirection",context);
}

 });