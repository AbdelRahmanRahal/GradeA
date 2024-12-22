import React from 'react';
import {AccessButton, EditButton, RemoveButton} from "../../coursesList/components/ButtonA.jsx";
import { FaVideo, FaLink, FaExclamationCircle, FaCircleNotch } from "react-icons/fa";

const Entry = ({entryData, role, onEditEntry, onRemoveEntry}) => {
    return (
        <section className='py-4 min-w-full'>
            <div>
                <div>
                    {entryData.type === "link" && entryData.url.includes('youtube.com') &&
                        <h2 className='text-2xl font-bold h-12 mt-2 ml-5 flex'><FaVideo className={`mt-1 mr-2`} />{entryData.title}</h2> }
                    {entryData.type === "link" && !entryData.url.includes('youtube.com') &&
                        <h2 className='text-2xl font-bold h-12 mt-2 ml-5 flex'><FaLink className={`mt-1 mr-2`} />{entryData.title}</h2> }
                    {entryData.type === "text" &&
                        <h2 className='text-2xl font-bold h-12 mt-2 ml-5 flex'><FaCircleNotch className={`mt-1 mr-2`} />{entryData.title}</h2> }
                    {entryData.type === "assignment" &&
                        <h2 className='text-2xl font-bold h-12 mt-2 ml-5 flex'><FaExclamationCircle className={`mt-1 mr-2`} />{entryData.title}</h2> }
                    <div>
                        <p className='mt-2 ml-6 min-h-12'>
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
                                className={`ml-8 mb-6`}
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
                            <p className={`ml-6`}>Due Date: {entryData.dueDate}</p>
                        )}
                    {role === 'professor' &&
                        <div className="flex gap-2 mt-3">
                            <EditButton onClick={onEditEntry}/>
                            <RemoveButton onClick={onRemoveEntry}/>
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