import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { fireEvent } from '@testing-library/react'
import MathGame from '../MathGame'

describe('MathGame Levels', () => {
  const level1Config = { coefficients: 2, operations: ['+', '-'], range: 20 };
  const level2Config = { coefficients: 3, operations: ['+', '-'], range: 20 };
  const level3Config = { coefficients: 2, operations: ['*'], range: 20 };

  it('renders level 1 correctly (2 coefficients)', () => {
    render(<MathGame config={level1Config} />)
    expect(screen.getByText(/(\d+)\s*[\+\-]\s*(\d+)\s*=/)).toBeInTheDocument()
  })

  it('renders level 2 correctly (3 coefficients)', () => {
    render(<MathGame config={level2Config} />)
    expect(screen.getByText(/(\d+)\s*[\+\-]\s*(\d+)\s*[\+\-]\s*(\d+)\s*=/)).toBeInTheDocument()
  })

  it('renders level 3 correctly (multiplication)', () => {
    render(<MathGame config={level3Config} />)
    expect(screen.getByText(/(\d+)\s*\* \s*(\d+)\s*=/)).toBeInTheDocument()
  })

  it('generates questions within range 0-20 for Level 1', () => {
    render(<MathGame config={level1Config} />)
    // Extract numbers from the rendered text
    const text = screen.getByText(/(\d+)\s*[\+\-]\s*(\d+)\s*=/).textContent
    const numbers = text.match(/\d+/g).map(Number)
    numbers.forEach(n => {
      expect(n).toBeGreaterThanOrEqual(0)
      expect(n).toBeLessThanOrEqual(20)
    })
  })

  it('generates questions within range 0-20 for Level 2', () => {
    render(<MathGame config={level2Config} />)
    const text = screen.getByText(/(\d+)\s*[\+\-]\s*(\d+)\s*[\+\-]\s*(\d+)\s*=/).textContent
    const numbers = text.match(/\d+/g).map(Number)
    numbers.forEach(n => {
      expect(n).toBeGreaterThanOrEqual(0)
      expect(n).toBeLessThanOrEqual(20)
    })
  })

  it('generates multiplication questions within product range 0-20 for Level 3', async () => {
    render(<MathGame config={level3Config} />)
    const text = screen.getByText(/(\d+)\s*\* \s*(\d+)\s*=/).textContent
    const numbers = text.match(/\d+/g).map(Number)
    
    // Check factors
    numbers.forEach(n => {
      expect(n).toBeGreaterThanOrEqual(0)
      expect(n).toBeLessThanOrEqual(20)
    })

    // Click "Zobacz odpowiedź" to check product
    const showAnswerButton = screen.getByText('Zobacz odpowiedź')
    await userEvent.click(showAnswerButton)
    const answerMessage = screen.getByText(/Poprawna odpowiedź to:/).textContent
    const product = parseInt(answerMessage.match(/\d+/)[0])
    expect(product).toBeLessThanOrEqual(20)
  })
})

describe('MathGame General Functionality', () => {
  const defaultConfig = { coefficients: 2, operations: ['+', '-'], range: 20 };

  it('has a submit button', () => {
    render(<MathGame config={defaultConfig} />)
    expect(screen.getByText('Zatwierdź')).toBeInTheDocument()
  })

  it('shows the correct answer when "Zobacz odpowiedź" button is clicked', async () => {
    render(<MathGame config={defaultConfig} />)
    const showAnswerButton = screen.getByText('Zobacz odpowiedź')
    await userEvent.click(showAnswerButton)
    expect(screen.getByText(/Poprawna odpowiedź to:/)).toBeInTheDocument()
  })
})
