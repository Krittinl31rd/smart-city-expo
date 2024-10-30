var deviceList = []
var memberId = 2421

class Room {
    constructor() {
        this.id = 0;
        this.name = "";
        this.dimmer = [];
        this.power = [];
        this.airq = [];
        this.sensor = [];
    }
}

class Dimmer {
    constructor() {
        this.type = 3;
        this.id = 0;
        this.name = "Dimmer";
        this.online = 0;
        this.bright = 0;
        this.status = 0;
    }
}

function initData(member) {
    deviceList.push(member.Name);

    Object.entries(member.Room).map(([roomId, room]) => {
        let rooms = new Room();
        rooms.id = roomId;
        rooms.name = room.Name;
        deviceList.push(rooms);
    });

    Object.entries(member.Device).map(([deviceID, devices]) => {
        if (devices.DeviceStyleID == 3) {
            let dimmer = new Dimmer();
            dimmer.id = deviceID;
            dimmer.name = devices.DeviceName;
            dimmer.online = devices.Control[0].Value;
            dimmer.bright = devices.Control[1].Value;
            dimmer.status = devices.Control[2].Value;
            deviceList[devices.RoomID].dimmer.push(dimmer);
        }
        if (devices.DeviceStyleID == 20) {
            for (let i = 1; i < Object.keys(devices.Control).length; i++) {
                deviceList[devices.RoomID].power.push({
                    type: 20,
                    id: deviceID,
                    name: devices.Control[i].Label,
                    value: devices.Control[i].Value,
                });
            }
        }
        if (devices.DeviceStyleID == 21) {
            if (devices.Control[5]) {
                deviceList[devices.RoomID].sensor.push({
                    type: 21,
                    id: deviceID,
                    name: devices.Control[5].Label,
                    value: devices.Control[5].Value,
                });
            } if (devices.Control[6]) {
                deviceList[devices.RoomID].sensor.push({
                    type: 21,
                    id: deviceID,
                    name: devices.Control[6].Label,
                    value: devices.Control[6].Value,
                });
            } if (devices.Control[20]) {
                deviceList[devices.RoomID].sensor.push({
                    type: 21,
                    id: deviceID,
                    name: devices.Control[20].Label,
                    value: devices.Control[20].Value,
                });
            } if (devices.Control[21]) {
                deviceList[devices.RoomID].sensor.push({
                    type: 21,
                    id: deviceID,
                    name: devices.Control[21].Label,
                    value: devices.Control[21].Value,
                });
            } if (devices.Control[22]) {
                deviceList[devices.RoomID].sensor.push({
                    type: 21,
                    id: deviceID,
                    name: devices.Control[22].Label,
                    value: devices.Control[22].Value,
                });
            } if (devices.Control[23]) {
                deviceList[devices.RoomID].sensor.push({
                    type: 21,
                    id: deviceID,
                    name: devices.Control[23].Label,
                    value: devices.Control[23].Value,
                });
            } if (devices.Control[24]) {
                deviceList[devices.RoomID].sensor.push({
                    type: 21,
                    id: deviceID,
                    name: devices.Control[24].Label,
                    value: devices.Control[24].Value,
                });
            } if (devices.Control[25]) {
                deviceList[devices.RoomID].sensor.push({
                    type: 21,
                    id: deviceID,
                    name: devices.Control[25].Label,
                    value: devices.Control[25].Value,
                });
            } if (devices.Control[26]) {
                deviceList[devices.RoomID].sensor.push({
                    type: 21,
                    id: deviceID,
                    name: devices.Control[26].Label,
                    value: devices.Control[26].Value,
                });
            } if (devices.Control[27]) {
                deviceList[devices.RoomID].sensor.push({
                    type: 21,
                    id: deviceID,
                    name: devices.Control[27].Label,
                    value: devices.Control[27].Value,
                });
            } if (devices.Control[28]) {
                deviceList[devices.RoomID].sensor.push({
                    type: 21,
                    id: deviceID,
                    name: devices.Control[28].Label,
                    value: devices.Control[28].Value,
                });
            }
        }

    })
    initElement(deviceList)
}

function checkCommand(cmd, payload) {
    console.log("Command:" + cmd);
    switch (cmd) {
        case 1: // login
            if (payload.Success == 1) {
                getFriendInformation();
            }
            console.log("Login :" + (payload.Success == 1 ? "Logedin" : "Failed"));
            break;
        case 9: // gateway online status
            if (payload.MemberID == memberId) {
                console.log("Gateway:" + payload.MemberID + "/" + (payload.Status == 1 ? "Online" : "Offline"));
            }
            break;
        case 34: // initData
            let member = payload.Member[memberId]
            if (member != undefined) {
                initData(member)
            }
            break;
        case 31:
            if (parseInt(payload.Member) == parseInt(memberId)) {
                const deviceId = payload.Device;
                let dev = null;
                deviceList.forEach(item => {
                    if (typeof item === 'object') {
                        const { power, sensor } = item;
                        if (!dev && power) {
                            dev = power.find(dev => dev.id == deviceId);
                        }
                        if (!dev && sensor) {
                            dev = sensor.find(dev => dev.id == deviceId);
                        }
                    }
                })
                if (dev != null) {
                    let value = payload.V;
                    // console.log(deviceId, payload.Ctrl, payload.V);
                    switch (dev.type) {
                        case 20:
                            switch (payload.Ctrl) {
                                case 1: //voltage
                                    dev.value = value;
                                    $('#Voltage' + dev.id).text((value / 10).toFixed(2))
                                    break
                                case 2://current
                                    dev.value = value;
                                    $('#Current' + dev.id).text((value / 1000).toFixed(2))
                                    break
                                case 3://watt
                                    dev.value = value;
                                    $('#Power' + dev.id).text((value / 10).toFixed(2))
                                    break
                                case 4://powerfactor
                                    dev.value = value;
                                    $('#PowerFactor' + dev.id).text((value / 100).toFixed(2))
                                    break
                                case 5://energy
                                    dev.value = value;
                                    console.log((value / 100).toFixed(2))
                                    $('#Energy' + dev.id).text((value / 100).toFixed(2))
                                    break
                                case 6://frequency
                                    dev.value = value;
                                    $('#Frequency' + dev.id).text((value / 10).toFixed(1))
                                    break
                            }
                            break
                        case 21:
                            switch (payload.Ctrl) {
                                case 5://temperature
                                    dev.value = value;
                                    $('#temp' + dev.id).text(value.toFixed(1))
                                    break
                                case 6://humidity
                                    dev.value = value;
                                    $('#hu' + dev.id).text(value.toFixed(1))
                                    break
                                case 20://lux
                                    dev.value = value;
                                    $('#lux' + dev.id).text(value)
                                    break
                                case 21://soil_humidity
                                    dev.value = value;
                                    $('#soilHu' + dev.id).text(value.toFixed(1))
                                    $('#HUSOIL' + dev.id).text(value.toFixed(1))
                                    $('#HUSOIL-2' + dev.id).text(value.toFixed(1))
                                    break
                                case 22://soil_temp
                                    dev.value = value;
                                    $('#soilTemp' + dev.id).text(value.toFixed(1))
                                    $('#TEMPSOIL' + dev.id).text(value.toFixed(1))
                                    $('#TEMPSOIL-2' + dev.id).text(value.toFixed(1))
                                    break
                                case 23://con
                                    dev.value = value;
                                    $('#con' + dev.id).text(value)
                                    break
                                case 24://nitrogen
                                    dev.value = value;
                                    $('#ni' + dev.id).text(value)
                                    $('#N' + dev.id).text(value)
                                    $('#N-2' + dev.id).text(value)
                                    break
                                case 25://potassuim
                                    dev.value = value;
                                    $('#po' + dev.id).text(value)
                                    $('#P' + dev.id).text(value)
                                    $('#P-2' + dev.id).text(value)
                                    break
                                case 26://phophorus
                                    dev.value = value;
                                    $('#pho' + dev.id).text(value)
                                    $('#K' + dev.id).text(value)
                                    $('#K-2' + dev.id).text(value)
                                    break
                                case 27://ph
                                    dev.value = value;
                                    $('#ph' + dev.id).text(value.toFixed(2))
                                    break
                                case 28:// tank_water
                                    dev.value = value;
                                    $('#liters' + dev.id).text(value)
                                    const water = litToPer(value)
                                    if (water <= 0) {
                                        $('#wave1' + dev.id).css('top', `110%`);
                                        $('#wave2' + dev.id).css('top', `110%`);
                                        $('#wave3' + dev.id).css('top', `110%`);
                                    } else if (water >= 100) {
                                        $('#wave1' + dev.id).css('top', `-3%`);
                                        $('#wave2' + dev.id).css('top', `-7%`);
                                        $('#wave3' + dev.id).css('top', `0%`);
                                    } else {
                                        $('#wave1' + dev.id).css('top', `${90 - water}%`);
                                        $('#wave2' + dev.id).css('top', `${97 - water}%`);
                                        $('#wave3' + dev.id).css('top', `${100 - water}%`);
                                    }
                                    break
                            }
                            break
                    }
                }
            }
            break;
    }
}

function connectWS() {
    ws = new WebSocket("wss://archismarthome.com:8000/echo");
    console.log("Connection : " + ws.url);

    ws.onmessage = (event) => {
        // console.log("data : " + event.data);
        const obj = JSON.parse(event.data);
        checkCommand(obj.cmd, obj.param);
    }
    ws.onopen = (event) => {
        console.log("onopen : " + JSON.stringify(event));
        sendLogin();
    }
    ws.onclose = (event) => {
        console.log("onclose : code(" + event.code + "), reason(" + event.reason + ")");
    }
}

function getFriendInformation() {
    var data = "{\"cmd\":32}";
    ws.send(data);
}

function sendLogin() {
    var data = "{\"cmd\":1,\"param\":{\"username\":\"krittin2543\",\"password\":\"123456\"}}";
    ws.send(data);
}


function initElement(deviceList) {
    if (deviceList && deviceList.length > 0) {
        const devList = deviceList[2]
        if (devList.sensor.length > 0) {

            const slideContainer = $(`#slide0`)[0]
            const sensorContainer = $(`
                <div class="bg-[url('./images/farm.jpg')] bg-cover bg-center flex flex-col gap-4 relative z-[99] overflow-hidden min-h-screen">
                    <div class="bg-black opacity-70 w-full h-full absolute z-[-1]"></div>
                    <div class="py-16 px-16 flex flex-col gap-16 2xl:gap-32">
                        <div class="grid grid-cols-5 gap-8 2xl:gap-16 w-full" id="sensorGrid">
                            <div class="col-span-3 flex items-center">
                                <img src="./images/logo-farm.png" class="w-[156px] h-[156px] 2xl:w-[208px] 2xl:h-[208px]">
                                <h1 class="text-7xl 2xl:text-9xl ml-8 2xl:ml-4 font-bold bg-gradient-to-b from-yellow-300 to-orange-500 inline-block text-transparent bg-clip-text">Archi Farm</h1>
                            </div>
                        </div>
                    <div class="grid grid-cols-4 gap-8 2xl:gap-16 w-full" id="tankairqGrid"></div>
                    </div>
                </div>`)
            sensorContainer.appendTo(slideContainer);

            const sensorElements = devList.sensor
                .filter((dev) => dev.name != "Tank_Litre" && dev.name != "Temperature" && dev.name != "Humidity" && dev.name != "Illumination_Lux")
                .map((dev) => {
                    if (dev.name === "Potential of Hydrogen_pH") {
                        Id = "ph"
                        symbol = "pH";
                        label = "pH"
                        value = dev.value
                    } else if (dev.name === "Soil Humidity_RH") {
                        Id = "soilHu"
                        symbol = "RH";
                        label = "Humidity"
                        value = dev.value.toFixed(1)
                    } else if (dev.name === "Soil Temperature_°C") {
                        Id = "soilTemp"
                        symbol = "°C";
                        label = "Temperature"
                        value = dev.value.toFixed(1)
                    } else if (dev.name === "Conductivity_us/cm") {
                        Id = "con"
                        symbol = "μs/cm";
                        label = "Conductivity"
                        value = dev.value
                    } else if (dev.name === "Nitrogen_mg/kg") {
                        Id = "ni"
                        symbol = "mg/kg";
                        label = "Nitrogen"
                        value = dev.value
                    } else if (dev.name === "Potassium_mg/kg") {
                        Id = "po"
                        symbol = "mg/kg";
                        label = "Potassium"
                        value = dev.value
                    } else if (dev.name === "Phosphorus_mg/kg") {
                        Id = "pho"
                        symbol = "mg/kg";
                        label = "Phosphorus"
                        value = dev.value
                    }
                    return `
            <div class="flex flex-col items-end gap-2">
                <label class="text-3xl 2xl:text-4xl text-stone-200 ">${symbol}</label>
                <label class="text-6xl 2xl:text-7xl font-bold text-emerald-400" id="${Id}${dev.id}">${value}</label>
                <label class="text-4xl 2xl:text-5xl text-stone-200">${label}</label>
            </div>`;
                }).filter(Boolean).join(' ');
            $("#sensorGrid").append(sensorElements);

            const elementsTankAirq = devList.sensor
                .filter((dev) => dev.name == "Tank_Litre" || dev.name == "Temperature" || dev.name == "Humidity" || dev.name == "Illumination_Lux")
                .map((dev) => {
                    if (dev.name == "Tank_Litre") {
                        let water = litToPer(dev.value)
                        let wave1 = "0", wave2 = "0", wave3 = "0";
                        if (water <= 0) {
                            wave1 = "110%"
                            wave2 = "110%"
                            wave3 = "110%"
                        } else if (water >= 100) {
                            wave1 = "-3%"
                            wave2 = "-7%"
                            wave3 = "0%"
                        } else {
                            wave1 = (90 - water).toFixed(0) + '%'
                            wave2 = (97 - water).toFixed(0) + '%'
                            wave3 = (100 - water).toFixed(0) + '%'
                        }
                        return `
                            <div class="flex flex-col items-center justify-center">
                                <div
                                    class="relative w-[308px] h-[308px] bg-gradient-to-b from-[#ffffff9d] to-gray-600 overflow-hidden rounded-3xl shadow-2xl">
                                    <div id="wave1${dev.id}"
                                    class="absolute w-[308%] h-[308%] left-[-100%] bg-[#00beff66] rounded-[45%] animate-wave-01 ease-in duration-300"
                                    style="top: ${wave1};">
                                    </div>
                                    <div id="wave2${dev.id}"
                                        class="absolute w-[308%] h-[308%] left-[-100%] bg-[#00466e66] rounded-[43%] animate-wave-02 ease-in duration-300"
                                        style="top: ${wave2};">
                                    </div>
                                    <div id="wave3${dev.id}"
                                        class="absolute w-[308%] h-[308%] left-[-100%] bg-[#005a6e66] rounded-[40%] animate-wave-03 ease-in duration-300"
                                        style="top: ${wave3};">
                                    </div>
                                    <div class="absolute top-[5%] left-[10%]">
                                        <h1 class="text-3xl font-bold">Water</h1>
                                    </div>
                                    <div class="absolute top-[70%] left-[0%] text-white flex  flex-col w-full">
                                        <label class=" text-4xl font-bold text-center" id="liters${dev.id}">${dev.value}</label>
                                        <label class="text-2xl text-center">Litters</label>
                                    </div>
                                </div>
                            </div>`
                    } else {
                        if (dev.name === "Temperature") {
                            Id = "temp"
                            symbol = "°C";
                            label = "Temperature"
                            value = dev.value.toFixed(1)
                            options = {
                                border: "border-blue-300"
                            }
                        } else if (dev.name === "Humidity") {
                            Id = "hu"
                            symbol = "RH";
                            label = "Humidity"
                            value = dev.value.toFixed(1)
                            options = {
                                border: "border-green-400"
                            }
                        } else if (dev.name === "Illumination_Lux") {
                            Id = "lux"
                            symbol = "Lux";
                            label = "Illumination"
                            value = dev.value
                            options = {
                                border: "border-yellow-300"
                            }
                        }
                        return `
                        <div class="flex flex-col items-center justify-center">
                            <div
                                class="relative flex flex-col gap-4 items-center justify-center h-[192px] w-[192px] 2xl:h-[256px] 2xl:w-[256px] rounded-full border-[16px] ${options.border}">
                                <span class="text-4xl 2xl:text-6xl font-bold text-white" id="${Id}${dev.id}">${value}</span>
                                <span class="text-3xl 2xl:text-4xl text-stone-200">${symbol}</span>
                            </div>
                            <label class="mt-4 text-4xl 2xl:text-5xl text-stone-200">${label}</label>
                        </div>`
                    }
                }).filter(Boolean).join(' ');
            $("#tankairqGrid").append(elementsTankAirq);
        }

        if (devList.power.length > 0) {
            const slideContainer = $(`#slide1`)[0]
            const sensorContainer = $(`
                <div class="bg-[url('./images/electric.jpg')] bg-cover bg-center flex flex-col gap-4 relative z-[99] overflow-hidden min-h-screen">
                    <div class="bg-black opacity-70 w-full h-full absolute z-[-1]"></div>
                        <div class="py-16 px-16 flex flex-col gap-16 2xl:gap-32">
                            <div class="grid grid-cols-3 gap-8 w-full" id="powerGrid">
                                <div class="col-span-3 flex items-center">
                                    <img src="./images/logo-electric.png" class="w-[156px] h-[156px] 2xl:w-[208px] 2xl:h-[208px]">
                                    <h1 class="text-9xl ml-8 font-bold bg-gradient-to-b from-yellow-300 to-orange-500 inline-block text-transparent bg-clip-text ">Archi Electric</h1>
                                </div>
                            </div>
                    </div>
                </div>`)
            sensorContainer.appendTo(slideContainer);

            const powerElements = devList.power.map((dev) => {
                if (dev.name === "Voltage") {
                    symbol = "Volt";
                    Id = "Voltage";
                    value = (dev.value / 10).toFixed(2)
                } else if (dev.name === "Current") {
                    symbol = "Amp";
                    Id = "Current";
                    value = (dev.value / 1000).toFixed(2)
                } else if (dev.name === "Power") {
                    symbol = "Watt";
                    Id = "Power";
                    value = (dev.value / 10).toFixed(2)
                } else if (dev.name === "PowerFactor") {
                    symbol = "";
                    Id = "PowerFactor";
                    value = (dev.value / 100).toFixed(2)
                } else if (dev.name === "Energy") {
                    symbol = "kWh";
                    Id = "Energy";
                    value = (dev.value / 100).toFixed(2)
                } else if (dev.name === "Frequency") {
                    symbol = "Hz";
                    Id = "Frequency";
                    value = (dev.value / 10).toFixed(1)
                }
                return `
                    <div class="flex flex-col gap-4 items-left py-12">
                        <div class="flex items-end justify-center gap-4 w-full">
                            <label class="text-7xl 2xl:text-9xl font-bold text-white" id="${Id}${dev.id}">${value}</label>
                            <label class="text-4xl text-yellow-400">${symbol}</label>
                        </div>
                        <label class="text-5xl 2xl:text-6xl text-[#95c3ff] font-semibold ml-8">${dev.name}</label>
                    </div>`
            }).filter(Boolean).join(' ');
            $("#powerGrid").append(powerElements);
        }

        if (devList.sensor.length > 0) {
            const slideContainer = $(`#slide3`)[0]
            const slide3Container = $(`
               <div
                class="bg-[url('./images/slide4.jpg')] bg-cover bg-center flex flex-col gap-4 relative z-[99] overflow-hidden min-h-screen">
            </div>`)
            slide3Container.appendTo(slideContainer);

            const soilElements = devList.sensor
                .filter((dev) => dev.name == "Soil Humidity_RH" || dev.name == "Soil Temperature_°C" || dev.name == "Nitrogen_mg/kg" || dev.name == "Potassium_mg/kg" || dev.name == "Phosphorus_mg/kg")
                .map((dev) => {
                    let value = dev.value.toFixed(1)
                    let top;
                    let left;
                    let id;
                    if (dev.name == "Soil Humidity_RH") {
                        id = `HUSOIL${dev.id}`
                        top = "top-[185px]"
                        left = "left-[120px]"
                    } else if (dev.name == "Soil Temperature_°C") {
                        id = `TEMPSOIL${dev.id}`
                        top = "top-[185px]"
                        left = "left-[285px]"
                    } else if (dev.name == "Nitrogen_mg/kg") {
                        id = `N${dev.id}`
                        top = "top-[135px]"
                        left = "left-[515px]"
                    } else if (dev.name == "Potassium_mg/kg") {
                        id = `P${dev.id}`
                        top = "top-[190px]"
                        left = "left-[515px]"
                    } else if (dev.name == "Phosphorus_mg/kg") {
                        id = `K${dev.id}`
                        top = "top-[245px]"
                        left = "left-[515px]"
                    }
                    return `
                <h1 class="text-3xl font-semibold text-[#1A4288] absolute ${top} ${left}" id="${id}">${value}</h1>`
                }).filter(Boolean).join(' ');
            $(slide3Container).append(soilElements);

            const soilElements2 = devList.sensor
                .filter((dev) => dev.name == "Soil Humidity_RH" || dev.name == "Soil Temperature_°C" || dev.name == "Nitrogen_mg/kg" || dev.name == "Potassium_mg/kg" || dev.name == "Phosphorus_mg/kg")
                .map((dev) => {
                    let value = dev.value.toFixed(1)
                    let top;
                    let left;
                    let id;
                    if (dev.name == "Soil Humidity_RH") {
                        id = `HUSOIL-2${dev.id}`
                        top = "top-[900px]"
                        left = "left-[870px]"
                    } else if (dev.name == "Soil Temperature_°C") {
                        id = `TEMPSOIL-2${dev.id}`
                        top = "top-[900px]"
                        left = "left-[1035px]"
                    } else if (dev.name == "Nitrogen_mg/kg") {
                        id = `N-2${dev.id}`
                        top = "top-[850px]"
                        left = "left-[1265px]"
                    } else if (dev.name == "Potassium_mg/kg") {
                        id = `P-2${dev.id}`
                        top = "top-[905px]"
                        left = "left-[1265px]"
                    } else if (dev.name == "Phosphorus_mg/kg") {
                        id = `K-2${dev.id}`
                        top = "top-[960px]"
                        left = "left-[1265px]"
                    }
                    return `
                <h1 class="text-3xl font-semibold text-[#1A4288] absolute ${top} ${left}" id="${id}">${value}</h1>`
                }).filter(Boolean).join(' ');
            $(slide3Container).append(soilElements2);
        }
    }



}


// functional other


function litToPer(n) {
    let litMax = 6 // litters
    return ((n / litMax) * 100).toFixed(2)
}



connectWS()