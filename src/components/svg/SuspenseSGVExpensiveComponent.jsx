import {equalString, isNullOrEmpty, toBoolean} from "../../utils/Utils.jsx";
import {useApp} from "../../context/AppProvider.jsx";
import {memo, useEffect, useRef, useState} from "react";
import {useSvgCacheProvider} from "@/context/SvgCacheContext.jsx";

const SuspenseSGVExpensiveComponent = memo(({ icon,
                                                color = 'black',
                                                size = 24,
                                                style= '',
                                                preventFill = false,
                                                preventStroke = true,
                                                replaceColor = false,
                                                preventPaths = false,
                                                preventRects = true,
                                                preventCircles = true,
                                                pathFillColor,
                                                elementAttributes = {}}) => {

    const {token} = useApp();
    const {svgList} = useSvgCacheProvider();
    const svgContainerRef = useRef(null);  // Reference for the container
    
    
    if (equalString(color, 'black')) {
        color = token.colorText;
    }

    // Get the SVG content from cache (always executed)
    const svgData = svgList.find(v => equalString(icon, v.Icon));
    const svgContent = svgData ? svgData.Code : null;

    const applyAttributes = (elements, tag) => {
        const attrs = elementAttributes?.[tag];
        if (!attrs) return;

        elements.forEach(el => {
            Object.entries(attrs).forEach(([attr, value]) => {
                el.setAttribute(attr, value);
            });
        });
    };
    
    // Use `useEffect` to modify the SVG **after** rendering
    useEffect(() => {
        if (!svgContent || !svgContainerRef.current) return;

        const svg = svgContainerRef.current.querySelector("svg");
        if (!svg) return;

        if (!equalString(size, 'auto')) {
            svg.setAttribute('width', `${size}px`);
            svg.setAttribute('height', `${size}px`);
        }

        const paths = svg.querySelectorAll('path');
        const rects = svg.querySelectorAll('rect');
        const circles = svg.querySelectorAll('circle');
        
        if (!preventPaths) {
            paths.forEach(path => {
                if (replaceColor) {
                    const currentFill = path.getAttribute('fill');
                    if (equalString(currentFill, '#66C949')) {
                        path.setAttribute('fill', token.colorPrimary);
                    }
                    if (equalString(currentFill, '#E0F4DB')) {
                        path.setAttribute('fill', token.colorPrimary);
                        path.setAttribute('fill-opacity', '0.4');
                    }
                }

                if (!toBoolean(preventFill)) {
                    path.setAttribute('stroke', 'transparent');
                    path.setAttribute('fill', color);
                    svg.setAttribute('fill', color);
                }

                if (!toBoolean(preventStroke)) {
                    path.setAttribute('stroke', color);
                }
            });
        }

        if (!preventRects) {
            rects.forEach(rect => {
                if (replaceColor) {
                    rect.setAttribute('fill', token.colorPrimary);
                }

                if (!toBoolean(preventFill)) {
                    rect.setAttribute('stroke', 'transparent');
                    rect.setAttribute('fill', color);
                    svg.setAttribute('fill', color);
                }

                if (!toBoolean(preventStroke)) {
                    rect.setAttribute('stroke', color);
                }
            });
        }

        if (!preventCircles) {
            circles.forEach(circle => {
                if (replaceColor) {
                    circle.setAttribute('fill', token.colorPrimary);
                }

                if (!toBoolean(preventFill)) {
                    circle.setAttribute('stroke', 'transparent');
                    circle.setAttribute('fill', color);
                    svg.setAttribute('fill', color);
                }

                if (!toBoolean(preventStroke)) {
                    circle.setAttribute('stroke', color);
                }
            });
        }

        applyAttributes(paths, 'path');
        applyAttributes(rects, 'rect');
        applyAttributes(circles, 'circle');
        
    }, [svgContent, color, size]); // Keep dependencies consistent

    // If there's no SVG content, return `null` (instead of conditionally rendering hooks)
    if (!svgContent) return null;

    return (
        <div ref={svgContainerRef}
             dangerouslySetInnerHTML={{ __html: svgContent }}
             style={{
                 width: size,
                 height: size,
                 ...(typeof style === 'object' ? style : {}) // Ensure style is an object
             }} />
    );
});

export default SuspenseSGVExpensiveComponent;