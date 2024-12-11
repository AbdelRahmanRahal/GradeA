import React from "react";
import {FaExclamationCircle} from "react-icons/fa";

const CredentialsForm = ({email, password, setEmail, setPassword, setComponentIndex, setForgotPasswordEmail, formErrors}) => {

return (
    <div className="flex items-center justify-center bg-gray-100">
      <form
          className="bg-white rounded px-8 pt-6 pb-8 w-full max-w-md"
      >
     {/* {errorMessage && (
            <p className="text-red-500 text-center mb-4">{errorMessage}</p>
        )} */}

        <div className="mb-4">
        <label htmlFor="email" className={`text-xs font-bold relative top-2 ml-[7px] px-[3px] bg-white w-fit ${formErrors.email ? 'text-red-500' : 'text-black'}`}>Email</label>
              <div className={`flex items-center shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none ${
                  formErrors.email ? 'border-red-500' : 'border-gray-300'
              }`}><input
                  type="text"
                  id="email"
                  value={email}
                  onChange={(e) => {setEmail(e.target.value); delete formErrors.email;}}
                  className={'w-full leading-tight focus:outline-none'}
                  style={{ lineHeight: '1' }}
                  required
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
                  if (formErrors.password === "Invalid login credentials.") {
                      delete formErrors.password; delete formErrors.email;
                  }
                  else { delete formErrors.password; }
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
          <button type="button" className={'italic underline text-black ml-[13rem] hover:text-gray-500 whitespace-nowrap'}
          onClick={() =>{setComponentIndex(1); setForgotPasswordEmail(email)}}>Forgot password?</button>
      </form>
    </div>
    );
};

export default CredentialsForm;
