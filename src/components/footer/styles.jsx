import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => {
    return {
        footer: css`
            background-color: ${token.colorBgBase};
            color: ${token.colorText};
            height: 60px;
            box-shadow: ${token.boxShadow};
            .adm-tab-bar-item-active {
                svg {
                    path {
                        fill: var(--adm-color-primary);
                    }
                }
            }
        `,
        skeleton: css`
            --height: 42px;
            --width: 100%;
            --border-radius: ${token.borderRadius}px;
        `,
        plusIconWrapper: css`
            position: relative;
        `,
        
        plusIcon: css`
            position: absolute;
            bottom: -18px;
            left: 50%;
            transform: translateX(-50%);
        `,
        minWidth: css`
            min-width: 40px;
        `,
        footerSkeletonWrapper: css`
            padding-left: ${token.padding}px;
            padding-right: ${token.padding}px;
        `
    };
});