import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App (Landing Page)', () => {
  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      render(<App />);
      // Basic test to ensure component renders without errors
      expect(screen.getByText('Gry dla XY')).toBeInTheDocument();
    });

    it('shows navigation menu', () => {
      render(<App />);
      
      // Check that navigation elements are present
      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('shows menu items', () => {
      render(<App />);
      
      // Check that menu items are present using link selectors
      // Note: There are now duplicate links (sidebar + landing page content)
      const homeLinks = screen.getAllByRole('link', { name: 'Strona główna' });
      const mathLinks = screen.getAllByRole('link', { name: 'Gra matematyczna' });
      const contactLinks = screen.getAllByRole('link', { name: 'Kontakt' });
      
      expect(homeLinks).toHaveLength(2);
      expect(mathLinks).toHaveLength(2);
      expect(contactLinks).toHaveLength(2);
    });
  });
});
