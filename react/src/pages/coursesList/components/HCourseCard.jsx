import { AccessButton, RemoveButton, EditButton } from "./ButtonA.jsx";
const HCourseCard = ({title, description, image, role}) => {

    return (
        <section className='py-4 min-w-full'>
            <div className='flex container-xl lg:container m-auto min-w-full gap-6 rounded-lg shadow-md transition-all hover:bg-gray-100 overflow-hidden'>
                {image && (
                    <img
                        src={image}
                        alt={title}
                        className="h-48 object-cover"
                    />
                )}
                <div>
                    <button className='text-2xl font-bold h-12 mt-2'>{title}</button>
                    <div>
                        <p className='mt-2 mb-4 min-h-12'>
                            {description}
                        </p>
                    </div>
                    {role === 'instructor' &&
                    <div className="flex gap-2">
                        <EditButton/>
                        <RemoveButton/>
                    </div>
                    }
                </div>
                <div className="ml-auto ">
                    <AccessButton/>
                </div>
            </div>
        </section>
    );
};
export default HCourseCard;
