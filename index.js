const FastSpeedtest = require("fast-speedtest-api");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const csvWriter = createCsvWriter({
    path: './data.csv',
    header: [
        { id: 'date', title: 'date' },
        { id: 'speed', title: 'speed' }
    ]
});

let speedtest = new FastSpeedtest({
    token: "YXNkZmFzZGxmbnNkYWZoYXNkZmhrYWxm", // required
    verbose: false, // default: false
    timeout: 5000, // default: 5000
    https: true, // default: true
    urlCount: 5, // default: 5
    bufferSize: 8, // default: 8
    unit: FastSpeedtest.UNITS.Mbps // default: Bps
});

const options = {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric"
};

const getCurrentSpeed = () => {
    const time = new Date().toLocaleDateString("en-AU", options)
    speedtest.getSpeed().then(s => {
        const speed = `${s} Mbps`;
        const record = [{
            date: time,
            speed: speed
        }];
        csvWriter.writeRecords(record)
            .then(() => {
                console.log('Recorded speed on CSV', speed);
            });
    }).catch(e => {
        const record = [{
            date: time,
            speed: e.message
        }];
        csvWriter.writeRecords(record)
            .then(() => {
                console.log('Recorded error on CSV', e.message);
            });
    });
}

// Runs every 5 mins
setInterval(getCurrentSpeed, 300000);
