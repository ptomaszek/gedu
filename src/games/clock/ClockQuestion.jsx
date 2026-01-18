import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Box } from '@mui/material';

import StyledClock from './StyledClock';
import useClockQuestion from './useClockQuestion';
import NumericKeyboard from '../../components/keyboards/NumericKeyboard';
import MultiTimeInput from './MultiTimeInput';

/* =========================
   TIME VALIDATION FUNCTIONS
   ========================= */

/**
 * Checks if user input is a valid equivalent for the given analog clock hour (Level 1)
 * Returns true if the input matches any valid 24-hour equivalent
 */
const isCorrectHourAnswer = (userInput, analogHour) => {
    // Handle special case for hour 12
    if (analogHour === 12) {
        return userInput === 12 || userInput === 24 || userInput === 0;
    }

    // Check direct 24-hour equivalents (1-11 and 13-23)
    if (userInput === analogHour || userInput === analogHour + 12) {
        return true;
    }

    // Check zero-padded versions for single-digit hours (10-90 represent 01-09)
    if (analogHour >= 1 && analogHour <= 9 && userInput === analogHour * 10) {
        return true;
    }

    return false;
};

/**
 * Checks if user input (hours:minutes) is a valid equivalent for the given analog clock time (Level 2)
 */
const isCorrectTimeAnswer = (userHours, userMinutes, analogHour, analogMinute) => {
    // Normalize user hours to 0-23 range
    let normalizedUserHours = userHours;
    if (userHours === 24) normalizedUserHours = 0;
    if (userHours > 24) normalizedUserHours = userHours % 24;

    // Handle 12-hour format conversion (12 PM = 12, 12 AM = 0)
    if (normalizedUserHours === 12) {
        normalizedUserHours = 0; // 12 AM
    }

    // Check if hours and minutes match exactly
    return normalizedUserHours === analogHour && userMinutes === analogMinute;
};

function ClockQuestion({ config, progressRef }) {
    // Determine level type and input mode
    const isLevel2 = config.type === 'hours-minutes';
    const includeMinutes = isLevel2;

    // State for Level 1 (hours only)
    const [hourInput, setHourInput] = useState('');
    // State for Level 2 (hours and minutes)
    const [hoursInput, setHoursInput] = useState('');
    const [minutesInput, setMinutesInput] = useState('');
    const [activeSection, setActiveSection] = useState('hh');

    const [feedback, setFeedback] = useState('neutral'); // neutral | wrong | correct
    const [inputBg, setInputBg] = useState('white');
    const [fade, setFade] = useState(true);
    const inputRef = useRef(null);
    const replaceOnNextInput = useRef(false);

    const {
        currentTime,
        correctAnswer,
        generateQuestion,
    } = useClockQuestion({
        minHour: 1,
        maxHour: 12,
        includeMinutes,
        onQuestionGenerated: () => {
            if (isLevel2) {
                setHoursInput('');
                setMinutesInput('');
            } else {
                setHourInput('');
            }
            replaceOnNextInput.current = false;
            setInputBg('white');
            setActiveSection('hh');
        },
    });

    useEffect(() => {
        generateQuestion();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const submitAnswer = useCallback(() => {
        if (isLevel2) {
            // Level 2: Hours and minutes validation
            if (!hoursInput || !minutesInput) return;

            const userHours = parseInt(hoursInput.padStart(2, '0'), 10);
            const userMinutes = parseInt(minutesInput.padStart(2, '0'), 10);

            // Validate ranges
            if (userHours < 0 || userHours > 24 || userMinutes < 0 || userMinutes > 59) {
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

            // Check if the user input is correct
            const isCorrect = isCorrectTimeAnswer(userHours, userMinutes, correctAnswer.hour, correctAnswer.minute);

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
        } else {
            // Level 1: Hours only validation (original logic)
            if (!hourInput) return;

            // Convert input to number for validation
            const userInput = Number(hourInput);

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

            // Check if the user input is a valid equivalent for the analog clock hour
            const isCorrect = isCorrectHourAnswer(userInput, correctAnswer.hour);

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
        }
    }, [isLevel2, hoursInput, minutesInput, hourInput, correctAnswer, generateQuestion, progressRef]);

    const focusAndSelectInput = useCallback(() => {
        const input = inputRef.current?.querySelector('input');
        if (input) {
            input.focus();
            input.select();
        }
    }, []);

    // Handle section click for Level 2
    const handleSectionClick = useCallback((section) => {
        if (isLevel2) {
            setActiveSection(section);
        }
    }, [isLevel2]);

    // Handle keyboard input
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (feedback !== 'neutral') return;

            if (e.key === 'Enter') {
                submitAnswer();
                return;
            }

            if (e.key === 'Backspace') {
                if (isLevel2) {
                    if (activeSection === 'hh') {
                        setHoursInput(prev => prev.slice(0, -1));
                    } else {
                        setMinutesInput(prev => prev.slice(0, -1));
                    }
                } else {
                    setHourInput(prev => prev.slice(0, -1));
                }
                return;
            }

            if (/^\d$/.test(e.key)) {
                if (isLevel2) {
                    if (activeSection === 'hh') {
                        setHoursInput(prev => {
                            if (replaceOnNextInput.current) {
                                replaceOnNextInput.current = false;
                                return e.key;
                            }
                            return prev.length < 2 ? prev + e.key : prev;
                        });
                    } else {
                        setMinutesInput(prev => {
                            if (replaceOnNextInput.current) {
                                replaceOnNextInput.current = false;
                                return e.key;
                            }
                            return prev.length < 2 ? prev + e.key : prev;
                        });
                    }
                } else {
                    setHourInput(prev => {
                        if (replaceOnNextInput.current) {
                            replaceOnNextInput.current = false;
                            return e.key;
                        }
                        return prev.length < 2 ? prev + e.key : prev;
                    });
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [submitAnswer, feedback, isLevel2, activeSection, replaceOnNextInput]);

    // Handle virtual keyboard input
    const handleVirtualKey = (key) => {
        if (feedback !== 'neutral') return;

        if (key === '{enter}') {
            submitAnswer();
        } else if (key === '{bksp}') {
            if (isLevel2) {
                if (activeSection === 'hh') {
                    setHoursInput(prev => prev.slice(0, -1));
                } else {
                    setMinutesInput(prev => prev.slice(0, -1));
                }
            } else {
                setHourInput(prev => prev.slice(0, -1));
            }
        } else if (/^\d$/.test(key)) {
            if (isLevel2) {
                if (activeSection === 'hh') {
                    setHoursInput(prev => {
                        if (replaceOnNextInput.current) {
                            replaceOnNextInput.current = false;
                            return key;
                        }
                        return prev.length < 2 ? prev + key : prev;
                    });
                } else {
                    setMinutesInput(prev => {
                        if (replaceOnNextInput.current) {
                            replaceOnNextInput.current = false;
                            return key;
                        }
                        return prev.length < 2 ? prev + key : prev;
                    });
                }
            } else {
                setHourInput(prev => {
                    if (replaceOnNextInput.current) {
                        replaceOnNextInput.current = false;
                        return key;
                    }
                    return prev.length < 2 ? prev + key : prev;
                });
            }
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
                                {isLevel2 ? (
                                    <MultiTimeInput
                                        ref={inputRef}
                                        sections={['hh', 'mm']}
                                        values={{ hh: hoursInput, mm: minutesInput }}
                                        activeSection={activeSection}
                                        bgcolor={inputBg}
                                        disabled={feedback !== 'neutral'}
                                        onSectionClick={handleSectionClick}
                                    />
                                ) : (
                                    <MultiTimeInput
                                        ref={inputRef}
                                        values={hourInput}
                                        bgcolor={inputBg}
                                        disabled={feedback !== 'neutral'}
                                    />
                                )}
                            </Box>
                        </Box>
                </Box>

                <NumericKeyboard
                    width={260}
                    onKeyPress={handleVirtualKey}
                />
            </Box>
        </Box>
    );
}

export default ClockQuestion;
