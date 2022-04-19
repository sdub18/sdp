function parseData(recv_data){
	let pkt_array = []
	
	recv_packets = recv_data.toString('utf-8').split("\n");
	
	recv_packets.forEach(split => {
		try {
			let pkt = JSON.parse(split);
			pkt_array.push(pkt);
		  }
		  catch (err) {
			
		  }	
	});
	
	return pkt_array;
  }


module.exports = parseData;