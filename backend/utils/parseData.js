function parseData(recv_data){
	const parens = {"{": "}", "(": ")", "[": "]"};
	const stack = []
	let pkt_array = []
	let pkt = "";
  
	try {
	  pkt = JSON.parse(recv_data.toString('utf-8'));
	  pkt_array.push(pkt);
	}
	catch (err) {
	  for (let char in recv_data){
		pkt += char;
		if (parens.hasOwnProperty(char)) {
		  stack.push(char)  
		}
		else if (Object.values(parens).some(p => p === char)){
		  if (parens[stack.pop()] === char && stack.length === 0){
			pkt = JSON.parse(pkt);
			pkt_array.push(pkt);
			pkt = "";
		  }
		  else {
			pkt_array.length = 0;
			console.log("Failed to parse data");
			break;
		  }
		}
		else continue;
	  }
	}
	return pkt_array;
  }


module.exports = parseData;