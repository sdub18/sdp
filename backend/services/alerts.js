const twilio = require('twilio');

const accountSid = 'AC18138c01bd4b7f65fd30b3a09eb5c2b2'; // Your Account SID from www.twilio.com/console
const authToken = '5059ba2c85bcda69899536c487b3643f'; // Your Auth Token from www.twilio.com/console

const client = new twilio(accountSid, authToken);

function sendMessage(msg, phone_num) {
	client.messages.create({
		body: msg,
		to: phone_num,
		from: '+12542444036'
	}).then((msg) => {console.log(msg.sid)});
}

module.exports = { sendMessage }