import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Fade
} from '@mui/material';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

/**
 * Reusable component for tracking level progress with configurable rules
 *
 * @param {Object} props
 * @param {number} [props.tasksToComplete=10] - Number of tasks required to complete level
 * @param {number} [props.maxMistakes=3] - Maximum allowed mistakes before level failure
 * @param {function} props.onLevelComplete - Callback when level is completed successfully
 * @param {function} props.onLevelRestart - Callback when level is restarted
 * @param {function} props.onNextLevel - Callback when user chooses to go to next level
 * @param {React.ReactNode} props.children - Child components to render (will be blocked by modals)
 * @returns {React.ReactElement}
 */
const LevelProgressTracker = forwardRef(({
                                             tasksToComplete = 10,
                                             maxMistakes = 3,
                                             onLevelComplete,
                                             onLevelRestart,
                                             onNextLevel,
                                             children
                                         }, ref) => {
    const [taskCount, setTaskCount] = useState(0);
    const [mistakeCount, setMistakeCount] = useState(0);
    const [showFailureModal, setShowFailureModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isLevelActive, setIsLevelActive] = useState(true);

    const [delayedFailureOpen, setDelayedFailureOpen] = useState(false);
    const [delayedSuccessOpen, setDelayedSuccessOpen] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    const { width, height } = useWindowSize();

    // Reset level state
    const resetLevel = () => {
        setTaskCount(0);
        setMistakeCount(0);
        setShowFailureModal(false);
        setShowSuccessModal(false);
        setDelayedFailureOpen(false);
        setDelayedSuccessOpen(false);
        setIsLevelActive(true);
        if (onLevelRestart) onLevelRestart();
    };

    // Handle correct answer
    const handleCorrectAnswer = () => {
        if (!isLevelActive) return;

        const newTaskCount = taskCount + 1;
        setTaskCount(newTaskCount);

        if (newTaskCount >= tasksToComplete) {
            setIsLevelActive(false);
            setShowSuccessModal(true);
            if (onLevelComplete) onLevelComplete();
        }
    };

    // Handle incorrect answer
    const handleIncorrectAnswer = () => {
        if (!isLevelActive) return;

        const newMistakeCount = mistakeCount + 1;
        setMistakeCount(newMistakeCount);

        if (newMistakeCount >= maxMistakes) {
            setIsLevelActive(false);
            setShowFailureModal(true);
        }
    };

    // Reset progress on mount
    useEffect(() => {
        resetLevel();
    }, []);

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
        handleCorrectAnswer,
        handleIncorrectAnswer,
        resetLevel
    }));

    // Delay failure modal
    useEffect(() => {
        let timer;
        if (showFailureModal) {
            timer = setTimeout(() => setDelayedFailureOpen(true), 500);
        } else {
            setDelayedFailureOpen(false);
        }
        return () => clearTimeout(timer);
    }, [showFailureModal]);

    // Delay success modal and show confetti
    useEffect(() => {
        let timer, confettiTimer;
        if (showSuccessModal) {
            setDelayedSuccessOpen(false); // reset
            timer = setTimeout(() => {
                setDelayedSuccessOpen(true);
                setShowConfetti(true);
            }, 500);

            confettiTimer = setTimeout(() => setShowConfetti(false), 5500);
        } else {
            setDelayedSuccessOpen(false);
            setShowConfetti(false);
        }

        return () => {
            clearTimeout(timer);
            clearTimeout(confettiTimer);
        };
    }, [showSuccessModal]);

    const mistakesLeft = Math.max(0, maxMistakes - mistakeCount);

    return (
        <div style={{ position: 'relative' }}>
            {showConfetti && (
                <Confetti
                    width={width}
                    height={height}
                    recycle={false}
                    numberOfPieces={300}
                    gravity={0.2}
                />
            )}

            {/* Hearts (lives) */}
            <Box sx={{ mb: 4, display: 'flex', gap: 0.5 }}>
                {Array.from({ length: maxMistakes }).map((_, index) => {
                    const isLost = index >= mistakesLeft;
                    return (
                        <span
                            key={index}
                            style={{
                                fontSize: 14,
                                color: isLost ? '#ccc' : '#f44336',
                                transition: 'color 0.1s, opacity 0.5s, transform 0.1s',
                                opacity: isLost ? 0.2 : 1,
                                transform: isLost ? 'scale(0.8)' : 'scale(1)',
                                lineHeight: 1,
                                display: 'inline-block'
                            }}
                        >
                            ❤️
                        </span>
                    );
                })}
            </Box>

            {/* Chunked Progress Bar */}
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {Array.from({ length: tasksToComplete }).map((_, index) => {
                    const isCompleted = index < taskCount;
                    return (
                        <Box
                            key={index}
                            sx={{
                                flex: 1,
                                height: 12,
                                borderRadius: 2,
                                backgroundColor: isCompleted ? '#4caf50' : '#e0e0e0',
                                transition: 'background-color 0.3s',
                            }}
                        />
                    );
                })}
            </Box>

            {/* Child content */}
            <div style={{
                position: 'relative',
                opacity: showFailureModal || showSuccessModal ? 0.3 : 1,
                pointerEvents: showFailureModal || showSuccessModal ? 'none' : 'auto'
            }}>
                {children}
            </div>

            {/* Failure Modal */}
            <Dialog
                open={delayedFailureOpen}
                onClose={() => {}}
                TransitionComponent={Fade}
                transitionDuration={500}
                fullWidth
                sx={{ '& .MuiDialog-paper': { maxWidth: '300px' } }}
                aria-labelledby="failure-modal-title"
                aria-describedby="failure-modal-description"
            >
                <DialogTitle
                    id="failure-modal-title"
                    sx={{ color: 'error.main', fontWeight: 'bold', textAlign: 'center' }}
                >
                    Koniec gry
                </DialogTitle>
                <DialogContent>
                    <Typography
                        id="failure-modal-description"
                        sx={{ mt: 1, textAlign: 'center', fontSize: '1rem', color: 'text.primary' }}
                    >
                        Zacznij jeszcze raz 🍀
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center' }}>
                    <Button
                        onClick={resetLevel}
                        variant="contained"
                        color="primary"
                        autoFocus
                        sx={{ width: '100%', fontSize: '1.2rem', textTransform: 'none' }}
                    >
                        Spróbuję!
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Success Modal */}
            <Dialog
                open={delayedSuccessOpen}
                onClose={() => {}}
                TransitionComponent={Fade}
                transitionDuration={500}
                disableScrollLock
                fullWidth
                sx={{ '& .MuiDialog-paper': { maxWidth: '300px' } }}
                aria-labelledby="success-modal-title"
                aria-describedby="success-modal-description"
            >
                <DialogTitle
                    id="success-modal-title"
                    sx={{ color: 'success.main', fontWeight: 'bold', textAlign: 'center' }}
                >
                    Brawo! 🎉
                </DialogTitle>
                <DialogContent>
                    <Typography
                        id="success-modal-description"
                        sx={{ mt: 1, textAlign: 'center', fontSize: '1rem', color: 'text.primary' }}
                    >
                        Poziom ukończony!
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center' }}>
                    <Button
                        onClick={resetLevel}
                        variant="outlined"
                        color="primary"
                        sx={{ width: '45%', marginRight: '5%', fontSize: '1rem', textTransform: 'none' }}
                    >
                        Powtarzam
                    </Button>
                    <Button
                        onClick={() => {
                            resetLevel();
                            if (onNextLevel) onNextLevel();
                        }}
                        variant="contained"
                        color="success"
                        autoFocus
                        sx={{ width: '45%', fontSize: '1.2rem', textTransform: 'none' }}
                    >
                        Idę dalej!
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
});

export default LevelProgressTracker;
