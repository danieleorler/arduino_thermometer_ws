class Measurement {
	constructor(device, sensor, temperature) {
		this.device = device;
		this.sensor = sensor;
		this.temperature = temperature/100;
		this.timestamp = (Date.now()).toString();
	}
}

module.exports = Measurement;