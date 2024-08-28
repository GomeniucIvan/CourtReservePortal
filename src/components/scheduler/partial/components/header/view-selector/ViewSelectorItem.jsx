import * as React from "react";
import { useLocalization } from "../../../intl/index.mjs";
import { useSchedulerActiveViewContext } from "../../../context/SchedulerContext.mjs";

export const ViewSelectorItem = (props) => {
    const [activeViewName, setActiveViewName] = useSchedulerActiveViewContext();
    const localization = useLocalization();

    const title = React.useMemo(
        () => typeof props.view.title === 'function'
            ? props.view.title.call(undefined, localization)
            : props.view.title,
        [props.view.title, localization]);

    const handleClick = React.useCallback(
        () => { if (props.view.name) { setActiveViewName(props.view.name); } },
        [setActiveViewName, props.view.name]
    );

    return (<></>)
    
    // return (
    //     <Button
    //         className='k-toolbar-button'
    //         role="button"
    //         type="button"
    //         tabIndex={-1}
    //         togglable={true}
    //         selected={props.view.name === activeViewName}
    //         onClick={handleClick}
    //     >
    //         {title}
    //     </Button>
    // );
};
