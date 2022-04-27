function validatePhoneNumber(num){
	let regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
	return regex.test(num);

}

module.exports = validatePhoneNumber;