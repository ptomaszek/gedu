import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Box } from '@mui/material';

import StyledClock from './StyledClock';
import useClockQuestion from './useClockQuestion';
import NumericKeyboard from '../../components/keyboards/NumericKeyboard';
import TimeInput from './TimeInput';

/* =========================
   HOUR VALIDATION + NORMALIZATION
   ========================= */

/**
 * Gets all valid input equivalents for an analog clock hour (1-12)
 * Returns exact input values that should be accepted (no normalization)
 */
const getValidEquivalents = (analogHour) => {
    const equivalents = [];

    // Direct 24-hour equivalents
    if (analogHour >= 1 && analogHour <= 11) {
        equivalents.push(analogHour);      // 1-11
        equivalents.push(analogHour + 12); // 13-23
    } else if (analogHour === 12) {
        equivalents.push(12, 24, 0, 0);  // 12, 24, 0, 0
    }

    // Add zero-padded versions for single-digit hours (except 0)
    if (analogHour >= 1 && analogHour <= 9) {
        equivalents.push(analogHour * 10); // 01-09 (as 10-90)
    }

    return equivalents;
};

function ClockQuestion({ progressRef }) {
    const [input, setInput] = useState('');
    const [feedback, setFeedback] = useState('neutral'); // neutral | wrong | correct
    const [inputBg, setInputBg] = useState('white');
    const [fade, setFade] = useState(true);
    const inputRef = useRef(null);
    const replaceOnNextInput = useRef(false);

    const {
        currentTime,
        correctAnswer, // ALWAYS 1–12
        generateQuestion,
    } = useClockQuestion({
        minHour: 1,
        maxHour: 12,
        onQuestionGenerated: () => {
            setInput('');
            replaceOnNextInput.current = false;
            setInputBg('white');
        },
    });

    useEffect(() => {
        generateQuestion();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const submitAnswer = useCallback(() => {
        if (!input) return;

        // Convert input to number for validation
        const userInput = Number(input);

        // Validate input range (0-99)
        if (!Number.isInteger(userInput) || userInput < 0 || userInput > 99) {
            progressRef.current?.handleIncorrectAnswer();
            setFeedback('wrong');
            setInputBg('#f8d7da');
            replaceOnNextInput.current = true;
            setTimeout(() => {
                setFeedback('neutral');
                setInputBg('white');
                focusAndSelectInput();
            }, 1000);
            return;
        }

        // Get all valid equivalents for the current analog clock hour
        const validEquivalents = getValidEquivalents(correctAnswer);

        // Check if the raw input matches any valid equivalent
        const isCorrect = validEquivalents.includes(userInput);

        if (isCorrect) {
            progressRef.current?.handleCorrectAnswer();
            setFeedback('correct');
            setInputBg('#d4edda');

            setTimeout(() => {
                setFade(false);
                setTimeout(() => {
                    generateQuestion();
                    setFade(true);
                    setFeedback('neutral');
                    focusAndSelectInput();
                }, 250);
            }, 600);
        } else {
            progressRef.current?.handleIncorrectAnswer();
            setFeedback('wrong');
            setInputBg('#f8d7da');
            replaceOnNextInput.current = true;
            setTimeout(() => {
                setFeedback('neutral');
                setInputBg('white');
                focusAndSelectInput();
            }, 1000);
        }
    }, [input, correctAnswer, generateQuestion, progressRef]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (feedback !== 'neutral') return;

            if (e.key === 'Enter') {
                submitAnswer();
                return;
            }

            if (e.key === 'Backspace') {
                setInput(prev => prev.slice(0, -1));
                return;
            }

            if (/^\d$/.test(e.key)) {
                setInput(prev => {
                    if (replaceOnNextInput.current) {
                        replaceOnNextInput.current = false;
                        return e.key;
                    }
                    return prev.length < 2 ? prev + e.key : prev;
                });
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [submitAnswer, feedback]);

    const focusAndSelectInput = useCallback(() => {
        const input = inputRef.current?.querySelector('input');
        if (input) {
            input.focus();
            input.select();
        }
    }, []);

    const handleVirtualKey = (key) => {
        if (feedback !== 'neutral') return;

        if (key === '{enter}') {
            submitAnswer();
        } else if (key === '{bksp}') {
            setInput(prev => prev.slice(0, -1));
        } else if (/^\d$/.test(key)) {
            setInput(prev => {
                if (replaceOnNextInput.current) {
                    replaceOnNextInput.current = false;
                    return key;
                }
                return prev.length < 2 ? prev + key : prev;
            });
        }
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center">
            <StyledClock currentTime={currentTime} />

            <Box mt={1}>
                <Box
                    sx={{
                        opacity: fade ? 1 : 0,
                        transform: fade ? 'scale(1)' : 'scale(0.98)',
                        transition: 'opacity 250ms ease, transform 250ms ease',
                    }}
                >
                    <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
                        <Box display="flex" alignItems="center" justifyContent="center" gap={2} mb={2}>
                            <TimeInput
                                ref={inputRef}
                                value={input}
                                bgcolor={inputBg}
                                disabled={feedback !== 'neutral'}
                            />
                        </Box>
                    </Box>
                </Box>

                <NumericKeyboard
                    width={180}
                    onKeyPress={handleVirtualKey}
                />
            </Box>
        </Box>
    );
}

export default ClockQuestion;
