import { useNavigate } from "react-router-dom";

const CourseCard = ({title, image, courseID}) => {
    const navigate = useNavigate();

    return (
        <button className='py-4 w-80'
        onClick={event => {navigate(`/course/${courseID}`)}}>
            <div className='container-xl lg:container m-auto rounded-lg transition-all duration-200 hover:bg-gray-300'>
                {image && (
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-48 object-fill aspect-card rounded-md "
                    />
                )}
                <div className={`p-6 rounded-lg shadow-md`}>
                    <h2 className='text-2xl font-bold h-16'>{title}</h2>
                </div>
            </div>
        </button>
    );
};
export default CourseCard;
