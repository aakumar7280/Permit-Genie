import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import DashboardSearch from '../DashboardSearch';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Test wrapper with Router
const TestWrapper = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('DashboardSearch', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders the search component with correct placeholder', () => {
    render(
      <TestWrapper>
        <DashboardSearch />
      </TestWrapper>
    );

    const searchInput = screen.getByPlaceholderText(
      'Search permits, e.g., building renovation, food truck, business license'
    );
    expect(searchInput).toBeInTheDocument();
  });

  it('renders the main title and subtitle', () => {
    render(
      <TestWrapper>
        <DashboardSearch />
      </TestWrapper>
    );

    expect(screen.getByText('Permit Genie')).toBeInTheDocument();
    expect(screen.getByText('Find the permits you need, fast')).toBeInTheDocument();
  });

  it('displays empty state guidance', () => {
    render(
      <TestWrapper>
        <DashboardSearch />
      </TestWrapper>
    );

    expect(screen.getByText(/Try keywords like/)).toBeInTheDocument();
    expect(screen.getByText('building renovation')).toBeInTheDocument();
    expect(screen.getByText('signage')).toBeInTheDocument();
    expect(screen.getByText('home business')).toBeInTheDocument();
  });

  it('shows advanced tools link', () => {
    render(
      <TestWrapper>
        <DashboardSearch />
      </TestWrapper>
    );

    const advancedLink = screen.getByText('Advanced tools');
    expect(advancedLink).toBeInTheDocument();
  });

  it('disables search button when input is empty', () => {
    render(
      <TestWrapper>
        <DashboardSearch />
      </TestWrapper>
    );

    const searchButton = screen.getByRole('button', { name: /search permits/i });
    expect(searchButton).toBeDisabled();
  });

  it('enables search button when input has text', () => {
    render(
      <TestWrapper>
        <DashboardSearch />
      </TestWrapper>
    );

    const searchInput = screen.getByPlaceholderText(/search permits/i);
    const searchButton = screen.getByRole('button', { name: /search permits/i });

    fireEvent.change(searchInput, { target: { value: 'building permit' } });
    expect(searchButton).not.toBeDisabled();
  });

  it('calls onSearch callback when search is submitted', () => {
    const mockOnSearch = jest.fn();
    render(
      <TestWrapper>
        <DashboardSearch onSearch={mockOnSearch} />
      </TestWrapper>
    );

    const searchInput = screen.getByPlaceholderText(/search permits/i);
    const searchButton = screen.getByRole('button', { name: /search permits/i });

    fireEvent.change(searchInput, { target: { value: 'building permit' } });
    fireEvent.click(searchButton);

    expect(mockOnSearch).toHaveBeenCalledWith('building permit');
  });

  it('navigates to permits page with query on submit', () => {
    render(
      <TestWrapper>
        <DashboardSearch />
      </TestWrapper>
    );

    const searchInput = screen.getByPlaceholderText(/search permits/i);
    const searchButton = screen.getByRole('button', { name: /search permits/i });

    fireEvent.change(searchInput, { target: { value: 'business license' } });
    fireEvent.click(searchButton);

    expect(mockNavigate).toHaveBeenCalledWith('/permits?query=business%20license');
  });

  it('submits search on Enter key press', () => {
    const mockOnSearch = jest.fn();
    render(
      <TestWrapper>
        <DashboardSearch onSearch={mockOnSearch} />
      </TestWrapper>
    );

    const searchInput = screen.getByPlaceholderText(/search permits/i);

    fireEvent.change(searchInput, { target: { value: 'food truck' } });
    fireEvent.keyDown(searchInput, { key: 'Enter' });

    expect(mockOnSearch).toHaveBeenCalledWith('food truck');
    expect(mockNavigate).toHaveBeenCalledWith('/permits?query=food%20truck');
  });

  it('shows suggestions after typing with debounce', async () => {
    render(
      <TestWrapper>
        <DashboardSearch />
      </TestWrapper>
    );

    const searchInput = screen.getByPlaceholderText(/search permits/i);

    fireEvent.change(searchInput, { target: { value: 'building' } });

    // Wait for debounce delay (300ms)
    await waitFor(() => {
      expect(screen.getByText('Building Renovation Permit')).toBeInTheDocument();
    }, { timeout: 500 });
  });

  it('handles arrow key navigation in suggestions', async () => {
    render(
      <TestWrapper>
        <DashboardSearch />
      </TestWrapper>
    );

    const searchInput = screen.getByPlaceholderText(/search permits/i);

    fireEvent.change(searchInput, { target: { value: 'permit' } });

    // Wait for suggestions to appear
    await waitFor(() => {
      expect(screen.getByText('Building Renovation Permit')).toBeInTheDocument();
    });

    // Test arrow down navigation
    fireEvent.keyDown(searchInput, { key: 'ArrowDown' });
    
    // The first suggestion should be selected (highlighted)
    const firstSuggestion = screen.getByText('Building Renovation Permit').closest('[role="option"]');
    expect(firstSuggestion).toHaveAttribute('aria-selected', 'true');

    // Test arrow down again
    fireEvent.keyDown(searchInput, { key: 'ArrowDown' });
    
    // The second suggestion should now be selected
    const secondSuggestion = screen.getByText('Food Truck License').closest('[role="option"]');
    expect(secondSuggestion).toHaveAttribute('aria-selected', 'true');

    // Test arrow up
    fireEvent.keyDown(searchInput, { key: 'ArrowUp' });
    expect(firstSuggestion).toHaveAttribute('aria-selected', 'true');
  });

  it('selects suggestion on Enter key when suggestion is highlighted', async () => {
    const mockOnSearch = jest.fn();
    render(
      <TestWrapper>
        <DashboardSearch onSearch={mockOnSearch} />
      </TestWrapper>
    );

    const searchInput = screen.getByPlaceholderText(/search permits/i);

    fireEvent.change(searchInput, { target: { value: 'building' } });

    // Wait for suggestions
    await waitFor(() => {
      expect(screen.getByText('Building Renovation Permit')).toBeInTheDocument();
    });

    // Navigate to first suggestion and select it
    fireEvent.keyDown(searchInput, { key: 'ArrowDown' });
    fireEvent.keyDown(searchInput, { key: 'Enter' });

    expect(mockOnSearch).toHaveBeenCalledWith('Building Renovation Permit');
  });

  it('closes suggestions on Escape key', async () => {
    render(
      <TestWrapper>
        <DashboardSearch />
      </TestWrapper>
    );

    const searchInput = screen.getByPlaceholderText(/search permits/i);

    fireEvent.change(searchInput, { target: { value: 'permit' } });

    // Wait for suggestions
    await waitFor(() => {
      expect(screen.getByText('Building Renovation Permit')).toBeInTheDocument();
    });

    // Press Escape
    fireEvent.keyDown(searchInput, { key: 'Escape' });

    // Suggestions should be hidden
    expect(screen.queryByText('Building Renovation Permit')).not.toBeInTheDocument();
  });

  it('filters suggestions based on search query', async () => {
    render(
      <TestWrapper>
        <DashboardSearch />
      </TestWrapper>
    );

    const searchInput = screen.getByPlaceholderText(/search permits/i);

    fireEvent.change(searchInput, { target: { value: 'food' } });

    await waitFor(() => {
      expect(screen.getByText('Food Truck License')).toBeInTheDocument();
      expect(screen.queryByText('Building Renovation Permit')).not.toBeInTheDocument();
    });
  });

  it('shows loading indicator during search', async () => {
    render(
      <TestWrapper>
        <DashboardSearch />
      </TestWrapper>
    );

    const searchInput = screen.getByPlaceholderText(/search permits/i);
    fireEvent.change(searchInput, { target: { value: 'permit' } });

    // Loading indicator should appear briefly
    await waitFor(() => {
      expect(document.querySelector('.animate-spin')).toBeInTheDocument();
    }, { timeout: 100 });
  });

  it('has proper ARIA attributes for accessibility', () => {
    render(
      <TestWrapper>
        <DashboardSearch />
      </TestWrapper>
    );

    const searchInput = screen.getByPlaceholderText(/search permits/i);
    const combobox = screen.getByRole('combobox');

    expect(searchInput).toHaveAttribute('aria-label', 'Search permits');
    expect(searchInput).toHaveAttribute('aria-describedby', 'search-help');
    expect(combobox).toHaveAttribute('aria-expanded', 'false');
    expect(combobox).toHaveAttribute('aria-haspopup', 'listbox');
  });

  it('trims input and ignores empty queries', () => {
    const mockOnSearch = jest.fn();
    render(
      <TestWrapper>
        <DashboardSearch onSearch={mockOnSearch} />
      </TestWrapper>
    );

    const searchInput = screen.getByPlaceholderText(/search permits/i);
    const searchButton = screen.getByRole('button', { name: /search permits/i });

    // Test with only whitespace
    fireEvent.change(searchInput, { target: { value: '   ' } });
    fireEvent.click(searchButton);

    expect(mockOnSearch).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();

    // Test with valid input that has whitespace
    fireEvent.change(searchInput, { target: { value: '  building permit  ' } });
    fireEvent.click(searchButton);

    expect(mockOnSearch).toHaveBeenCalledWith('building permit');
  });

  it('navigates to projects page when advanced tools is clicked', () => {
    render(
      <TestWrapper>
        <DashboardSearch />
      </TestWrapper>
    );

    const advancedLink = screen.getByText('Advanced tools');
    fireEvent.click(advancedLink);

    expect(mockNavigate).toHaveBeenCalledWith('/projects');
  });
});
