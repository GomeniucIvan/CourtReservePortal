
import {lazy, Suspense} from "react";
const SuspenseSGVExpensiveComponent = lazy(() => import('./SuspenseSGVExpensiveComponent'));

//todo make fallback display skeleton with size width and height
const SGV = ({
                 icon,
                 color = 'black',
                 size = 24,
                 style = '',
                 preventFill = false,
                 preventStroke = true,
                 replaceColor = false,
                 preventPaths = false,
                 preventRects = true,
                 preventCircles = true,
                 pathFillColor
             }) => {
    return (
        <Suspense fallback={<></>}>
            <SuspenseSGVExpensiveComponent
                icon={icon}
                color={color}
                size={size}
                style={style}
                preventFill={preventFill}
                preventStroke={preventStroke}
                replaceColor={replaceColor}
                preventPaths={preventPaths}
                preventRects={preventRects}
                preventCircles={preventCircles}
                pathFillColor={pathFillColor}
            />
        </Suspense>
    );
};

export default SGV;
