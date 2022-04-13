import React, { useState, useCallback, useContext, useEffect, useRef } from 'react'
import { Stack } from '@mui/material'

import { SocketContext } from '../../contexts/SocketContext';
import { AddonContext } from '../../contexts/AddonContext';
import Dropdown from '../../components/Dropdown';
import Selector from '../../components/Selector';


export default function AddonSelector() {
	const {socket, holderAddons} = useContext(SocketContext);
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
		socket.emit("addon_selection", selectedAddon);
		setAddon(Number(selectedAddon));
	  }, []);

	return (
		<Selector text="ID" labels={availableAddons} value={addon} onChangeHandler={chooseAddon}>
			Select Module ID
		</Selector>
	)
}
