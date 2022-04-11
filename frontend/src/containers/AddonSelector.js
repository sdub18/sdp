import React, { useState, useCallback, useContext, useEffect } from 'react'
import { SocketContext } from '../contexts/SocketContext';
import { AddonContext } from '../contexts/AddonContext';
import { Stack } from '@mui/material'
import Dropdown from '../components/Dropdown';

const DropdownMemo = React.memo(Dropdown);

export default function AddonSelector() {
	const socket = useContext(SocketContext);
	const [addon, setAddon] = useContext(AddonContext);
	const [availableAddons, setAvailableAddons] = useState([]);

	const handleUpdateAddons = useCallback((updatedAddons) => {
		if (!(JSON.stringify(updatedAddons) === JSON.stringify(availableAddons))){
			setAvailableAddons(updatedAddons);
		}
	  },[]);
	

	useEffect(()=>{
		socket.on("updateAddons", handleUpdateAddons);
		return () => {
			socket.off("updateAddons", handleUpdateAddons);
		}
	},[]);

	useEffect(() => {
		console.log("HIT USE EFFECT");
		if (!(availableAddons.includes(addon))){
		  setAddon("");
		}
	}, [availableAddons])


	const chooseAddon = useCallback((event) => {
		const addon = event.target.value
		socket.emit("addon_selection", addon);
		setAddon(Number(addon));
	  }, []);

	return (
		<Stack direction='row' spacing={3} alignItems='center' justifyContent='flex-start'>
			<h4 style={{ marginLeft: 20 }}>Select addon</h4>
			<DropdownMemo minWidth={120} text="ID" labels={availableAddons} value={addon} onChangeHandler={chooseAddon} />
		</Stack>
	)
}
