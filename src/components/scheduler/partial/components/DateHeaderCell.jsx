import * as React from "react";
import { useInternationalization } from "@progress/kendo-react-intl";
import { classNames} from "@progress/kendo-react-common";

export const DateHeaderCell = React.forwardRef((props, ref) => {
  const {
    as: Component = dateHeaderCellDefaultProps.as,
    ...other
  } = props;

  const element = React.useRef(null);
  const target = React.useRef(null);
  const intl = useInternationalization();

  const className = React.useMemo(
      () => classNames('k-scheduler-cell k-heading-cell k-scheduler-date-heading', props.className),
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
          ref={Component !== dateHeaderCellDefaultProps.as ? undefined : element}
          {...other}
          className={className}
      >
        <span className="k-link k-nav-day">
          {intl.formatDate(
              props.date,
              props.format ? props.format: dateHeaderCellDefaultProps.format
          )}
        </span>
      </Component>
  );
});

export const dateHeaderCellDefaultProps = {
  as: React.forwardRef(({ as, format, start, end, ...props }, ref) => <div {...props} ref={ref} />),
  format: 'd'
};