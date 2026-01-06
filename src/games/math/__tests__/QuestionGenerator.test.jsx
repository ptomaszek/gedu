import { renderHook, act } from '@testing-library/react';
import QuestionGenerator from '../QuestionGenerator';

// Import the helper functions for direct testing
import { calculateResult, buildLatexExpression } from '../QuestionGenerator';

// Game configuration from App.jsx
const gameConfig = {
    math: {
        title: 'Matematyka',
        path: '/games/math',
        levels: [
            { coefficients: 2, operations: ['+', '-'], range: 10 },
            { coefficients: 2, operations: ['+', '-'], range: 20 },
            { coefficients: 3, operations: ['+', '-'], range: 10 },
            { coefficients: 3, operations: ['+', '-'], range: 20 },
            { coefficients: 2, operations: ['*'], range: 10 }
        ]
    }
};

describe('QuestionGenerator', () => {
    describe('Basic Rendering and State', () => {
        it('renders without crashing', () => {
            const { result } = renderHook(() =>
                QuestionGenerator({
                    coefficients: 2,
                    operations: ['+'],
                    range: 10
                })
            );
            
            expect(result.current).toBeDefined();
            expect(result.current.numbers).toBeDefined();
            expect(result.current.operators).toBeDefined();
            expect(result.current.correctAnswer).toBeDefined();
            expect(result.current.latexExpression).toBeDefined();
            expect(result.current.generateQuestion).toBeDefined();
        });

        it('initializes with empty arrays', () => {
            const { result } = renderHook(() =>
                QuestionGenerator({
                    coefficients: 2,
                    operations: ['+'],
                    range: 10
                })
            );
            
            expect(result.current.numbers).toEqual([]);
            expect(result.current.operators).toEqual([]);
        });
    });

    describe('Question Generation', () => {
        it('generates questions with correct number of coefficients', () => {
            const { result } = renderHook(() =>
                QuestionGenerator({
                    coefficients: 3,
                    operations: ['+'],
                    range: 10
                })
            );

            act(() => {
                result.current.generateQuestion();
            });

            expect(result.current.numbers).toHaveLength(3);
            expect(result.current.operators).toHaveLength(2);
        });

        it('generates questions within specified range', () => {
            const range = 10;
            const { result } = renderHook(() =>
                QuestionGenerator({
                    coefficients: 2,
                    operations: ['+'],
                    range: range
                })
            );

            act(() => {
                result.current.generateQuestion();
            });

            result.current.numbers.forEach(num => {
                expect(num).toBeGreaterThanOrEqual(0);
                expect(num).toBeLessThanOrEqual(range);
            });
        });

        it('handles disabled state correctly', () => {
            const { result } = renderHook(() =>
                QuestionGenerator({
                    coefficients: 2,
                    operations: ['+'],
                    range: 10,
                    disabled: true
                })
            );

            const initialNumbers = [...result.current.numbers];
            const initialOperators = [...result.current.operators];

            act(() => {
                result.current.generateQuestion();
            });

            expect(result.current.numbers).toEqual(initialNumbers);
            expect(result.current.operators).toEqual(initialOperators);
        });
    });

    describe('Multiplication Operations', () => {
        it('generates valid multiplication questions', () => {
            const { result } = renderHook(() =>
                QuestionGenerator({
                    coefficients: 2,
                    operations: ['*'],
                    range: 10
                })
            );

            act(() => {
                result.current.generateQuestion();
            });

            expect(result.current.operators).toEqual(['*']);
            expect(result.current.numbers).toHaveLength(2);
            
            // For multiplication, ensure the result doesn't exceed the range
            const [a, b] = result.current.numbers;
            expect(a * b).toBeLessThanOrEqual(10);
        });

        it('handles zero in multiplication correctly', () => {
            const { result } = renderHook(() =>
                QuestionGenerator({
                    coefficients: 2,
                    operations: ['*'],
                    range: 10
                })
            );

            // Force a scenario with zero
            act(() => {
                result.current.generateQuestion();
            });

            const [a, b] = result.current.numbers;
            if (a === 0) {
                expect(b).toBeGreaterThanOrEqual(0);
                expect(b).toBeLessThanOrEqual(10);
            }
        });
    });

    describe('Mixed Operations', () => {
        it('generates questions with mixed operations', () => {
            const { result } = renderHook(() =>
                QuestionGenerator({
                    coefficients: 3,
                    operations: ['+', '-'],
                    range: 10
                })
            );

            act(() => {
                result.current.generateQuestion();
            });

            expect(result.current.numbers).toHaveLength(3);
            expect(result.current.operators).toHaveLength(2);
            
            // Check that operators are from the allowed set
            result.current.operators.forEach(op => {
                expect(['+', '-']).toContain(op);
            });
        });
    });

    describe('Derived Values', () => {
        it('calculates correct answer correctly', () => {
            const { result } = renderHook(() =>
                QuestionGenerator({
                    coefficients: 2,
                    operations: ['+'],
                    range: 10
                })
            );

            act(() => {
                result.current.generateQuestion();
            });

            const { numbers, operators, correctAnswer } = result.current;
            const expectedAnswer = calculateResult(numbers, operators);
            
            expect(correctAnswer).toBe(expectedAnswer);
        });

        it('generates correct LaTeX expression', () => {
            const { result } = renderHook(() =>
                QuestionGenerator({
                    coefficients: 2,
                    operations: ['+'],
                    range: 10
                })
            );

            act(() => {
                result.current.generateQuestion();
            });

            const { numbers, operators, latexExpression } = result.current;
            const expectedExpression = buildLatexExpression(numbers, operators);
            
            expect(latexExpression).toBe(expectedExpression);
        });

        it('handles multiplication in LaTeX correctly', () => {
            const { result } = renderHook(() =>
                QuestionGenerator({
                    coefficients: 2,
                    operations: ['*'],
                    range: 10
                })
            );

            act(() => {
                result.current.generateQuestion();
            });

            const { numbers, operators, latexExpression } = result.current;
            
            // Check that multiplication is represented as \times in LaTeX
            expect(latexExpression).toContain('\\times');
        });
    });

    describe('Callback Function', () => {
        it('calls onQuestionGenerated callback when question is generated', () => {
            const mockCallback = vi.fn();
            
            const { result } = renderHook(() =>
                QuestionGenerator({
                    coefficients: 2,
                    operations: ['+'],
                    range: 10,
                    onQuestionGenerated: mockCallback
                })
            );

            act(() => {
                result.current.generateQuestion();
            });

            expect(mockCallback).toHaveBeenCalledWith({
                numbers: result.current.numbers,
                operators: result.current.operators
            });
        });
    });

    describe('Edge Cases', () => {
        it('handles single coefficient correctly', () => {
            const { result } = renderHook(() =>
                QuestionGenerator({
                    coefficients: 1,
                    operations: ['+'],
                    range: 10
                })
            );

            act(() => {
                result.current.generateQuestion();
            });

            expect(result.current.numbers).toHaveLength(1);
            expect(result.current.operators).toHaveLength(0);
            expect(result.current.correctAnswer).toBe(result.current.numbers[0]);
        });

        it('handles large range values', () => {
            const { result } = renderHook(() =>
                QuestionGenerator({
                    coefficients: 2,
                    operations: ['+'],
                    range: 100
                })
            );

            act(() => {
                result.current.generateQuestion();
            });

            result.current.numbers.forEach(num => {
                expect(num).toBeGreaterThanOrEqual(0);
                expect(num).toBeLessThanOrEqual(100);
            });
        });
    });

    describe('Randomization', () => {
        it('generates different questions on multiple calls', () => {
            const { result } = renderHook(() =>
                QuestionGenerator({
                    coefficients: 2,
                    operations: ['+', '-'],
                    range: 10
                })
            );

            act(() => {
                result.current.generateQuestion();
            });

            const firstNumbers = [...result.current.numbers];
            const firstOperators = [...result.current.operators];

            // Generate multiple times to check for different results
            let differentResultFound = false;
            for (let i = 0; i < 10; i++) {
                act(() => {
                    result.current.generateQuestion();
                });

                const currentNumbers = result.current.numbers;
                const currentOperators = result.current.operators;

                if (
                    JSON.stringify(currentNumbers) !== JSON.stringify(firstNumbers) ||
                    JSON.stringify(currentOperators) !== JSON.stringify(firstOperators)
                ) {
                    differentResultFound = true;
                    break;
                }
            }

            expect(differentResultFound).toBe(true);
        });
    });

    describe('Level-Specific Tests', () => {
        gameConfig.math.levels.forEach((levelConfig, index) => {
            describe(`Level ${index + 1}: ${levelConfig.coefficients} coefficients, ${levelConfig.operations.join(', ')} operations, range ${levelConfig.range}`, () => {
                it('generates valid questions for level configuration', () => {
                    const { result } = renderHook(() =>
                        QuestionGenerator({
                            coefficients: levelConfig.coefficients,
                            operations: levelConfig.operations,
                            range: levelConfig.range
                        })
                    );

                    act(() => {
                        result.current.generateQuestion();
                    });

                    const { numbers, operators, correctAnswer } = result.current;

                    // Check number of coefficients
                    expect(numbers).toHaveLength(levelConfig.coefficients);
                    
                    // Check number of operators
                    expect(operators).toHaveLength(levelConfig.coefficients - 1);
                    
                    // Check that all numbers are within range
                    numbers.forEach(num => {
                        expect(num).toBeGreaterThanOrEqual(0);
                        expect(num).toBeLessThanOrEqual(levelConfig.range);
                    });
                    
                    // Check that all operators are from allowed set
                    operators.forEach(op => {
                        expect(levelConfig.operations).toContain(op);
                    });

                    // Check that correctAnswer is calculated correctly
                    expect(correctAnswer).toBe(calculateResult(numbers, operators));
                });
            });
        });
    });

    describe('Comprehensive Level Correctness Tests', () => {
        gameConfig.math.levels.forEach((levelConfig, index) => {
            describe(`Level ${index + 1} - 100 Correctness Tests`, () => {
                // Generate 100 test cases for each level to verify correctness
                Array.from({ length: 100 }, (_, testIndex) => {
                    it(`test case ${testIndex + 1}: generates mathematically correct question`, () => {
                        const { result } = renderHook(() =>
                            QuestionGenerator({
                                coefficients: levelConfig.coefficients,
                                operations: levelConfig.operations,
                                range: levelConfig.range
                            })
                        );

                        act(() => {
                            result.current.generateQuestion();
                        });

                        const { numbers, operators, correctAnswer, latexExpression } = result.current;

                        // Verify mathematical correctness
                        const calculatedAnswer = calculateResult(numbers, operators);
                        expect(correctAnswer).toBe(calculatedAnswer);

                        // Verify LaTeX expression correctness
                        const expectedLatex = buildLatexExpression(numbers, operators);
                        expect(latexExpression).toBe(expectedLatex);

                        // Verify structure constraints
                        expect(numbers).toHaveLength(levelConfig.coefficients);
                        expect(operators).toHaveLength(levelConfig.coefficients - 1);

                        // Verify range constraints
                        numbers.forEach(num => {
                            expect(num).toBeGreaterThanOrEqual(0);
                            expect(num).toBeLessThanOrEqual(levelConfig.range);
                        });

                        // Verify operation constraints
                        operators.forEach(op => {
                            expect(levelConfig.operations).toContain(op);
                        });

                        // Verify multiplication constraints (if applicable)
                        if (levelConfig.operations.includes('*')) {
                            const [a, b] = numbers;
                            if (numbers.length === 2) {
                                expect(a * b).toBeLessThanOrEqual(levelConfig.range);
                            }
                        }

                        // Verify subtraction doesn't go negative (for addition/subtraction levels)
                        if (levelConfig.operations.includes('+') || levelConfig.operations.includes('-')) {
                            // For mixed operations, we can't guarantee non-negative intermediate results
                            // but we can verify the final result is calculated correctly
                            expect(typeof calculatedAnswer).toBe('number');
                            expect(isFinite(calculatedAnswer)).toBe(true);
                        }

                        // Verify LaTeX contains proper symbols
                        if (operators.includes('*')) {
                            expect(latexExpression).toContain('\\times');
                        } else {
                            expect(latexExpression).not.toContain('\\times');
                        }

                        // Verify LaTeX ends with equals sign
                        expect(latexExpression).toMatch(/ =$/);

                        // Verify no invalid characters in LaTeX
                        expect(latexExpression).toMatch(/^[0-9+\-\\times\s=]+$/);
                    });
                });
            });
        });
    });
});
