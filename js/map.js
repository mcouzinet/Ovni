// chargement de la librairie google
google.load("earth", "1");

var jsReady = false;
var ge;
var placemark;
var dragInfo = null;
var position,iconMarker,styleMarker;
var altitudeSoucoupe = 500;
var bougeX =0;
var bougeY =0;
var zoom = 0;

const centerMapLat = 45.4943800000006;
const centerMapLon = 2.42566000000163;
const mapSize = 0.008;

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





function initCB(instance) {

   	ge = instance;
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
	la.set(45.4943800000006, 2.42566000000163, 0, ge.ALTITUDE_RELATIVE_TO_GROUND, 0, 0, 100);
	ge.getView().setAbstractView(la);
	
	iconMarker = ge.createIcon('');
	iconMarker.setHref('http://img4.hostingpics.net/pics/926546mouton.png');
	styleMarker = ge.createStyle(''); //create a new style
	styleMarker.getIconStyle().setIcon(iconMarker); //apply the icon to the style
	ge.getOptions().setFlyToSpeed(ge.SPEED_TELEPORT);
	addSheep(5);
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

// Define a custom icon.


function addSheep(numSheep){
	for(i=0;i<numSheep;i++){

		placemark = ge.createPlacemark('');
		placemark.setStyleSelector(styleMarker);

		// Set the placemark's location.  
		point = ge.createPoint('');
	 	point.setLatitude((centerMapLat-mapSize/2)+(Math.random()*mapSize));
		point.setLongitude((centerMapLon-mapSize/2)+(Math.random()*mapSize));
		placemark.setGeometry(point);

		ge.getFeatures().appendChild(placemark);
	}
}

document.onkeypress = function(e) {
   	switch (e.keyCode) {
		 case 97: /*A - Zoom +*/
			altitudeSoucoupe -= (altitudeSoucoupe > 100)?100:0;
			console.log(altitudeSoucoupe);
			console.log((altitudeSoucoupe-100)/7.5);
			$("#jauge_hauteur").animate({top: (-(altitudeSoucoupe-100)/7.5)+120+"px"},100);
			// $("#viseur img").animate({
			// 				width: (altitudeSoucoupe)/3+"px"
			// 			},100);
			// 			$("#viseur").animate({
			// 				marginTop: -((altitudeSoucoupe)/3)/2+"px",
			// 				marginLeft: -((altitudeSoucoupe)/3)/2+"px"
			// 			},100);
			sendToActionScript('{"action":"zoom","value":"'+altitudeSoucoupe+'"}');
		 break;
		 case 122: /*Z - Zoom -*/
 			altitudeSoucoupe += (altitudeSoucoupe < 1000)?100:0;
			console.log(altitudeSoucoupe);
			console.log((altitudeSoucoupe-100)/7.5);
			$("#jauge_hauteur").animate({top: (-(altitudeSoucoupe-100)/7.5)+120+"px"},100);
			// $("#viseur img").animate({
			// 				width: (altitudeSoucoupe)/3+"px"
			// 			},100);
			// 			$("#viseur").animate({
			// 				marginTop: -((altitudeSoucoupe)/3)/2+"px",
			// 				marginLeft: -((altitudeSoucoupe)/3)/2+"px"
			// 			},100);
			sendToActionScript('{"action":"zoom","value":"'+altitudeSoucoupe+'"}');
		 break;
	}
	
	camera.setAltitude(altitudeSoucoupe);
	ge.getView().setAbstractView(camera);
}

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
	}
}



document.onkeydown = function(e){
	// Calcul de la distance
	lookAt = ge.getView().copyAsLookAt(ge.ALTITUDE_RELATIVE_TO_GROUND);
	camera = ge.getView().copyAsCamera(ge.ALTITUDE_RELATIVE_TO_GROUND);
	distX = camera.getLatitude()-point.getLatitude();
	distY = camera.getLongitude()-point.getLongitude();
	var distance = Math.sqrt(Math.pow(distX,2)+Math.pow(distY,2));
	
	//Déplacement sur la carte

	switch (e.keyCode) {
		 case 38: //Bouton Up
			bougeX = 0.00000002*altitudeSoucoupe;
		 break;
		 case 40: //Bouton Down
			bougeX = -0.00000002*altitudeSoucoupe;
		 break;
		 case 37: //Bouton Left
			bougeY = -0.00000002*altitudeSoucoupe;
		 break;
		 case 39: //Bouton Right
			bougeY = 0.00000002*altitudeSoucoupe;
		 break;
	}
	enterFrame();
}

var enterFrame = function (){
	setTimeout(function() {

		depCamLat = camera.getLatitude() + bougeX;
		depCamLon = camera.getLongitude() + bougeY;
		if(depCamLat < (centerMapLat + mapSize) && depCamLat > (centerMapLat - mapSize) ){
			camera.setLatitude(depCamLat);
		}
		if(depCamLon < (centerMapLon + mapSize) && depCamLon > (centerMapLon - mapSize) ){
			camera.setLongitude(depCamLon);
		}
		ge.getView().setAbstractView(camera);
		enterFrame();
	},50);
}