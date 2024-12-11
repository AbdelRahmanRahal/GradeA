import React, {useState} from "react";
import {FaExclamationCircle} from "react-icons/fa";

const ForgotPassword = ({forgotPasswordEmail, setForgotPasswordEmail, formErrors, setFormErrors}) => {

    // const [formErrors, setFormErrors] = useState({});

    return (
        <div className="flex items-center justify-center bg-gray-100">
            <form
                className="bg-white rounded px-8 pt-6 pb-8 w-full max-w-md"
            >
                {/* {errorMessage && (
            <p className="text-red-500 text-center mb-4">{errorMessage}</p>
        )} */}

                <div className="mb-4">
                    <label htmlFor="forgotPasswordEmail" className={`text-xs font-bold relative top-2 ml-[7px] px-[3px] bg-white w-fit ${formErrors.forgotPasswordEmail ? 'text-red-500' : 'text-black'}`}>Email</label>
                    <div className={`flex items-center shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none ${
                        formErrors.forgotPasswordEmail ? 'border-red-500' : 'border-gray-300'
                    }`}><input
                        type="text"
                        id="forgotPasswordEmail"
                        value={forgotPasswordEmail}
                        onChange={(e) => {setForgotPasswordEmail(e.target.value); delete formErrors.forgotPasswordEmail;}}
                        className={'w-full leading-tight focus:outline-none'}
                        style={{ lineHeight: '1' }}
                        required
                    />
                        {formErrors.forgotPasswordEmail && (
                            <FaExclamationCircle className="text-xl text-red-500 absolute ml-[288px]" />
                        )}
                    </div>

                    {formErrors.forgotPasswordEmail && (
                        <p className="text-red-500 text-xs mt-1 absolute whitespace-nowrap italic">{formErrors.forgotPasswordEmail}</p>
                    )}
                </div>
            </form>
        </div>
    );
};

export default ForgotPassword;
