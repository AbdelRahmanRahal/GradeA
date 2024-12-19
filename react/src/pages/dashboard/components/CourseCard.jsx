import { Link } from 'react-router-dom';
import {useState} from "react";

const CourseCard = ({title, description, image}) => {
    const [showFullDescription, setShowFullDescription] = useState(false);

    if (!showFullDescription) {
        description = description.substring(0, 40) + '...';
    }

    return (
        <button className='py-4 w-80'>
            <div className='container-xl lg:container m-auto rounded-lg transition-all duration-200 hover:bg-gray-300'>
                {image && (
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-48 object-cover rounded-md "
                    />
                )}
                <div className={`p-6 rounded-lg shadow-md`}>
                    <h2 className='text-2xl font-bold h-16'>{title}</h2>
                    {/*<p className='mt-2 mb-4 min-h-16'>*/}
                    {/*    {description}*/}
                    {/*    <button*/}
                    {/*        onClick={() => setShowFullDescription((prevState) => !prevState)}*/}
                    {/*        className={`text-indigo-500 mb-5 hover:text-indigo-600 ${description.length > 40 ? "": "hidden"}`}*/}
                    {/*    >*/}
                    {/*        {showFullDescription ? 'Less' : 'More'}*/}
                    {/*    </button>*/}
                    {/*</p>*/}
                    {/*<Link*/}
                    {/*    to='/'*/}
                    {/*    className='inline-block bg-black text-white rounded-lg px-4 py-2 mt-6 hover:bg-gray-700'*/}
                    {/*>*/}
                    {/*    Access Course*/}
                    {/*</Link>*/}
                </div>
            </div>
        </button>
    );
};
export default CourseCard;
