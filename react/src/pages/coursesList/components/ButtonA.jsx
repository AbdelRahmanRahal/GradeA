import React from 'react';
import { FaArrowRight, FaPlus, FaTrash, FaPenSquare } from "react-icons/fa";
import {useNavigate} from "react-router-dom";
import "../../../index.css"

const BaseButton = ({ text, courseID, goesTo, className, disabled, type = "button" }) => {
    const navigate = useNavigate();

    return (
        <button
            type={type}
            onClick={event => {navigate(`/course/${courseID}/${goesTo}`)}}
            className={`py-2 px-3 text-xl transition-all ${className}`}
            disabled={disabled}
        >
            {text}
        </button>
    );
};

const AccessButton = ({ courseID }) => (
    <BaseButton
        text={<FaArrowRight/>}
        className="bg-black text-white hover:bg-red-800 min-h-full gradient-box"
        onClick={event => {navigate(`/course/${courseID}`)}}
        courseID={courseID}
    goesTo=""
    />
);

const AddButton = ({ courseID }) => (
    <BaseButton
        text={<FaPlus/>}
        className="text-gray-500 hover:text-black py-0 align-middle pt-1"
        courseID={courseID}
    />
);

const EditButton = ({ courseID }) => (
    <BaseButton
        text={<FaPenSquare/>}
        className="text-gray-500 hover:text-black"
        courseID={courseID}
    />
);

const RemoveButton = ({ courseID }) => (
    <BaseButton
        text={<FaTrash/>}
        className="text-gray-500 hover:text-black"
        courseID={courseID}
    />
);

export { AccessButton, AddButton, EditButton, RemoveButton };