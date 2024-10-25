function updateSlideTimings() {
    // Get the values from the form and update slideTimes array
    let slide0Time = document.getElementById('slide0Time').value * 1000;  // Convert to milliseconds
    let slide1Time = document.getElementById('slide1Time').value * 1000;
    let slide2Time = document.getElementById('slide2Time').value * 1000;
    let slide3Time = document.getElementById('slide3Time').value * 1000;
    let slide4Time = document.getElementById('slide4Time').value * 1000;
    try {
        let slideTimes = []
        if (slide0Time != 0 && slide1Time != 0 && slide2Time != 0 && slide3Time != 0 && slide4Time != 0) {

            slideTimes.push(
                slide0Time,
                slide1Time,
                slide2Time,
                slide3Time,
                slide4Time
            )
            // Save the updated times to local storage
            localStorage.setItem("slideTimes", JSON.stringify(slideTimes));
            document.getElementById('statusSave').innerHTML = `Save success!!!`
            setTimeout(() => {
                document.getElementById('statusSave').innerHTML = '';
            }, 1500);
        } else {
            document.getElementById('statusSave').innerHTML = `Error no update 0 second!!!`
            setTimeout(() => {
                document.getElementById('statusSave').innerHTML = '';
            }, 2000);
        }
    } catch (error) {
        console.log(error)
        document.getElementById('statusSave').innerHTML = `Save not success!!!`
        setTimeout(() => {
            document.getElementById('statusSave').innerHTML = '';
        }, 1500);
    }


}


window.onload = function () {
    let slideTimes = JSON.parse(localStorage.getItem("slideTimes")) || [5000, 5000, 5000, 5000, 5000];
    document.getElementById('slide0Time').value = slideTimes[0] / 1000;
    document.getElementById('slide1Time').value = slideTimes[1] / 1000;
    document.getElementById('slide2Time').value = slideTimes[2] / 1000;
    document.getElementById('slide3Time').value = slideTimes[3] / 1000;
    document.getElementById('slide4Time').value = slideTimes[4] / 1000;
};