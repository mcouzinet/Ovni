// chargement de la librairie google
google.load("earth", "1");

// Variable
var iconMarker,
	styleMarker,
	keyDown,
	placemark,
	ge,
	mapSize = 0.008,
	tabMou = new Array,
	altitudeSoucoupe = 500,
	bougeX =0,
	bougeY =0,
	zoom = 0,
	numSheep = 5;

// Constante
const centerMapLat = 45.4943800000006,
	  centerMapLon = 2.42566000000163,
	  distGetSheep = 0.0002;
	  
$(function(){
	if(google){
		google.earth.createInstance('map3d', initCB, failureCallback);
	}
});

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
	}catch(error){
		console.log(error);
	}
}

// Reception des valeurs par javascript
function sendToJavaScript(value) {
     console.log('sendToJavaScript : ' + value);
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

	var la = ge.createLookAt('');
	la.set(45.4943800000006, 2.42566000000163, 0, ge.ALTITUDE_RELATIVE_TO_GROUND, 0, 0, 100);
	ge.getView().setAbstractView(la);
	
	iconMarker = ge.createIcon('');
	iconMarker.setHref('http://img4.hostingpics.net/pics/926546mouton.png');
	styleMarker = ge.createStyle(''); //create a new style
	styleMarker.getIconStyle().setIcon(iconMarker); //apply the icon to the style
	ge.getOptions().setFlyToSpeed(ge.SPEED_TELEPORT);
	addSheep(numSheep);
}

function failureCallback(errorCode){
	console.log('Google Earth ERROR : ' + errorCode);
}

var Mouton = function() {
	this.placemark = ge.createPlacemark('');
	this.placemark.setStyleSelector(styleMarker);
	this.point = ge.createPoint('');
 	this.point.setLatitude((centerMapLat-mapSize/2)+(Math.random()*mapSize));
	this.point.setLongitude((centerMapLon-mapSize/2)+(Math.random()*mapSize));
	this.placemark.setGeometry(this.point);
	ge.getFeatures().appendChild(this.placemark);
	return this;
}

Mouton.prototype.calculDistance = function() {
	lookAt = ge.getView().copyAsLookAt(ge.ALTITUDE_RELATIVE_TO_GROUND);
	camera = ge.getView().copyAsCamera(ge.ALTITUDE_RELATIVE_TO_GROUND);
	distX = camera.getLatitude() - this.point.getLatitude();
	distY = camera.getLongitude() - this.point.getLongitude();
	distance = Math.sqrt(Math.pow(distX,2)+Math.pow(distY,2));
	return distance;
}

function addSheep(nomSheep){
	for(i=0;i<nomSheep;i++){
		tabMou[i] = new Mouton();
	}
}

document.onkeypress = function(e) {
   	switch (e.keyCode) {
		 case 97: /*A - Zoom +*/
			altitudeSoucoupe -= (altitudeSoucoupe > 100)?100:0;
			$("#jauge_hauteur").animate({top: (-(altitudeSoucoupe-100)/7.5)+120+"px"},10);
			sendToActionScript('{"action":"zoom","value":"'+altitudeSoucoupe+'"}');
		 break;
		 case 122: /*Z - Zoom -*/
 			altitudeSoucoupe += (altitudeSoucoupe < 1000)?100:0;
			$("#jauge_hauteur").animate({top: (-(altitudeSoucoupe-100)/7.5)+120+"px"},10);
			sendToActionScript('{"action":"zoom","value":"'+altitudeSoucoupe+'"}');
		 break;
	}
	camera.setAltitude(altitudeSoucoupe);
	ge.getView().setAbstractView(camera);
	return false;
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
	keyDown = false;
	return false;
}



document.onkeydown = function(e){

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
	keyDown = true;
	enterFrame();
	return false;
}

var enterFrame = function (){
	setTimeout(function() {
		for(i=0;i<numSheep;i++){
			dist = tabMou[i].calculDistance();
			if(dist < distGetSheep){
				sendToActionScript('{"action":"mouton","value":"'+dist+'"}');
			}
		}

		depCamLat = camera.getLatitude() + bougeX;
		depCamLon = camera.getLongitude() + bougeY;
		if(depCamLat < (centerMapLat + mapSize) && depCamLat > (centerMapLat - mapSize) ){
			camera.setLatitude(depCamLat);
		}
		if(depCamLon < (centerMapLon + mapSize) && depCamLon > (centerMapLon - mapSize) ){
			camera.setLongitude(depCamLon);
		}
		ge.getView().setAbstractView(camera);
		if(keyDown){enterFrame();}
	},50);
}