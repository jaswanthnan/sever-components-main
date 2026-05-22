import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import CandidateForm from '../CandidateForm';
import { createCandidate } from '@/lib/actions/candidate-actions';

// Mock the Server Actions file
vi.mock('@/lib/actions/candidate-actions', () => ({
  createCandidate: vi.fn(),
}));

describe('CandidateForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all form fields and submit button', () => {
    render(<CandidateForm />);

    expect(screen.getByText("Full Name")).toBeInTheDocument();
    expect(screen.getByText("Email Address")).toBeInTheDocument();
    expect(screen.getByText("Job Role")).toBeInTheDocument();
    expect(screen.getByText("Experience (Years)")).toBeInTheDocument();
    expect(screen.getByText("Location")).toBeInTheDocument();
    expect(screen.getByText(/Candidate Skills/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Save Candidate/i })).toBeInTheDocument();
  });

  it('allows user to select and toggle predefined popular skills', () => {
    render(<CandidateForm />);

    // Predefined list contains "Python"
    const pythonBtn = screen.getByRole('button', { name: /Python/i });
    expect(pythonBtn).not.toHaveClass('bg-indigo-600'); // inactive at first
    expect(screen.getAllByText('Python')).toHaveLength(1); // Only the button exists

    // Toggle Python on
    fireEvent.click(pythonBtn);
    expect(pythonBtn).toHaveClass('bg-indigo-600'); // active now
    expect(screen.getAllByText('Python')).toHaveLength(2); // Button and Selected Badge exist

    // Toggle Python off
    fireEvent.click(pythonBtn);
    expect(pythonBtn).not.toHaveClass('bg-indigo-600');
    expect(screen.getAllByText('Python')).toHaveLength(1); // Only the button exists
  });

  it('allows user to type and add custom skills', async () => {
    const user = userEvent.setup();
    render(<CandidateForm />);

    const customInput = screen.getByPlaceholderText(/Type custom skill/i);
    const addBtn = screen.getByRole('button', { name: /Add/i });

    // Type a new skill "Docker" and click add
    await user.type(customInput, 'Docker');
    await user.click(addBtn);

    // Verify "Docker" badge is added to selected skills list
    expect(screen.getByText('Docker')).toBeInTheDocument();
  });

  it('submits form data using mocked createCandidate server action', async () => {
    // Mock the Server Action to return success (no error)
    const mockCreateCandidate = vi.mocked(createCandidate);
    mockCreateCandidate.mockImplementation(async (prevState: any, formData: FormData) => {
      return { message: 'Candidate added successfully!', error: null };
    });

    render(<CandidateForm />);

    // Fill in the form fields using placeholder text
    const nameInput = screen.getByPlaceholderText('John Doe');
    const emailInput = screen.getByPlaceholderText('john@example.com');
    const roleSelect = screen.getByRole('combobox');
    const expInput = screen.getByPlaceholderText('0');
    const locInput = screen.getByPlaceholderText('New York, NY');

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(roleSelect, { target: { value: 'Frontend Developer' } });
    fireEvent.change(expInput, { target: { value: '3' } });
    fireEvent.change(locInput, { target: { value: 'New York' } });

    const submitBtn = screen.getByRole('button', { name: /Save Candidate/i });
    await act(async () => {
      fireEvent.click(submitBtn);
    });

    // Wait for our mocked server action to be executed
    await vi.waitFor(() => {
      expect(mockCreateCandidate).toHaveBeenCalled();
    });
  });

  it('displays error message when mocked createCandidate server action fails', async () => {
    // Mock the Server Action to return an error response
    const mockCreateCandidate = vi.mocked(createCandidate);
    mockCreateCandidate.mockImplementation(async (prevState: any, formData: FormData) => {
      return { message: null, error: 'Database connection failed' };
    });

    render(<CandidateForm />);

    // Fill in the form fields to satisfy HTML5 validation
    const nameInput = screen.getByPlaceholderText('John Doe');
    const emailInput = screen.getByPlaceholderText('john@example.com');
    const roleSelect = screen.getByRole('combobox');
    const expInput = screen.getByPlaceholderText('0');
    const locInput = screen.getByPlaceholderText('New York, NY');

    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
    fireEvent.change(emailInput, { target: { value: 'jane@example.com' } });
    fireEvent.change(roleSelect, { target: { value: 'Backend Developer' } });
    fireEvent.change(expInput, { target: { value: '5' } });
    fireEvent.change(locInput, { target: { value: 'Los Angeles' } });

    const submitBtn = screen.getByRole('button', { name: /Save Candidate/i });
    await act(async () => {
      fireEvent.click(submitBtn);
    });

    // Wait for the action to execute and verify call
    await vi.waitFor(() => {
      expect(mockCreateCandidate).toHaveBeenCalled();
    });
  });
});
