import * as React from "react";
import { classNames } from "@progress/kendo-react-common";

export const SchedulerViewSelector = React.forwardRef((
    props,
    ref
) => {
    const {
        className,
        ...other
    } = props;

    const element = React.useRef(null);

    React.useImperativeHandle(ref, () => ({ element: element.current, props }));

    return (<>
        
        </>)
    
    // return (
    //     <ToolbarItem
    //         ref={(item) => { if (item) { element.current = item.element; } }}
    //         className={classNames('k-scheduler-views', className)}
    //         {...other}
    //     >
    //         {props.children}
    //     </ToolbarItem>
    // );
});

SchedulerViewSelector.displayName = 'KendoReactSchedulerViewSelector';
