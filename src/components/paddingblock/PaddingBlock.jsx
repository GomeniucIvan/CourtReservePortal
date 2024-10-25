import { useApp } from "../../context/AppProvider.jsx";

function PaddingBlock({ children, topBottom = false, leftRight = true, onlyBottom = false, onlyTop = false }) {
    const { token } = useApp();

    const paddingTopBottom = topBottom ? token.padding : 0;
    const paddingLeftRight = leftRight ? token.padding : 0;

    const paddingBottom = onlyBottom ? token.padding : paddingTopBottom;
    const paddingTop = onlyTop ? token.padding : paddingTopBottom;

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