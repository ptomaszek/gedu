import React from 'react';
import { Container, Typography, Box } from '@mui/material';

function ClockGame({ config }) {
    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Zegar
                </Typography>

                <Typography variant="body1">
                    Placeholder gry „Zegar”.
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 2 }}
                >
                    Config (tymczasowo pusty):
                </Typography>

                <pre style={{ opacity: 0.6 }}>
          {JSON.stringify(config, null, 2)}
        </pre>
            </Box>
        </Container>
    );
}

export default ClockGame;
