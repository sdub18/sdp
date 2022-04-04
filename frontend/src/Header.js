import React from 'react';
import { Box } from '@material-ui/core';
import logo from './logo.svg';
import './Header.css';

export default function Header() {
    return (
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
                <Box>
                    <img src={logo} className="Header__logo" alt="logo" />
                </Box>
                <Box sx={{color: 'white', fontSize: 25}}>
                    <h1>Motor Health Analysis and Feedback</h1>
                </Box>
        </Box>
    );
}