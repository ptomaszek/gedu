import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ClockGame2 from '../ClockGame2';
import React from 'react';
import { vi } from 'vitest';

describe('ClockGame2 Component', () => {
    let mockProgressRef;

    // ------------------------
    // Helper functions
    // ------------------------
    const renderClockGame = (progressRef = null) => {
        if (!progressRef) {
            progressRef = {
                current: {
                    handleCorrectAnswer: vi.fn(),
                    handleIncorrectAnswer: vi.fn(),
                },
            };
        }
        render(<ClockGame2 config={{}} progressRef={progressRef} />);

        const container = screen.getByTestId('time-input-container');
        const hoursSection = screen.getByTestId('hours-section');
        const minutesSection = screen.getByTestId('minutes-section');
        const keyboardContainer = document.querySelector('.simple-keyboard');
        const keyboard = keyboardContainer ? within(keyboardContainer) : null;

        const getExpectedTime = () => {
            const expectedText = screen.getByText(/Expected:/).textContent;
            const match = expectedText.match(/Expected: (\d{2}):(\d{2})/);
            return match ? { hours: match[1], minutes: match[2] } : { hours: '00', minutes: '00' };
        };

        return { container, hoursSection, minutesSection, keyboard, keyboardContainer, progressRef, getExpectedTime };
    };

    const typeKeys = (container, keys) => {
        keys.forEach((key) => fireEvent.keyDown(container, { key }));
    };

    const typeVirtualKeyboard = async (keyboard, digits) => {
        for (const digit of digits) {
            const key = keyboard.getByText(digit);
            await userEvent.click(key);
        }
    };

    const expectCorrectAnswer = async (progressRef) => {
        await waitFor(() => expect(progressRef.current.handleCorrectAnswer).toHaveBeenCalled());
    };

    const expectIncorrectAnswer = async (progressRef) => {
        await waitFor(() => expect(progressRef.current.handleIncorrectAnswer).toHaveBeenCalled());
    };

    const expectInputReset = (hoursSection, minutesSection) => {
        expect(hoursSection.textContent).toBe('__');
        expect(minutesSection.textContent).toBe('__');
    };

    // ------------------------
    // Rendering Tests
    // ------------------------
    describe('Rendering', () => {
        it('renders TimeInput, analog clock, and virtual keyboard', () => {
            const { hoursSection, minutesSection, keyboardContainer } = renderClockGame();

            expect(hoursSection).toBeInTheDocument();
            expect(minutesSection).toBeInTheDocument();
            expect(keyboardContainer).toBeInTheDocument();

            const clock = document.querySelector('.react-clock');
            expect(clock).toBeInTheDocument();
        });

        it('shows the expected time for testing', () => {
            renderClockGame();
            expect(screen.getByText(/Expected:/)).toBeInTheDocument();
        });
    });

    // ------------------------
    // Random Time Generation
    // ------------------------
    describe('Random Time Generation', () => {
        it('generates random time on mount', () => {
            renderClockGame();
            const expectedText = screen.getByText(/Expected:/).textContent;
            expect(expectedText).toMatch(/Expected: \d{2}:\d{2}/);
        });

        it('generates time with minutes in 5-minute increments', () => {
            renderClockGame();
            const expectedText = screen.getByText(/Expected:/).textContent;
            const match = expectedText.match(/Expected: \d{2}:(\d{2})/);
            const minutes = parseInt(match[1], 10);
            expect(minutes % 5).toBe(0);
        });
    });

    // ------------------------
    // Answer Validation
    // ------------------------
    describe('Answer Validation', () => {
        it('accepts correct time via keyboard', async () => {
            const { container, progressRef, getExpectedTime } = renderClockGame();
            const { hours, minutes } = getExpectedTime();

            typeKeys(container, [...hours, ...minutes]);
            fireEvent.keyDown(container, { key: 'Enter' });

            await expectCorrectAnswer(progressRef);
        });

        it('rejects incorrect time via keyboard', async () => {
            const { container, progressRef } = renderClockGame();

            typeKeys(container, ['2', '3', '5', '9']);
            fireEvent.keyDown(container, { key: 'Enter' });

            await expectIncorrectAnswer(progressRef);
        });

        it('accepts correct time via virtual keyboard', async () => {
            const { keyboard, hoursSection, minutesSection, progressRef, getExpectedTime } = renderClockGame();
            const { hours, minutes } = getExpectedTime();

            await typeVirtualKeyboard(keyboard, [...hours, ...minutes]);
            const enterKey = keyboard.getByText('OK');
            await userEvent.click(enterKey);

            await expectCorrectAnswer(progressRef);

            await waitFor(() => expectInputReset(hoursSection, minutesSection));
        });

        it('removes last digit when pressing ⌫ on virtual keyboard', async () => {
            const { keyboard, hoursSection, minutesSection } = renderClockGame();

            await typeVirtualKeyboard(keyboard, ['1', '2', '3', '4']);
            const backspaceKey = keyboard.getByText('⌫');
            await userEvent.click(backspaceKey);

            // Minute section resets to '00'
            expect(hoursSection.textContent).toBe('12');
            expect(minutesSection.textContent).toBe('00');
        });

        it('shows red background on wrong answer', async () => {
            const { container } = renderClockGame();
            typeKeys(container, ['2', '3', '5', '9']);
            fireEvent.keyDown(container, { key: 'Enter' });

            await waitFor(() => {
                const styles = window.getComputedStyle(container);
                expect(styles.backgroundColor).toBe('rgb(248, 215, 218)');
            });
        });

        it('keeps wrong answer visible for review', async () => {
            const { container, hoursSection, minutesSection, progressRef } = renderClockGame();
            typeKeys(container, ['2', '3', '5', '9']);
            fireEvent.keyDown(container, { key: 'Enter' });

            await expectIncorrectAnswer(progressRef);

            // Wait a short moment and check visibility
            await new Promise((resolve) => setTimeout(resolve, 500));

            expect(hoursSection.textContent).toBe('23');
            expect(minutesSection.textContent).toBe('59');
        });
    });

    it('accepts time with single-digit minutes (e.g., 15:05 → type 5)', async () => {
        const { container, progressRef, getExpectedTime } = renderClockGame();
        const { hours, minutes } = getExpectedTime();

        // Only run if minutes starts with '0' but is not '00' (e.g., 05, 09)
        if (minutes.startsWith('0') && minutes !== '00') {
            // Type hours normally
            typeKeys(container, [...hours]);
            // Type only the last digit of minutes
            typeKeys(container, [minutes[1]]);
            fireEvent.keyDown(container, { key: 'Enter' });

            await expectCorrectAnswer(progressRef);
        }
    });
});
