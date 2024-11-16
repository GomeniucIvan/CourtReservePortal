import { useApp } from "../../context/AppProvider.jsx";

function PaddingBlock({ children, topBottom = false, leftRight = true, onlyBottom = false, onlyTop = false,headerSearch = false }) {
    const { token } = useApp();

    const paddingTopBottom = topBottom ? token.padding : 0;
    const paddingLeftRight = leftRight ? token.padding : 0;

    const paddingBottom = onlyBottom ? token.padding : paddingTopBottom;
    let paddingTop = onlyTop ? token.padding : paddingTopBottom;

    if (headerSearch){
        paddingTop = token.paddingSM;
    }
    
    return (
        <div
            style={{
                padding: `${paddingTop}px ${paddingLeftRight}px ${paddingBottom}px ${paddingLeftRight}px`
            }}
        >
            {children}
        </div>
    );
}

export default PaddingBlock;