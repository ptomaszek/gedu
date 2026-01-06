import React, { useState, useEffect, useRef } from 'react';
import TextField from '@mui/material/TextField';

function MathGame({ config }) {
  const { coefficients = 2, operations = ['+', '-'], range = 20 } = config || {};
  const [nums, setNums] = useState([]);
  const [ops, setOps] = useState([]);
  const [answer, setAnswer] = useState('');
  const [message, setMessage] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const inputRef = useRef(null);

  const focusInput = () => {
    if (inputRef.current) {
      const inputElement = inputRef.current.querySelector('input');
      if (inputElement) {
        inputElement.focus();
        inputElement.select(); // Select existing text
      }
    }
  };

  const generateQuestion = () => {
    let newNums = [];
    let newOps = [];
    let currentResult = 0;

    if (operations.includes('*')) {
      const n1 = Math.floor(Math.random() * (range + 1));
      let n2;
      if (n1 === 0) {
        n2 = Math.floor(Math.random() * (range + 1));
      } else {
        n2 = Math.floor(Math.random() * Math.floor(range / n1 + 1));
      }
      newNums = [n1, n2];
      newOps = ['*'];
    } else {
      for (let i = 0; i < coefficients; i++) {
        if (i === 0) {
          const n = Math.floor(Math.random() * (range + 1));
          newNums.push(n);
          currentResult = n;
        } else {
          const op = operations[Math.floor(Math.random() * operations.length)];
          newOps.push(op);
          
          let n;
          if (op === '+') {
            n = Math.floor(Math.random() * (range - currentResult + 1));
            currentResult += n;
          } else {
            n = Math.floor(Math.random() * (currentResult + 1));
            currentResult -= n;
          }
          newNums.push(n);
        }
      }
    }

    setNums(newNums);
    setOps(newOps);
    setAnswer('');
    setMessage('');
    setIsCorrect(false);
  };

  const getCorrectAnswer = () => {
    if (nums.length === 0) return 0;
    let result = nums[0];
    for (let i = 0; i < ops.length; i++) {
      if (ops[i] === '+') result += nums[i + 1];
      else if (ops[i] === '-') result -= nums[i + 1];
      else if (ops[i] === '*') result *= nums[i + 1];
    }
    return result;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (answer === '') return;

    const userAnswer = parseInt(answer);
    const correctAnswer = getCorrectAnswer();

    if (userAnswer === correctAnswer) {
      setMessage('Poprawnie! 🎉');
      setIsCorrect(true);
    } else {
      setMessage('Błędnie! Spróbuj ponownie lub zobacz odpowiedź.');
      setIsCorrect(false);
      focusInput(); // Focus and select after wrong answer
    }
  };

  const handleShowAnswer = () => {
    setMessage(`Poprawna odpowiedź to: ${getCorrectAnswer()}`);
  };

  const handleSkip = () => {
    generateQuestion();
  };

  useEffect(() => {
    generateQuestion();
  }, [config]);

  useEffect(() => {
    // Focus and select input after new question generation or component mount
    focusInput();
  }, [nums, ops]); // Depend on nums and ops to re-focus after question changes

  const renderExpression = () => {
    let expr = [];
    for (let i = 0; i < nums.length; i++) {
      expr.push(nums[i]);
      if (i < ops.length) {
        expr.push(ops[i] === '*' ? '*' : ops[i]);
      }
    }
    return expr.join(' ') + ' =';
  };

  return (
    <div style={{
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif',
      maxWidth: '500px',
      margin: '50px auto',
      padding: '20px',
      border: '2px solid #007bff',
      borderRadius: '10px',
      backgroundColor: '#f8f9fa'
    }}>
      <div style={{ marginBottom: '20px' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ fontSize: '1.5rem', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <span>
              {renderExpression()}
            </span>
            <TextField
              ref={inputRef}
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="?"
              disabled={isCorrect}
              variant="outlined"
              size="medium"
              sx={{
                width: '80px',
                '& .MuiOutlinedInput-root': {
                  fontSize: '1.5rem',
                  textAlign: 'center',
                  backgroundColor: isCorrect ? '#d4edda' : 'white',
                  '&.Mui-disabled': {
                    backgroundColor: '#e9ecef',
                  }
                }
              }}
              inputProps={{
                min: 0,
                max: range * coefficients, // Approximate max
                step: 1,
                inputMode: 'numeric',
                pattern: '[0-9]*',
                style: {
                  padding: '10px',
                  border: '2px solid #007bff',
                  borderRadius: '5px'
                }
              }}
            />
          </div>
          <button
            type="submit"
            disabled={isCorrect || answer === ''}
            style={{
              padding: '10px 20px',
              fontSize: '1rem',
              backgroundColor: isCorrect ? '#28a745' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: isCorrect ? 'default' : 'pointer',
              marginRight: '10px',
              marginBottom: '10px'
            }}
          >
            {isCorrect ? 'Poprawnie!' : 'Zatwierdź'}
          </button>
          <br />
          <div style={{ 
            minHeight: '60px',
            marginTop: '10px',
            marginBottom: '10px'
          }}>
            {message && (
              <div style={{
                padding: '10px',
                borderRadius: '5px',
                backgroundColor: isCorrect ? '#d4edda' : '#f8d7da',
                color: isCorrect ? '#155724' : '#721c24',
                border: `1px solid ${isCorrect ? '#c3e6cb' : '#f5c6cb'}`
              }}>
                {message}
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={handleShowAnswer}
              style={{
                padding: '10px 20px',
                fontSize: '1rem',
                backgroundColor: '#ffc107',
                color: '#856404',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Zobacz odpowiedź
            </button>
            <button
              type="button"
              onClick={handleSkip}
              style={{
                padding: '10px 20px',
                fontSize: '1rem',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Następne
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MathGame;
