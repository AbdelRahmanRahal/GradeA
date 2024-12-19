import React from 'react';
import { FaPlus } from "react-icons/fa";
import {useNavigate} from "react-router-dom";
import "../../../index.css"

const AddCourseButton = () => {
    const navigate = useNavigate();

    return (
        <button
            type='button'
            onClick={event => {navigate(`/courses/addCourse`)}}
            className={`py-2 px-3 text-xl transition-all ${className}`}
        >
            {text}
        </button>
    );
};

export { AddCourseButton };