import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { supabase } from "./../supabase.js";
import { toast } from "react-toastify";
import { useLoading } from "./../context/LoadingContext";
import Login from "./../pages/Login/login";

// Mock dependencies
jest.mock("./../supabase.js", () => ({
    supabase: {
        auth: {
            signInWithPassword: jest.fn(),
            resetPasswordForEmail: jest.fn(),
        },
    },
}));

jest.mock("react-toastify", () => ({
    toast: {
        error: jest.fn(),
        info: jest.fn(),
    },
}));

jest.mock("./../context/LoadingContext", () => ({
    useLoading: () => ({
        setLoading: jest.fn(),
    }),
}));

describe("Login Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Test Case: TC_Login_01
    test("TC_Login_01: Verify that the login form displays correctly", () => {
        render(
            <Router>
                <Login />
            </Router>
        );

        expect(screen.getByText(/enter credentials/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
        expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
    });

    // Test Case: TC_Login_02
    test("TC_Login_02: Test login with valid credentials", async () => {
        supabase.auth.signInWithPassword.mockResolvedValue({ data: { user: {} }, error: null });

        render(
            <Router>
                <Login />
            </Router>
        );

        fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: "test@example.com" } });
        fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: "password123" } });
        fireEvent.click(screen.getByRole("button", { name: /login/i }));

        await waitFor(() => {
            expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
                email: "test@example.com",
                password: "password123",
            });
        });
    });

    // Test Case: TC_Login_03
    test("TC_Login_03: Test login with invalid credentials", async () => {
        supabase.auth.signInWithPassword.mockResolvedValue({
            data: null,
            error: { message: "Invalid login credentials" },
        });

        render(
            <Router>
                <Login />
            </Router>
        );

        fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: "wrong@example.com" } });
        fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: "wrongpassword" } });
        fireEvent.click(screen.getByRole("button", { name: /login/i }));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("Invalid login credentials");
        });
    });

    // Test Case: TC_Login_04
    test("TC_Login_04: Test login with empty email field", async () => {
        render(
            <Router>
                <Login />
            </Router>
        );

        fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: "password123" } });
        fireEvent.click(screen.getByRole("button", { name: /login/i }));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("Email is required");
        });
    });

    // Test Case: TC_Login_05
    test("TC_Login_05: Test login with empty password field", async () => {
        render(
            <Router>
                <Login />
            </Router>
        );

        fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: "test@example.com" } });
        fireEvent.click(screen.getByRole("button", { name: /login/i }));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("Password is required");
        });
    });

    // Test Case: TC_Login_06
    test("TC_Login_06: Test login with incorrect email format", async () => {
        render(
            <Router>
                <Login />
            </Router>
        );

        fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: "invalid-email" } });
        fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: "password123" } });
        fireEvent.click(screen.getByRole("button", { name: /login/i }));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("Invalid email format");
        });
    });

    // Test Case: TC_Login_07
    test("TC_Login_07: Test forgot password functionality", async () => {
        supabase.auth.resetPasswordForEmail.mockResolvedValue({ data: {}, error: null });

        render(
            <Router>
                <Login />
            </Router>
        );

        fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: "test@example.com" } });
        fireEvent.click(screen.getByText(/forgot password/i));

        await waitFor(() => {
            expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalledWith("test@example.com");
            expect(toast.info).toHaveBeenCalledWith("Password reset email sent");
        });
    });

    // Test Case: TC_Login_08
    test("TC_Login_08: Test forgot password with empty email field", async () => {
        render(
            <Router>
                <Login />
            </Router>
        );

        fireEvent.click(screen.getByText(/forgot password/i));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("Please enter an email");
        });
    });
});
