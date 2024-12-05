/* eslint-disable no-unused-vars */
import React, {useEffect, useState} from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";
import 'react-icons/fa'
import {FaChalkboardTeacher, FaGraduationCap} from "react-icons/fa";

const Register = () => {
  const [step, setStep] = useState(0);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState("student"); // Default to "student"
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // for the fields
  const [items, setItems] = useState([]);

  // only to use dummy-base for the fields, for the mean time
  useEffect(() => {
    // Fetch fields data from API
    fetch('/api/fields')
        .then((response) => response.json())
        .then((data) => setItems(data))
        .catch((error) => console.error('Error fetching fields:', error));
  }, []);
  // end of dummy-base api integration

  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const {data, error} = await supabase.auth.signUp({
      email,
      password,
      role,
      options: {
        data: {role}, // Store the selected role in user metadata
      },
    });

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    if (data) {
      alert("Sign-up successful! Please verify your email.");
      navigate("/verify-email");
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
    } else if (step === 1) {
      if (password !== confirmPassword) {
        alert('Passwords do not match');
        return; }
      //
      // if (!formData.firstname || !formData.lastname || !formData.email || !formData.password || !confirmPassword) {
      //   alert('All fields are required. Please fill them out.');
      //   return;
      // }
      //
      // if (!emailRegex.test(formData.email)) {
      //   alert('Invalid email.');
      //   return;
      // }
      setStep(2);
    }
  };



  const CredentialsForm = (
      <div className="flex items-center justify-center bg-gray-100">
        <form
            // onSubmit={handleNext} //used to be handleSignUp
            className="bg-white rounded px-8 pt-6 pb-8 w-full max-w-md"
        >

          {errorMessage && (
              <p className="text-red-500 text-center mb-4">{errorMessage}</p>
          )}
          <div className="flex space-x-4 mb-4">
            <div>
              <label htmlFor="firstname" className="text-xs text-black font-bold relative top-2 ml-[7px] px-[3px] bg-white w-fit">First Name</label>
              <input
                  type="text"
                  id="firstname"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  style={{ lineHeight: '1' }}
                  required
              />
            </div>
            <div>
              <label htmlFor="lastname" className="text-xs text-black font-bold relative top-2 ml-[7px] px-[3px] bg-white w-fit">Last Name</label>
              <input
                  type="text"
                  id="lastname"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-none"
                  style={{ lineHeight: '1' }}
                  required
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="text-xs text-black font-bold relative top-2 ml-[7px] px-[3px] bg-white w-fit">
              Email
            </label>
            <input
                type="email"
                id="email"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-none"
                style={{ lineHeight: '1' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
          </div>

          <div className="mb-4">
            <label
                htmlFor="password"
                className="text-xs text-black font-bold relative top-2 ml-[7px] px-[3px] bg-white w-fit"
            >
              Password
            </label>
            <input
                type="password"
                id="password"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-none"
                style={{ lineHeight: '1' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
          </div>

          <div className="mb-4">
            <label
                htmlFor="password"
                className="text-xs text-black font-bold relative top-2 ml-[7px] px-[3px] bg-white w-fit"
            >
              Confirm Password
            </label>
            <input
                type="password"
                id="confirmPassword"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-none"
                style={{ lineHeight: '1' }}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
            />
          </div>

          {/*<div className="flex items-center justify-between">*/}
          {/*</div>*/}
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
                setRole('instructor');
                handleNext();
              }}
          >
            Instructor
            <FaChalkboardTeacher className="text-xl ml-2" style={{height:'2rem', width:'2rem'}} />
          </button>
        </div>
      </div>
  );

  const ItemSelectionForm = () => {
    const [selectedItems, setSelectedItems] = useState([]);
    const handleSelectionChange = (abbreviation, checked) => {
      if (role === "student") {
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
        <div className="border-gray-300 border-2 rounded-[15px] overflow-hidden max-h-80">
        <div className="overflow-y-auto max-h-80">
          <table className="table-bordered table-hover table-responsive-xl border-black rounded-lg shadow-xl"
          style={{
            width: '100%'
          }}>
            <tbody>
            {items.map((item) => (
                <tr key={item.id}
                    className={item .id % 2 === 0 ? 'bg-[#D3D3D3]' : ''}>
                  <td className="px-12 py-4 pl-4"> {item.name} </td>
                  <td className="px-12 py-4 pr-4"><input
                      type="checkbox"
                      checked={selectedItems.includes(item.abbreviation)}
                      onChange={(e) =>
                          handleSelectionChange(item.abbreviation, e.target.checked)
                      }
                      disabled={(role === "student") && selectedItems.length >= 1 && !selectedItems.includes(item.abbreviation)}
                      className="scale-150"
                      // Disable other checkboxes if the user is a student and already selected one
                      style={{marginRight: '10px'}}
                  /></td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>
          {(role === "student") && selectedItems.length > 1 && (
              <p className="text-red-500">Students can only select one field.</p>
          )}
        </div>
    );
  };

  const steps = [
    {title: 'Choose Your Role', content: RoleSelection, height: "30vh"},
    {title: 'Enter Credentials', content: CredentialsForm},
    {
      title: 'Select Your Field(s)',
      content: (<ItemSelectionForm
          items={items}
          role={role} // Pass role-specific state
      />),

    },
  ];


//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <form
//         onSubmit={handleSignUp}
//         className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-md"
//       >
//         <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
//
//         {errorMessage && (
//           <p className="text-red-500 text-center mb-4">{errorMessage}</p>
//         )}
//
//         <div className="mb-4">
//           <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
//             Email
//           </label>
//           <input
//             type="email"
//             id="email"
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </div>
//
//         <div className="mb-4">
//           <label
//             htmlFor="password"
//             className="block text-gray-700 font-bold mb-2"
//           >
//             Password
//           </label>
//           <input
//             type="password"
//             id="password"
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </div>
//
//         <div className="mb-4">
//           <label htmlFor="role" className="block text-gray-700 font-bold mb-2">
//             Select Role
//           </label>
//           <select
//             id="role"
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             value={role}
//             onChange={(e) => setRole(e.target.value)}
//           >
//             <option value="student">Student</option>
//             <option value="professor">Professor</option>
//           </select>
//         </div>
//
//         <div className="flex items-center justify-between">
//           <button
//             type="submit"
//             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//           >
//             Sign Up
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };


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
            {step > 0 && step < steps.length - 1 && (
                <div className="flex gap-5">
                  <button
                      type="button"
                      onClick={() => setStep(prevStep => prevStep - 1)}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded mt-4"
                  >
                    Back
                  </button>
                  <button
                      type="button"
                      onClick={handleNext}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded mt-4"
                  >
                    Next
                  </button>

                </div>
            )}
            {step === steps.length - 1 && (
                <div className="flex gap-5">
                  <button
                      type="button"
                      onClick={() => setStep(prevStep => prevStep - 1)}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded mt-4"
                  >
                    Back
                  </button>
                  <button
                      type="button"
                      onClick={handleSignUp}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded mt-4"
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
