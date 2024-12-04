import {useApp} from "../../context/AppProvider.jsx";
import {useEffect, useRef, useState} from "react";
import {useStyles} from "./styles.jsx";
import {cx} from "antd-style";

function Sticky({children, disable, offset = 0, bottomBoundary = ''}) {
    const {token} = useApp();
    const stickyRef = useRef(null);
    const [isSticky, setIsSticky] = useState(false);
    const [isTopAbsolute, setIsTopAbsolute] = useState(false);
    const {styles} = useStyles();
    
    const containerRef = useRef(null);

    useEffect(() => {
        const container = document.getElementById('page-body');
        containerRef.current = container;

        const bottomBoundaryElement = bottomBoundary
            ? document.querySelector(bottomBoundary)
            : null;

        if (bottomBoundary && !bottomBoundaryElement) {
           
        }
        
        const handleScroll = () => {
            if (stickyRef.current && containerRef.current) {
                
                const stickyRect = stickyRef.current.getBoundingClientRect();
                const containerRect = containerRef.current.getBoundingClientRect();
                const containerScrollTop = containerRef.current.scrollTop;

                let boundaryTop = Infinity;
                if (bottomBoundaryElement) {
                    boundaryTop =
                        bottomBoundaryElement.getBoundingClientRect().top -
                        containerRect.top +
                        containerScrollTop;
                }

                const stickyTop = stickyRect.top - containerRect.top;
                const isSticky = stickyTop <= offset;
                const shouldStopSticky =
                    containerScrollTop + stickyRef.current.offsetHeight >= boundaryTop;
                
                if (shouldStopSticky) {
                    setIsTopAbsolute(true);
                    setIsSticky(false);
                } else if(isSticky) {
                    setIsTopAbsolute(false);
                    setIsSticky(true);
                } else{
                    setIsTopAbsolute(false);
                    setIsSticky(false);
                }
            }
        };

        container.addEventListener('scroll', handleScroll);
        return () => {
            container.removeEventListener('scroll', handleScroll);
        };
    }, [offset]);
    
    return (
        <div
            ref={stickyRef}
            className={cx((isSticky && !disable) && styles.sticky)}
        >
            {children}
        </div>
    )
}

export default Sticky
