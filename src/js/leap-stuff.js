var controller = new Leap.Controller({
  enableGestures: true,
  frameEventName: 'animationFrame'
});


var bpm = 102,
    beatLength = 120 * 1000/ bpm,
    beatStartTime = Date.now(),
    timeSinceBeat = 0,
    direction = 'up',
    rate = 1,
    pastBeats = [
      beatLength,
      beatLength,
      beatLength,
      beatLength,
      beatLength,
    ];

function swapDirection(){
 if(direction === 'up'){
   direction = 'down';
 } else {
   direction = 'up';
 }
 pastBeats.unshift(Date.now() - beatStartTime);
 pastBeats.pop();

 var sum = 0;
 for(var i = 0; i < pastBeats.length; i++){
  sum += pastBeats[i];
 }
 var average = sum / pastBeats.length;
//  rate = beatLength / average;

 beatStartTime = Date.now();
 console.log('SWITCH direction: ' + direction + ' rate: ' + Math.round(rate*100)/100);
 console.log(pastBeats);
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
    // if(hand.type==='left'){
    //   var volume = (hand.palmPosition[1] - 50) / 100;
    //   leftTrack.gainSlider.value = volume;
    //   var evt = new CustomEvent('input');
    //   leftTrack.gainSlider.dispatchEvent(evt);
    // }

    // if(hand.type==='right'){
      var handPosition = (hand.palmPosition[1] - 100) / 200;
      handPosition = Math.max(0, Math.min(1, handPosition));
      handPosition = direction === 'up' ? handPosition : 1 - handPosition;

      if(handPosition === 1) {
        swapDirection();
      }

      var beatProgress = timeSinceBeat / beatLength;
      var newRate = handPosition / beatProgress;
      rate += 0.01*(newRate-rate);

      if(Math.random() < 0.2) {
        console.log('direction: ' + direction + ' rate: ' + Math.round(rate*100)/100);
      }

      s.tempo = rate;

      // leftTrack.pbrSlider.value = rate;
      // var evt = new CustomEvent('input');
      // leftTrack.pbrSlider.dispatchEvent(evt);
    // }
  });
});

controller.connect();


var audioCtx = new AudioContext(),
    mydiv = document.getElementById('mydiv'),
    playButton = document.getElementById('playButton'),
    pauseButton = document.getElementById('pauseButton'),
    bpmInput = document.getElementById('bpmInput');

playButton.onclick = play;
pauseButton.onclick = pause;

bpmInput.value = bpm;
bpmInput.addEventListener('input',function(){
  console.log(+bpmInput.value);
  bpm = +bpmInput.value;
  beatLength = 120 * 1000/ bpm;
});

mydiv.addEventListener('dragover', function (evt) {
  evt.stopPropagation();
  evt.preventDefault();
  evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}, false);

mydiv.addEventListener('drop', function (ev) {
      pause();
  		ev.preventDefault();
      console.log(ev.dataTransfer.files[0]);
      console.log(ev);

	  	var reader = new FileReader();
	  	reader.onload = function (event) {
        console.log('loaded')
	  		audioCtx.decodeAudioData( event.target.result, function(data) {
          console.log('decoded')
          buffer = data;
          play();

	  		}, function(){console.error("error loading!");} );

	  	};
	  	reader.onerror = function (event) {
	  		console.error("Error: " + reader.error );
		};
	  	reader.readAsArrayBuffer(ev.dataTransfer.files[0]);
	  	return false;
	}, false );
