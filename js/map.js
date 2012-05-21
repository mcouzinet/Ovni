google.load("earth", "1");

var ge;
var placemark;
var dragInfo = null;

function initMap(){
	google.earth.createInstance('map3d', initCB, failureCB);
}

function initCB(instance) {
   	ge = instance;
  	ge.getWindow().setVisibility(true);
	// console.log('yep');
	// 	placemark = ge.createPlacemark('');
	//   	var point = ge.createPoint('');
	//   	point.setLatitude(37);
	//   	point.setLongitude(-122);
	//   	placemark.setGeometry(point);
	//   	placemark.setName('Drag Me!');
	//   	ge.getFeatures().appendChild(placemark);

  	// Look at the placemark we created.
	var la = ge.createLookAt('');
	la.set(37, -122, 0, ge.ALTITUDE_RELATIVE_TO_GROUND, 0, 0, 5000);
	ge.getView().setAbstractView(la);

		
	// Create the placemark. MOUTON
	var placemark = ge.createPlacemark('');

	// Define a custom icon.
	var icon = ge.createIcon('');
	icon.setHref('http://img4.hostingpics.net/pics/926546mouton.png');
	var style = ge.createStyle(''); //create a new style
	style.getIconStyle().setIcon(icon); //apply the icon to the style
	placemark.setStyleSelector(style); //apply the style to the placemark

	// Set the placemark's location.  
	var point = ge.createPoint('');
	  point.setLatitude(37);
	  point.setLongitude(-122);
	placemark.setGeometry(point);

	// Add the placemark to Earth.
	ge.getFeatures().appendChild(placemark);

	//Calcul de distance avec les moutons
	ge.onkeydown = function() {
		var lookAt = ge.getView().copyAsLookAt(ge.ALTITUDE_RELATIVE_TO_GROUND);
   		var latcenter = lookAt.getLatitude();
    		var lngcenter = lookAt.getLongitude();
    		var latmouton = point.getLatitude();
    		var lngmouton = point.getLongitude();
    		var distance = Math.sqrt(Math.pow(latcenter-latmouton,2)+Math.pow(lngcenter-lngmouton,2));
		console.log(distance);		
	};

  // Listen for mousedown on the window (look specifically for point placemarks).
  	// google.earth.addEventListener(ge.getWindow(), 'mousedown', function(event) {
  	//     	if (event.getTarget().getType() == 'KmlPlacemark' &&
  	//         event.getTarget().getGeometry().getType() == 'KmlPoint') {
  	//       var placemark = event.getTarget();
  	//       dragInfo = {
  	//         placemark: event.getTarget(),
  	//         dragged: false
  	//       };
  	//     }
  	//  });
  	//   	 google.earth.addEventListener(ge.getGlobe(), 'mousemove', function(event) {
  	//     if (dragInfo) {
  	//       event.preventDefault();
  	//       var point = dragInfo.placemark.getGeometry();
  	//       point.setLatitude(event.getLatitude());
  	//       point.setLongitude(event.getLongitude());
  	//       dragInfo.dragged = true;
  	//     }
  	//   });
  	// 
  	//   // Listen for mouseup on the window.
  	//   google.earth.addEventListener(ge.getWindow(), 'mouseup', function(event) {
  	//     if (dragInfo) {
  	//       if (dragInfo.dragged) {
  	//         // If the placemark was dragged, prevent balloons from popping up.
  	//         event.preventDefault();
  	//       }
  	// 
  	//       dragInfo = null;
  	//     }
  	//   });
	
	// AJOUT D'UNE PHOTO //
	// Create the ScreenOverlay
	//var screenOverlay = ge.createScreenOverlay('');

	// Specify a path to the image and set as the icon
	// var icon = ge.createIcon('');
	// 	icon.setHref('http://www.google.com/intl/en_ALL/images/logo.gif');
	// 	screenOverlay.setIcon(icon);

	// Set the ScreenOverlay's position in the window
	// screenOverlay.getOverlayXY().setXUnits(ge.UNITS_PIXELS);
	// 	screenOverlay.getOverlayXY().setYUnits(ge.UNITS_PIXELS);
	// 	screenOverlay.getOverlayXY().setX(200);
	// 	screenOverlay.getOverlayXY().setY(200);

	// Set the overlay's size in pixels
	// screenOverlay.getSize().setXUnits(ge.UNITS_PIXELS);
	// 	screenOverlay.getSize().setYUnits(ge.UNITS_PIXELS);
	// 	screenOverlay.getSize().setX(250);
	// 	screenOverlay.getSize().setY(75);

	// Specify the point in the image around which to rotate
	// screenOverlay.getRotationXY().setXUnits(ge.UNITS_FRACTION);
	// 	screenOverlay.getRotationXY().setYUnits(ge.UNITS_FRACTION);
	// 	screenOverlay.getRotationXY().setX(0.5);
	// 	screenOverlay.getRotationXY().setY(0.5);

	// Rotate the overlay
	// screenOverlay.setRotation(25);

	// Add the ScreenOverlay to Earth
	// ge.getFeatures().appendChild(screenOverlay);
}

function failureCB(instance) {
   ge = instance;
   ge.getWindow().setVisibility(true);
}



function failureCallback(errorCode) {
}