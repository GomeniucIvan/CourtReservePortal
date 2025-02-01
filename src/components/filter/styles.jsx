import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
   label: css`
      font-weight: 600;
        padding: 0;
   `,
   blockLabel: css`
      min-height: 40px;
   `,
   closedBlockLabel: css`
    
   `,

   chevronBlock: css`

   `,
   openedChevronBlock: css`
      svg {
         transform: rotate(180deg);
      }
   `
}));