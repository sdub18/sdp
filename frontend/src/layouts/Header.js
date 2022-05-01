import React from 'react';
import { Box } from '@material-ui/core';
import './Header.css';

export default function Header() {
    return (
        <div className='header'>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderRadius: '12px',
                    boxShadow: 1,
                    fontWeight: 'bold',
                }}
            >
                    <Box sx={{ml: 2, mr: 5}}>
                        <img src={process.env.PUBLIC_URL +"/logo.png"} className="Header__logo" alt="logo" />
                    </Box>
                    <Box sx={{color: 'white', fontSize: 25}}>
                        <h1>Watchdog</h1>
                    </Box>
            </Box>
        </div>
    );
}