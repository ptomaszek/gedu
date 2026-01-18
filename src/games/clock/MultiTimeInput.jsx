import React, { forwardRef } from 'react';
import { Box, Typography, TextField } from '@mui/material';

/**
 * MultiTimeInput
 *
 * A generic component to display time segments (HH, MM, SS).
 * It relies on the parent to handle actual keyboard input (via window listeners),
 * keeping these inputs strictly as "displays" that can be clicked to select.
 */
const MultiTimeInput = forwardRef(({
                                       sections = ['hh'],     // e.g., ['hh'] or ['hh', 'mm'] or ['mm', 'ss']
                                       values = {},           // e.g., { hh: '12', mm: '05' }
                                       activeSection,         // e.g., 'hh'
                                       bgcolor = 'white',     // Background color for feedback (red/green)
                                       disabled = false,
                                       onSectionClick,        // Callback when a specific input is clicked
                                       ...otherProps
                                   }, ref) => {

    const renderSection = (type, index) => {
        const isActive = activeSection === type;
        const sectionValue = values[type] || '';

        return (
            <React.Fragment key={type}>
                {/* Render Separator (Colon) if not the first item */}
                {index > 0 && (
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 600,
                            mx: 0.5,
                            userSelect: 'none',
                            color: disabled ? 'text.disabled' : 'text.primary'
                        }}
                    >
                        :
                    </Typography>
                )}

                {/* Render Input Field */}
                <TextField
                    // Attach ref to the first input so parent can manage focus programmatically if needed
                    ref={index === 0 ? ref : undefined}

                    value={sectionValue}
                    onClick={() => !disabled && onSectionClick?.(type)}
                    disabled={disabled}
                    variant="outlined"

                    // The input is strictly read-only because we use a custom keyboard handler
                    // in the parent component to support both physical and virtual keys.
                    inputProps={{
                        readOnly: true,
                        style: {
                            textAlign: 'center',
                            fontSize: '1.6rem',
                            fontWeight: 600,
                            letterSpacing: '0.1em',
                            padding: '8px 0',
                            cursor: disabled ? 'default' : 'pointer',
                            caretColor: 'transparent', // Hide the text cursor
                        },
                    }}

                    sx={{
                        width: 80,
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: bgcolor,
                            transition: 'background-color 0.3s ease, border-color 0.2s ease',

                            // Visual logic for Active vs Inactive state
                            '& fieldset': {
                                borderColor: isActive ? 'primary.main' : 'rgba(0, 0, 0, 0.23)',
                                borderWidth: isActive ? 2 : 1,
                            },
                            '&:hover fieldset': {
                                borderColor: isActive ? 'primary.main' : 'rgba(0, 0, 0, 0.87)',
                            },
                            // Ensure the style persists even if MUI thinks it's focused
                            '&.Mui-focused fieldset': {
                                borderColor: isActive ? 'primary.main' : 'rgba(0, 0, 0, 0.23)',
                                borderWidth: isActive ? 2 : 1,
                            },
                        },
                    }}
                    {...otherProps}
                />
            </React.Fragment>
        );
    };

    return (
        <Box display="flex" alignItems="center" justifyContent="center">
            {sections.map((section, index) => renderSection(section, index))}
        </Box>
    );
});

MultiTimeInput.displayName = 'MultiTimeInput';

export default MultiTimeInput;