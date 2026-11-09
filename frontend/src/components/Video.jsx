import React, { useEffect, useState } from "react";

function Video({ src, poster }) {
    const [mediaError, setMediaError] = useState(false);

    useEffect(() => {
        setMediaError(false);
    }, [src]);

    return (
        <>
            <video
                key={src || "video"}
                poster={poster}
                controls
                playsInline
                preload="metadata"
                onError={() => setMediaError(true)}
                className="sm:h-[68vh] sm:max-w-4xl h-64 w-full object-contain"
            >
                {src && <source src={src} type="video/mp4" />}
                Your browser does not support MP4 video playback.
            </video>
            {!src && (
                <p className="p-4 text-sm text-red-400">
                    Video URL is unavailable. Please refresh and try again.
                </p>
            )}
            {mediaError && (
                <p className="p-4 text-sm text-red-400">
                    This video could not be played. Please refresh and try again.
                </p>
            )}
        </>
    );
}

export default Video;
