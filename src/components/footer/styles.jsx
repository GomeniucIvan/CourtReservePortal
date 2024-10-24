import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => {
    return {
        footer: css`
            background-color: ${token.colorBgBase};
            color: ${token.colorText};
            
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
    };
});