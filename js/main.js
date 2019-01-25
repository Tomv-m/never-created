var noise = function noise() {
  var canvas = void 0, ctx = void 0;
  var wWidth = void 0, wHeight = void 0;
  var noiseData = [];
  var frame = 0;
  var loopTimeout = void 0;
  // Create Noise
  var createNoise = function createNoise() {
    var idata = ctx.createImageData(wWidth, wHeight);
    var buffer32 = new Uint32Array(idata.data.buffer);
    var len = buffer32.length;
    for (var i = 0; i < len; i++) {
      if (Math.random() < 0.5) {
        buffer32[i] = 0xff000000;
      }
    }
    noiseData.push(idata);
  };
  // Play Noise
  var paintNoise = function paintNoise() {
    if (frame === 9) {
      frame = 0;
    } else {
      frame++;
    }

    ctx.putImageData(noiseData[frame], 0, 0);
  };
  // Loop
  var loop = function loop() {
    paintNoise(frame);
    loopTimeout = window.setTimeout(function() {
      window.requestAnimationFrame(loop);
    }, 1000 / 25);
  };
  // Setup
  var setup = function setup() {
    wWidth = window.innerWidth;
    wHeight = window.innerHeight;

    canvas.width = wWidth;
    canvas.height = wHeight;

    for (var i = 0; i < 10; i++) {
      createNoise();
    }

    loop();
  };
  // Reset
  var resizeThrottle = void 0;
  var reset = function reset() {
    window.addEventListener(
      "resize",
      function() {
        window.clearTimeout(resizeThrottle);
        resizeThrottle = window.setTimeout(function() {
          window.clearTimeout(loopTimeout);
          setup();
        }, 200);
      },
      false
    );
  };
  // Init
  var init = (function() {
    canvas = document.getElementById("grain");
    ctx = canvas.getContext("2d");
    setup();
  })();
};
noise();


// parallax mouse
window.addEventListener('mousemove', mouseMove);
// set mouse to center
var mouse = {
  x: window.innerWidth * .5,
  y: window.innerHeight * .5,
}
function mouseMove(e) {
  mouse.x = e.clientX || e.clientX;
  mouse.y = e.clientY || e.clientY;
  parallax();
}
// input data
var input = {
  mouseX: {
    start: 0,
    end: window.innerWidth
  }
}
var setData = function(){
  input.mouseX.end = window.innerWidth;
  input.mouseX.range = input.mouseX.end - input.mouseX.start;
}
var setInput = function(){
  input.mouseX.fraction = (mouse.x - input.mouseX.start) / input.mouseX.range;
}
// output data
var output = {
  x: {
    start: -1,
    end: 1
  }
}
output.x.range = output.x.end - output.x.start;
var setOutput = function(){
  output.x.current = output.x.end - input.mouseX.fraction * output.x.range;
}
var setItems = function(){
  document.querySelector('.error-lines').style.transform = 'translateX('+ output.x.current +'%)';
}
var parallax = function(){
  setData();
  setInput();
  setOutput();
  setItems();
}
parallax();

// movie controls
var movie = document.querySelector('.movie');
movie.addEventListener('mouseover', function(){
  TweenMax.to('.movie video', 1, {scale: 1, ease: Power2.easeOut});
  TweenMax.to(movie, 1, {scale: 1.05, ease: Power2.easeOut});
});
movie.addEventListener('mouseout', function(){
  TweenMax.to('.movie video', .7, {scale: 1.1, ease: Power2.easeOut});
  TweenMax.to(movie, .7, {scale: 1, ease: Power2.easeOut});
});
var vid = document.getElementById('header-video'),
    isPlay = document.querySelector('.is-play'),
    innerBar = document.querySelector('.bar .inner'),
    pauseIcon = document.getElementById('pause'),
    playIcon = document.getElementById('play');
document.getElementById('player').addEventListener('click', playPause);
movie.addEventListener('click', playPause);
function playPause(){
  if(vid.paused){
    vid.play();
    isPlay.innerText = 'Pause';
    pauseIcon.style.display = 'inline-block';
    playIcon.style.display = 'none';
  } else {
    vid.pause();
    isPlay.innerText = 'Play';
    pauseIcon.style.display = 'none';
    playIcon.style.display = 'inline-block';
  }
}
vid.addEventListener('timeupdate', function(){
  var progress = vid.currentTime * (100/vid.duration);
  innerBar.style.width = progress + '%';
})

// cursor
var cursor = document.querySelector(".cursor");
animateCursor();
document.querySelectorAll(".highlight").forEach(function(e) {
  e.addEventListener("mouseover", function() {
    setSize(44);
  });
  e.addEventListener("mouseout", function() {
    setSize();
  });
});
// eventlisteners
document.addEventListener("mousedown", function() {
  toggleSize(true);
});
document.addEventListener("mouseup", function() {
  toggleSize();
});
document.addEventListener("mouseenter", function() {
  toggleCursor(true);
});
document.addEventListener("mouseleave", function() {
  toggleCursor();
});
var x = 0;
var y = 0;
function animateCursor() {
  x += (mouse.x - x) * .4;
  y += (mouse.y - y) * .4;
  cursor.style.left = x + "px";
  cursor.style.top = y + "px";
  requestAnimationFrame(animateCursor.bind(this));
}
function toggleSize(is) {
  is ? setSize(32) : setSize();
}
function toggleCursor(is) {
  is ? (cursor.style.opacity = 1, setSize()) : (cursor.style.opacity = 0, setSize("0"));
}
function setSize(size) {
  cursor.style.width = (size ? size : 38) + "px";
  cursor.style.height = (size ? size : 38) + "px";
}
