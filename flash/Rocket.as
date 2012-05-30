package {
    import flash.display.Sprite;
    import flash.events.*;
	import flash.utils.*;
	import flash.display.MovieClip;

	public class Rocket extends Sprite{
		
		private var timer:Timer;
		private var warn:MovieClip;
		private var rocket:MovieClip;
		public static const READY:String = "RocketReady";
		
		public function Rocket(posY:Number){
			y = posY;
			x = 460;
			timer = new Timer(1300);
			timer.addEventListener(TimerEvent.TIMER,onTimer);
			warn = new Warning();
			rocket = new theRocket();
			addChild(warn);
			timer.start();
			
		}
		
		private function onTimer(e:TimerEvent) {
			x += 30;
			timer.removeEventListener(TimerEvent.TIMER,onTimer);
			removeChild(warn);
			addChild(rocket);
			dispatchEvent(new Event(READY,true));
		}

	}
}