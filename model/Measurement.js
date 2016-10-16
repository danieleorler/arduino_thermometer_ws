class Measurement {
	constructor(device, sensor, temperature) {
		this.id = this.generateId(device, sensor);
		this.device = device;
		this.sensor = sensor;
		this.temperature = temperature/100;
		this.timestamp = (Date.now()).toString();
	}
	
	generateId(device, sensor) {
		return device + "_" + sensor;
	}
}

module.exports = Measurement;