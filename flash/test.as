﻿package {    import flash.display.Sprite;    import flash.events.*;    import flash.external.ExternalInterface;    import flash.text.TextField;    import flash.utils.*;    import flash.text.TextFieldType;    import flash.text.TextFieldAutoSize;	import theRocket;	import soucoupe;    public class test extends Sprite {        private var input:TextField;        private var output:TextField;        private var sendBtn:Sprite;		private var soucoupe:Soucoupe;		private var left:String = '37';		private var up:String = '38';		private var right:String = '39';		private var down:String = '40';		private var space:Boolean = false;		private var larg:uint = stage.stageWidth;		private var haut:uint = stage.stageHeight;				public var vitesse:uint = 10;		        public function test() {					    soucoupe = new Soucoupe();			soucoupe.x = larg/2;			soucoupe.y = 100;			addChild(soucoupe);            if (ExternalInterface.available) {                ExternalInterface.addCallback("sendToActionScript", receivedFromJavaScript);        	}			addEventListener(Event.ENTER_FRAME, enterFrame);				}		        private function receivedFromJavaScript(value:String):void {			ExternalInterface.call("sendToJavaScript", stage.stageWidth );            if (value=='espace'){				//ExternalInterface.call("sendToJavaScript", 'UP');				space = true;			}			if (value=='espaceup'){				//ExternalInterface.call("sendToJavaScript", 'DOWN');				space = false;			}        }				private function enterFrame(e:Event):void {			if(space != true){	           		if(soucoupe.y < (stage.stageHeight - soucoupe.height) ){					soucoupe.y += vitesse;				}			}else{				if(soucoupe.y > 0){					soucoupe.y -= vitesse;				} 			}						if(Math.random()*50 < 1){			 	prepareRocket();			}        }			private function prepareRocket(){			var r:Rocket = new Rocket(Math.random()*600);			r.addEventListener(Rocket.READY,onRocketReady);			addChild(r);		}			private function onRocketReady(e:Event):void{			var r:Rocket = e.target as Rocket;			r.addEventListener(Event.ENTER_FRAME,enterFrameRocket);		}				private function enterFrameRocket(e:Event):void {			if(e.target.x > -e.target.width){	       		e.target.x -= 4;			}else{				e.target.removeEventListener(Event.ENTER_FRAME, enterFrameRocket);			}			if(e.target.x < (larg/2+30) && e.target.x > (larg/2-30) && e.target.y > (soucoupe.y-15) && e.target.y < (soucoupe.y+15)){				if (ExternalInterface.available) {	                ExternalInterface.call("sendToJavaScript", 'BOUMMM');					e.target.removeEventListener(Event.ENTER_FRAME, enterFrameRocket);	            }			}        }				    }}