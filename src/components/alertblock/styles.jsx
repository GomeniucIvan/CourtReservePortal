import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
    block: css`
        min-height: 82px;
        
        .ant-typography {
            color: rgba(0, 0, 0, 0.88); //we display black for dark theme
        }
    `,
    removePaddingBlock: css`
        margin-left: -${token.padding}px;
        margin-right: -${token.padding}px;
    `,
    dangerBlock: css`
        background-color: #ffeaea;
        border-color: #f03d3d;
    `,
    warningBlock: css`
        background-color: #FFFCE6;
    `,
    infoBlock: css`
        background-color: #ebefff;
    `,
    button: css`
        height: 32px;
        min-width: 70px;
    `,
    dangerButton: css`
        background-color: #CF292C;
        border-color: #CF292C;
        color: #fff;

        &:hover, &:focus, &:active, &:visited {
            background-color: #CF292C;
            border-color: #CF292C;
            color: #fff;
        }
    `,
    warningButton: css`
        background-color: #FFCA2B;
        border-color: #FFCA2B;
        color: #634308;

        &:hover, &:focus, &:active, &:visited {
            background-color: #FFCA2B;
            border-color: #FFCA2B;
            color: #634308;
        }
    `,
    infoButton: css`
        background-color: #2F54EB;
        border-color: #2F54EB;
        color: #fff;

        &:hover, &:focus, &:active, &:visited {
            background-color: #2F54EB;
            border-color: #2F54EB;
            color: #fff;
        }
    `
}));