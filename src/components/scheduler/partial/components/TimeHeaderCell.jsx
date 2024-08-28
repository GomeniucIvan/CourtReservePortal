
import * as React from "react";
import { useInternationalization } from "../intl/index.mjs";
import { classNames } from "@progress/kendo-react-common";

export const TimeHeaderCell = React.forwardRef((props, ref) => {
  const {
    as: Component = timeHeaderCellDefaultProps.as,
    ...other
  } = props;

  const element = React.useRef(null);
  const target = React.useRef(null);
  const intl = useInternationalization();

  const className = React.useMemo(
      () => classNames('k-scheduler-cell k-heading-cell k-time-cell', props.className),
      [props.className]
  );

  React.useImperativeHandle(target, () => ({
    element: (element.current && element.current.element) ? element.current.element : element.current,
    props: props
  }));
  React.useImperativeHandle(ref, () => target.current);

  return (
      <Component
          // Consider using `react-is` to check if the component accepts a ref, to avoid console warning
          ref={Component !== timeHeaderCellDefaultProps.as ? undefined : element}
          {...other}
          className={className}
      >
        {intl.formatDate(
            props.date,
            props.format ? props.format : timeHeaderCellDefaultProps.format
        )}
      </Component>
  );
});

export const timeHeaderCellDefaultProps = {
  as: React.forwardRef(({ as, format, start, end, ...props }, ref) => <div {...props} ref={ref} />),
  format: 't'
};

TimeHeaderCell.displayName = 'KendoReactSchedulerTimeHeaderCell';