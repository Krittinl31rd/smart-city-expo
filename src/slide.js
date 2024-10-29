let slideIndex = 0;
let slides = document.getElementsByClassName("hidden");
let autoSlideInterval;
let isPaused = false;

let vid = document.getElementById("myVideo");

// Load saved slide times from local storage, or use defaults
let slideTimes = JSON.parse(localStorage.getItem("slideTimes")) || [5000, 5000, 5000, 5000, 5000];

// Show the initial slide
showSlide(slideIndex);

// Auto slide with dynamic time for each slide
autoSlide(getSlideInterval(slideIndex));

// Function to change slides manually
function moveSlide(n) {
    showSlide(slideIndex += n);
    $("#pauseBtn").html(`<i class='bx bx-pause'></i>`)
}

// Function to show the current slide
function showSlide(n) {
    if (n >= slides.length) {
        slideIndex = 0;
    }
    if (n < 0) {
        slideIndex = slides.length - 1;
    }
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slides[slideIndex].style.display = "block";

    if (slideIndex == 2) {
        playVid();
    } else if (slideIndex == 1 || slideIndex == 3) {
        pauseVid();
    }
}

// Function to dynamically set the interval for each slide
function getSlideInterval(slideIndex) {
    return slideTimes[slideIndex] || 5000;
}

// Function to enable auto slide with dynamic intervals
function autoSlide(interval) {
    autoSlideInterval = setTimeout(function () {
        moveSlide(1);
        autoSlide(getSlideInterval(slideIndex));  // Adjust interval for the next slide
    }, interval);
}

// Function to pause the slideshow
function pauseSlide() {
    clearTimeout(autoSlideInterval);
    isPaused = true;
    $("#pauseBtn").html(`<i class='bx bx-play' ></i>`)
}

// Function to resume the slideshow
function resumeSlide() {
    autoSlide(getSlideInterval(slideIndex));
    isPaused = false;
    $("#pauseBtn").html(`<i class='bx bx-pause'></i>`)
}

function checkPause() {
    if (!isPaused) {
        pauseSlide();
    } else {
        resumeSlide();
    }
}

function playVid() {
    vid.currentTime = 0;
    vid.play();
}

function pauseVid() {
    vid.pause();
    vid.currentTime = 0;
}

// Function to handle keypress events for manual slide and pause functionality
document.onkeydown = function (e) {
    if (e.key === 'ArrowLeft') {
        if (!isPaused) {
            clearTimeout(autoSlideInterval);  // Pause auto-slide
            moveSlide(-1);  // Move to the previous slide
            autoSlide(getSlideInterval(slideIndex));  // Resume auto-slide with the correct interval
        }
    } else if (e.key === 'ArrowRight') {
        if (!isPaused) {
            clearTimeout(autoSlideInterval);
            moveSlide(1);  // Move to the next slide
            autoSlide(getSlideInterval(slideIndex));  // Resume auto-slide with the correct interval
        }
    } else if (e.key === 'p' || e.key === 'P') {  // Handle "P" key press
        if (!isPaused) {
            pauseSlide();  // Pause the slideshow
        } else {
            resumeSlide();  // Resume the slideshow if paused
        }
    }
};

$('#fullscreenBtn').on('click', function () {
    var elem = $('#fullscreenElement')[0];

    if (!document.fullscreenElement &&    // Standard browsers
        !document.mozFullScreenElement && // Firefox
        !document.webkitFullscreenElement && // Chrome, Safari, Opera
        !document.msFullscreenElement) { // IE/Edge

        // Enter fullscreen
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen(); // Firefox
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen(); // Chrome, Safari, Opera
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen(); // IE/Edge
        }
    } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen(); // Firefox
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen(); // Chrome, Safari, Opera
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen(); // IE/Edge
        }
    }
});


let cursorTimeout;

// Function to hide the cursor
function hideCursor() {
    document.body.style.cursor = 'none';
}

// Function to reset the timer and show the cursor again
function resetCursorTimer() {
    // Show the cursor
    document.body.style.cursor = 'default';

    // Clear any existing timer
    clearTimeout(cursorTimeout);

    // Set a new timer to hide the cursor after 5 seconds of inactivity
    cursorTimeout = setTimeout(hideCursor, 5000);
}

// Attach the reset function to mousemove event
document.addEventListener('mousemove', resetCursorTimer);

// Initialize the cursor timer on page load
resetCursorTimer();
