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
    test("TC_Login_01: Verify that the login form displays correctly", () => {
        render(
            <Router>
                <Login />
            </Router>
        );

        expect(screen.getByText("Enter Credentials")).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
        expect(screen.getByText(/login/i)).toBeInTheDocument();
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
        fireEvent.click(screen.getByText(/login/i));

        await waitFor(() => {
            expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
                email: "test@example.com",
                password: "password123",
            });
        });
    });

    // Test Case: TC_Login_03
    test("TC_Login_03: Test login with invalid credentials", async () => {
        supabase.auth.signInWithPassword.mockResolvedValue({ data: null, error: { message: "Invalid login credentials" } });

        render(
            <Router>
                <Login />
            </Router>
        );

        fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: "wrong@example.com" } });
        fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: "wrongpassword" } });
        fireEvent.click(screen.getByText(/login/i));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("Invalid login credentials");
        });
    });

    // Other test cases...
});
