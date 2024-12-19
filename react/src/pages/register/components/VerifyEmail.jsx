import React, {useState} from "react";
import { FaCheckCircle } from "react-icons/fa";

const VerifyEmail = ({name}) => {

    return (
        <div className="flex flex-col items-center justify-center rounded-[15px] overflow-hidden max-h-40">
                <FaCheckCircle className={'text-center text-gray-500 text-6xl'} />
            <h2 className={`mt-4 text-2xl font-bold`}>You're almost there, {name}.</h2>
                <h2 className={`text-center mt-4`}>Please check your email inbox for a verification email.</h2>
                <p className={'text-center'}>If you don't find it there, check your junk folder.</p>
        </div>
    );
};

export default VerifyEmail;