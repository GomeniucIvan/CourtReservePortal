import * as React from "react";
import { useLocalization} from "@progress/kendo-react-intl";
import { useWindow, classNames, IconWrap } from "@progress/kendo-react-common";
import { ViewSelectorItem } from "./ViewSelectorItem.jsx";
import { useSchedulerViewsContext, useSchedulerActiveViewContext } from "../../../context/SchedulerContext.mjs";


export const ViewSelectorList = React.forwardRef(() => {
    const element = React.useRef(null);
    const [media, setMedia] = React.useState('desktop');
    const views = useSchedulerViewsContext();
    const getWindow = useWindow(element);
    const [activeViewName, setActiveViewName] = useSchedulerActiveViewContext();

    const activeView = views.find((v) => v.props.name === activeViewName);
    const localization = useLocalization();

    const handleItemClick = React.useCallback(
        (event) => {
            console.log(event.item.name)
            if (!setActiveViewName) { return; }
            event.syntheticEvent.preventDefault();
            setActiveViewName(event.item.name);
        },
        [setActiveViewName]);

    const calculateMedia = () => {
        if(getWindow().matchMedia) {
            setMedia(getWindow().matchMedia('(min-width: 1024px)').matches
                ? 'desktop'
                : 'mobile');
        }
    };

    React.useEffect(() => {
        calculateMedia();

        const resizeObserver = (getWindow()).ResizeObserver;
        const observer = resizeObserver && new resizeObserver(calculateMedia);
        if(observer) {
            observer.observe(element.current);
        }

        return () => {
            if(observer) {
                observer.disconnect();
            }
        };
    }, []);

    return (
        <div
            className={classNames(
                'k-toolbar-button-group k-button-group k-button-group-solid',
                {
                    'k-scheduler-views': media === 'desktop',
                    'k-scheduler-tools': media === 'mobile'
                }
            )}
            role='group'
            ref={element}
        >
            {/*{(activeView && media === 'mobile') && (*/}
            {/*    <DropDownButton*/}
            {/*        className="k-views-dropdown"*/}
            {/*        onItemClick={handleItemClick}*/}
            {/*        popupSettings={{ popupClass: 'k-scheduler-toolbar' }}*/}
            {/*        textField="title"*/}
            {/*        items={views.map((v) => ({*/}
            {/*            ...v.props,*/}
            {/*            selected: v.props.name === activeViewName,*/}
            {/*            title:*/}
            {/*                typeof v.props.title === 'function'*/}
            {/*                    ? v.props.title.call(undefined, localization)*/}
            {/*                    : v.props.title*/}
            {/*        }))}*/}
            {/*        text={(*/}
            {/*            <React.Fragment>*/}
            {/*                {typeof activeView.props.title === 'function'*/}
            {/*                    ? activeView.props.title.call(undefined, localization)*/}
            {/*                    : activeView.props.title}*/}
            {/*                <IconWrap name="caret-alt-down" icon={caretAltDownIcon} />*/}
            {/*            </React.Fragment>*/}
            {/*        )}*/}
            {/*    />*/}
            {/*)}*/}
            {(media === 'desktop') && (
                <>
                    {views.map((view) => (
                        <ViewSelectorItem key={view.props.name} view={view.props} />
                    ))}
                </>
            )}
        </div>
    );
});

ViewSelectorList.displayName = 'KendoReactSchedulerViewSelectorList';
