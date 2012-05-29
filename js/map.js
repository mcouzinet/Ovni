
google.load("earth", "1");

var jsReady = false;
var ge;
var placemark;
var dragInfo = null;
var position;

function isReady(){
	return jsReady;
}

function pageInit(){
	jsReady = true;
	google.earth.createInstance('map3d', initCB, failureCB);
}

function thisMovie(movieName){
	if(navigator.appName.indexOf("Microsoft") != -1){
		return window[movieName];
	}else{
		return document[movieName];
	}
}

// Fonction d'envoie à flash
function sendToActionScript(value){
	thisMovie("ExternalInterfaceExample").sendToActionScript(value);
}

// Reception des valeurs par javascript
function sendToJavaScript(value) {
     console.log('sendToJavaScript : ' + value);
}

document.onkeyup = function(e){
	// Envoie du numero de la touche à flash
	sendToActionScript(e.keyCode + 'up');
}

document.onkeydown = function(e){
	// Envoie du numero de la touche à flash
	sendToActionScript(e.keyCode);
	// Calcul de la distance
	position.lookAt = ge.getView().copyAsLookAt(ge.ALTITUDE_RELATIVE_TO_GROUND);
   	position.latcenter = position.lookAt.getLatitude();
    position.lngcenter = position.lookAt.getLongitude();
    position.latmouton = point.getLatitude();
    position.lngmouton = point.getLongitude();
    position.distance = Math.sqrt(Math.pow(position.latcenter-position.latmouton,2)+Math.pow(position.lngcenter-position.lngmouton,2));
};


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

}

function failureCB(instance) {
   ge = instance;
   ge.getWindow().setVisibility(true);
}

function failureCallback(errorCode){
	console.log('ERROR');
}