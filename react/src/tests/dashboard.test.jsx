import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { supabase } from "./../supabase.js";
import { useLoading } from "./../context/LoadingContext";
import Dashboard from "./../pages/dashboard/dashboard";
import { toast } from "react-toastify";

// Mock dependencies
jest.mock("./../supabase.js", () => ({
    supabase: {
        auth: {
            getUser: jest.fn(),
        },
        from: jest.fn().mockReturnThis(),
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

describe("Dashboard Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Test Case: TC_Dashboard_01
    test("TC_Dashboard_01: Verify that the dashboard displays the correct courses", async () => {
        const mockCourses = [
            { id: 1, name: "Course 1", description: "Description 1" },
            { id: 2, name: "Course 2", description: "Description 2" },
            { id: 3, name: "Course 3", description: "Description 3" },
        ];

        // Mock the response for fetching the user and courses
        supabase.auth.getUser.mockResolvedValue({ data: { user: { id: "user123" } } });
        supabase.from.mockImplementationOnce(() => ({
            select: () => ({
                eq: () => ({ data: mockCourses, error: null }),
            }),
        }));

        render(
            <Router>
                <Dashboard />
            </Router>
        );

        // Check that the courses are rendered
        await waitFor(() => {
            expect(screen.getByText("Your Courses")).toBeInTheDocument();
            expect(screen.getByText("Course 1")).toBeInTheDocument();
            expect(screen.getByText("Course 2")).toBeInTheDocument();
            expect(screen.getByText("Course 3")).toBeInTheDocument();
        });
    });

    // Test Case: TC_Dashboard_02
    test("TC_Dashboard_02: Redirect to login if no user is logged in", async () => {
        // Mock the user response to be null (user not logged in)
        supabase.auth.getUser.mockResolvedValue({ data: { user: null } });

        render(
            <Router>
                <Dashboard />
            </Router>
        );

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("User not logged in. Redirecting to login.");
        });
    });

    // Test Case: TC_Dashboard_03
    test("TC_Dashboard_03: Verify that no courses are displayed when there are no courses", async () => {
        const mockCourses = [];

        supabase.auth.getUser.mockResolvedValue({ data: { user: { id: "user123" } } });
        supabase.from.mockImplementationOnce(() => ({
            select: () => ({
                eq: () => ({ data: mockCourses, error: null }),
            }),
        }));

        render(
            <Router>
                <Dashboard />
            </Router>
        );

        await waitFor(() => {
            expect(screen.getByText("No courses found.")).toBeInTheDocument();
        });
    });

    // Test Case: TC_Dashboard_04
    test("TC_Dashboard_04: Test role-based redirection to admin dashboard", async () => {
        const mockCourses = [
            { id: 1, name: "Course 1", description: "Description 1" },
        ];

        // Mock the response for fetching the user and role as "admin"
        supabase.auth.getUser.mockResolvedValue({ data: { user: { id: "user123" } } });
        supabase.from.mockImplementationOnce(() => ({
            select: () => ({
                eq: () => ({ data: [{ role: "admin" }], error: null }),
            }),
        }));

        render(
            <Router>
                <Dashboard />
            </Router>
        );

        await waitFor(() => {
            expect(screen.getByText("No courses found.")).toBeInTheDocument();
            expect(window.location.pathname).toBe("/admin");
        });
    });

    // Test Case: TC_Dashboard_05
    test("TC_Dashboard_05: Verify View All button functionality", async () => {
        const mockCourses = [
            { id: 1, name: "Course 1", description: "Description 1" },
            { id: 2, name: "Course 2", description: "Description 2" },
            { id: 3, name: "Course 3", description: "Description 3" },
        ];

        supabase.auth.getUser.mockResolvedValue({ data: { user: { id: "user123" } } });
        supabase.from.mockImplementationOnce(() => ({
            select: () => ({
                eq: () => ({ data: mockCourses, error: null }),
            }),
        }));

        render(
            <Router>
                <Dashboard />
            </Router>
        );

        // Check that View All button exists and simulate click
        await waitFor(() => {
            expect(screen.getByRole("button", { name: /view all/i })).toBeInTheDocument();
        });

        fireEvent.click(screen.getByRole("button", { name: /view all/i }));
        // Replace with your expected behavior after View All is clicked
        expect(window.location.pathname).toBe("/");
    });
});
