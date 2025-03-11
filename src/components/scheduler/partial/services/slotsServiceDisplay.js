"use client";
import * as React from "react";
import { MS_PER_DAY } from "@progress/kendo-date-math";
import { MS_PER_MINUTE } from "../constants/index.mjs";


export const toSlots = (_dateRange, { step }, { groups, ranges }) => {
    const slots = [];


    groups.forEach((group) => {
        ranges.forEach((range) => {
            const viewStart = range.zonedStart;
            const viewEnd = range.zonedEnd;

            const offset = (viewEnd.timezoneOffset - viewStart.timezoneOffset);

            for (
                let current = viewStart.clone(), index = 0, deficiency = offset < 0 ? offset * MS_PER_MINUTE * -1 : 0;
                current.getTime() < viewEnd.getTime();
                index++, current = current.addTime(step)
            ) {
                const _ref = React.createRef();

                const zonedStart = current.clone();
                const zonedEnd = current.addTime(step);

                const difference = (zonedEnd.timezoneOffset - zonedStart.timezoneOffset) * MS_PER_MINUTE;
                const canFill = step <= Math.abs(difference);

                if (deficiency && canFill) {
                    deficiency -= step;
                    current = current.addTime(-step);
                }

                const start = new Date(zonedStart.getTime());
                const end = new Date(zonedEnd.getTime());

                const slot = {
                    _ref,
                    index,

                    end,
                    start,

                    zonedStart,
                    zonedEnd,

                    range,
                    group,
                    items: [],

                    isAllDay: MS_PER_DAY <= step
                };

                slots.push(slot);
            }
        });
    });

    return slots;
};
