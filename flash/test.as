﻿package {    import flash.display.Sprite;    import flash.events.*;    import flash.external.ExternalInterface;    import flash.text.TextField;    import flash.utils.Timer;    import flash.text.TextFieldType;    import flash.text.TextFieldAutoSize;	import theRocket;	import soucoupe;    public class test extends Sprite {        private var input:TextField;        private var output:TextField;        private var sendBtn:Sprite;		private var soucoupe:Soucoupe;		private var left:String = '37';		private var up:String = '38';		private var right:String = '39';		private var down:String = '40';		private var space:Boolean = false;		private var larg:uint = stage.stageWidth;		private var haut:uint = stage.stageHeight;		        public function test() {			    soucoupe = new Soucoupe();			soucoupe.x = larg/2;			soucoupe.y = 100;			addChild(soucoupe);            if (ExternalInterface.available) {                ExternalInterface.addCallback("sendToActionScript", receivedFromJavaScript);        	}			addEventListener(Event.ENTER_FRAME, enterFrame);		}		        private function receivedFromJavaScript(value:String):void {            if (value=='espace'){				space = true;			}			if (value=='espaceUp'){				space = false;			}        }				private function enterFrame(e:Event):void {			if(space != true){	           		if(soucoupe.y < 300){					soucoupe.y += 10;				}			}else{				if(soucoupe.y > 15){					soucoupe.y -= 10;				}			}			if(Math.random()*50 < 1){				var uneRocket:theRocket = new theRocket(stage.stageWidth);				addChild(uneRocket);				uneRocket.addEventListener(Event.ENTER_FRAME, enterFrameRocket);			}        }		var i = 0;		private function enterFrameRocket(e:Event):void {			if(e.target.x < (larg/2+30) && e.target.x > (larg/2-30) && e.target.y > (soucoupe.y-15) && e.target.y < (soucoupe.y+15)){				if (ExternalInterface.available) {	                ExternalInterface.call("sendToJavaScript", 'BOUMMM');					//e.target.bye();					e.target.removeEventListener(Event.ENTER_FRAME, enterFrameRocket);	            }			}        }				    }}