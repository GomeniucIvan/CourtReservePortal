import { ReactSVG } from 'react-svg'
import {equalString, isNullOrEmpty, toBoolean} from "../../utils/Utils.jsx";
import {useApp} from "../../context/AppProvider.jsx";

const SGV = ({ icon, color = 'black', size = '24', style= '', preventFill = false, preventStroke = true, replaceColor = false }) => {
    const {token} = useApp();
    
    return (
        <ReactSVG
            src={`/svg/${icon}.svg`}
            beforeInjection={(svg) => {
                if (isNullOrEmpty(style)) {
                    svg.setAttribute('style', `width: ${size}px; height: ${size}px;display:flex;`);
                } else {
                    svg.setAttribute('style', style);
                }

                svg.removeAttribute('width');
                svg.removeAttribute('height');
                const paths = svg.querySelectorAll('path');

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

                        // const pathD = path.getAttribute('d');
                        // const targetText = "124.185L70.365";
                        // if (pathD && pathD.includes(targetText)) {
                        //
                        //     const currentFill = path.getAttribute('fill');
                        //     console.log(`Specific path's fill color: ${currentFill}`);
                        //     console.log(`Matching path 'd' attribute: ${pathD}`);
                        // }
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
            }}
        />
    )
}

export default SGV;
