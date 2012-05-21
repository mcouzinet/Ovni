 document.onkeydown = returnKey;
 document.onkeyup = returnKeyUp;

 var jsReady = false;
 function isReady() {
     return jsReady;
 }

 function pageInit() {
    jsReady = true;
	initMap();
 }

 function thisMovie(movieName) {
     if (navigator.appName.indexOf("Microsoft") != -1) {
         return window[movieName];
     } else {
         return document[movieName];
     }
 }

 function sendToActionScript(value) {
     thisMovie("ExternalInterfaceExample").sendToActionScript(value);
 }

 function sendToJavaScript(value) {
     document.forms["form1"].output.value += "ActionScript says: " + value + "\n";
 }

var left = 37;
var up = 38;
var right = 39;
var down = 40;

function returnKey(e)
{
	console.log(e.keyCode);
	if (e.keyCode==32){
		sendToActionScript('espace');
	}
	if (e.keyCode==up){
		sendToActionScript('haut');
	}
	if (e.keyCode==right){
		sendToActionScript('droite');
	}
	if (e.keyCode==down){
		sendToActionScript('bas');
	}
}

function returnKeyUp(e)
{
	console.log(e.keyCode);
	if (e.keyCode==32){
		sendToActionScript('espaceUp');
	}
	if (e.keyCode==up){
		sendToActionScript('haut');
	}
	if (e.keyCode==right){
		sendToActionScript('droite');
	}
	if (e.keyCode==down){
		sendToActionScript('bas');
	}
}
