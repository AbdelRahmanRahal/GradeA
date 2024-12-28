import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { LoadingProvider } from '../context/LoadingContext';
import Login from '../pages/login/login';

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <LoadingProvider>
        {component}
      </LoadingProvider>
    </BrowserRouter>
  );
};

describe('Login Component Tests', () => {
  // Test 1: Basic render test
  test('TC_Login_01: Basic Render', () => {
    console.log('Running TC_Login_01...');
    renderWithProviders(<Login />);
    expect(document.body).toBeInTheDocument();
    console.log('TC_Login_01 completed');
  });

  // Test 2: Title
  test('TC_Login_02: Title Check', () => {
    console.log('Running TC_Login_02...');
    renderWithProviders(<Login />);
    try {
      const title = screen.getByText('Enter Credentials');
      expect(title).toBeInTheDocument();
      console.log('TC_Login_02 completed');
    } catch (error) {
      console.log('TC_Login_02 failed:', error.message);
      throw error;
    }
  });

  // Test 3: Form Elements - Fixed to use IDs
  test('TC_Login_03: Form Elements', () => {
    console.log('Running TC_Login_03...');
    renderWithProviders(<Login />);
    try {
      const emailInput = document.getElementById('email');
      const passwordInput = document.getElementById('password');
      expect(emailInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
      console.log('TC_Login_03 completed');
    } catch (error) {
      console.log('TC_Login_03 failed:', error.message);
      throw error;
    }
  });

  // Test 4: Login Button
  test('TC_Login_04: Login Button', () => {
    console.log('Running TC_Login_04...');
    renderWithProviders(<Login />);
    try {
      const loginButton = screen.getByRole('button', { name: /login/i });
      expect(loginButton).toBeInTheDocument();
      console.log('TC_Login_04 completed');
    } catch (error) {
      console.log('TC_Login_04 failed:', error.message);
      throw error;
    }
  });

  // Test 5: Form Structure
  test('TC_Login_05: Form Structure', () => {
    console.log('Running TC_Login_05...');
    renderWithProviders(<Login />);
    try {
      const form = document.querySelector('form');
      expect(form).toBeInTheDocument();
      console.log('TC_Login_05 completed');
    } catch (error) {
      console.log('TC_Login_05 failed:', error.message);
      throw error;
    }
  });

  // Test 6: Additional Elements
  test('TC_Login_06: Additional Elements', () => {
    console.log('Running TC_Login_06...');
    renderWithProviders(<Login />);
    try {
      const forgotPasswordButton = screen.getByRole('button', { name: /forgot password\?/i });
      const createAccountButton = screen.getByRole('button', { name: /create account/i });
      expect(forgotPasswordButton).toBeInTheDocument();
      expect(createAccountButton).toBeInTheDocument();
      console.log('TC_Login_06 completed');
    } catch (error) {
      console.log('TC_Login_06 failed:', error.message);
      throw error;
    }
  });
});