import React from 'react';
import {AccessButton, EditButton, RemoveButton} from "../../coursesList/components/ButtonA.jsx";
import { FaVideo, FaPenSquare, FaExclamationCircle } from "react-icons/fa";

const Entry = ({entryData, role}) => {
    return (
        <section className='py-4 min-w-full'>
            <div>
                <div>
                    <h2 className='text-2xl font-bold h-12 mt-2 ml-5'>{entryData.title}</h2>
                    <div>
                        <p className='mt-2 mb-4 ml-6 min-h-12'>
                            {entryData.type === "text" ? entryData.content : entryData.description}
                        </p>
                    </div>
                    {(entryData.type) === "link" && !entryData.url.includes('youtube.com') &&
                        (
                            <a className={`ml-8 text-blue-800 underline`}
                                href={entryData.url} target="_blank" rel="noopener noreferrer">
                        {entryData.url}</a>
                        )}
                    {(entryData.type) === "link" && entryData.url.includes('youtube.com') &&
                        (
                            <iframe
                                width="560"
                                height="315"
                                src={`https://www.youtube.com/embed/${getYouTubeVideoId(entryData.url)}`}
                                title={entryData.title}
                                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen>
                            </iframe>
                        )}
                    {(entryData.type) === "assignment" &&
                        (
                            <p>Due Date: {entryData.dueDate}</p>
                        )}
                    {role === 'instructor' &&
                        <div className="flex gap-2">
                            <EditButton/>
                            <RemoveButton/>
                        </div>
                    }
                </div>
                <div className="ml-auto ">
                </div>
            </div>
        </section>
    );
};

const getYouTubeVideoId = (url) => {
    const videoId = url.match(/[\\?\\&]v=([^\\?\\&]+)/);
    return videoId && videoId[1] ? videoId[1] : '';
};

export default Entry;