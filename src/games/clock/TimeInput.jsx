import React, { forwardRef } from 'react';
import { TextField } from '@mui/material';

/**
 * Custom TimeInput component that displays raw input values
 * without normalization, designed for clock/time-based games.
 *
 * @param {Object} props
 * @param {string} props.value - The current input value
 * @param {number} [props.width=120] - Width of the input field
 * @param {boolean} [props.disabled=false] - Whether the input is disabled
 * @param {string} [props.bgcolor='white'] - Background color of the input
 * @param {Object} [props.sx] - Additional styling
 * @param {Object} [props.inputProps] - Additional input properties
 * @param {React.Ref} ref - Ref to the TextField component
 */
const TimeInput = forwardRef(({
    value,
    width = 120,
    disabled = false,
    bgcolor = 'white',
    sx,
    inputProps,
    ...otherProps
}, ref) => {
    return (
        <TextField
            ref={ref}
            value={value}
            disabled={disabled}
            inputProps={{
                readOnly: true,
                style: {
                    textAlign: 'center',
                    fontSize: '1.6rem',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                },
                ...inputProps,
            }}
            sx={{
                width,
                '& .MuiOutlinedInput-root': {
                    bgcolor,
                    transition: 'background-color 0.5s ease',
                },
                ...sx,
            }}
            {...otherProps}
        />
    );
});

TimeInput.displayName = 'TimeInput';

export default TimeInput;
