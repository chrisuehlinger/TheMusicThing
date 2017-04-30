// setTimeout(function(){
//   leftTrack.trackElement.querySelector('.powerButton').click();
// }, 1500);

var controller = new Leap.Controller({
  enableGestures: true,
  frameEventName: 'animationFrame'
});


var bpm = 120,
    beatLength = 120 * 1000/ bpm,
    beatStartTime = Date.now(),
    timeSinceBeat = 0,
    direction = 'up',
    rate = 1;

function swapDirection(){
 if(direction === 'up'){
   direction = 'down';
 } else {
   direction = 'up';
 }
 console.log('direction: ' + direction + ' rate: ' + Math.round(rate*100)/100);
}
controller.on('frame', function(frame){
  // if(Math.random() < 0.2){
  //   frame.hands.forEach(function(hand){
  //     console.log(' type: ' + hand.type +
  //                 ' y-pos: ' + hand.palmPosition[1] +
  //                 ' y-vel: ' + hand.palmVelocity[1]);
  //   })
  // }

  timeSinceBeat = Date.now() - beatStartTime;

  frame.hands.forEach(function(hand){
    if(hand.type==='left'){
      var volume = (hand.palmPosition[1] - 50) / 100;
      leftTrack.gainSlider.value = volume;
      var evt = new CustomEvent('input');
      leftTrack.gainSlider.dispatchEvent(evt);
    }

    if(hand.type==='right'){
      var handPosition = (hand.palmPosition[1] - 100) / 200;
      handPosition = Math.max(0, Math.min(1, handPosition));
      handPosition = direction === 'up' ? handPosition : 1 - handPosition;

      if(handPosition === 1) {
        swapDirection();
        beatStartTime = Date.now();
      }

      var beatProgress = timeSinceBeat / beatLength;
      var newRate = handPosition / beatProgress;
      rate += 0.01*(newRate-rate);

      // if(Math.random() < 0.2) {
      //   console.log('direction: ' + direction + ' rate: ' + Math.round(rate*100)/100);
      // }

      leftTrack.pbrSlider.value = rate;
      var evt = new CustomEvent('input');
      leftTrack.pbrSlider.dispatchEvent(evt);
    }
  });
});

controller.connect();
