﻿package {	    import flash.display.Sprite;    import flash.events.*;    import flash.external.ExternalInterface;    import flash.utils.*;	import com.adobe.serialization.json.*;		import flash.display.StageScaleMode;	import fl.transitions.Tween;	import fl.transitions.easing.*;    public class Winteriscoming extends Sprite {		private const constProbaRocket:Number = 800;		private var soucoupe:Soucoupe;		private var larg:uint = stage.stageWidth;		private var haut:uint = stage.stageHeight;		private var probaRocket:Number = constProbaRocket;		private var vitesseRocket:Number = 10;		private var numSheep;		private var chope:Boolean = false;		private var tabSheep:Array = new Array();		private var zoneDetect:Number = 40;		        public function Winteriscoming() {						stage.scaleMode = StageScaleMode.NO_SCALE;						// Création de la soucoupe 		    soucoupe = new Soucoupe(250,larg/2);			addChild(soucoupe);						// Création de l'interface avec javascript			ExternalInterface.marshallExceptions = true;						if (ExternalInterface.available) {				try {	            	ExternalInterface.addCallback("sendToActionScript", receivedFromJavaScript);	                   if (!checkJavaScriptReady()) {	                       var readyTimer:Timer = new Timer(100, 0);	                       readyTimer.addEventListener(TimerEvent.TIMER, timerHandler);	                       readyTimer.start();	                   }	             } catch (error:SecurityError) {	             	trace(error);	             } catch (error:Error) {	             	trace(error);	             }	        }						// Ecouteur d'évènements sur le framerate 			addEventListener(Event.ENTER_FRAME, enterFrame);		}				private function checkJavaScriptReady():Boolean {			var isReady:Boolean = ExternalInterface.call("isReady");			return isReady;		}				private function timerHandler(event:TimerEvent):void {		var isReady:Boolean = checkJavaScriptReady();			if (isReady) {				Timer(event.target).stop();			}		}				// Fonction de réception des données envoiés par javascript	        public function receivedFromJavaScript(value:String):void {						var data = JSON.decode(value,true);						switch(data.action){				case 'zoom' :					soucoupe.bouge(data.value);					chope = (data.value == 100)?true:false;					break;				case 'mouton' :					for(var i:uint=0;i<numSheep;i++){						if(tabSheep[i].numero == data.num){							var deplacement:Tween = new Tween(tabSheep[i], "x", Strong.easeOut, tabSheep[i].x, (240 + ( data.value*260/0.0008)), 0.2, true);						}					}					break;				case 'init' :					ExternalInterface.call("sendToJavaScript",'{"action":"init"}');					addSheep(data);					break;				case 'get' :					if(data.value == 'on'){						if(chope){							for(var j:uint=0;j<numSheep;j++){								if(tabSheep[j].x < 240+zoneDetect && tabSheep[j].x > 240-zoneDetect){									tabSheep[j].monte();									tabSheep[j].addEventListener(Mouton.CHOPPE,onMoutonChoppe);								}							}						}						soucoupe.gotoAndPlay('chope');					}else{						soucoupe.gotoAndPlay('dechope');						for(var k:uint=0;k<numSheep;j++){							if(tabSheep[k].ilMonte){								tabSheep[k].descend();							}						}						}					break;			}        }		private function onMoutonChoppe(e:Event){			var mouton:Mouton = e.target as Mouton;			removeChild(mouton);			ExternalInterface.call("sendToJavaScript",'{"action":"choppe","numero":"'+mouton.numero+'"}');		}				private function addSheep(data){			numSheep = data.numSheep;			for(var i:uint=0;i<numSheep;i++){				var mout = new Mouton();				mout.numero = i;				addChildAt(mout,1);				tabSheep.push(mout);			}		}				// Fonction framerate		private function enterFrame(e:Event):void {			if(Math.random()*probaRocket < 5){			 	prepareRocket();				probaRocket = constProbaRocket;			}else{				probaRocket--;			}        }			private function prepareRocket(){			var r:Rocket = new Rocket(Math.random()*390 + 10);			r.addEventListener(Rocket.READY,onRocketReady);			addChild(r);		}			private function onRocketReady(e:Event):void{			var r:Rocket = e.target as Rocket;			r.addEventListener(Event.ENTER_FRAME,enterFrameRocket);		}				private function enterFrameRocket(e:Event):void {						var rocket:Rocket = e.target as Rocket;						if(rocket.x < -rocket.width){				rocket.removeEventListener(Event.ENTER_FRAME, enterFrameRocket);	       		removeChild(rocket);			}else{				if(rocket.hitTestObject(soucoupe)){					rocket.removeEventListener(Event.ENTER_FRAME, enterFrameRocket);		       		removeChild(rocket);					soucoupe.gotoAndPlay('explosion');					gameover();				}				rocket.x -= vitesseRocket;				}        }		private function gameover():void{			ExternalInterface.call("sendToJavaScript",'{"action":"gameOver"}');		}    } // End of class}