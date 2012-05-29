
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
	thisMovie("Interface").sendToActionScript(value);
}

// Reception des valeurs par javascript
function sendToJavaScript(value) {
     console.log('sendToJavaScript : ' + value);
}


var bougeX =0;
var bougeY =0;
var zoom;
document.onkeyup = function(e){
	// Envoie du numero de la touche à flash
	switch (e.keyCode) {
		 case 38: //Bouton Up
			bougeX = 0;
		 break;
		 case 40: //Bouton Down
			bougeX = 0;
		 break;
		 case 37: //Bouton Left
			bougeY = 0;
		 break;
		 case 39: //Bouton Right
			bougeY = 0;
		 break;
		 case 32: //Bouton Espace
			sendToActionScript('espaceUp');
		 break;
		 case 90: //Bouton Z - Zoom -
			zoom=0;
		 break;
		 case 90: //Bouton Z - Zoom -
			zoom=0;
		 break;
	}
}



document.onkeydown = function(e){
	// Envoie du numero de la touche à flash
	sendToActionScript(e.keyCode);
	// Calcul de la distance
	lookAt = ge.getView().copyAsLookAt(ge.ALTITUDE_RELATIVE_TO_GROUND);
	camera = ge.getView().copyAsCamera(ge.ALTITUDE_RELATIVE_TO_GROUND);
	var latcenter = lookAt.getLatitude();
	var lngcenter = lookAt.getLongitude();
	var latmouton = point.getLatitude();
	var lngmouton = point.getLongitude();
	var distance = Math.sqrt(Math.pow(latcenter-latmouton,2)+Math.pow(lngcenter-lngmouton,2));
	//Déplacement sur la carte
	switch (e.keyCode) {
	 	case 65: //Bouton A - Zoom +
			// lookAt.setRange(lookAt.getRange() / 8.0);
			// 			ge.getView().setAbstractView(lookAt);
			//console.log('zoom'+LookAt.getRange());
			zoom=100;
			// lookAt.setRange(lookAt.getRange() * zoom);
			// 			ge.getView().setAbstractView(lookAt);
		 break;
		 case 90: //Bouton Z - Zoom -
			// lookAt.setRange(lookAt.getRange() * 8.0);
			// 			ge.getView().setAbstractView(lookAt);
			zoom=-100;
			// lookAt.setRange(lookAt.getRange() * zoom);
			// 			ge.getView().setAbstractView(lookAt);
		 break;
		 case 38: //Bouton Up
			bougeX = 0.005;
		 break;
		 case 40: //Bouton Down
			bougeX = -0.005;
		 break;
		 case 37: //Bouton Left
			bougeY = -0.005;
		 break;
		 case 39: //Bouton Right
			bougeY = 0.005;
		 break;
		case 32: //Bouton Espace
			sendToActionScript('espace');
		break;
	 }
		enterFrame();
}

var enterFrame = function (){
	setTimeout(function() {
		camera.setLatitude(camera.getLatitude() + bougeX);
		camera.setLongitude(camera.getLongitude() + bougeY);
		camera.setAltitude(camera.getAltitude() + zoom);
		ge.getView().setAbstractView(camera);
		enterFrame();
	},50);
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
	point = ge.createPoint('');
 	point.setLatitude(37);
	point.setLongitude(-122);
	placemark.setGeometry(point);

	// Add the placemark to Earth.
	ge.getFeatures().appendChild(placemark);
	ge.getOptions().setFlyToSpeed(ge.SPEED_TELEPORT);

}

function failureCB(instance) {
   ge = instance;
   ge.getWindow().setVisibility(true);
}

function failureCallback(errorCode){
	console.log('ERROR');
}