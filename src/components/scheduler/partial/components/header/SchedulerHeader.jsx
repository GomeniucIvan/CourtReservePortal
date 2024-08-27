import * as React from "react";
import { classNames } from "@progress/kendo-react-common";

export const SchedulerHeader = React.forwardRef((props, ref) => {
    const {
        className,
        ...other
    } = props;
    const element = React.useRef(null);
    const header = React.useRef(null);

    React.useImperativeHandle(header, () => ({ element: element.current, props }));
    React.useImperativeHandle(ref, () => header.current);

    const rootClassName = React.useMemo(() => classNames('k-scheduler-toolbar', className), [className]);

    return (<></>)
    
    // return (
    //     <Toolbar
    //         id={props.id}
    //         ref={(toolbar) => { if (toolbar) { element.current = toolbar.element; } }}
    //         className={rootClassName}
    //         {...other}
    //     >
    //         {props.children}
    //     </Toolbar>
    // );
});

SchedulerHeader.displayName = 'KendoReactSchedulerHeader';

