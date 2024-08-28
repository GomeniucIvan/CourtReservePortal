import * as React from "react";
import { useControlledState } from "../hooks/useControlledState.mjs";
import { findMaster } from "../utils/index.jsx";
import { DATA_ACTION } from "../constants/index.mjs";
import { useSchedulerFieldsContext, useSchedulerDataContext } from "../context/SchedulerContext.mjs";
import { SchedulerEditTaskContext } from "../context/SchedulerEditTaskContext.mjs";
import { useEditable } from "../hooks/useEditable.mjs";

export const SchedulerEditTask = React.forwardRef((
    props,
    ref
) => {
    const {
        _ref,
        onDataAction,

        viewTask: viewTaskProp,

        removeDialog: propRemoveDialog,
        removeItem: propRemoveItem,
        onRemoveItemChange,

        occurrenceDialog: propOccurrenceDialog,
        showOccurrenceDialog: propShowOccurrenceDialog,
        onShowOccurrenceDialogChange,

        showRemoveDialog: propShowRemoveDialog,
        onShowRemoveDialogChange,

        ...taskProps
    } = props;

    const viewTask = React.useRef(null);

    React.useImperativeHandle(viewTask, () => ({ props, element: viewTask.current && viewTask.current.element }));
    React.useImperativeHandle(_ref, () => viewTask.current);
    React.useImperativeHandle(ref, () => viewTask.current);

    const VieTask = viewTaskProp || schedulerEditTaskDefaultProps.viewTask;
    const OccurrenceDialog = propOccurrenceDialog || schedulerEditTaskDefaultProps.occurrenceDialog;
    const RemoveDialog = propRemoveDialog || schedulerEditTaskDefaultProps.removeDialog;

    const editable = useEditable(props.editable);
    const fields = useSchedulerFieldsContext();

    const [data, dispatchData] = useSchedulerDataContext();

    const [series, setSeries] = React.useState<boolean | null>(null);
    const [removeItem, setRemoveItem]
        = useControlledState<DataItem | null>(null, propRemoveItem, onRemoveItemChange);
    const [showRemoveDialog, setShowRemoveDialog]
        = useControlledState<boolean>(false, propShowRemoveDialog, onShowRemoveDialogChange);
    const [showOccurrenceDialog, setShowOccurrenceDialog]
        = useControlledState<boolean>(false, propShowOccurrenceDialog, onShowOccurrenceDialogChange);

    const handleRemoveClick = React.useCallback(
        (event) => {
            if (!editable.remove) { return; }

            setRemoveItem(props.dataItem, event);

            if (props.isRecurring) {
                setShowOccurrenceDialog(true, event);
            } else {
                setShowRemoveDialog(true, event);
            }
        },
        [
            setRemoveItem, props.dataItem,
            props.isRecurring,
            setShowOccurrenceDialog,
            setShowRemoveDialog
        ]
    );

    const handleCancel = React.useCallback(
        (event) => {
            setSeries(null);
            setRemoveItem(null, event);
            setShowRemoveDialog(false, event);
            setShowOccurrenceDialog(false, event);
        },
        [
            setSeries,
            setRemoveItem,
            setShowRemoveDialog,
            setShowOccurrenceDialog
        ]
    );

    const handleRemoveConfirm = React.useCallback(
        (event) => {
            if (onDataAction && removeItem) {
                onDataAction.call(undefined, {
                    type: DATA_ACTION.remove,
                    series,
                    dataItem: removeItem
                });
            }

            setRemoveItem(null, event);
            setShowRemoveDialog(false, event);
        },
        [
            removeItem,
            dispatchData,
            setShowRemoveDialog
        ]
    );

    const handleRemoveItemChange = React.useCallback(
        (value, event) => {
        if (!setRemoveItem) { return; }

        setRemoveItem(value, event);
    },
    [setRemoveItem]
);

    const handleRemoveDialogChange = React.useCallback(
        (value, event) => {
        if (!setShowRemoveDialog) { return; }

        setShowRemoveDialog(value, event);
    },
    [setShowRemoveDialog]
);

    const handleOccurrenceDialogChange = React.useCallback(
        (value, event) => {
        if (!setShowOccurrenceDialog) { return; }

        setShowOccurrenceDialog(value, event);
    },
    [setShowOccurrenceDialog]
);

    const handleOccurrenceClick = React.useCallback(
        (event) => {
            if (removeItem) {
                setSeries(false);
                setRemoveItem(props.dataItem, event);
                setShowRemoveDialog(true, event);
            }

            setShowOccurrenceDialog(false, event);
        },
        [
            setSeries,
            props.dataItem,
            removeItem,
            setRemoveItem,
            setShowRemoveDialog
        ]
    );

    const handleSeriesClick = React.useCallback(
        (event) => {
            if (removeItem) {
                setSeries(true);
                const dataItem = findMaster(removeItem, fields, data);

                setRemoveItem(dataItem, event);
                setShowRemoveDialog(true, event);
            }

            setShowOccurrenceDialog(false, event);
        },
        [
            fields,
            removeItem,
            setSeries,
            setRemoveItem,
            setShowRemoveDialog,
            setShowOccurrenceDialog
        ]
    );

    return (
        <SchedulerEditTaskContext
            remove={[removeItem, handleRemoveItemChange]}
            showRemoveDialog={[showRemoveDialog, handleRemoveDialogChange]}
            showOccurrenceDialog={[showOccurrenceDialog, handleOccurrenceDialogChange]}
        >
            <VieTask
                _ref={viewTask}
                {...taskProps}

                onRemoveClick={handleRemoveClick}
            />
            {(showOccurrenceDialog) && (<OccurrenceDialog
                dataItem={removeItem}
                isRemove={removeItem !== null}
                onClose={handleCancel}
                onOccurrenceClick={handleOccurrenceClick}
                onSeriesClick={handleSeriesClick}
            />)}
            {(showRemoveDialog) && (<RemoveDialog
                dataItem={removeItem}
                onClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleRemoveConfirm}
            />)}
        </SchedulerEditTaskContext>
    );
});

export const schedulerEditTaskDefaultProps = {
    viewTask: null,
    occurrenceDialog: null,
    removeDialog: null
};

SchedulerEditTask.displayName = 'KendoReactSchedulerEditTask';
