// src/games/clock/LevelInfo.js
import React from 'react';
import { Box } from '@mui/material';

/**
 * LevelInfo component for clock game - displays a small box with level info
 * @param {Object} props
 * @param {Object} props.config - Level config with type information
 */
function LevelInfo({ config }) {
    return (
        <Box
            sx={{
                fontSize: '0.9rem',
                fontStyle: 'italic',
                color: '#555',
                mb: 5,
                p: 1.5,
                borderRadius: 2,
                bgcolor: '#f0f4f8',
            }}
        >
            Poziom {config.level}: Odczytaj czas z zegara analogowego.
        </Box>
    );
}

export default LevelInfo;
