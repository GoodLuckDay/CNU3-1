$(document).ready(function(){
  var element = document.getElementsByClassName("container");
    $("#dropDownUL").hide();
    $("#Menu_imgae").click(function(){
    $("#dropDownUL").slideToggle(300);
    element[0].classList.toggle("change");
    });
});
