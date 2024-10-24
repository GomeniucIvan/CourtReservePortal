import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
    scheduler: css`
        .k-scheduler-layout {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            flex: 1 1 auto;
            position: relative;
            z-index: 1;
        }

        .k-scheduler-monthview  .k-scheduler-head{
            .k-scheduler-date-heading {
                height: 40px;
            }
        }
        
        .k-scheduler-layout-flex .k-scheduler-head {
            position: sticky;
            top: 0;
            z-index: 3;
        }

        .k-scheduler-layout-flex .k-scheduler-head, .k-scheduler-layout-flex .k-scheduler-body {
            display: flex;
            flex: 100%;
            flex-wrap: wrap;
        }

        .k-scheduler-layout-flex .k-scheduler-row {
            display: flex;
            flex: 1 1 100%;
            width: 100%;
            min-width: 0;
        }

        .k-scheduler-layout-flex .k-scheduler-cell.k-heading-cell {
            justify-content: center;
            width: 120px;
        }

        .k-scheduler .k-calendar .k-other-month {
            color: #666666;
            background-color: transparent;
        }

        .k-pane-wrapper .k-scheduler-edit-form .k-recur-view {
            padding: 0;
            flex-direction: column;
            align-items: stretch;
        }

        .k-pane-wrapper .k-scheduler-edit-form .k-recur-view > .k-listgroup-form-row {
            margin: 0;
        }

        .k-pane-wrapper .k-scheduler-edit-form .k-recur-items-wrap {
            width: 100%;
            margin-block: -1px;
            margin-inline: 0;
        }

        .k-pane-wrapper .k-scheduler-edit-form .k-scheduler-recur-end-wrap {
            white-space: nowrap;
        }

        .k-scheduler.k-scheduler-mobile {
            border-width: 0;
        }

        .k-scheduler-mobile th {
            font-weight: normal;
        }

        .k-scheduler-mobile .k-event:hover .k-resize-handle {
            visibility: hidden;
        }

        .k-scheduler-mobile .k-scheduler-toolbar {
            padding-block: 8px;
            padding-inline: 8px;
        }

        .k-scheduler-mobile .k-scheduler-toolbar > * {
            margin: 0;
        }

        .k-scheduler-mobile .k-scheduler-toolbar::before {
            display: none;
        }

        .k-scheduler-mobile .k-scheduler-toolbar .k-scheduler-navigation {
            width: 100%;
            display: flex;
            flex-flow: row nowrap;
            justify-content: space-between;
            margin: 0;
        }

        .k-scheduler-mobile .k-scheduler-toolbar .k-scheduler-navigation .k-nav-current {
            line-height: 1;
            display: flex;
            flex-flow: column nowrap;
            align-items: center;
            justify-content: space-evenly;
            gap: 0;
        }

        .k-scheduler-mobile .k-scheduler-toolbar .k-scheduler-views-wrapper .k-views-dropdown {
            display: inline-block;
        }

        .k-scheduler-mobile .k-scheduler-footer {
            padding-block: 8px;
            padding-inline: 8px;
            display: flex;
            justify-content: space-between;
        }

        .k-scheduler-mobile .k-scheduler-footer > * {
            margin: 0;
        }

        .k-scheduler-mobile .k-scheduler-footer::before {
            display: none;
        }

        .k-scheduler-mobile .k-scheduler-monthview .k-hidden {
            height: 40px;
        }

        .k-scheduler-mobile .k-scheduler-monthview .k-scheduler-table td {
            height: 40px;
            vertical-align: top;
            text-align: center;
        }

        .k-scheduler-mobile .k-scheduler-monthview .k-events-container {
            position: absolute;
            text-align: center;
            height: 6px;
            line-height: 6px;
        }

        .k-scheduler-mobile .k-scheduler-monthview .k-event {
            position: static;
            padding: 4px;
            border-radius: 50%;
            display: inline-block;
            width: 4px;
            height: 4px;
            min-height: 0;
            margin: 1px;
        }

        .k-scheduler-mobile .k-scheduler-dayview .k-mobile-header.k-mobile-horizontal-header .k-scheduler-times table tr:first-child {
            display: none;
        }

        .k-scheduler-mobile .k-scheduler-dayview .k-mobile-header .k-scheduler-header .k-scheduler-date-group {
            display: none;
        }

        .k-scheduler-mobile .k-scheduler-header-wrap > div {
            overflow: visible;
        }

        .k-scheduler-mobile .k-scheduler-agendaview .k-mobile-header {
            display: none;
        }

        .k-scheduler-mobile .k-scheduler-agendaview .k-scheduler-table {
            table-layout: auto;
        }

        .k-scheduler-mobile .k-scheduler-agendaview .k-scheduler-table .k-scheduler-groupcolumn {
            width: 1%;
        }

        .k-scheduler-mobile .k-scheduler-agendaview .k-scheduler-table td {
            white-space: normal;
        }

        .k-scheduler-mobile .k-mobile-header .k-scheduler-table td,
        .k-scheduler-mobile .k-mobile-header .k-scheduler-table th {
            height: 1.5em;
        }

        .k-scheduler-mobile .k-time-text,
        .k-scheduler-mobile .k-time-period {
            display: block;
            line-height: 1;
        }

        .k-scheduler-mobile .k-time-period {
            font-size: .7em;
        }

        .k-scheduler-mobile .k-scheduler-table td,
        .k-scheduler-mobile .k-scheduler-table th {
            height: 2em;
            vertical-align: middle;
        }

        .k-scheduler-mobile .k-scheduler-datecolumn-wrap {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .k-scheduler-mobile .k-task {
            display: flex;
            align-items: center;
            gap: .5em;
        }

        .k-scheduler-mobile .k-task .k-scheduler-mark {
            border-radius: 50%;
            margin: 0;
        }

        .k-scheduler-mobile .k-task .k-scheduler-task-text {
            flex: 1 1 0%;
        }

        .k-scheduler-mobile .k-scheduler-times .k-scheduler-group-cell,
        .k-scheduler-mobile .k-scheduler-times .k-scheduler-groupcolumn,
        .k-scheduler-mobile .k-scheduler-agenda .k-scheduler-group-cell,
        .k-scheduler-mobile .k-scheduler-agenda .k-scheduler-groupcolumn {
            vertical-align: top;
        }

        .k-scheduler-mobile .k-scheduler-times .k-scheduler-group-cell .k-scheduler-group-text,
        .k-scheduler-mobile .k-scheduler-times .k-scheduler-groupcolumn .k-scheduler-group-text,
        .k-scheduler-mobile .k-scheduler-agenda .k-scheduler-group-cell .k-scheduler-group-text,
        .k-scheduler-mobile .k-scheduler-agenda .k-scheduler-groupcolumn .k-scheduler-group-text {
            -ms-writing-mode: tb-lr;
            writing-mode: vertical-lr;
            transform: rotate(180deg);
            white-space: nowrap;
        }

        .k-scheduler-mobile .k-scrollbar-h tr + tr .k-scheduler-times {
            border-bottom-width: 0;
        }

        .k-scheduler {
            border: none;
            box-sizing: border-box;
            outline: 0;
            font-family: inherit;
            font-size: 14px;
            line-height: 1.4285714286;
            display: flex;
            flex-direction: column;
            position: relative;
            -webkit-touch-callout: none;
            background-color: ${token.colorBgBase};
        }

        .k-scheduler table,
        .k-scheduler thead,
        .k-scheduler tfoot,
        .k-scheduler tbody,
        .k-scheduler tr,
        .k-scheduler th,
        .k-scheduler td,
        .k-scheduler div,
        .k-scheduler .k-scheduler-edit-dialog,
        .k-scheduler > * {
            border-color: inherit;
        }

        kendo-scheduler.k-scheduler {
            overflow: hidden;
        }

        kendo-scheduler.k-scheduler.k-readonly-scheduler .k-event-delete {
            display: none;
        }

        .k-scheduler-table {
            width: 100%;
            max-width: none;
            border-collapse: separate;
            border-spacing: 0;
            table-layout: fixed;
        }

        .k-scheduler-table td,
        .k-scheduler-table th {
            padding-block: 8px;
            padding-inline: 8px;
            height: 1.4285714286em;
            overflow: hidden;
            white-space: nowrap;
            border-style: solid;
            border-width: 0 0 1px 1px;
            vertical-align: top;
            box-sizing: content-box;
        }

        .k-scheduler-table td:first-child,
        .k-scheduler-table th:first-child {
            border-left-width: 0;
        }

        .k-scheduler-table .k-middle-row td {
            border-bottom-style: dotted;
        }

        .k-scheduler-table .k-link {
            cursor: pointer;
        }

        .k-scheduler-layout-flex {
            overflow: auto;
        }

        .k-scheduler-layout-flex .k-scheduler-head {
            position: sticky;
            top: 0;
            z-index: 3;
        }

        .k-scheduler-layout-flex .k-scheduler-body {
            position: relative;
        }

        .k-header-resource {
            white-space: wrap !important;
            display: initial !important;
        }
        
        
        .k-scheduler-layout-flex .k-scheduler-head,
        .k-scheduler-layout-flex .k-scheduler-body {
            display: flex;
            flex: 100%;
            flex-wrap: wrap;
        }

        .k-scheduler-layout-flex .k-scheduler-row {
            display: flex;
            flex: 1 1 100%;
            width: 100%;
            min-width: 0;
        }

        .k-scheduler-layout-flex .k-scheduler-group {
            display: block;
            flex: 1 1 100%;
            width: 100%;
            min-width: 0;
            flex-wrap: wrap;
        }

        .k-scheduler-layout-flex .k-scheduler-group .k-group-cell {
            display: flex;
            flex: 1 1 auto;
            flex-wrap: wrap;
            overflow: auto;
        }

        .k-scheduler-layout-flex .k-scheduler-group .k-group-content {
            padding: 0;
            display: flex;
            flex: 1 1 100%;
            width: 100%;
            border-width: 0;
            flex-wrap: wrap;
        }

        .k-scheduler-layout-flex .k-scheduler-group.k-group-horizontal .k-group-cell {
            flex-basis: 100%;
            border-width: 0;
            padding: 0;
        }

        .k-scheduler-layout-flex.k-scheduler-timeline-view .k-scheduler-body .k-scheduler-cell {
            flex-basis: auto;
        }

        .k-scheduler-layout-flex .k-more-events {
            bottom: 2px;
            left: 0;
            width: 100%;
        }

        .k-scheduler-layout-flex {
            .k-scheduler-cell {
                display: flex;
                flex: 1 1 100%;
                padding: 0;
                min-height: 1.5em;
                overflow: hidden;
                white-space: nowrap;
                border-style: solid;
                border-width: 0 1px 1px 0;
                vertical-align: top;
                box-sizing: content-box;
                border-color: ${token.colorBorder};
                color: ${token.colorText};
            }
            
            .k-scheduler-eventcolumn,
            .k-scheduler-timecolumn,
            .k-scheduler-datecolumn {
                background-color: ${token.colorBgBase};
                color: ${token.colorText};
            }

            .k-scheduler-timecolumn {
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
            }
            
            .k-agenda-date-display {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                width: 100%;
            }
        }

        .k-scheduler-layout-flex .k-scheduler-cell.k-side-cell {
            position: sticky;
            justify-content: flex-end;
            flex-grow: 0;
            flex-basis: auto;
            overflow: visible;
            min-height: 40px;
            width: 80px;
            padding-right: 4px !important;
            padding-top: 4px !important;
            z-index: 2;
        }

        .k-current-time{
            position: absolute;
            background-color: red;
            z-index: 1;
        }
        
        .k-current-time.k-current-time-arrow-right{
            position: absolute;
            background-color: red;
            z-index: 2;
        }
        
        .k-scheduler-layout-flex .k-scheduler-cell.k-major-cell {
            border-bottom-width: 0;
        }

        .k-scheduler-layout-flex .k-middle-row .k-scheduler-cell {
            border-bottom-style: dotted;
        }

        .k-scheduler-layout-flex .k-resource-cell {
            flex: none;
            display: flex;
            flex-wrap: wrap;
            overflow: visible;
        }

        .k-scheduler-layout-flex .k-resource-content {
            display: flex;
            flex-wrap: wrap;
            padding: 0;
            border-width: 0;
        }

        .k-scheduler-layout-flex .k-sticky-cell {
            display: flex;
            flex-wrap: wrap;
            flex-basis: 0;
            position: sticky;
            left: 0;
            z-index: 3;
        }

        .k-scheduler-toolbar {
            padding: ${token.padding/2}px ${token.padding}px;
        }

        .k-scheduler-toolbar .k-widget {
            font-size: inherit;
        }

        .k-scheduler-toolbar .k-nav-current {
            color: inherit;
            outline: 0;
            text-decoration: none;
            display: inline-flex;
            flex-flow: row nowrap;
            align-items: center;
            gap: 4px;
            cursor: pointer;
        }

        .k-scheduler-toolbar .k-scheduler-search {
            display: inline-flex;
            flex-flow: row nowrap;
        }

        .k-scheduler-toolbar .k-views-dropdown {
            width: auto;
            font: inherit;
        }

        .k-scheduler-footer {
            box-shadow: none;
            border-width: 0;
            border-top-width: 1px;
            white-space: nowrap;
            flex-shrink: 0;
            position: relative;
        }

        .k-scheduler-layout {
            width: 100%;
            -webkit-flex: 0 1 auto;
            -ms-flex: 1 1 auto;
            border-top: 1px solid;
            border-color: ${token.colorBorder} !important;
            table-layout: fixed;
            display: grid;
        }

        .k-time-cell,
        .k-scheduler-cell.k-side-cell {
            padding-right: 4px !important;
            padding-top: 4px !important;
        }
        
        .k-time-cell,
        .k-side-cell {
            position: sticky;
            left: 0;
            background-color: ${token.colorBgBase};
            color: ${token.colorText};
            z-index: 1;
            font-size: 12px;
        }

        .k-header-resource, .k-scheduler-date-heading {
            background-color: ${token.colorBgBase};
            color: ${token.colorText};
        }
        
        .k-scheduler-layout > tbody > tr > td {
            padding: 0;
            vertical-align: top;
        }

        .k-scheduler-layout td.k-selected,
        .k-scheduler-layout .k-scheduler-cell.k-selected {
            outline: none;
        }

        .k-scheduler-layout tr + tr .k-scheduler-times tr th,
        .k-scheduler-layout .k-scheduler-pane + .k-scheduler-pane .k-scheduler-times tr th {
            border-bottom-color: transparent;
        }

        .k-scheduler-layout tr + tr .k-scheduler-times tr .k-slot-cell,
        .k-scheduler-layout tr + tr .k-scheduler-times tr .k-scheduler-times-all-day,
        .k-scheduler-layout tr + tr .k-scheduler-times tr:last-child th,
        .k-scheduler-layout .k-scheduler-pane + .k-scheduler-pane .k-scheduler-times tr .k-slot-cell,
        .k-scheduler-layout .k-scheduler-pane + .k-scheduler-pane .k-scheduler-times tr .k-scheduler-times-all-day,
        .k-scheduler-layout .k-scheduler-pane + .k-scheduler-pane .k-scheduler-times tr:last-child th {
            border-bottom-color: inherit;
        }

        .k-scheduler-layout.k-scheduler-flex-layout {
            display: flex;
            flex-direction: column;
        }

        .k-scheduler-layout.k-scheduler-flex-layout.k-scheduler-weekview .k-scheduler-pane:first-child .k-scheduler-table, .k-scheduler-layout.k-scheduler-flex-layout.k-scheduler-dayview .k-scheduler-pane:first-child .k-scheduler-table {
            table-layout: fixed;
        }

        .k-scheduler-header,
        .k-scheduler-view-header {
            padding-inline-end: var(--kendo-scrollbar-width, 17px);
        }

        .k-scheduler-header th {
            text-align: center;
        }

        .k-scheduler-header,
        .k-scheduler-header-wrap,
        .k-scheduler-header-wrap > div {
            border-color: inherit;
            overflow: hidden;
        }

        .k-scheduler-header-wrap {
            border-width: 0;
            border-style: solid;
            position: relative;
        }

        .k-scheduler-times {
            border-color: inherit;
            position: relative;
            overflow: hidden;
        }

        .k-scheduler-times .k-scheduler-table {
            table-layout: auto;
        }

        .k-scheduler-times th {
            border-width: 0 1px 1px 0;
            text-align: end;
        }

        .k-scheduler-times .k-slot-cell,
        .k-scheduler-times .k-scheduler-times-all-day {
            border-bottom-color: inherit;
        }

        .k-scheduler-times .k-slot-cell.k-last-resource {
            border-right: 0;
        }

        .k-scheduler-times .k-slot-cell.k-empty-slot {
            padding-left: 0;
            padding-right: 0;
        }

        .k-scheduler-datecolumn {
            width: 12em;
        }

        .k-scheduler-timecolumn {
            width: 11em;
            white-space: nowrap;
        }

        .k-scheduler-agendaview {
            color: ${token.colorText};
        }
        
        .k-scheduler-content {
            border-color: inherit;
            position: relative;
            overflow: auto;
        }

        .k-scheduler-content:focus {
            outline: none;
        }

        .k-event {
            border-radius: 4px;
            min-height: 25px;
            box-sizing: border-box;
            border-width: 0;
            border-style: solid;
            border-radius: 4px;
            text-align: start;
            outline: 0;
            cursor: default;
            position: absolute;
            overflow: hidden;
            padding-right: 8px;
            touch-action: initial !important;
            z-index: 0 !important;
        }

        kendo-scheduler .k-event > div,
        .k-event > div {
            position: relative;
            z-index: 2;
        }

        kendo-scheduler .k-event .k-event-template,
        .k-event .k-event-template {
            line-height: 17px;
            padding-block: 4px;
            padding-inline: 8px;
        }

        kendo-scheduler .k-event .k-event-time,
        .k-event .k-event-time {
            padding-bottom: 0;
            font-size: .875em;
            white-space: nowrap;
            display: none;
        }

        kendo-scheduler .k-event .k-event-actions,
        .k-event .k-event-actions {
            white-space: nowrap;
            position: absolute;
            top: 0;
            bottom: 0;
            right: 8px;
            z-index: 2;
        }

        kendo-scheduler .k-event .k-event-actions .k-event-delete,
        .k-event .k-event-actions .k-event-delete {
            opacity: .5;
            visibility: hidden;
        }

        kendo-scheduler .k-event .k-event-actions:hover .k-event-delete, kendo-scheduler .k-event .k-event-actions.k-hover .k-event-delete,
        .k-event .k-event-actions:hover .k-event-delete,
        .k-event .k-event-actions.k-hover .k-event-delete {
            opacity: 1;
        }

        kendo-scheduler .k-event .k-event-actions a,
        .k-event .k-event-actions a {
            color: inherit;
        }

        kendo-scheduler .k-event .k-event-actions:first-child,
        .k-event .k-event-actions:first-child {
            margin: 2px 0.4ex 0 4px;
            top: 0;
            right: 0;
            float: left;
            position: relative;
            opacity: 1;
            visibility: visible;
            line-height: normal;
        }

        kendo-scheduler .k-event .k-resize-handle,
        .k-event .k-resize-handle {
            z-index: 4;
            opacity: .5;
            visibility: hidden;
        }

        kendo-scheduler .k-event .k-resize-handle::before,
        .k-event .k-resize-handle::before {
            border-color: currentColor;
        }

        kendo-scheduler .k-event .k-resize-n,
        .k-event .k-resize-n {
            height: .5em;
            top: 0;
        }

        kendo-scheduler .k-event .k-resize-s,
        .k-event .k-resize-s {
            height: .5em;
            bottom: 0;
        }

        kendo-scheduler .k-event .k-resize-n::before,
        kendo-scheduler .k-event .k-resize-s::before,
        .k-event .k-resize-n::before,
        .k-event .k-resize-s::before {
            width: 32px;
            border-bottom-width: 1px;
        }

        kendo-scheduler .k-event .k-resize-w,
        .k-event .k-resize-w {
            width: .5em;
            left: 0;
        }

        kendo-scheduler .k-event .k-resize-e,
        .k-event .k-resize-e {
            width: .5em;
            right: 0;
        }

        kendo-scheduler .k-event .k-resize-w::before,
        kendo-scheduler .k-event .k-resize-e::before,
        .k-event .k-resize-w::before,
        .k-event .k-resize-e::before {
            height: 32px;
            border-left-width: 1px;
        }

        kendo-scheduler .k-event:hover .k-event-actions .k-event-delete,
        kendo-scheduler .k-event:hover .k-resize-handle, kendo-scheduler .k-event.k-hover .k-event-actions .k-event-delete,
        kendo-scheduler .k-event.k-hover .k-resize-handle,
        .k-event:hover .k-event-actions .k-event-delete,
        .k-event:hover .k-resize-handle,
        .k-event.k-hover .k-event-actions .k-event-delete,
        .k-event.k-hover .k-resize-handle {
            visibility: visible;
        }

        kendo-scheduler .k-event.k-event-drag-hint .k-event-time,
        .k-event.k-event-drag-hint .k-event-time {
            display: block;
        }

        kendo-scheduler .k-event .k-event-top-actions,
        kendo-scheduler .k-event .k-event-bottom-actions,
        .k-event .k-event-top-actions,
        .k-event .k-event-bottom-actions {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            text-align: center;
        }

        kendo-scheduler .k-event .k-event-bottom-actions,
        .k-event .k-event-bottom-actions {
            top: auto;
            bottom: 0;
        }

        .k-scheduler-mark {
            width: 1em;
            height: 1em;
            display: inline-block;
            vertical-align: middle;
        }

        .k-more-events {
            padding: 0;
            height: 13px;
            border-style: solid;
            border-width: 1px;
            overflow: hidden;
            position: absolute;
            justify-content: center;
        }

        .k-more-events > .k-icon {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }

        .k-event-drag-hint {
            opacity: .5;
            z-index: 3;
        }

        .k-event-drag-hint .k-event-actions,
        .k-event-drag-hint .k-event-top-actions,
        .k-event-drag-hint .k-event-bottom-actions,
        .k-event-drag-hint .k-resize-handle {
            display: none;
        }

        .k-event-drag-hint .k-event-time {
            display: block;
        }

        .k-scheduler-marquee {
            border-width: 0;
            border-style: solid;
        }

        .k-scheduler-marquee .k-label-top,
        .k-scheduler-marquee .k-label-bottom {
            font-size: .75em;
            position: absolute;
        }

        .k-scheduler-marquee .k-label-top {
            left: 4px;
            top: 2px;
        }

        .k-scheduler-marquee .k-label-bottom {
            right: 4px;
            bottom: 2px;
        }

        .k-scheduler-marquee.k-first::before, .k-scheduler-marquee.k-last::after {
            content: "";
            border-width: 3px;
            border-style: solid;
            position: absolute;
            width: 0;
            height: 0;
        }

        .k-scheduler-marquee.k-first::before {
            top: 0;
            left: 0;
            border-right-color: transparent;
            border-bottom-color: transparent;
        }

        .k-scheduler-marquee.k-last::after {
            bottom: 0;
            right: 0;
            border-left-color: transparent;
            border-top-color: transparent;
        }

        .k-pdf-export-shadow .k-scheduler,
        .k-scheduler-pdf-export .k-scheduler-content,
        .k-scheduler-pdf-export .k-scheduler-times {
            height: auto !important;
            overflow: visible !important;
        }

        .k-scheduler-pdf-export {
            overflow: hidden;
        }

        .k-scheduler-pdf-export .k-scheduler-header {
            padding: 0 !important;
        }

        .k-scheduler-pdf-export .k-scheduler-header-wrap {
            border-width: 0 !important;
        }

        .k-scheduler-pdf-export .k-scheduler-header .k-scheduler-table,
        .k-scheduler-pdf-export .k-scheduler-content .k-scheduler-table {
            width: 100% !important;
        }

        .k-recurrence-editor {
            display: flex;
            flex-direction: column;
        }

        kendo-scheduler .k-recurrence-editor {
            display: block;
        }

        .k-scheduler-monthview .k-scheduler-table {
            height: 100%;
        }

        .k-scheduler-monthview .k-scheduler-table td {
            height: 80px;
            text-align: end;
        }

        .k-scheduler-monthview .k-scheduler-body .k-scheduler-cell {
            min-height: 80px;
        }

        .k-scheduler-monthview .k-hidden {
            padding-left: 0 !important;
            padding-right: 0 !important;
            border-right-width: 0 !important;
        }

        .k-scheduler-monthview .k-scheduler-table-auto,
        .k-scheduler-monthview .k-scheduler-table-auto td,
        .k-scheduler-monthview .k-scheduler-content .k-scheduler-table-auto {
            height: auto;
        }

        .k-scheduler-monthview .k-scheduler-content {
            overflow-y: scroll;
        }

        .k-scheduler-monthview.k-scheduler-flex-layout .k-scheduler-content {
            overflow-y: auto;
        }

        .k-scheduler-agendaview .k-scheduler-mark {
            margin-right: .5em;
            width: 1em;
            height: 1em;
            display: inline-block;
            vertical-align: middle;
        }

        .k-scheduler-agendaview .k-scheduler-table th:first-child,
        .k-scheduler-agendaview .k-scheduler-table td:first-child {
            border-left-width: 1px;
        }

        .k-scheduler-agendaview .k-scheduler-table td.k-first {
            border-left-width: 0;
        }

        .k-scheduler-agendaview .k-task > .k-event-delete {
            color: inherit;
            position: absolute;
            top: 2px;
            right: 2px;
            opacity: .5;
            visibility: hidden;
        }

        .k-scheduler-agendaview .k-hover .k-task > .k-event-delete,
        .k-scheduler-agendaview .k-scheduler-content tr:hover .k-event-delete,
        .k-scheduler-agendaview .k-scheduler-content .k-scheduler-row:hover .k-event-delete,
        .k-scheduler-agendaview .k-scheduler-content .k-scheduler-row.k-hover .k-event-delete {
            visibility: visible;
        }

        .k-scheduler-agendaday {
            margin: 0;
            font-size: 2.2em;
            line-height: 1;
            font-weight: 400;
            float: left;
        }

        .k-scheduler-agendaweek {
            display: block;
            margin: .4em 0 0;
            line-height: 1;
            font-style: normal;
        }

        .k-scheduler-agendadate {
            font-size: .75em;
        }

        .k-scheduler-timelineview .k-slot-cell {
            overflow: hidden;
        }

        .k-scheduler-timelineview .k-scheduler-content {
            overflow: auto;
        }

        .k-scheduler-pane {
            display: flex;
            flex-direction: row;
        }

        .k-scheduler-pane .k-scheduler-times {
            flex: 0 0 auto;
        }

        .k-scheduler-pane .k-scheduler-times .k-scheduler-table {
            height: 100%;
        }

        .k-scheduler-pane .k-scheduler-header,
        .k-scheduler-pane .k-scheduler-content {
            flex: 1 1 auto;
        }

        .k-scheduler-yearview .k-scheduler-body {
            padding-block: 12px;
            padding-inline: 12px;
            justify-content: center;
        }

        .k-scheduler-yearview .k-calendar {
            width: 100%;
            border-width: 0;
        }

        .k-scheduler-yearview .k-calendar .k-calendar-view {
            flex-wrap: wrap;
            justify-content: center;
            gap: 12px;
        }

        .k-scheduler-yearview .k-calendar .k-content {
            flex: 0;
        }

        .k-scheduler-yearview .k-calendar .k-link {
            position: relative;
        }

        .k-scheduler-yearview .k-calendar td.k-selected {
            background-color: inherit;
        }

        .k-scheduler-yearview .k-day-indicator {
            margin-top: calc(32px - 0.5em);
            width: 3px;
            height: 3px;
            border-radius: 50%;
            position: absolute;
            left: calc(50% - 1.5px);
        }

        .k-scheduler-tooltip {
            padding-block: 8px;
            padding-inline: 8px;
            border-width: 0;
            color: inherit;
        }

        .k-scheduler-tooltip .k-tooltip-title {
            margin-bottom: 12px;
        }

        .k-scheduler-tooltip .k-tooltip-title .k-month {
            font-size: 12px;
            text-transform: uppercase;
        }

        .k-scheduler-tooltip .k-tooltip-title .k-day {
            font-size: 24px;
        }

        .k-scheduler-tooltip .k-tooltip-events-container {
            overflow: auto;
        }

        .k-scheduler-tooltip .k-tooltip-events {
            max-height: 250px;
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .k-scheduler-tooltip .k-tooltip-event {
            padding-block: 4px;
            padding-inline: 8px;
            border-radius: 4px;
            box-sizing: border-box;
            display: flex;
            flex-direction: row;
            align-items: center;
            flex-shrink: 0;
            position: relative;
            gap: 4px;
        }

        .k-scheduler-tooltip .k-tooltip-event .k-event-time {
            display: flex;
            flex-shrink: 0;
            font-size: inherit;
        }

        .k-scheduler-tooltip .k-no-data, .k-scheduler-tooltip .k-nodata {
            height: auto;
            min-height: auto;
            color: inherit;
        }

        .k-scheduler-edit-dialog .k-dialog {
            max-height: 100vh;
        }

        .k-scheduler-edit-form .k-edit-form-container {
            width: 100%;
        }

        .k-scheduler-edit-form .k-edit-label {
            width: 17%;
        }

        .k-scheduler-edit-form .k-edit-field {
            width: 77%;
        }

        .k-scheduler-edit-form .k-edit-field > ul > li {
            display: flex;
            flex-flow: row nowrap;
            align-items: center;
        }

        .k-scheduler-edit-form .k-recurrence-editor .k-radio-list .k-radio-wrap,
        .k-scheduler-edit-form .k-recurrence-editor .k-checkbox-list .k-checkbox-wrap {
            align-self: center;
        }

        .k-scheduler-edit-form .k-recur-interval,
        .k-scheduler-edit-form .k-recur-count,
        .k-scheduler-edit-form .k-recur-monthday {
            width: 5em;
        }

        .k-scheduler-edit-form .k-recur-until,
        .k-scheduler-edit-form .k-recur-month,
        .k-scheduler-edit-form .k-recur-weekday,
        .k-scheduler-edit-form .k-recur-weekday-offset {
            width: 10em;
        }

        .k-scheduler-edit-form .k-scheduler-datetime-picker {
            display: flex;
            flex-flow: row nowrap;
            gap: 8px;
        }
    `
}));