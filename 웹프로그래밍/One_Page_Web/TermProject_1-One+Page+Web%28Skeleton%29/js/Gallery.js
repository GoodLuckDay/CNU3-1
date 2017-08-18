var columns = document.getElementsByClassName("column");
var slides = document.getElementsByClassName("mySlides");
for(var i=0;i<columns.length;i++){
    if(localStorage.getItem(i)=="none"){
        columns[i].style.display = "none";
    }
    else{
        columns[i].style.display = "inline";
    }
}
function openModal() {
  document.getElementById('myModal').style.display = "block";
}

function closeModal() {
  document.getElementById('myModal').style.display = "none";
}
var slideIndex = 1;
showSlides(slideIndex);
function plusSlides(n) {
  slideIndex += n
  if(slideIndex > slides.length){
    slideIndex = 1;
  }
  if(slideIndex < 1){
    slideIndex =slides.length;
  }
  while(localStorage.getItem(slideIndex-1)=="none"){
    if(n>0){
      slideIndex++;
      if(slideIndex>slides.length)
        slideIndex=1;
    }
    else if(n<0){
      slideIndex--;
      if(slideIndex<1)
        slideIndex = slides.length;
    }
  }
  showSlides(slideIndex);
}
function currentSlide(n) {
  showSlides(slideIndex = n);
}
function deleteSlide(n){
  localStorage.setItem(n-1,"none");
  document.getElementsByClassName("column")[n-1].style.display = localStorage.getItem(n-1);
}
function showSlides(n){
  var i;
  var gallerypictures = document.getElementsByClassName("gallery_picture")

  for(i=0;i<slides.length;i++){
    slides[i].style.display = "none";
  }
  slides[slideIndex-1].style.display = "block"
}
function showInfo(n){
  var captionBox = document.getElementsByClassName("caption-container");
  var slide = document.getElementsByClassName("hover-shadow");
  var Ximage = document.getElementsByClassName("X_images");
  captionBox[n-1].style.display = "block";
  slide[n-1].style.opacity =0.2;
}
function hideInfo(n){
  var captionBox = document.getElementsByClassName("caption-container");
  var slide = document.getElementsByClassName("hover-shadow");
  captionBox[n-1].style.display = "none";
  slide[n-1].style.opacity =1;
}
