import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MultiSectionDigitalClock } from '@mui/x-date-pickers/MultiSectionDigitalClock';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { enUS } from 'date-fns/locale';

import StyledClock from './StyledClock';
import useClockQuestion from './useClockQuestion';

function ClockQuestion({ progressRef }) {
    const [selectedTime, setSelectedTime] = useState(null);    const [fade, setFade] = useState(true);
    const [feedback, setFeedback] = useState('neutral'); // 'neutral' | 'wrong' | 'correct'


    const {
        currentTime,
        correctAnswer,
        generateQuestion,
    } = useClockQuestion({
        minHour: 1,
        maxHour: 12,
        onQuestionGenerated: () => {
            setSelectedTime(null);
        },
    });

    useEffect(() => {
        generateQuestion();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const handleSubmit = () => {
        if (!selectedTime) return;

        const selectedHour = selectedTime.getHours();

        if (selectedHour === correctAnswer) {
            progressRef.current?.handleCorrectAnswer();

            setFeedback('correct');

            // Give time for green feedback
            setTimeout(() => {
                setFade(false);

                setTimeout(() => {
                    generateQuestion();
                    setSelectedTime(null);
                    setFeedback('neutral');
                    setFade(true);
                }, 300);
            }, 300);
        } else {
            progressRef.current?.handleIncorrectAnswer();

            setFeedback('wrong');

            // Clear red feedback but KEEP value
            setTimeout(() => {
                setFeedback('neutral');
            }, 300);
        }
    };


    return (
        <StyledClock currentTime={currentTime} fade={fade}>
            <Box
                data-testid="time-input-container"
                display="flex"
                flexDirection="column"
                alignItems="center"
                gap={2}
                sx={{
                    borderRadius: 2,
                    padding: 1,
                    transition: 'all 200ms ease',
                    backgroundColor:
                        feedback === 'wrong'
                            ? 'rgb(248, 215, 218)'
                            : feedback === 'correct'
                                ? 'rgb(212, 237, 218)'
                                : 'transparent',
                    boxShadow:
                        feedback === 'wrong'
                            ? '0 0 0 2px rgba(220, 53, 69, 0.4)'
                            : feedback === 'correct'
                                ? '0 0 0 2px rgba(40, 167, 69, 0.4)'
                                : 'none',
                    transform:
                        feedback === 'wrong'
                            ? 'scale(0.95)'
                            : 'scale(1)',
                }}
            >
                <LocalizationProvider
                    dateAdapter={AdapterDateFns}
                    locale={enUS}
                >
                    <MultiSectionDigitalClock
                        views={['hours']}
                        ampm={false}
                        value={selectedTime}
                        onChange={(date) => {
                            if (!date) return;

                            const fixed = new Date(date);
                            fixed.setMinutes(0);
                            fixed.setSeconds(0);
                            fixed.setMilliseconds(0);

                            setSelectedTime(fixed);
                        }}
                    />
                </LocalizationProvider>

                <Box sx={{ width: 160 }}>
                    <Keyboard
                        layout={{ default: ['{enter}'] }}
                        display={{ '{enter}': 'OK' }}
                        buttonTheme={[
                            {
                                class: selectedTime ? 'hg-ok-enabled' : 'hg-ok-disabled',
                                buttons: '{enter}',
                            },
                        ]}
                        onKeyPress={(btn) =>
                            btn === '{enter}' && selectedTime && handleSubmit()
                        }
                    />
                </Box>
            </Box>
        </StyledClock>
    );
}

export default ClockQuestion;
