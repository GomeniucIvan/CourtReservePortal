import * as React from "react";

export const SchedulerNavigation = React.forwardRef((props, ref) => {
    const {
        className,
        ...other
    } = props;

    const element = React.useRef(null);

    React.useImperativeHandle(ref, () => ({ element: element.current, props }));

    return (<></>)
    
    // return (
    //     <ToolbarItem
    //         ref={(item) => { if (item) { element.current = item.element; } }}
    //         className={classNames(className)}
    //         {...other}
    //     >
    //         {props.children}
    //     </ToolbarItem>
    // );
});

SchedulerNavigation.displayName = 'KendoReactSchedulerSchedulerNavigation';