import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LoadingProvider } from '../context/LoadingContext';
import Dashboard from '../pages/dashboard/dashboard';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

// Mock Supabase
jest.mock('@supabase/supabase-js', () => {
  const mockSupabaseClient = {
    auth: {
      getUser: jest.fn().mockResolvedValue({
        data: { user: { id: '123' } },
        error: null
      })
    },
    from: jest.fn().mockImplementation((table) => {
      if (table === 'profiles') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({
            data: { role: 'student' },
            error: null
          })
        };
      }
      if (table === 'courses_with_covers') {
        return {
          select: jest.fn().mockResolvedValue({
            data: [
              {
                course_id: 1,
                course_name: 'Mathematics',
                description: 'Advanced Math Course',
                cover_image_name: 'math.jpg',
                cover_image_bucket: 'covers'
              }
            ],
            error: null
          })
        };
      }
    }),
    storage: {
      from: jest.fn().mockReturnValue({
        getPublicUrl: jest.fn().mockReturnValue({
          data: { publicUrl: 'https://example.com/image.jpg' }
        })
      })
    }
  };

  return {
    createClient: () => mockSupabaseClient
  };
});

describe('Dashboard Component Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // TC_Dashboard_01: Basic Render
  test('TC_Dashboard_01: Component renders', async () => {
    await act(async () => {
      render(
        <LoadingProvider>
          <Dashboard />
        </LoadingProvider>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Your Courses')).toBeInTheDocument();
    });
  });

  // TC_Dashboard_02: No Courses Message
  test('TC_Dashboard_02: Shows no courses message when empty', async () => {
    const supabase = jest.requireMock('@supabase/supabase-js').createClient();
    
    // Mock profiles query
    supabase.from.mockImplementationOnce((table) => {
      if (table === 'profiles') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({
            data: { role: 'student' },
            error: null
          })
        };
      }
    });

    // Mock courses query with empty data
    supabase.from.mockImplementationOnce((table) => {
      if (table === 'courses_with_covers') {
        return {
          select: jest.fn().mockResolvedValue({
            data: [],  // Empty courses array
            error: null
          })
        };
      }
    });

    await act(async () => {
      render(
        <LoadingProvider>
          <Dashboard />
        </LoadingProvider>
      );
    });

    await waitFor(() => {
      expect(screen.getByText(/No courses found/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  // TC_Dashboard_03: Admin Redirect
  test('TC_Dashboard_03: Redirects admin users', async () => {
    const supabase = jest.requireMock('@supabase/supabase-js').createClient();
    supabase.from.mockImplementationOnce((table) => {
      if (table === 'profiles') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({
            data: { role: 'admin' },
            error: null
          })
        };
      }
    });

    await act(async () => {
      render(
        <LoadingProvider>
          <Dashboard />
        </LoadingProvider>
      );
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/admin');
    });
  });

  // TC_Dashboard_04: Unauthorized Redirect
  test('TC_Dashboard_04: Redirects unauthorized users', async () => {
    const supabase = jest.requireMock('@supabase/supabase-js').createClient();
    supabase.auth.getUser.mockResolvedValueOnce({
      data: { user: null },
      error: null
    });

    await act(async () => {
      render(
        <LoadingProvider>
          <Dashboard />
        </LoadingProvider>
      );
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });
}); 