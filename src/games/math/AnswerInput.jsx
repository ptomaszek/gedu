import React, { forwardRef } from 'react';
import { TextField } from '@mui/material';

/**
 * Custom AnswerInput component designed for math-based games.
 * Displays answer input with configurable styling and behavior.
 *
 * @param {Object} props
 * @param {string} props.value - The current answer value
 * @param {number} [props.width=70] - Width of the input field
 * @param {boolean} [props.disabled=false] - Whether the input is disabled
 * @param {string} [props.bgcolor='white'] - Background color of the input
 * @param {Object} [props.sx] - Additional styling
 * @param {Object} [props.inputProps] - Additional input properties
 * @param {React.Ref} ref - Ref to the TextField component
 */
const AnswerInput = forwardRef(({
    value,
    width = 70,
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

AnswerInput.displayName = 'AnswerInput';

export default AnswerInput;
