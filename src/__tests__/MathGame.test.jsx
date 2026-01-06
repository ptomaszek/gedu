import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import MathGame from '../MathGame'

// Helper function to render MathGame with Router context
const renderMathGame = (config) => {
  return render(
    <BrowserRouter>
      <MathGame config={config} />
    </BrowserRouter>
  )
}

describe('MathGame Levels', () => {
  const level1Config = { coefficients: 2, operations: ['+', '-'], range: 20 };
  const level2Config = { coefficients: 3, operations: ['+', '-'], range: 20 };
  const level3Config = { coefficients: 2, operations: ['*'], range: 20 };

  it('renders level 1 correctly (2 coefficients)', () => {
    renderMathGame(level1Config)
    expect(screen.getByText(/(\d+)\s*[\+\-]\s*(\d+)\s*=/)).toBeInTheDocument()
  })

  it('renders level 2 correctly (3 coefficients)', () => {
    renderMathGame(level2Config)
    expect(screen.getByText(/(\d+)\s*[\+\-]\s*(\d+)\s*[\+\-]\s*(\d+)\s*=/)).toBeInTheDocument()
  })

  it('renders level 3 correctly (multiplication)', () => {
    renderMathGame(level3Config)
    expect(screen.getByText(/(\d+)\s*\*\s*(\d+)\s*=/)).toBeInTheDocument()
  })

  it('generates questions within range 0-20 for Level 1', () => {
    renderMathGame(level1Config)
    // Extract numbers from the rendered text
    const text = screen.getByText(/(\d+)\s*[\+\-]\s*(\d+)\s*=/).textContent
    const numbers = text.match(/\d+/g).map(Number)
    numbers.forEach(n => {
      expect(n).toBeGreaterThanOrEqual(0)
      expect(n).toBeLessThanOrEqual(20)
    })
  })

  it('generates questions within range 0-20 for Level 2', () => {
    renderMathGame(level2Config)
    const text = screen.getByText(/(\d+)\s*[\+\-]\s*(\d+)\s*[\+\-]\s*(\d+)\s*=/).textContent
    const numbers = text.match(/\d+/g).map(Number)
    numbers.forEach(n => {
      expect(n).toBeGreaterThanOrEqual(0)
      expect(n).toBeLessThanOrEqual(20)
    })
  })

  it('generates multiplication questions within product range 0-20 for Level 3', () => {
    renderMathGame(level3Config)
    const text = screen.getByText(/(\d+)\s*\*\s*(\d+)\s*=/).textContent
    const numbers = text.match(/\d+/g).map(Number)
    
    // Check factors
    numbers.forEach(n => {
      expect(n).toBeGreaterThanOrEqual(0)
      expect(n).toBeLessThanOrEqual(20)
    })
  })
})

describe('MathGame General Functionality', () => {
  const defaultConfig = { coefficients: 2, operations: ['+', '-'], range: 20 };

  it('has a submit button', () => {
    renderMathGame(defaultConfig)
    expect(screen.getByText('Zatwierdź')).toBeInTheDocument()
  })

  it('shows success message when correct answer is submitted', async () => {
    renderMathGame(defaultConfig)
    const input = screen.getByRole('spinbutton')
    const submitButton = screen.getByText('Zatwierdź')
    
    // Get the current expression and calculate correct answer
    const expressionText = screen.getByText(/(\d+)\s*[\+\-]\s*(\d+)\s*=/).textContent
    const numbers = expressionText.match(/\d+/g).map(Number)
    const operators = expressionText.match(/[\+\-]/g)
    
    let correctAnswer = numbers[0]
    if (operators && operators[0] === '+') {
      correctAnswer += numbers[1]
    } else {
      correctAnswer -= numbers[1]
    }
    
    // Enter correct answer and submit
    await userEvent.type(input, correctAnswer.toString())
    await userEvent.click(submitButton)
    
    expect(screen.getByText('Poprawnie! 🎉')).toBeInTheDocument()
  })
})
