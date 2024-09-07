import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => {
    
    return {
        notification: css`
            background-color: var(--ant-notification-colorbg, ${token.colorBgBase});
            color: var(--ant-notification-colortext, ${token.colorText});
            border-radius: ${token.borderRadius}px;
            margin: ${token.padding * 2}px ${token.padding}px 0px ${token.padding}px;
            transition: transform 0.3s ease-in-out;
            position: relative;
            box-shadow: ${token.boxShadow};
            
            span:not(.anticon), h1, h2, h3, h4, h5 {
                color: var(--ant-notification-colortext, ${token.colorText}) !important;
            }
        `,
        leftBorder: css`
            position: absolute;
            left: 0;
            height: 100%;
            width: 5px;
            top: 0;
            border-top-left-radius: ${token.borderRadius}px;
            border-bottom-left-radius: ${token.borderRadius}px;
        `
    };
});