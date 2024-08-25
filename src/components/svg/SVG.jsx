import { ReactSVG } from 'react-svg'
import {toBoolean} from "../../utils/Utils.jsx";

const SGV = ({ icon, color = 'black', size = '24', preventFill = false, preventStroke = true }) => {
    return (
        <ReactSVG
            src={`/svg/${icon}.svg`}
            beforeInjection={(svg) => {
                svg.setAttribute('style', `width: ${size}px; height: ${size}px;display:flex;`);
                svg.removeAttribute('width');
                svg.removeAttribute('height');
                const paths = svg.querySelectorAll('path');
                paths.forEach(path => {
                    if (!toBoolean(preventFill)) {
                        path.setAttribute('stroke', 'transparent');
                        path.setAttribute('fill', color);
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
