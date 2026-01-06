import React, {
    useState,
    useEffect,
    useRef,
    useCallback,
    useMemo,
} from 'react';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import LevelProgressTracker from './LevelProgressTracker';

/* ===================== Helpers ===================== */
const generateLevelDescription = (config) => {
    const {coefficients, operations, range} = config;

    // Map operations to Polish text
    const operationNames = {
        '+': 'Dodawanie',
        '-': 'Odejmowanie',
        '*': 'Mnożenie'
    };

    // Get unique operation names
    const uniqueOperations = [...new Set(operations)];
    const operationText = uniqueOperations.map(op => operationNames[op]).join(', ');

    return `${operationText} w zakresie ${range}`;
};

const calculateResult = (numbers, operators) =>
    operators.reduce((result, op, i) => {
        const next = numbers[i + 1];
        if (op === '+') return result + next;
        if (op === '-') return result - next;
        if (op === '*') return result * next;
        return result;
    }, numbers[0] ?? 0);

const buildLatexExpression = (numbers, operators) =>
    numbers
        .flatMap((n, i) =>
            i < operators.length
                ? [n, operators[i] === '*' ? '\\times' : operators[i]]
                : [n]
        )
        .join(' ') + ' =';

/* ===================== Component ===================== */

function MathGame({ config }) {
    const {
        coefficients = 2,
        operations = ['+', '-'],
        range = 20,
    } = config || {};

    const [numbers, setNumbers] = useState([]);
    const [operators, setOperators] = useState([]);
    const [answer, setAnswer] = useState('');
    const [status, setStatus] = useState('idle'); // idle | correct | wrong

    const inputRef = useRef(null);
    const progressRef = useRef(null);
    const navigate = useNavigate();

    /* ===================== Focus ===================== */

    const focusInput = useCallback(() => {
        const input = inputRef.current?.querySelector('input');
        input?.focus();
        input?.select();
    }, []);

    /* ===================== Question Generation ===================== */

    const generateQuestion = useCallback(() => {
        let nums = [];
        let ops = [];
        let current = 0;

        if (operations.includes('*')) {
            const a = Math.floor(Math.random() * (range + 1));
            const b =
                a === 0
                    ? Math.floor(Math.random() * (range + 1))
                    : Math.floor(Math.random() * (Math.floor(range / a) + 1));

            nums = [a, b];
            ops = ['*'];
        } else {
            for (let i = 0; i < coefficients; i++) {
                if (i === 0) {
                    current = Math.floor(Math.random() * (range + 1));
                    nums.push(current);
                } else {
                    const op =
                        operations[Math.floor(Math.random() * operations.length)];
                    ops.push(op);

                    let n;
                    if (op === '+') {
                        n = Math.floor(Math.random() * (range - current + 1));
                        current += n;
                    } else {
                        n = Math.floor(Math.random() * (current + 1));
                        current -= n;
                    }
                    nums.push(n);
                }
            }
        }

        setNumbers(nums);
        setOperators(ops);
        setAnswer('');
        setStatus('idle');
    }, [coefficients, operations, range]);

    /* ===================== Derived ===================== */

    const correctAnswer = useMemo(
        () => calculateResult(numbers, operators),
        [numbers, operators]
    );

    const latexExpression = useMemo(
        () => buildLatexExpression(numbers, operators),
        [numbers, operators]
    );

    /* ===================== Handlers ===================== */

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!answer) return;

        const userAnswer = parseInt(answer, 10);

        if (userAnswer === correctAnswer) {
            setStatus('correct');
            progressRef.current?.handleCorrectAnswer();
            setTimeout(generateQuestion, 800);
        } else {
            setStatus('wrong');
            progressRef.current?.handleIncorrectAnswer();
            focusInput();
        }
    };

    const handleNextLevel = () => {
        const path = window.location.hash;
        if (path.includes('/levels/1')) navigate('/games/math/levels/2');
        else if (path.includes('/levels/2')) navigate('/games/math/levels/3');
        else navigate('/games/math');
    };

    /* ===================== Effects ===================== */

    useEffect(generateQuestion, [generateQuestion]);
    useEffect(focusInput, [numbers, operators, focusInput]);

    /* ===================== Render ===================== */

    return (
        <div style={{ textAlign: 'center', marginTop: 12 }}>
            {/* ===================== Parent Info ===================== */}
            <div
                style={{
                    fontSize: '0.85rem',
                    fontStyle: 'italic',
                    color: '#555',
                    marginBottom: '24px', // extra spacing to separate from game
                    opacity: 0.8,
                    padding: '6px 12px',
                    borderRadius: 6,
                    backgroundColor: '#f7f7f7', // subtle background
                    display: 'inline-block', // shrink to content width
                }}
            >
                {generateLevelDescription(config)}
            </div>

            {/* ===================== Game & Progress Tracker ===================== */}
            <LevelProgressTracker
                ref={progressRef}
                tasksToComplete={10}
                maxMistakes={3}
                onLevelRestart={generateQuestion}
                onNextLevel={handleNextLevel}
            >
                <form onSubmit={handleSubmit} style={{ textAlign: 'center' }}>
                    <div
                        style={{
                            fontSize: '1.2rem',
                            marginBottom: 10,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 8,
                        }}
                    >
                        <InlineMath math={latexExpression} />

                        <TextField
                            ref={inputRef}
                            type="number"
                            value={answer}
                            disabled={status === 'correct'}
                            onChange={(e) => setAnswer(e.target.value)}
                            sx={{
                                width: 80,
                                '& .MuiOutlinedInput-root': {
                                    backgroundColor:
                                        status === 'correct'
                                            ? '#d4edda'
                                            : status === 'wrong'
                                                ? '#f8d7da'
                                                : 'white',
                                    transition: 'background-color 0.2s ease',
                                },
                            }}
                        />

                        <span
                            style={{
                                width: 28,
                                textAlign: 'center',
                                fontSize: '1.5rem',
                            }}
                        >
                        {status === 'correct' && '✅'}
                            {status === 'wrong' && '❌'}
                    </span>
                    </div>

                    <button
                        type="submit"
                        disabled={status === 'correct' || !answer}
                        style={{
                            padding: '10px 20px',
                            fontSize: '1rem',
                            backgroundColor:
                                status === 'correct' ? '#9cc7a3' : '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor:
                                status === 'correct' ? 'default' : 'pointer',
                            opacity: status === 'correct' ? 0.8 : 1,
                        }}
                    >
                        Zatwierdź
                    </button>
                </form>
            </LevelProgressTracker>
        </div>
    );
}

export default MathGame;
