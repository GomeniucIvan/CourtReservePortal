import {ReactSVG} from "react-svg";
import {equalString, isNullOrEmpty, toBoolean} from "../../utils/Utils.jsx";
import {useApp} from "../../context/AppProvider.jsx";
import {memo, useEffect, useState} from "react";

const svgCache = new Map(); // Global cache to store SVGs

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
                                                pathFillColor}) => {
    
    const [svgContent, setSvgContent] = useState(svgCache.get(icon) || null);
    const {token} = useApp();

    if (equalString(color, 'black')) {
        color = token.colorText;
    }

    useEffect(() => {
        if (!svgCache.has(icon)) {
            fetch(`/svg/${icon}.svg`)
                .then(res => res.text())
                .then(data => {
                    svgCache.set(icon, data);
                    setSvgContent(data);
                })
                .catch(err => console.error("Failed to load SVG:", err));
        }
    }, [icon]);

    return svgContent ? (
        <ReactSVG
            src={`data:image/svg+xml,${encodeURIComponent(svgContent)}`}
            beforeInjection={(svg) => {
                if (isNullOrEmpty(style)) {
                    svg.setAttribute('style', `width: ${size}px; height: ${size}px;display:flex;`);
                } else {
                    svg.setAttribute('style', style);
                }

                svg.removeAttribute('width');
                svg.removeAttribute('height');
                const paths = svg.querySelectorAll('path');
                const rects = svg.querySelectorAll('rect');
                const circles = svg.querySelectorAll('circle');

                if (!isNullOrEmpty(pathFillColor)) {
                    paths.forEach(path => {
                        path.setAttribute('fill', pathFillColor);
                    });
                }

                if (!preventPaths) {
                    paths.forEach(path => {
                        if (replaceColor){
                            const currentFill = path.getAttribute('fill');

                            if (equalString(currentFill, '#66C949')){
                                path.setAttribute('fill', token.colorPrimary);
                            }

                            if (equalString(currentFill, '#E0F4DB')){
                                path.setAttribute('fill', token.colorPrimary);
                                path.setAttribute('fill-opacity', '0.4');
                            }
                        }

                        if (!toBoolean(preventFill)) {
                            path.setAttribute('stroke', 'transparent');
                            path.setAttribute('fill', color);
                            svg.setAttribute('fill', color);
                        }

                        if (!toBoolean(preventStroke)){
                            path.setAttribute('stroke', color);
                        }
                    });
                }

                if (!preventRects) {
                    rects.forEach(path => {
                        if (replaceColor){
                            path.setAttribute('fill', token.colorPrimary);
                        }

                        if (!toBoolean(preventFill)) {
                            path.setAttribute('stroke', 'transparent');
                            path.setAttribute('fill', color);
                            svg.setAttribute('fill', color);
                        }

                        if (!toBoolean(preventStroke)){
                            path.setAttribute('stroke', color);
                        }
                    });
                }

                if (!preventCircles) {
                    circles.forEach(path => {
                        if (replaceColor){
                            path.setAttribute('fill', token.colorPrimary);
                        }

                        if (!toBoolean(preventFill)) {
                            path.setAttribute('stroke', 'transparent');
                            path.setAttribute('fill', color);
                            svg.setAttribute('fill', color);
                        }

                        if (!toBoolean(preventStroke)){
                            path.setAttribute('stroke', color);
                        }
                    });
                }
            }}
        />
    ) : null;
});

export default SuspenseSGVExpensiveComponent;