import React, { useEffect, useRef, useState } from 'react';

function IframeContent({ content, id }) {
    const iframeRef = useRef(null);
    const [iframeHeight, setIframeHeight] = useState('150px');

    useEffect(() => {
        const iframe = iframeRef.current;
        if (iframe) {
            iframe.onload = () => {
                setIframeHeight(iframe.contentWindow.document.body.scrollHeight + 'px');
            };
        }
    }, [content]);

    const styledContent = `
        <style>
            body { margin: 0;overflow: hidden; }
            img {
                max-width: 100% !important;
                height: auto;
            }
        </style>
        ${content}
    `;
    
    return (
        <iframe
            ref={iframeRef}
            title={`content-${id}`}
            sandbox="allow-scripts allow-same-origin"
            style={{ border: 'none', width: '100%', height: iframeHeight }}
            srcDoc={styledContent}
        />
    );
}

export default IframeContent;