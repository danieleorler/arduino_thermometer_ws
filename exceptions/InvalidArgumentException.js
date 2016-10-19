class InvalidArgumentException {
	constructor(value, message) {
		this.value = value;
		this.message = message;
	}
}

module.exports = InvalidArgumentException;