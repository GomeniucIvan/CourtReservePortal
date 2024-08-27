import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => {
    const loadingAnimation = css`
        @keyframes loadingHeader {
            0% {
                left: -100%;
            }
            100% {
                left: 100%;
            }
        }
    `;

    return {
        header: css`
            position: relative;
            overflow: hidden;
            border-bottom: 1px solid ${token.colorBorder};
            background-color: ${token.colorBgBase};
            color: ${token.colorText};
            
            .adm-nav-bar-title {
                text-align: start;
                padding-left: 0;
            }
            .adm-nav-bar-left {
                flex: 0;
            }
        `,
        headerLoadingBar: css`
            ${loadingAnimation};
            width: 100%;
            height: 1px;
            position: absolute;
            opacity: 0.6;
            bottom: 0;
            left: -100%;
            animation: loadingHeader 3s linear infinite;
            background-color: ${token.colorPrimary};
        `,
    };
});