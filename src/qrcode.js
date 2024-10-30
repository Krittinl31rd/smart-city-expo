let defaultURL = "http://192.168.1.66:5500";
let qrInterval;

// Function to generate a timestamp 5 minutes from now
function generateTimestamp() {
    return Math.floor(Date.now() / 1000) + 300;
}

// Function to create a QR code with the timestamp
function generateQRCode(expireTime) {
    const qr = qrcode(0, 'L');
    qr.addData(`${defaultURL}/?t=${expireTime}`);
    qr.make();
    const size = 24;
    const margin = 4;

    const imgTag = qr.createImgTag(size, margin);

    const container = $("#qrcodeCon")[0]

    $(container).html(imgTag);
    $(container).find('img').eq(0).css('cursor', 'pointer');
    $(container).find('img').eq(0).on('click', function () {
        window.open(`${defaultURL}/?t=${expireTime}`, '_blank');
    });
}



// Function to start the timer and update the QR code every 5 minutes
function startQR() {
    let expireTime = generateTimestamp();
    generateQRCode(expireTime);

    qrInterval = setInterval(() => {
        expireTime = generateTimestamp();
        generateQRCode(expireTime);
        console.log("New QRcode")
    }, 60000);
}


function stopQR() {
    clearInterval(qrInterval);
}

// page qrcode gen qrcode set every 1 min
// not page qrcode clear interval




