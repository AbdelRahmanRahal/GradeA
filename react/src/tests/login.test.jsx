import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { supabase } from "../../supabase.js"; // Mock this for testing
import { toast } from "react-toastify";
import { useLoading } from "../../context/LoadingContext";
import Login from "./Login";

// Mock dependencies
jest.mock("../../supabase.js", () => ({
    supabase: {
        auth: {
            signInWithPassword: jest.fn(),
            resetPasswordForEmail: jest.fn(),
            getUser: jest.fn(),
        },
    },
}));

jest.mock("react-toastify", () => ({
    toast: {
        error: jest.fn(),
        info: jest.fn(),
    },
}));

jest.mock("../../context/LoadingContext", () => ({
    useLoading: () => ({
        setLoading: jest.fn(),
    }),
}));

describe("Login Component", () => {
    // Clear mocks before each test
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Test Case: TC_Login_01
    // Verify that the login form displays correctly
    test("TC_Login_01: Verify that the login form displays correctly", () => {
        render(
            <Router>
                <Login />
            </Router>
        );

        // Check if the form title, email field, password field, and login button are present
        expect(screen.getByText("Enter Credentials")).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
        expect(screen.getByText(/login/i)).toBeInTheDocument();
    });

    // Test Case: TC_Login_02
    // Test login with valid credentials
    test("TC_Login_02: Test login with valid credentials", async () => {
        // Mock successful login response
        supabase.auth.signInWithPassword.mockResolvedValue({ data: { user: {} }, error: null });

        render(
            <Router>
                <Login />
            </Router>
        );

        // Simulate entering valid credentials
        fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: "test@example.com" } });
        fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: "password123" } });

        // Simulate clicking the login button
        fireEvent.click(screen.getByText(/login/i));

        // Verify that the API was called with the correct data
        await waitFor(() => {
            expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
                email: "test@example.com",
                password: "password123",
            });
        });
    });

    // Test Case: TC_Login_03
    // Test login with invalid credentials
    test("TC_Login_03: Test login with invalid credentials", async () => {
        // Mock failed login response
        supabase.auth.signInWithPassword.mockResolvedValue({ data: null, error: { message: "Invalid login credentials" } });

        render(
            <Router>
                <Login />
            </Router>
        );

        // Simulate entering invalid credentials
        fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: "wrong@example.com" } });
        fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: "wrongpassword" } });

        // Simulate clicking the login button
        fireEvent.click(screen.getByText(/login/i));

        // Verify that the correct error message is shown
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("Invalid login credentials");
        });
    });

    // Test Case: TC_Login_04
    // Test login with an empty email field
    test("TC_Login_04: Test login with empty email field", async () => {
        render(
            <Router>
                <Login />
            </Router>
        );

        // Simulate entering a password but leaving the email field empty
        fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: "password123" } });
        fireEvent.click(screen.getByText(/login/i));

        // Verify that the email validation error is displayed
        expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
    });

    // Test Case: TC_Login_05
    // Test login with an empty password field
    test("TC_Login_05: Test login with empty password field", async () => {
        render(
            <Router>
                <Login />
            </Router>
        );

        // Simulate entering an email but leaving the password field empty
        fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: "test@example.com" } });
        fireEvent.click(screen.getByText(/login/i));

        // Verify that the password validation error is displayed
        expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
    });

    // Test Case: TC_Login_06
    // Test login with an incorrect email format
    test("TC_Login_06: Test login with incorrect email format", async () => {
        render(
            <Router>
                <Login />
            </Router>
        );

        // Simulate entering an incorrectly formatted email
        fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: "invalid-email" } });
        fireEvent.click(screen.getByText(/login/i));

        // Verify that the email format validation error is displayed
        expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
    });

    // Test Case: TC_Login_07
    // Test forgot password functionality
    test("TC_Login_07: Test forgot password functionality", async () => {
        // Mock successful password reset response
        supabase.auth.resetPasswordForEmail.mockResolvedValue({ error: null });

        render(
            <Router>
                <Login />
            </Router>
        );

        // Simulate navigating to the forgot password form and entering a valid email
        fireEvent.click(screen.getByText(/recover your password/i));
        fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: "test@example.com" } });
        fireEvent.click(screen.getByText(/submit/i));

        // Verify that the password reset email API was called and a success toast was displayed
        await waitFor(() => {
            expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalledWith("test@example.com");
            expect(toast.info).toHaveBeenCalledWith("Password reset email sent! Check your inbox.");
        });
    });

    // Test Case: TC_Login_08
    // Test forgot password with an empty email field
    test("TC_Login_08: Test forgot password with empty email field", async () => {
        render(
            <Router>
                <Login />
            </Router>
        );

        // Simulate navigating to the forgot password form and leaving the email field empty
        fireEvent.click(screen.getByText(/recover your password/i));
        fireEvent.click(screen.getByText(/submit/i));

        // Verify that the email validation error is displayed
        expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
    });
});
