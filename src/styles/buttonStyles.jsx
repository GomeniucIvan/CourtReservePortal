import { createStyles } from 'antd-style';

export const bStyles = createStyles(({ css, token }) => ({
    buttonYellow: css`
      background-color: #d6d605;
      color: black;
      
      &:not(.ant-btn-disabled):not(.ant-btn-background-ghost):hover,
      &:not(.ant-btn-disabled):not(.ant-btn-background-ghost):active {
         background-color: #bfbf06 !important;
         color: black !important;
      }

      &.ant-btn-background-ghost {
         color: #d6d605;
         background: transparent;
         border-color: #d6d605;
         box-shadow: none;

         &:not(.ant-btn-disabled):hover,
         &:not(.ant-btn-disabled):active {
            color: #d6d605 !important;
            border-color: #d6d605 !important;
         }
      }
   `,
    buttonBlue: css`
      background-color: #0558d6;
      color: white;
        
      &:not(.ant-btn-disabled):not(.ant-btn-background-ghost):hover,
      &:not(.ant-btn-disabled):not(.ant-btn-background-ghost):active {
         background-color: #0747a9 !important;
      }
      
      &.ant-btn-background-ghost {
         color: #0558d6;
         background: transparent;
         border-color: #0558d6;
         box-shadow: none;

         &:not(.ant-btn-disabled):hover,
         &:not(.ant-btn-disabled):active {
            color: #0558d6 !important;
            border-color: #0558d6 !important;
         }
      }
   `,
    lightGreen: css`
        background-color: #1ACC80;
        color: ${token.colorBlack} !Important;
        
        &:not(.ant-btn-disabled):not(.ant-btn-background-ghost):hover,
        &:not(.ant-btn-disabled):not(.ant-btn-background-ghost):active {
            background-color: #1ACC80 !important;
        }

        &.ant-btn-background-ghost {
            color: #1ACC80;
            background: transparent;
            border-color: #1ACC80;
            box-shadow: none;

            &:not(.ant-btn-disabled):hover,
            &:not(.ant-btn-disabled):active {
                color: #1ACC80 !important;
                border-color: #1ACC80 !important;
            }
        }
    `
}));