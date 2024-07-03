/**
 * client/src/components/Media.tsx
 *
 * Opportunities:
 *  - Validation to ensure `mediaUrl` and `mediaType` are strings
 *  - Image lazy loading
 * Test cases:
 *  - Various media types are handled correctly
 */
import React from "react";

interface MediaProps {
    mediaUrl: string;
    mediaType: string;
}

const Media: React.FC<MediaProps> = ({ mediaUrl, mediaType }) => {
    return (
        <div className="media">
            <img className="img-img" src={mediaUrl} alt={mediaType} />
        </div>
    );
};

export default Media;
