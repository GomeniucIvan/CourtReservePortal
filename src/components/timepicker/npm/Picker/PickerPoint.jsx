import React from 'react';
import PropTypes from 'prop-types';
import {
    getTimePickerInlineRotateStyle,
    getTimePickerRotateStyle,
    timePickerDisableMouseDown
} from '../utils/drag';

const propTypes = {
    index: PropTypes.number,
    angle: PropTypes.number,
    onClick: PropTypes.func,
    pointClass: PropTypes.string,
};

const PickerPoint = (props) => {
    const {
        index = 0,
        angle = 0,
        onClick,
        pointClass = 'picker_point point_outter',
        pointerRotate,
    } = props;
    const inlineStyle = getTimePickerInlineRotateStyle(angle);
    const wrapperStyle = getTimePickerRotateStyle(-angle);

    return (
        <div
            style={inlineStyle}
            className={pointClass}
            onClick={() => {
                let relativeRotate = angle - (pointerRotate % 360);
                if (relativeRotate >= 180) {
                    relativeRotate -= 360;
                } else if (relativeRotate < -180) {
                    relativeRotate += 360;
                }
                onClick && onClick({
                    time: index,
                    pointerRotate: relativeRotate + pointerRotate
                });
            }}
            onMouseDown={timePickerDisableMouseDown}
        >
            <div className="point_wrapper" style={wrapperStyle}>
                {index}
            </div>
        </div>
    );
};

PickerPoint.propTypes = propTypes;

export default PickerPoint;
