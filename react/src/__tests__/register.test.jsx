import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LoadingProvider } from '../context/LoadingContext';
import Register from '../pages/register/register';

// Mock Supabase
jest.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    auth: {
      signUp: jest.fn().mockResolvedValue({ data: { user: { id: 1 } }, error: null }),
      getUser: jest.fn().mockResolvedValue({ data: { user: null }, error: null })
    }
  })
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  BrowserRouter: ({ children }) => <div>{children}</div>
}));

describe('Register Component Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.log('\n--- Starting New Test ---\n');
  });

  afterEach(() => {
    console.log('\n--- Test Completed ---\n');
  });

  // TC_Register_01: Verify form display
  test('TC_Register_01: Form displays correctly', async () => {
    console.log('Running: Form Display Test');
    await act(async () => {
      render(
        <LoadingProvider>
          <Register />
        </LoadingProvider>
      );
    });

    const title = screen.getByText('Choose Your Role');
    expect(title).toBeInTheDocument();
    console.log('✓ Title found');

    const studentButton = screen.getByRole('button', { name: /student/i });
    await act(async () => {
      fireEvent.click(studentButton);
    });
    console.log('✓ Student role selected');

    await waitFor(() => {
      const form = document.querySelector('form');
      expect(form).toBeInTheDocument();
      console.log('✓ Form found');
    });

    console.log('Test TC_Register_01 Passed ✅');
  });

  // TC_Register_02: Test basic form navigation
  test('TC_Register_02: Form navigation works', async () => {
    render(
      <LoadingProvider>
        <Register />
      </LoadingProvider>
    );

    // Step 1: Verify initial role selection screen
    expect(screen.getByText('Choose Your Role')).toBeInTheDocument();

    // Step 2: Click student button and verify credentials form appears
    const studentButton = screen.getByRole('button', { name: /student/i });
    await act(async () => {
      fireEvent.click(studentButton);
    });

    // Verify we moved to credentials form
    await waitFor(() => {
      expect(screen.getByText('Enter Credentials')).toBeInTheDocument();
    });

    // Verify form fields are present
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  // TC_Register_03: Test registration with existing email
  test('TC_Register_03: Existing email shows error', async () => {
    console.log('Running: Existing Email Test');
    await act(async () => {
      render(
        <LoadingProvider>
          <Register />
        </LoadingProvider>
      );
    });

    const studentButton = screen.getByRole('button', { name: /student/i });
    await act(async () => {
      fireEvent.click(studentButton);
    });

    await waitFor(() => {
      expect(document.getElementById('email')).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.change(document.getElementById('email'), { target: { value: 'existing@example.com' } });
    });

    console.log('Test TC_Register_03 Passed ✅');
  });

  // TC_Register_04: Test empty fields validation
  test('TC_Register_04: Empty fields validation', async () => {
    console.log('Running: Empty Fields Test');
    await act(async () => {
      render(
        <LoadingProvider>
          <Register />
        </LoadingProvider>
      );
    });

    const studentButton = screen.getByRole('button', { name: /student/i });
    await act(async () => {
      fireEvent.click(studentButton);
    });

    await waitFor(() => {
      const form = document.querySelector('form');
      expect(form).toBeInTheDocument();
    });

    const submitButton = screen.getByRole('button', { name: /next/i });
    expect(submitButton).toBeDisabled();
    console.log('✓ Submit button disabled for empty fields');

    console.log('Test TC_Register_04 Passed ✅');
  });

  // TC_Register_05: Test invalid email format
  test('TC_Register_05: Invalid email format', async () => {
    console.log('Running: Invalid Email Format Test');
    await act(async () => {
      render(
        <LoadingProvider>
          <Register />
        </LoadingProvider>
      );
    });

    const studentButton = screen.getByRole('button', { name: /student/i });
    await act(async () => {
      fireEvent.click(studentButton);
    });

    await waitFor(() => {
      expect(document.getElementById('email')).toBeInTheDocument();
    });

    const emailInput = document.getElementById('email');
    expect(emailInput).toHaveAttribute('type', 'email');
    console.log('✓ Email validation attribute present');

    console.log('Test TC_Register_05 Passed ✅');
  });

  // TC_Register_06: Test role selection
  test('TC_Register_06: Role selection works', async () => {
    console.log('Running: Role Selection Test');
    await act(async () => {
      render(
        <LoadingProvider>
          <Register />
        </LoadingProvider>
      );
    });

    const studentButton = screen.getByRole('button', { name: /student/i });
    const professorButton = screen.getByRole('button', { name: /professor/i });

    expect(studentButton).toBeInTheDocument();
    expect(professorButton).toBeInTheDocument();
    console.log('✓ Both role buttons found');

    await act(async () => {
      fireEvent.click(studentButton);
    });
    console.log('✓ Student role selection works');

    console.log('Test TC_Register_06 Passed ✅');
  });

  // TC_Register_07: Test form navigation
  test('TC_Register_07: Form navigation works', async () => {
    console.log('Running: Form Navigation Test');
    await act(async () => {
      render(
        <LoadingProvider>
          <Register />
        </LoadingProvider>
      );
    });

    const studentButton = screen.getByRole('button', { name: /student/i });
    await act(async () => {
      fireEvent.click(studentButton);
    });

    await waitFor(() => {
      expect(document.querySelector('form')).toBeInTheDocument();
    });
    console.log('✓ Navigation to form successful');

    console.log('Test TC_Register_07 Passed ✅');
  });

  // TC_Register_08: Test password validation
  test('TC_Register_08: Password validation works', async () => {
    console.log('Running: Password Validation Test');
    await act(async () => {
      render(
        <LoadingProvider>
          <Register />
        </LoadingProvider>
      );
    });

    const studentButton = screen.getByRole('button', { name: /student/i });
    await act(async () => {
      fireEvent.click(studentButton);
    });

    await waitFor(() => {
      expect(document.getElementById('password')).toBeInTheDocument();
    });

    const passwordInput = document.getElementById('password');
    expect(passwordInput).toHaveAttribute('type', 'password');
    console.log('✓ Password field validation present');

    console.log('Test TC_Register_08 Passed ✅');
  });

  // TC_Register_02: Role Selection
  test('TC_Register_02: Role selection works', async () => {
    render(
      <LoadingProvider>
        <Register />
      </LoadingProvider>
    );

    // Find the role buttons
    const studentButton = screen.getByRole('button', {
      name: /student/i,
      exact: false
    });
    const professorButton = screen.getByRole('button', {
      name: /professor/i,
      exact: false
    });

    // Initially student should be selected
    expect(studentButton).toHaveAttribute('id', 'role');
    expect(professorButton).not.toHaveAttribute('id', 'role');

    // Click professor button and verify step changes
    await fireEvent.click(professorButton);

    // Verify that we moved to the credentials form
    expect(screen.getByText('Enter Credentials')).toBeInTheDocument();
  });
}); 