import React, { forwardRef } from 'react';
import { TextField } from '@mui/material';

/**
 * Custom TimeInput component that displays raw input values
 * without normalization, designed for clock/time-based games.
 *
 * @param {Object} props
 * @param {string} props.value - The current input value
 * @param {number} [props.width=120] - Width of the input field
 * @param {boolean} [props.readOnly=true] - Whether the input is read-only
 * @param {Object} [props.sx] - Additional styling
 * @param {Object} [props.inputProps] - Additional input properties
 * @param {React.Ref} ref - Ref to the TextField component
 */
const TimeInput = forwardRef(({
    value,
    width = 120,
    readOnly = true,
    sx,
    inputProps,
    ...otherProps
}, ref) => {
    return (
        <TextField
            ref={ref}
            value={value}
            inputProps={{
                style: {
                    textAlign: 'center',
                    fontSize: '1.6rem',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                },
                readOnly,
                ...inputProps,
            }}
            sx={{
                width,
                ...sx,
            }}
            {...otherProps}
        />
    );
});

TimeInput.displayName = 'TimeInput';

export default TimeInput;
