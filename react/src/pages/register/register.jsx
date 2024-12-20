/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, {useEffect, useState} from "react";
import { supabase } from "../../supabase.js";
import { useNavigate } from "react-router-dom";
import 'react-icons/fa'
import {FaChalkboardTeacher, FaGraduationCap, FaExclamationCircle} from "react-icons/fa";
import ItemSelectionForm from "./components/ItemSelectionForm.jsx";
import VerifyEmail from "./components/VerifyEmail.jsx";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import {useLoading} from "../../context/LoadingContext.jsx";

const Register = () => {
  const { setLoading } = useLoading();
  const [step, setStep] = useState(0);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState("student"); // Default to "student"
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({});

  // for the departments
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  // only to use dummy-base for the departments, for the mean time
  useEffect(() => {
    const data = [
    {
      "id": "1",
      "name": "Computer Science",
      "abbreviation": "CS"
    },
    {
      "id": "2",
      "name": "Biomedical",
      "abbreviation": "BM"
    },
    {
      "id": "3",
      "name": "Mathematics",
      "abbreviation": "MATH"
    },
    {
      "id": "4",
      "name": "Physics",
      "abbreviation": "PHYS"
    },
    {
      "id": "5",
      "name": "Chemistry",
      "abbreviation": "CHEM"
    },
    {
      "id": "6",
      "name": "Philosophy",
      "abbreviation": "PHIL"
    },
    {
      "id": "7",
      "name": "Psychology",
      "abbreviation": "PSY"
    },
    {
      "id": "8",
      "name": "Engineering",
      "abbreviation": "ENG"
    },
    {
      "id": "9",
      "name": "Economics",
      "abbreviation": "ECO"
    }
  ];
    setItems(data);
    // // Fetch departments data from API
    // fetch('/api/fields')
    //     .then((response) => response.json())
    //     .then((data) => setItems(data))
    //     .catch((error) => console.error('Error fetching fields:', error));
  }, []);
  // end of dummy-base api integration

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    const currentYear = new Date().getFullYear().toString().slice(-2);

    const metadata = {
      role,
      first_name: firstName,
      last_name: lastName,
      year: currentYear,
    };

    if (role === "student") {
      metadata.department = selectedItems;
    } else if (role === "professor") {
      metadata.departments = selectedItems;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata }, // Store metadata for role and additional fields
    });

    if (error) {
      setLoading(false);
      toast.error(error.message);
      return;
    }

    if (data) {
      setLoading(false);
      setStep(3)
    }
  };

  const handleNext = () => {
    if (step === 0) {
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setStep(1);
      setFormErrors({})
    } else if (step === 1) {

      // Credential validations
      const errors = {};
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      if (!firstName) {
        errors.firstName = 'First name is required.';
      }
      if (!lastName) {
        errors.lastName = 'Last name is required.';
      }
      if (!email) {
        errors.email = 'Email address is required.';
      }

      if ((email) && !emailRegex.test(email)) {
        errors.email = 'Invalid email address.';
      }
      if (!password) {
        errors.password = 'Password is required.';
      }

      if (password.length < 6 && (password === confirmPassword)) {
        errors.password = 'Password must at least be 6 characters.';
        errors.confirmPassword = 'Password must at least be 6 characters.';
      }

      if (password.length < 6) {
        errors.password = 'Password must at least be 6 characters.';
      }

      if (!confirmPassword) {
        errors.confirmPassword = 'Please confirm your password.';
      }

      if (password !== confirmPassword) {
        errors.password = 'Passwords must match.';
        errors.confirmPassword = 'Passwords must match.';
      }

      setFormErrors(errors);

      if (Object.keys(formErrors).length > 0 || Object.keys(errors).length > 0) {return;}

      setSelectedItems([]);

      setStep(2);
    }
  };



  const CredentialsForm = (
      <div className="flex items-center justify-center bg-gray-100">
        <form
            className="bg-white rounded px-8 pt-6 pb-8 w-full max-w-md"
        >

          <div className="flex space-x-4 mb-4">
            <div>
              <label htmlFor="firstname" className={`text-xs font-bold relative top-2 ml-[7px] px-[3px] bg-white w-fit ${formErrors.firstName ? 'text-red-500' : 'text-black'}`}>First Name</label>
              <div className={`flex items-center shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none ${
                  formErrors.firstName ? 'border-red-500' : 'border-gray-300'
              }`}><input
                  type="text"
                  id="firstname"
                  value={firstName}
                  onChange={(e) => {setFirstName(e.target.value); delete formErrors.firstName;}}
                  className={'w-full leading-tight focus:outline-none'}
                  style={{ lineHeight: '1' }}
                  required
              />
                {formErrors.firstName && (
                    <FaExclamationCircle className="text-xl text-red-500 absolute ml-[112px]" />
                )}
              </div>

              {formErrors.firstName && (
                  <p className="text-red-500 text-xs mt-1 absolute whitespace-nowrap italic">{formErrors.firstName}</p>
              )}
            </div>
            <div>
              <label htmlFor="lastname" className={`text-xs font-bold relative top-2 ml-[7px] px-[3px] bg-white w-fit ${formErrors.lastName ? 'text-red-500' : 'text-black'}`}>Last Name</label>
              <div className={`flex items-center shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none ${
                  formErrors.lastName ? 'border-red-500' : 'border-gray-300'
              }`}><input
                  type="text"
                  id="lastname"
                  value={lastName}
                  onChange={(e) => {setLastName(e.target.value); delete formErrors.lastName;}}
                  className={'w-full leading-tight focus:outline-none'}
                  style={{ lineHeight: '1' }}
                  required
              />
                {formErrors.lastName && (
                    <FaExclamationCircle className="text-xl text-red-500 absolute ml-[112px]" />
                )}
              </div>
              {formErrors.lastName && (
                  <p className="text-red-500 text-xs mt-1 absolute whitespace-nowrap italic">{formErrors.lastName}</p>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="email"
                   className={`text-xs font-bold relative top-2 ml-[7px] px-[3px] bg-white w-fit ${formErrors.email ? 'text-red-500' : 'text-black'}`}>
              Email
            </label>
            <div className={`flex items-center shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none ${
                formErrors.email ? 'border-red-500' : 'border-gray-300'
            }`}><input
                type="email"
                id="email"
                className={'w-full leading-tight focus:outline-none'}
                style={{ lineHeight: '1' }}
                value={email}
                onChange={(e) => {setEmail(e.target.value); delete formErrors.email;}}
            />
              {formErrors.email && (
                  <FaExclamationCircle className="text-xl text-red-500 absolute ml-[288px]" />
              )}
            </div>
            {formErrors.email && (
                <p className="text-red-500 text-xs mt-1 absolute whitespace-nowrap italic">{formErrors.email}</p>
            )}
          </div>

          <div className="mb-4">
            <label
                htmlFor="password"
                className={`text-xs font-bold relative top-2 ml-[7px] px-[3px] bg-white w-fit ${formErrors.password ? 'text-red-500' : 'text-black'}`}
            >
              Password
            </label>
            <div className={`flex items-center shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none ${
                formErrors.password ? 'border-red-500' : 'border-gray-300'
            }`}><input
                type="password"
                id="password"
                className={'w-full leading-tight focus:outline-none'}
                style={{ lineHeight: '1' }}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (formErrors.password === "Passwords must match.") {delete formErrors.password; delete formErrors.confirmPassword;}
                  else {delete formErrors.password;}
                }}
                required
            />
              {formErrors.password && (
                  <FaExclamationCircle className="text-xl text-red-500 absolute ml-[288px]" />
              )}
            </div>
            {formErrors.password && (
                <p className="text-red-500 text-xs mt-1 absolute whitespace-nowrap italic">{formErrors.password}</p>
            )}
          </div>

          <div className="mb-4">
            <label
                htmlFor="password"
                className={`text-xs font-bold relative top-2 ml-[7px] px-[3px] bg-white w-fit ${formErrors.confirmPassword ? 'text-red-500' : 'text-black'}`}
            >
              Confirm Password
            </label>
            <div className={`flex items-center shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none ${
                formErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
            }`}><input
                type="password"
                id="confirmPassword"
                className={'w-full leading-tight focus:outline-none'}
                style={{ lineHeight: '1' }}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (formErrors.confirmPassword === "Passwords must match.") {delete formErrors.password; delete formErrors.confirmPassword;}
                  else {delete formErrors.confirmPassword;}
                }}
                required
            />
              {formErrors.confirmPassword && (
                  <FaExclamationCircle className="text-xl text-red-500 absolute ml-[288px]" />
              )}
            </div>
            {formErrors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1 absolute whitespace-nowrap italic">{formErrors.confirmPassword}</p>
            )}
          </div>
        </form>
      </div>
  );

  const RoleSelection = (
      <div className="space-y-4">
        <div className="flex space-x-4">
          <button
              type="button"
              id="role"
              className="w-full bg-black hover:bg-gray-600 text-white py-2 rounded mt-4 text-xl flex"
              style={{padding: '15px 32px'}}
              value={role}
              onClick={() => {
                setRole('student');
                handleNext();
              }}
          >
            <FaGraduationCap className="text-xl mr-2" style={{height:'2rem', width:'2rem'}} />
            Student
          </button>
          <button
              type="button"
              className="w-full bg-black hover:bg-gray-600 text-white py-2 rounded mt-4 text-xl flex"
              style={{padding: '15px 32px'}}
              onClick={() => {
                setRole('professor');
                handleNext();
              }}
          >
            Professor
            <FaChalkboardTeacher className="text-xl ml-2" style={{height:'2rem', width:'2rem'}} />
          </button>
        </div>
      </div>
  );


  const steps = [ //I will rework all of this and turn them into components proper, at some point in time. <3
    {title: 'Choose Your Role', content: RoleSelection, height: "30vh"},
    {title: 'Enter Credentials', content: CredentialsForm},
    {
      title: 'Select Your Field(s)',
      content: (<ItemSelectionForm
          items={items}
          role={role}
          setSelectedItems={setSelectedItems}
          selectedItems={selectedItems}
      />),
      height: "80vh"

    },
    {title: ``, content: (<VerifyEmail name={firstName}/>), height: "40vh"},
  ];


  return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md overflow-hidden"
             style={{maxHeight: steps[step].height}}>
          <h2 className="text-2xl font-bold mb-6 text-center">{steps[step].title}</h2>
          <div
              className="min-w-0 flex transition-transform duration-300 ease-in-out gap-x-20"
              style={{transform: `translateX(-${step * 120}%)`,
                display: 'flex',
                width: '100%',}}
          >
            {steps.map((stepContent, index) => (
                <div key={index} className="flex-shrink-0 w-full" // Style of the most inner part, which is basically the contents of the steps.
                     style={{display: 'flex', justifyContent: 'center', minHeight: 'auto'}}>
                  {stepContent.content}
                </div>
            ))}
          </div>
          {step === 1 && ( //step > 0 && step < steps.length - 1
              <div className="flex gap-5">
                <button
                    type="button"
                    onClick={() => setStep(prevStep => prevStep - 1)}
                    className="w-full bg-black hover:bg-gray-600 text-white py-2 rounded mt-4"
                >
                  Back
                </button>

                <button
                    type="button"
                    onClick={handleNext}
                    disabled = {!(Object.keys(formErrors).length === 0 && (firstName) && (lastName) && (password) && (confirmPassword) && (email))}
                    className={`w-full py-2 rounded mt-4 ${Object.keys(formErrors).length === 0 && (firstName) && (lastName) && (password) && (confirmPassword) && (email) ? 'bg-black hover:bg-gray-600 text-white' : 'bg-gray-100 text-gray-500'}`}
                >
                  Next
                </button>

              </div>
          )}
          {step === 2 && ( //steps.length - 1
              <div className="flex gap-5">
                <button
                    type="button"
                    onClick={() => setStep(prevStep => prevStep - 1)}
                    className="w-full bg-black hover:bg-gray-600 text-white py-2 rounded mt-4"
                >
                  Back
                </button>
                <button
                    type="button"
                    onClick={handleSignUp}
                    disabled={(selectedItems.length === 0)}
                    className={`w-full text-white py-2 rounded mt-4 ${!(selectedItems.length === 0) ? 'bg-black hover:bg-gray-600 text-white' : 'bg-gray-100 text-gray-500'}`}
                >
                  Submit
                </button>
              </div>
          )}
        </div>
      </div>
  );


};

export default Register;
