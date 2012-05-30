﻿package {    import flash.display.Sprite;    import flash.events.*;    import flash.external.ExternalInterface;    import flash.utils.*;    public class Winteriscoming extends Sprite {		private var soucoupe:Soucoupe;		private var larg:uint = stage.stageWidth;		private var haut:uint = stage.stageHeight;		private const constProbaRocket:Number = 200;		private var probaRocket:Number = constProbaRocket;		private var vitesseRocket:Number = 4;		        public function Winteriscoming() {						// Création de la soucoupe 		    soucoupe = new Soucoupe(100,larg/2);			addChild(soucoupe);						// Création de l'interface avec javascript            if (ExternalInterface.available) {                ExternalInterface.addCallback("sendToActionScript", receivedFromJavaScript);        	}						// Ecouteur d'évènements sur le framerate 			addEventListener(Event.ENTER_FRAME, enterFrame);			}				// Fonction de réception des données envoiés par javascript        private function receivedFromJavaScript(value:String):void {			switch(value){				case 'espace' :					soucoupe.monte = true;					break;				case 'espaceup' :					soucoupe.monte = false;					break;			}        }				// Fonction framerate		private function enterFrame(e:Event):void {			if(Math.random()*probaRocket < 5){			 	prepareRocket();				probaRocket = constProbaRocket;			}else{				probaRocket--;			}        }			private function prepareRocket(){			var r:Rocket = new Rocket(Math.random()*390 + 10);			r.addEventListener(Rocket.READY,onRocketReady);			addChild(r);		}			private function onRocketReady(e:Event):void{			var r:Rocket = e.target as Rocket;			r.addEventListener(Event.ENTER_FRAME,enterFrameRocket);		}				private function enterFrameRocket(e:Event):void {			var r:Rocket = e.target as Rocket;			if((r.x < -r.width) || r.hitTestObject(soucoupe)){				r.removeEventListener(Event.ENTER_FRAME, enterFrameRocket);	       		removeChild(r);			}else{				r.x -= vitesseRocket;				}        }    }}