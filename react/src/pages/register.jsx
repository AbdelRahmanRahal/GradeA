import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MultiStepRegister = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [items, setItems] = useState([]);
  const [isStudent, setIsStudent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch fields data from API
    fetch('/api/fields')
      .then((response) => response.json())
      .then((data) => setItems(data))
      .catch((error) => console.error('Error fetching fields:', error));
  }, []);

  const handleRoleChange = (role) => {
    setIsStudent(role === 'student');
    setStep(1);
  };

  const handleConfirmPasswordChange = (value) => {
    setConfirmPassword(value);
  };

  const handleFormDataChange = (field, value) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleNext = () => {
    if (step === 0) {
      setStep(1);
    } else if (step === 1) {
        if (formData.password !== confirmPassword) {
            alert('Passwords do not match');
            return;
          }

        if (!formData.firstname || !formData.lastname || !formData.email || !formData.password || !confirmPassword) {
            alert('All fields are required. Please fill them out.');
            return;
            }
        
        if (!emailRegex.test(formData.email)) {
            alert('Invalid email.');
            return;
        }
      setStep(2);
    }
  };

  const handleSubmit = async () => {

    if (selectedItems.length === 0) {
        alert('At least one field must be selected');
        return;
      }

    try {
        const role = isStudent ? 'student' : 'instructor';
      const userData = {
        ...formData,
        selectedItems,
      };
      
      const response = await fetch(`/api/${role}s`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Failed to register user');
      }

      const data = await response.json();
      console.log('User registered successfully:', data);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  const steps = [
    { title: 'Choose Your Role', content: <RoleSelection onChange={handleRoleChange} /> },
    { title: 'Enter Credentials', content: <CredentialsForm formData={formData} onChange={handleFormDataChange} confirmPassword={confirmPassword} onConfirmPasswordChange={handleConfirmPasswordChange} /> },
    {
      title: 'Select Your Field(s)',
      content: (
        <ItemSelectionForm
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
        items={items}
        isStudent={isStudent} // Pass role-specific state
        />
      ),
    },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">{steps[step].title}</h2>
        {steps[step].content}
        {step > 0 && step < steps.length - 1 && (
          <button
            type="button"
            onClick={handleNext}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded mt-4"
          >
            Next
          </button>
        )}
        {step === steps.length - 1 && (
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded mt-4"
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

const RoleSelection = ({ onChange }) => (
  <div className="space-y-4">
    <div className="flex space-x-4">
      <button
        type="button"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded mt-4"
        onClick={() => onChange('student')}
      >
        Student
      </button>
      <button
        type="button"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded mt-4"
        onClick={() => onChange('instructor')}
      >
        Instructor
      </button>
    </div>
  </div>
);

const CredentialsForm = ({ formData, onChange, confirmPassword, onConfirmPasswordChange }) => (
  <form>
    <div className="flex space-x-4">
        <div>
        <label htmlFor="firstname">First Name</label>
        <input
            type="text"
            id="firstname"
            value={formData.firstname}
            onChange={(e) => onChange('firstname', e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
        />
        </div>
        <div>
        <label htmlFor="lastname">Last Name</label>
        <input
            type="text"
            id="lastname"
            value={formData.lastname}
            onChange={(e) => onChange('lastname', e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
        />
        </div>
    </div>
    <div>
      <label htmlFor="email">Email</label>
      <input
        type="email"
        id="email"
        value={formData.email}
        onChange={(e) => onChange('email', e.target.value)}
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        required
      />
    </div>
    <div>
      <label htmlFor="password">Password</label>
      <input
        type="password"
        id="password"
        value={formData.password}
        onChange={(e) => onChange('password', e.target.value)}
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        required
      />
    </div>
    <div>
      <label htmlFor="confirmPassword">Confirm Password</label>
      <input
        type="password"
        id="confirmPassword"
        value={confirmPassword}
        onChange={(e) => onConfirmPasswordChange(e.target.value)}
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        required
      />
    </div>
  </form>
);

const ItemSelectionForm = ({ selectedItems, setSelectedItems, items, isStudent }) => {
    const handleSelectionChange = (abbreviation, checked) => {
      if (isStudent) {
        // Students can only select one
        setSelectedItems(checked ? [abbreviation] : []);
      } else {
        // Instructors can select multiple
        setSelectedItems(
          checked
            ? [...selectedItems, abbreviation]
            : selectedItems.filter((abbr) => abbr !== abbreviation)
        );
      }
    };
  
    return (
      <div>
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.abbreviation)}
                  onChange={(e) =>
                    handleSelectionChange(item.abbreviation, e.target.checked)
                  }
                  disabled={isStudent && selectedItems.length >= 1 && !selectedItems.includes(item.abbreviation)}
                  // Disable other checkboxes if the user is a student and already selected one
                  style={{ marginRight: '10px' }}
                />
                <span>{item.name}</span>
              </label>
            </li>
          ))}
        </ul>
        {isStudent && selectedItems.length > 1 && (
          <p className="text-red-500">Students can only select one field.</p>
        )}
      </div>
    );
  };
  

export default MultiStepRegister;
