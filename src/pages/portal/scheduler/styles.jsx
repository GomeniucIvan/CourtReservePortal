import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
    unavailableCell : css`
        height: 100%;
        background-color: #afacac;
    `,
    noneAvailable : css`
        height: 100%;
        background-color: ${token.colorError};
    `,
    joinWaitlist: css`
        height: 100%;
        background-color: ${token.colorPrimary};
        color: ${token.colorOrgText};
    `,
    availableWaitListSlot:css`
        height: 100%;
        background-color: #cdf5b6;
    `,
    availableSlot:css`
        height: 100%;
        background-color: ${token.colorPrimary};
    `
}));