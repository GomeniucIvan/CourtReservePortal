import * as React from "react";
import { useLocalization  } from "@progress/kendo-react-intl";
import { moreEvents, messages } from "../messages/index.mjs";
import {Button} from "antd";
import {MoreOutlined} from "@ant-design/icons";

export const ShowMoreItemsButton = React.forwardRef((props, ref) => {
    const btn = React.useRef(null);
    const element = React.useRef(null);

    const localization = useLocalization();

    React.useImperativeHandle(btn, () => ({
        element: element.current && element.current.element,
        ...props
    }));
    React.useImperativeHandle(ref, () => btn.current);

    const handleClick = React.useCallback(
        (syntheticEvent) => {
            if (!props.onClick || !btn.current) { return; }
            props.onClick.call(undefined, {
                target: btn.current,
                syntheticEvent
            });
        },
        [
            btn,
            props.slot,
            props.onClick
        ]
    );

    const moreEventsLabel = localization.toLanguageString(moreEvents, messages[moreEvents]);

    return (
        <Button
            ref={element}
            tabIndex={-1}
            className="k-more-events"
            onClick={handleClick}
            aria-label={moreEventsLabel}
            icon='more-horizontal'>
            <MoreOutlined />
        </Button>
    );
});

ShowMoreItemsButton.displayName = 'KendoReactSchedulerShowMoreItemsButton';