import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
    root: css`
        margin: 0;
        padding: 0;
        form {
            .ant-btn {
                margin: ${token.Button.paddingXS/2}px 0px;
            }
        }
        
        .sm-padding {
            margin: ${token.Button.paddingXS/2}px 0px;
        }
  `,
}));