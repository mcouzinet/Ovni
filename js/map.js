// chargement de la librairie google
google.load("earth", "1");

// Variable
var iconMarker,
	styleMarker,
	keyDown,
	placemark,
	ge,
	camera,
	interfaceReady = false,
	mapSize = 0.008,
	tabMou = new Array,
	altitudeSoucoupe = 500,
	bougeX =0,
	bougeY =0,
	zoom = 0,
	numSheep = 5
	vitesseDeplacement = 0.00000008,
	duree = 180;
 
// Constante
const centerMapLat = 45.4943800000006,
	  centerMapLon = 2.42566000000163,
	  distGetSheep = 0.0008;

function timeMsg(temps){
	Temps=temps;
	document.getElementById("temps").innerHTML = temps;	
	setTimeout(timer,1000);
}

function timer(){
	if (Temps>0){
		timeMsg(Temps-1);
	}
}


function isReady() {
	interfaceReady = true;
	return interfaceReady;
}

function page_init(){
	if(google){
		google.earth.createInstance('map3d', initCB, failureCallback);
	}
	timeMsg(duree);
}

var newGame = function(){
	numSheep = 5;
	addSheep(numSheep);
	if(interfaceReady){
	 	sendToActionScript('{"action":"init","numSheep":"'+numSheep+'"}');
	}
	//sendToActionScript('{"action":"init","numSheep":"'+numSheep+'"}');
	camera.setAltitude(500);
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
  	ge.getWindow().setVisibility(false);
	var options = ge.getOptions();   
	options.setStatusBarVisibility(false);  
	options.setGridVisibility(false);  
	options.setOverviewMapVisibility(false);  
	options.setScaleLegendVisibility(false);  
	options.setAtmosphereVisibility(false);  
	options.setMouseNavigationEnabled(false);
	ge.getOptions().setFlyToSpeed(ge.SPEED_TELEPORT);
	
	var la = ge.createLookAt('');
	la.set(centerMapLat, centerMapLon, 0, ge.ALTITUDE_RELATIVE_TO_GROUND, 0, 0, 500);
	ge.getView().setAbstractView(la);
	
	iconMarker = ge.createIcon('');
	iconMarker.setHref('http://labs.cedricmarteau.com/img/mouton_vue_aerienne.png');
	styleMarker = ge.createStyle(''); //create a new style
	styleMarker.getIconStyle().setIcon(iconMarker); //apply the icon to the style
	
	camera = ge.getView().copyAsCamera(ge.ALTITUDE_RELATIVE_TO_GROUND);
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
	distX = camera.getLatitude() - this.point.getLatitude();
	distY = camera.getLongitude() - this.point.getLongitude();
	distance = Math.sqrt(Math.pow(distX,2)+Math.pow(distY,2));
	if(this.point.getLatitude() < camera.getLatitude() || this.point.getLongitude() > camera.getLongitude()){
		distance = -distance;
	}
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
			console.log('dqsdqs');
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
		 case 38: // haut
			bougeX = 0;
		 	break;
		 case 40: // bas
			bougeX = 0;
		 	break;
		 case 37: // gauche
			bougeY = 0;
		 	break;
		 case 39: // droit
			bougeY = 0;
		 	break;
		case 32 : // espace
			if(keyDown == true){
				sendToActionScript('{"action":"get","value":"off"}');
			}
			break;
	}
	keyDown = false;
	return false;
}

document.onkeydown = function(e){
	switch (e.keyCode) {
		// Déplcement
		case 38 : // Haut
			bougeX = vitesseDeplacement*altitudeSoucoupe;
			break;
		case 40 : // bas
			bougeX = -vitesseDeplacement*altitudeSoucoupe;
			break;
		case 37 : // gauche
			bougeY = -vitesseDeplacement*altitudeSoucoupe;
			break;
		case 39 : // droit
			bougeY = vitesseDeplacement*altitudeSoucoupe;
			break;
		// Zoom
		case 65 : // A
			altitudeSoucoupe -= (altitudeSoucoupe > 100)?100:0;
			document.getElementById("jauge_hauteur").style.top=(-(altitudeSoucoupe-100)/7.5)+120+"px";
			sendToActionScript('{"action":"zoom","value":"'+altitudeSoucoupe+'"}');
			break;
		case 90 : // Z
 			altitudeSoucoupe += (altitudeSoucoupe < 1000)?100:0;
			document.getElementById("jauge_hauteur").style.top=(-(altitudeSoucoupe-100)/7.5)+120+"px";
			sendToActionScript('{"action":"zoom","value":"'+altitudeSoucoupe+'"}');
			break;
		// Attrapage
		case 32 : // espace
			if(keyDown == false){
				sendToActionScript('{"action":"get","value":"on"}');
			}
			break;		
	}
	console.log(e.keyCode);
	keyDown = true;
	enterFrame();
	return false;
}

var enterFrame = function (){
	setTimeout(function() {
		for(i=0;i<numSheep;i++){
			dist = tabMou[i].calculDistance();
			if(dist < distGetSheep){
				sendToActionScript('{"action":"mouton","num":"'+i+'","value":"'+dist+'"}');
			}
		}
		camera.setAltitude(altitudeSoucoupe);
		depCamLat = camera.getLatitude() + bougeX;
		depCamLon = camera.getLongitude() + bougeY;
		document.getElementById("point_radar").style.top=((31*(centerMapLat+mapSize/2-camera.getLatitude()))/mapSize+15)+"px";
		document.getElementById("point_radar").style.left=(31-(31*(centerMapLon+mapSize/2-camera.getLongitude()))/mapSize+15)+"px";
		if(depCamLat < (centerMapLat + mapSize) && depCamLat > (centerMapLat - mapSize) ){
			camera.setLatitude(depCamLat);
		}
		if(depCamLon < (centerMapLon + mapSize) && depCamLon > (centerMapLon - mapSize) ){
			camera.setLongitude(depCamLon);
		}
		ge.getView().setAbstractView(camera);
		if(keyDown){enterFrame();}
	},20);
}

//Gestion de la fin de la partie et du highScore
function finPartie(score)
{
	$('#map3d').html("Votre score = "+score+"<FORM NAME=\"formScore\"><INPUT TYPE=\"text\" NAME=\"input\" VALUE=\"Pseudo\"><BR><INPUT TYPE=\"button\" NAME=\"bouton\" VALUE=\"Soumettre\" onClick=\"highScore("+score+");\"></FORM>");
}

function highScore(scorePerso)
{
	var pseudo=$("input").val();
	$.getJSON("php/score.php",
				{pseudo:pseudo, score:scorePerso},
				function(data) {
					$('#map3d').html("");
					$.each(data, function(i,score){
						if(isset(score.pseudo))
							$('#map3d').append((i+1)+" "+score.pseudo+" "+score.score+"</BR>");
						else
							$('#map3d').append("</BR>ma position est : "+score.position+" avec un score de "+scorePerso);
					});
				  });
}

function isset(variable) {
   return (typeof variable != 'undefined');
}

function display(div){
	switch (div) {
		case 0:
			document.getElementById("intro").style.display="block";
			document.getElementById("home").style.display="none";
		break;
		case 1:
			document.getElementById("touches").style.display="block";
			document.getElementById("home").style.display="none";
		break;
		case 2:
			document.getElementById("scores").style.display="block";
			document.getElementById("home").style.display="none";
		break;
		case 3:
			document.getElementById("intro").style.display="none";
			newGame();
		break;
		case 4:
			document.getElementById("home").style.display="block";
			document.getElementById("scores").style.display="none";
		break;
		case 5:
			document.getElementById("home").style.display="block";
			document.getElementById("touches").style.display="none";
		break;
		case 6:
			document.getElementById("gameOver").style.display="none";
		break;
	}
}