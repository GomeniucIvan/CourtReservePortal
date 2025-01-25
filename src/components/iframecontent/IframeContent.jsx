import React, { useEffect, useRef, useState } from 'react';
import {isNullOrEmpty} from "../../utils/Utils.jsx";
import {Skeleton} from "antd";
import {useApp} from "@/context/AppProvider.jsx";

function IframeContent({ content, id }) {
    const iframeRef = useRef(null);
    const [iframeHeight, setIframeHeight] = useState('150px');
    const [isLoading, setIsLoading] = useState(true);
const{token} = useApp();

    useEffect(() => {
        const iframe = iframeRef.current;
        if (iframe) {
            iframe.onload = () => {
                setIframeHeight(iframe.contentWindow.document.body.scrollHeight + 'px');
                setIsLoading(false);
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
        <>
            {isLoading &&
                <Skeleton.Button block active={true} style={{height : `350px`}} />
            }
            <iframe
                ref={iframeRef}
                title={`content-${id}`}
                sandbox="allow-scripts allow-same-origin"
                style={{
                    border: 'none',
                    width: '100%',
                    height: iframeHeight,
                    backgroundColor: 'white',
                    borderRadius: `${token.borderRadius}px`,
                    padding: `${token.paddingXS}px`
                }}
                srcDoc={styledContent}
            />
        </>
    );
}

export default IframeContent;