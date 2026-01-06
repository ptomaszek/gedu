import React, {useState, useEffect, forwardRef, useImperativeHandle} from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    LinearProgress,
    Box
} from '@mui/material';

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

    // Reset level state
    const resetLevel = () => {
        setTaskCount(0);
        setMistakeCount(0);
        setShowFailureModal(false);
        setShowSuccessModal(false);
        setIsLevelActive(true);
        if (onLevelRestart) {
            onLevelRestart();
        }
    };

    // Handle correct answer
    const handleCorrectAnswer = () => {
        if (!isLevelActive) return;

        const newTaskCount = taskCount + 1;
        setTaskCount(newTaskCount);

        if (newTaskCount >= tasksToComplete) {
            // Level completed successfully
            setIsLevelActive(false);
            setShowSuccessModal(true);
            if (onLevelComplete) {
                onLevelComplete();
            }
        }
    };

    // Handle incorrect answer
    const handleIncorrectAnswer = () => {
        if (!isLevelActive) return;

        const newMistakeCount = mistakeCount + 1;
        setMistakeCount(newMistakeCount);

        if (newMistakeCount >= maxMistakes) {
            // Level failed
            setIsLevelActive(false);
            setShowFailureModal(true);
        }
    };

    // Progress calculation
    const progress = Math.min(100, (taskCount / tasksToComplete) * 100);
    const mistakesLeft = Math.max(0, maxMistakes - mistakeCount);

    // Expose methods to parent component via ref
    useImperativeHandle(ref, () => ({
        handleCorrectAnswer,
        handleIncorrectAnswer,
        resetLevel
    }), [handleCorrectAnswer, handleIncorrectAnswer, resetLevel]);

    return (
        <div style={{position: 'relative'}}>
            {/* Progress indicator */}
            <Box sx={{mb: 2}}>
                <Typography variant="subtitle2" color="text.secondary">
                    Postęp: {taskCount}/{tasksToComplete} zadań
                </Typography>
                <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{
                        height: 8,
                        borderRadius: 4,
                        mt: 0.5,
                        backgroundColor: '#e0e0e0',
                        '& .MuiLinearProgress-bar': {
                            backgroundColor: progress === 100 ? '#4caf50' : '#2196f3'
                        }
                    }}
                />
                <Typography variant="subtitle2" color={mistakesLeft <= 1 ? 'error.main' : 'text.secondary'}
                            sx={{mt: 0.5}}>
                    Szanse: {mistakesLeft}/{maxMistakes}
                </Typography>
            </Box>

            {/* Child content - will be blocked by overlay when modal is shown */}
            <div style={{
                position: 'relative',
                opacity: showFailureModal || showSuccessModal ? 0.3 : 1,
                pointerEvents: (showFailureModal || showSuccessModal) ? 'none' : 'auto'
            }}>
                {children}
            </div>

            {/* Failure Modal - shown when max mistakes reached */}
            <Dialog
                open={showFailureModal}
                onClose={() => {
                }}
                aria-labelledby="failure-modal-title"
                aria-describedby="failure-modal-description"
            >
                <DialogTitle id="failure-modal-title" sx={{color: 'error.main'}}>
                    Koniec gry
                </DialogTitle>
                <DialogContent>
                    <Typography id="failure-modal-description" sx={{mt: 1}}>
                        Przekroczyłeś limit błędów ({maxMistakes}). Musisz zrestartować poziom.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={resetLevel}
                        variant="contained"
                        color="primary"
                        autoFocus
                    >
                        Restartuj poziom
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Success Modal - shown when all tasks completed */}
            <Dialog
                open={showSuccessModal}
                onClose={() => {
                }}
                aria-labelledby="success-modal-title"
                aria-describedby="success-modal-description"
            >
                <DialogTitle id="success-modal-title" sx={{color: 'success.main'}}>
                    Gratulacje! 🎉
                </DialogTitle>
                <DialogContent>
                    <Typography id="success-modal-description" sx={{mt: 1}}>
                        Ukończyłeś poziom!
                    </Typography>
                </DialogContent>
                <DialogActions sx={{justifyContent: 'space-between'}}>
                    <Button
                        onClick={resetLevel}
                        variant="outlined"
                        color="primary"
                    >
                        Zagraj ponownie
                    </Button>
                    <Button
                        onClick={() => {
                            resetLevel();
                            if (onNextLevel) {
                                onNextLevel();
                            }
                        }}
                        variant="contained"
                        color="success"
                        autoFocus
                    >
                        Następny poziom
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
});

export default LevelProgressTracker;
