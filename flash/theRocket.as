package {
    import flash.display.Sprite;
    import flash.events.*;

	public class theRocket extends Sprite{
		
		private var rocket:Sprite;
		public var _X:uint;
		
		public function theRocket(largeur){
			rocket = new Sprite();
			trace('edsqdsd');
			this.x = largeur;
			this.y = Math.random()*300;
			rocket.addEventListener(Event.ENTER_FRAME, rocketFrame);
			addChild(rocket);
		}
	
		private function rocketFrame(e:Event):void {
			if(e.target.x > -20){
	       		this.x -= 10;
			}else{
				rocket.removeEventListener(Event.ENTER_FRAME, rocketFrame);
			}
	    }
	
		private function bye():void {
			removeChild(this);
	    }
	}
}