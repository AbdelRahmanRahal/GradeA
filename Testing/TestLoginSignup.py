import time
import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys

@pytest.fixture(scope="module")
def driver():
    # Set up the WebDriver
    driver = webdriver.Chrome()
    driver.get("http://localhost:8000")  # Replace with your app's URL
    yield driver
    driver.quit()

def test_signup(driver):
    # Navigate to the sign-up page
    driver.get("http://localhost:8000/signup")  # Replace with your sign-up page URL
    
    # Find the sign-up form fields
    username_field = driver.find_element(By.NAME, "username")
    email_field = driver.find_element(By.NAME, "email")
    password_field = driver.find_element(By.NAME, "password")
    
    # Fill in the form
    username_field.send_keys("testuser")
    email_field.send_keys("testuser@example.com")
    password_field.send_keys("password123")
    
    # Submit the form
    password_field.send_keys(Keys.RETURN)
    
    # Wait for a while to let the page load
    time.sleep(2)
    
    # Assert that sign-up was successful (change the condition as needed)
    assert "Welcome, testuser" in driver.page_source

def test_login(driver):
    # Navigate to the login page
    driver.get("http://localhost:8000/login")  # Replace with your login page URL
    
    # Find the login form fields
    username_field = driver.find_element(By.NAME, "username")
    password_field = driver.find_element(By.NAME, "password")
    
    # Fill in the form
    username_field.send_keys("testuser")
    password_field.send_keys("password123")
    
    # Submit the form
    password_field.send_keys(Keys.RETURN)
    
    # Wait for a while to let the page load
    time.sleep(2)
    
    # Assert that login was successful (change the condition as needed)
    assert "Welcome back, testuser" in driver.page_source
