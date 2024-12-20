import React from 'react';
import Entry from './Entry';

const Section = ({sectionData, role}) => {
    return (
        <div
            className='flex-col container-xl lg:container m-auto min-w-full gap-6 rounded-lg border border-black shadow-md transition-all hover:bg-gray-100 overflow-hidden'>
            <h2 className={`text-2xl m-4 font-bold`}>{sectionData.title}</h2>
            <div className="border-t-2 border-gray-600"></div>
            {sectionData.entries.length > 0 ? sectionData.entries.map((entry, index) => (
                <dev>
                    <Entry
                        key={index}
                        entryData={entry}
                        role={role}></Entry>
                    <div className="border-t-2 border-gray-600"></div>
                </dev>
            )) : (<h2>No entries available. issue is in section. </h2>)}
        </div>
    );
};

export default Section;