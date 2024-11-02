import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
    overlay: css `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.5); 
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    `,
    container: css`
        background-color: ${token.colorBgBase};
        border-radius: ${token.borderRadius}px;
        width: calc(100vw - ${token.padding*2}px);
        height: calc(100vh - ${token.padding*2}px);
        display: flex;
        flex-direction: column;
        overflow: hidden;
    `,
    title: css`
        padding: ${token.padding}px 0;
        border-bottom: 1px solid ${token.colorBorder};
        margin-bottom: ${token.padding}px;
    `,
    body: css`
        padding: 0 ${token.colorBgBase}px;
        overflow-y: auto;
        flex: 1;
    `
}));