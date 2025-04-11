import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => {
    return {
        header: css`
            display: flex;
            align-items: center;
            padding-bottom: 62px;
            background-color: ${token.colorHeaderBg};
        `,
        mainHeaderItem: css`
            padding: 14px 8px !important;
            position: relative;

            &:before {
                content: ' ';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                opacity: 0;
                background-color: ${token.colorHeaderText};
                transition: opacity 0.1s ease-in-out;
            }
            
            &:hover {
                &:before {
                    opacity: 0.1;
                }
            }
        `,
        headerDropdown: css`
            
            //parent set not working
            .ant-dropdown-arrow,
            .ant-dropdown-menu {
                margin-top: -14px; 
            }

        `
    };
});