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
	numSheep = 5,
	score = 0,
	vitesseDeplacement = 0.00000008,
	duree = 181,
	secondes = 180,
	statut=true,
	charger = false,
	nbSheep = numSheep,
	theLevel;
 
// Constante
const centerMapLat = 45.4943800000006,
	  centerMapLon = 2.42566000000163,
	  distGetSheep = 0.0008;
	
var level = new Array(
	{'rocket':600,'numSheep':3, 'time':120},
	{'rocket':500,'numSheep':5, 'time':120},
	{'rocket':500,'numSheep':8, 'time':120},
	{'rocket':400,'numSheep':5, 'time':120},
	{'rocket':300,'numSheep':5, 'time':120},
	{'rocket':300,'numSheep':8, 'time':120},
	{'rocket':200,'numSheep':5, 'time':120},
	{'rocket':100,'numSheep':5, 'time':120},
	{'rocket':80, 'numSheep':8, 'time':120},
	{'rocket':50, 'numSheep':10,'time':100}
);

function isReady() {
	interfaceReady = true;
	return interfaceReady;
}

function page_init(){
	if(google){
		google.earth.createInstance('map3d', initCB, failureCallback);
	}
}
	
function Decompte(){
	if (secondes>0){
		var CompteARebours = document.getElementById("temps");
		var temps_actuel = new Date()/1000;
		if (statut==true){
			temps_init=temps_actuel;
			statut=false;
		}
		var temps_final = temps_init+duree;
		secondes = Math.floor(temps_final - temps_actuel);
		document.getElementById("temps").innerHTML = secondes;
		Time_ReLance = setTimeout("Decompte()", 1000);
	}
	else{
		sendToActionScript('{"action":"gameover"}');
		for(i=0;i<numSheep;i++){
			ge.getFeatures().removeChild(tabMou[i].placemark); 
		}
		document.getElementById("gameOver").style.display="block";
	}
}

function initLevel(leLevel){
	theLevel = leLevel;
	numSheep = nbSheep = level[leLevel].numSheep;
	duree = level[leLevel].time;
	tabMou = [];
	altitudeSoucoupe = 500;
	for(i=0;i<numSheep;i++){
		tabMou[i] = new Mouton(i);
	}
	if(interfaceReady){
	 	sendToActionScript('{"action":"init","numSheep":"'+numSheep+'","level":"'+ leLevel+'","rocket":"'+level[leLevel].rocket+'"}');
	}
	document.getElementById("mission").innerHTML = "CAPTURER "+nbSheep+" MOUTON(S)";
	document.getElementById("score").innerHTML = score;
	document.getElementById("viseur").innerHTML = "";
	document.getElementById("bouton").style.backgroundPosition="0px -88px";
	camera.setAltitude(500);
	camera.setLatitude(centerMapLat);
	camera.setLongitude(centerMapLon);
	Decompte();
}


function newGame(leLevel){
	initLevel(0);
	score = 0;
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
	
	console.log('hey : '+value);
	data = json_parse(value,function(key,value){return value;});
	
	switch(data.action){
		
		case 'choppe' :
			charger = true;
			document.getElementById("bouton").style.backgroundPosition="0px 0px";
			for(i=0;i<numSheep;i++){
				if (tabMou[i].numero == data.numero){
					ge.getFeatures().removeChild(tabMou[i].placemark); 
				}
			}
			nbSheep = nbSheep - 1;
			
			document.getElementById("viseur").innerHTML = "EMMENER LE MOUTON DANS L'HYPERESPACE";
			break;
			
		case 'gameOver' :
			for(i=0;i<numSheep;i++){
				ge.getFeatures().removeChild(tabMou[i].placemark); 
			}
			setTimeout(function() {
				document.getElementById("gameOver").style.display="block";
				document.getElementById("scoreFinal").innerHTML = "SCORE : "+score;
			},1500);
			break;
		
		case 'decharger' :
			console.log('décharge');
			charger = false;
			score += 10;
			document.getElementById("mission").innerHTML = "CAPTURER "+nbSheep+" MOUTON(S)";
			document.getElementById("score").innerHTML = score;
			document.getElementById("viseur").innerHTML = "";
			document.getElementById("bouton").style.backgroundPosition="0px -88px";
			if (nbSheep==0){
				clearTimeout(Time_ReLance);
				document.getElementById("YouWin").style.display="block";
				var scor = parseInt(score)+parseInt(secondes);
				score = scor;
				document.getElementById("scoreFinal").innerHTML = "SCORE : "+scor;
			}
			break;
	}
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

var Mouton = function(num) {
	this.numero = num;
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

document.onkeyup = function(e){
	// Envoie du numero de la touche à flash
	switch (e.keyCode) {
		 case 38: // haut
			bougeX = 0;
			sendToActionScript('{"action":"bouge","value":"off"}');
		 	break;
		 case 40: // bas
			bougeX = 0;
			sendToActionScript('{"action":"bouge","value":"off"}');
		 	break;
		 case 37: // gauche
			bougeY = 0;
			sendToActionScript('{"action":"bouge","value":"off"}');
		 	break;
		 case 39: // droit
			bougeY = 0;
			sendToActionScript('{"action":"bouge","value":"off"}');
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
			sendToActionScript('{"action":"bouge","value":"on"}');
			break;
		case 40 : // bas
			bougeX = -vitesseDeplacement*altitudeSoucoupe;
			sendToActionScript('{"action":"bouge","value":"on"}');
			break;
		case 37 : // gauche
			bougeY = -vitesseDeplacement*altitudeSoucoupe;
			sendToActionScript('{"action":"bouge","value":"on"}');
			break;
		case 39 : // droit
			bougeY = vitesseDeplacement*altitudeSoucoupe;
			sendToActionScript('{"action":"bouge","value":"on"}');
			break;
		// Zoom
		case 65 : // A
			altitudeSoucoupe -= (altitudeSoucoupe > 100)?100:0;
			document.getElementById("jauge_hauteur").style.top=(-(altitudeSoucoupe-100)/7.5)+120+"px";
			sendToActionScript('{"action":"zoom","value":"'+altitudeSoucoupe+'","charger":"'+charger+'"}');
			break;
		case 90 : // Z
 			altitudeSoucoupe += (altitudeSoucoupe < 1000)?100:0;
			document.getElementById("jauge_hauteur").style.top=(-(altitudeSoucoupe-100)/7.5)+120+"px";
			sendToActionScript('{"action":"zoom","value":"'+altitudeSoucoupe+'","charger":"'+charger+'"}');
			break;
		// Attrapage
		case 32 : // espace
			if(keyDown == false && !charger){
				sendToActionScript('{"action":"get","value":"on"}');
			}
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
			statut = true;
			document.getElementById("gameOver").style.display="none";
			newGame();
			break;
		case 7:
			statut = true;
			document.getElementById("YouWin").style.display="none";
			document.getElementById("gameOver").style.display="none";
			initLevel(theLevel+1);
			break;
	}
}