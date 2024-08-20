import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
    formBlock: css`
        margin-bottom: ${token.Form.itemMarginBottom}px;
  `,
}));