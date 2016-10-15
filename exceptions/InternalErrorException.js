class InternalErrorException {
	constructor(value, message) {
		this.value = value;
		this.message = message;
	}
}

module.exports = InternalErrorException;