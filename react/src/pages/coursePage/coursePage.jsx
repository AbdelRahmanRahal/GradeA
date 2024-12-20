import React, {useEffect, useState} from 'react';
import { useLoading } from '../../context/LoadingContext';
import { useParams } from 'react-router-dom';
import { fetchRole } from '../../utils/CacheWorkings.jsx';
import Section from './components/section.jsx';

const CoursePage = () => {
    const { id } = useParams();
    const { setLoading } = useLoading();
    const [role, setRole] = useState("student");
    const [data, setData] = useState(null);

    useEffect(() => {
        const getRole = async () => {
            const role = await fetchRole();
            setRole(role);};
        getRole();

        const fetchCourseData = async () => {
            setLoading(true);

            try {
                const response = await fetch(`/api/course/${id}`);
                if (response.ok) {
                    const courseData = await response.json();
                    setData(courseData); // Set course data
                } else {
                    console.error('Failed to fetch course data');
                }
            } catch (error) {
                console.error('Error fetching courses:', error);
            } finally {
                setLoading(false); // Ensure loading state is stopped after fetching
            }
        };

        fetchCourseData(); // Call the async function to fetch data
    }, [id, setLoading]);


    return (
        <div className="min-h-screen bg-gray-100">
            {data && (<h1 className={`min-w-full bg-red-600 text-white text-center text-5xl min-h-16`}>{data.name}</h1>)}
            <main className="p-6">
                {data ? (
                    <div className="flex flex-col gap-y-6">
                        {data.sections.length > 0 ? data.sections.map((section) => (
                            <Section
                                key={section.id}
                                sectionData={section}
                                role={role}></Section>
                        )) : (<h2>No entries available, issue is in coursePage.</h2>)}
                    </div>) : (<h2>No data found.</h2>)}
            </main>
        </div>
    );
};

export default CoursePage;