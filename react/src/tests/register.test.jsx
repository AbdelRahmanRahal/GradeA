import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Register from '../Register'; // Adjust the path as needed
import { MemoryRouter } from 'react-router-dom';
import { LoadingContext } from '../../context/LoadingContext'; // Adjust based on context implementation
import { supabase } from '../../supabase';

jest.mock('../../supabase', () => ({
    supabase: {
        auth: {
            signUp: jest.fn(),
        },
    },
}));

const mockSetLoading = jest.fn();

describe('Register Component', () => {
    beforeEach(() => {
        render(
            <LoadingContext.Provider value={{ setLoading: mockSetLoading }}>
                <MemoryRouter>
                    <Register />
                </MemoryRouter>
            </LoadingContext.Provider>
        );
    });

    test('TC_Register_01: Verify that the registration form displays correctly.', () => {
        // Ensure all fields are rendered
        expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    });

    test('TC_Register_02: Test registration with valid credentials.', async () => {
        const mockResponse = { data: {}, error: null };
        supabase.auth.signUp.mockResolvedValue(mockResponse);

        // Simulate user input
        fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } });
        fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } });
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john.doe@example.com' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password123' } });

        fireEvent.click(screen.getByText(/next/i)); // Click next button
        fireEvent.click(screen.getByText(/submit/i)); // Submit registration form

        await waitFor(() => {
            expect(supabase.auth.signUp).toHaveBeenCalled();
        });
        expect(mockSetLoading).toHaveBeenCalledWith(false);
    });

    test('TC_Register_03: Test registration with existing email.', async () => {
        const mockError = { error: { message: 'Email is already in use' } };
        supabase.auth.signUp.mockResolvedValue(mockError);

        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'existing.email@example.com' } });
        fireEvent.click(screen.getByText(/submit/i));

        await waitFor(() => {
            expect(screen.getByText(/email is already in use/i)).toBeInTheDocument();
        });
    });

    test('TC_Register_04: Test registration with mismatched password and confirm password.', () => {
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password124' } });

        fireEvent.click(screen.getByText(/next/i));
        expect(screen.getByText(/passwords must match/i)).toBeInTheDocument();
    });

    test('TC_Register_05: Test registration with empty email field.', () => {
        fireEvent.click(screen.getByText(/next/i));
        expect(screen.getByText(/email address is required/i)).toBeInTheDocument();
    });

    test('TC_Register_06: Test registration with empty password field.', () => {
        fireEvent.click(screen.getByText(/next/i));
        expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });

    test('TC_Register_07: Test registration with invalid email format.', () => {
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'invalid-email' } });
        fireEvent.click(screen.getByText(/next/i));
        expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
    });

    test('TC_Register_08: Test successful registration with valid data and check for login redirection.', async () => {
        const mockResponse = { data: {}, error: null };
        supabase.auth.signUp.mockResolvedValue(mockResponse);

        fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } });
        fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } });
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john.doe@example.com' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password123' } });
        fireEvent.click(screen.getByText(/submit/i));

        await waitFor(() => {
            expect(mockSetLoading).toHaveBeenCalledWith(false);
        });
        expect(supabase.auth.signUp).toHaveBeenCalled();
    });
});
