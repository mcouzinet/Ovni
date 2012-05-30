// chargement de la librairie google
google.load("earth", "1");

var jsReady = false;
var ge;
var placemark;
var dragInfo = null;
var position;
var altitudeSoucoupe = 500;
var bougeX =0;
var bougeY =0;
var zoom = 0;

// Reception des valeurs par javascript
function sendToJavaScript(value) {
     console.log('sendToJavaScript : ' + value);
}

$(function(){
	init();
});


function init(){
	jsReady = true;
	if(google){
		google.earth.createInstance('map3d', initCB, failureCB);
	}
}

function isReady(){
	return jsReady;
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
	try{
		thisMovie("ExternalInterfaceExample").sendToActionScript(value);
	}catch(e){
		console.log(e);
	}
}





function initCB(ge) {

  	ge.getWindow().setVisibility(true);
	var options = ge.getOptions();   
	options.setStatusBarVisibility(false);  
	options.setGridVisibility(false);  
	options.setOverviewMapVisibility(false);  
	options.setScaleLegendVisibility(false);  
	options.setAtmosphereVisibility(false);  
	options.setMouseNavigationEnabled(false);

  	// Look at the placemark we created.
	var la = ge.createLookAt('');
	la.set(45.883088, 2.5, 0, ge.ALTITUDE_RELATIVE_TO_GROUND, 0, 0, 200);
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
 	point.setLatitude(45.883088);
	point.setLongitude(2.5);
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


/*
	END OF INIT
*/


document.onkeypress = function(e) {
   	switch (e.keyCode) {
		 case 97: /*A*/
			altitudeSoucoupe -= (altitudeSoucoupe > 100)?100:0;
			sendToActionScript('{"action":"zoom","value":"'+altitudeSoucoupe+'"}');
		 break;
		 case 122: /*Z*/
 			altitudeSoucoupe += (altitudeSoucoupe < 1000)?100:0;
			sendToActionScript('{"action":"zoom","value":"'+altitudeSoucoupe+'"}');
		 break;
	}
	console.log('altitudeSoucoupe : ' + altitudeSoucoupe);
	
	camera.setAltitude(altitudeSoucoupe);
	ge.getView().setAbstractView(camera);
}

document.onkeyup = function(e){
	// Envoie du numero de la touche à flash
	switch (e.keyCode) {
		 case 38: //Bouton Up
			bougeX = 0;
			sendToActionScript('{"action":"stopbouge","value":"droite"}');
		 break;
		 case 40: //Bouton Down
			bougeX = 0;
			sendToActionScript('{"action":"stopbouge","value":"gauche"}');
		 break;
		 case 37: //Bouton Left
			bougeY = 0;
			sendToActionScript('{"action":"stopbouge","value":"gauche"}');
		 break;
		 case 39: //Bouton Right
			bougeY = 0;
			sendToActionScript('{"action":"stopbouge","value":"droite"}');
		 break;
	}
}

document.onkeydown = function(e){

	distX = camera.getLatitude()-point.getLatitude();
	distY = camera.getLongitude()-point.getLongitude();
	distance = Math.sqrt(Math.pow(distX,2)+Math.pow(distY,2));
	
	//Déplacement sur la carte

	switch (e.keyCode) {
		 case 38: //Bouton Up
			bougeX = 0.000012;
			sendToActionScript('{"action":"bouge","value":"droite"}');
		 break;
		 case 40: //Bouton Down
			bougeX = -0.000012;
			sendToActionScript('{"action":"bouge","value":"gauche"}');
		 break;
		 case 37: //Bouton Left
			bougeY = -0.000012;
			sendToActionScript('{"action":"bouge","value":"gauche"}');
		 break;
		 case 39: //Bouton Right
			bougeY = 0.000012;
			sendToActionScript('{"action":"bouge","value":"droite"}');
		 break;
	}
	enterFrame();
}

var enterFrame = function (){
	setTimeout(function() {
		camera.setLatitude(camera.getLatitude() + bougeX);
		camera.setLongitude(camera.getLongitude() + bougeY);
		ge.getView().setAbstractView(camera);
		enterFrame();
	},50);
}
