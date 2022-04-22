import React, { useState, useCallback, useContext, useEffect, useRef } from 'react'
import axios from 'axios';

import { SocketContext } from '../../contexts/SocketContext';
import { AddonContext } from '../../contexts/AddonContext';
import Selector from '../../components/Selector';


export default function AddonSelector() {
	const {holderAddons} = useContext(SocketContext);
	const [addon, setAddon] = useContext(AddonContext);

	const [availableAddons, setAvailableAddons] = useState([]);	

	useEffect(() => {
		if (!(holderAddons.current.includes(addon)) && !(addon === "")){
		  	setAddon("");
		}
	}, [availableAddons])

	useEffect(() =>{
		const interval = setInterval(()=>{
			if (!(JSON.stringify(holderAddons.current) === JSON.stringify(availableAddons))) {
				setAvailableAddons(holderAddons.current);
			}
		}, 100);
		return () => clearInterval(interval);
	})

	const chooseAddon = useCallback((event) => {
		const selectedAddon = event.target.value
		axios.post("http://localhost:3001/addon", {addon: selectedAddon});
		setAddon(Number(selectedAddon));
	  }, []);

	return (
		<Selector text="ID" labels={availableAddons} value={addon} onChangeHandler={chooseAddon}>
			Select Module ID
		</Selector>
	)
}
