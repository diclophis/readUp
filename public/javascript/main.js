window.onorientationchange = detectOrientation;

function detectOrientation() {
  if (window.orientation == 0) {
    switchOrientation("portrait");
  } else if (window.orientation == 90) {  
    switchOrientation("landscape");
  } else if (window.orientation == -90) {  
    switchOrientation("landscape");
  } else if (window.orientation == 180) {
    switchOrientation("portrait");
  } else {
    switchOrientation("landscape");
  };
};

function switchOrientation(varOrientation) {
  $("body").removeClass("landscape portrait");
  if(varOrientation == "landscape") {
      $("body").addClass("landscape");
  } else if(varOrientation == "portrait") {
      $("body").addClass("portrait");
  };
};

$(function(){
  detectOrientation();
});
