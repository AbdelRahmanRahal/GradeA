import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ViewAllButton = () => {
    const navigate = useNavigate();

    return (
        <button className='min-h-max w-16 flex items-center justify-center p-2 rounded-lg shadow-md transition-all duration-200 text-gray-700 hover:text-black bg-gray-200 hover:bg-gray-300'
        onClick={() => {navigate("/courses")}}>
            <div className='container-xl lg:container m-auto'>
                        <h2 className='text-2xl font-bold content-center items-center ml-1'><FaArrowRight/></h2>
            </div>
        </button>
);
};
export default ViewAllButton;
