import React, { useState, useCallback, useContext, useEffect, useRef } from 'react';
import axios from 'axios';

import { Button, Stack, TextField } from '@mui/material';
import MainButton from '../../components/MainButton';
import SecondaryButton from '../../components/SecondaryButton';

export default function PhoneInput() {

	const [phone, setPhone] = useState("");

	const handleChange = (event) => {
		setPhone(event.target.value);
	};

	const handleClick = useCallback(() => {
		axios.post("http://localhost:3001/phone", {phone: phone})
		.then(()=>{alert("Phone number added for SMS alerts!")})
		.catch((err)=>{
			alert(`BAD REQUEST: ${err.response.data}`);
			return;
		});
	  }, []);


	return (
		<Stack direction='row' spacing={3} alignItems='center' justifyContent='flex-start'>
			<TextField  
              InputLabelProps={{style:{color: 'white', fontSize:23}}}
              inputProps={{ style: {fontSize: 18, color: 'white'}, inputMode: 'numeric', pattern: '[0-9]*' }} 
              label='Phone Number' variant='outlined' size='large' 
              value={phone} 
              onChange={handleChange}
              /> 		
			<SecondaryButton onClick={handleClick}>Submit</SecondaryButton>
		</Stack>
	)
}
