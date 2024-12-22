import React from 'react';

function Loading() {
    const dotStyle = {
        r: 'max(1vw, 11px)',
        cy: '50%',
        filter: 'saturate(2) opacity(0.85)',
        transformOrigin: 'center',
    };

    const keyframes = `
        @keyframes loader {
            0%, 100% {
                opacity: 0;
                transform: scale(1);
            }
            45%, 65% {
                opacity: 1;
                transform: scale(0.7);
            }
        }
    `;

    const delays = [0, 0.15, 0.3, 0.45, 0.6];

    return (
        <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
            <style>{keyframes}</style> {/* Inject keyframes */}
            <svg xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
                <g>
                    {delays.map((delay, index) => (
                        <circle
                            key={index}
                            cx={`${30 + index * 10}vw`} // Adjust cx dynamically
                            style={{
                                ...dotStyle,
                                animation: `loader 3s ease-in-out infinite`,
                                animationDelay: `${delay}s`,
                                opacity: 0,
                                stroke: 'white',
                                strokeWidth: '0.5px',
                                fill: 'var(--color, #e01f33)', // Fallback for --color
                            }}
                        />
                    ))}
                </g>
            </svg>
        </div>
    );
}

export default Loading;
