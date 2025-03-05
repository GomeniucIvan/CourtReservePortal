import {lazy, Suspense} from "react";
import {useApp} from "@/context/AppProvider.jsx";
import {isNullOrEmpty} from "@/utils/Utils.jsx";
const SuspenseSGVExpensiveComponent = lazy(() => import('./SuspenseSGVExpensiveComponent'));

//todo make fallback display skeleton with size width and height
const SGV = ({
                 icon,
                 color,
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

    const {token} = useApp();
    
    if (isNullOrEmpty(color)) {
        color = token.colorText;
    }

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
