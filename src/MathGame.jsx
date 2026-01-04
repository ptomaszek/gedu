import React, { useState, useEffect, useRef } from 'react';
import TextField from '@mui/material/TextField';

function MathGame() {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [operation, setOperation] = useState('+');
  const [answer, setAnswer] = useState('');
  const [message, setMessage] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const inputRef = useRef(null);

  const generateQuestion = () => {
    // Generate two numbers with result 0-20
    const n1 = Math.floor(Math.random() * 21);
    const ops = ['+', '-'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    
    let n2;
    if (op === '+') {
      n2 = Math.floor(Math.random() * (21 - n1));
    } else {
      n2 = Math.floor(Math.random() * (n1 + 1));
    }
    
    setNum1(n1);
    setNum2(n2);
    setOperation(op);
    setAnswer('');
    setMessage('');
    setIsCorrect(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (answer === '') return;

    const userAnswer = parseInt(answer);
    const correctAnswer = operation === '+' ? num1 + num2 : num1 - num2;

    if (userAnswer === correctAnswer) {
      setMessage('Poprawnie! 🎉');
      setIsCorrect(true);
    } else {
      setMessage('Błędnie! Spróbuj ponownie lub zobacz odpowiedź.');
      setIsCorrect(false);
    }
  };

  const handleShowAnswer = () => {
    const correctAnswer = operation === '+' ? num1 + num2 : num1 - num2;
    setMessage(`Poprawna odpowiedź to: ${correctAnswer}`);
  };

  const handleSkip = () => {
    generateQuestion();
  };

  // Initialize with first question and focus input
  useEffect(() => {
    generateQuestion();
  }, []);

  // Focus input when component mounts or when a new question is generated
  useEffect(() => {
    if (inputRef.current) {
      // For Material UI TextField, we need to focus the input element inside
      const inputElement = inputRef.current.querySelector('input');
      if (inputElement) {
        inputElement.focus();
      } else {
        // Fallback for cases where the input isn't immediately available
        setTimeout(() => {
          const fallbackInput = inputRef.current?.querySelector('input');
          if (fallbackInput) {
            fallbackInput.focus();
          }
        }, 100);
      }
    }
  }, [num1, num2, operation]);

  return (
    <div style={{
      textAlign: 'center',
      marginTop: '50px',
      fontFamily: 'Arial, sans-serif',
      maxWidth: '500px',
      margin: '50px auto',
      padding: '20px',
      border: '2px solid #007bff',
      borderRadius: '10px',
      backgroundColor: '#f8f9fa'
    }}>
      <h2>Gra Matematyczna</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ fontSize: '1.5rem', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <span>
              {num1} {operation} {num2} = 
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
                max: 20,
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
