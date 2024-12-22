const CourseCard = ({title, image}) => {

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
                </div>
            </div>
        </button>
    );
};
export default CourseCard;
