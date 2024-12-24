    import React, {useState} from 'react';
    import {FaArrowRight, FaPlus, FaTrash, FaPenSquare, FaBell} from "react-icons/fa";
    import {useNavigate} from "react-router-dom";
    import "../../../index.css"



    const BaseButton = ({ text, courseID, goesTo, className, disabled, onClick, type = "button" }) => {
        const navigate = useNavigate();

        return (
            <button
                type={type}
                onClick={event => {
                    if (onClick) {
                        onClick(event); // Use the custom onClick handler if provided
                    } else {
                        navigate(`/course/${courseID}/${goesTo}`); // Default navigation behavior
                    }
                }}
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
            // onClick={event => {navigate(`/course/${courseID}`)}}
            courseID={courseID}
        goesTo=""
        />
    );

    const AddButton = ({ courseID, onClick }) => (
        <BaseButton
            text={<FaPlus/>}
            className="text-gray-500 hover:text-black py-0 align-middle pt-1"
            courseID={courseID}
            onClick={onClick}
        />
    );

    const EditButton = ({ courseID, onClick }) => (
        <BaseButton
            text={<FaPenSquare/>}
            className="text-gray-500 hover:text-black"
            courseID={courseID}
            onClick={onClick}
        />
    );

    const RemoveButton = ({ courseID, onClick }) => (
        <BaseButton
            text={<FaTrash/>}
            className="text-gray-500 hover:text-black"
            courseID={courseID}
            onClick={onClick}
        />
    );

    const BellButton = ({ courseID, onClick }) => (
        <BaseButton
            text={<FaBell/>}
            className="text-gray-500 hover:text-black"
            courseID={courseID}
            onClick={onClick}
        />
    );

    export { AccessButton, AddButton, EditButton, RemoveButton, BellButton };