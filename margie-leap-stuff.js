var controller = new Leap.Controller({
  enableGestures: true,
  frameEventName: 'animationFrame'
});
controller.connect();
console.log('HRYO')

var oldHandsDown = {};
controller.on('frame', function(frame){
  if(Math.random() < 0.5){
    var handsDown = {};
    frame.hands.forEach(function(hand){
      console.log('type: ' + hand.type + ' y-position: ' + hand.palmPosition[1] + ' y-velocity: ' + hand.palmVelocity[1]);
      // console.log(hand);

      var finger = hand.fingers[0];
      // console.log('finger',finger);
      handsDown[hand.type] = [];
      hand.fingers.forEach(function (finger) {
          var fingerPosition = finger.tipPosition[1] - hand.palmPosition[1];
          if (fingerPosition < -21) {
            console.log("Play that note")
          }
        handsDown[hand.type].push(fingerPosition < -21)
          console.log('finger.tipPosition', finger.type, finger.tipPosition);
      });

    });
    console.log(JSON.stringify(handsDown));

    var baseNote = 60;

    var leftHandOffsets = [0, 2, 4, 5, 7];

    if(handsDown.left && oldHandsDown.left){
      handsDown.left.reverse().forEach(function(fingerDown, i){
        if(fingerDown && !oldHandsDown.left[i]){
          noteOn(baseNote + leftHandOffsets[i], 1);
        }

        if(!fingerDown && oldHandsDown.left[i]){
          noteOff(baseNote + leftHandOffsets[i],1);
        }
      });
    }else{
      console.log('ALL OFF');
      for(var i = 0; i < 5; i++){
        noteOff(baseNote+ leftHandOffsets[i],1);
      }
    }

    var rightHandOffsets = [9,11,12,14,16];

    if(handsDown.right && oldHandsDown.right){
      handsDown.right.forEach(function(fingerDown, i){
        if(fingerDown && !oldHandsDown.right[i]){
          noteOn(baseNote + rightHandOffsets[i],1);
        }

        if(!fingerDown && oldHandsDown.right[i]){
          noteOff(baseNote + rightHandOffsets[i],1);
        }
      });
    }else{
      console.log('ALL OFF');
      for(var i = 0; i < 5; i++){
        noteOff(baseNote+ rightHandOffsets[i],1);
      }
    }

    oldHandsDown = handsDown;

  }
});
