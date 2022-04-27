const twilio = require('twilio');

const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

function sendMessage(msg, phone_num) {
	client.messages.create({
		body: msg,
		to: phone_num,
		from: '+12542444036'
	}).then((msg) => {console.log(msg.sid)});
}

module.exports = { sendMessage }