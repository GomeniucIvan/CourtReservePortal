import PaddingBlock from "../paddingblock/PaddingBlock.jsx";
import React, {useState} from "react";
import { cx } from 'antd-style';
import {useStyles} from "./styles.jsx";
import {useApp} from "@/context/AppProvider.jsx";
import {Flex} from "antd";
import SVG from "@/components/svg/SVG.jsx";

function ListFilterItemExpander({label, children, close = false }) {
    const { styles } = useStyles();
    const {globalStyles} = useApp();
    const [isOpen, setIsOpen] = useState(!close);

    const handleClick = () => {
        setIsOpen((prevState) => !prevState);
    };
    
    return (
        <>
            <PaddingBlock onlyTop={true}>
                <Flex align={'center'} 
                      justify={'space-between'}
                      onClick={handleClick}
                      className={cx(styles.blockLabel, !isOpen && styles.closedBlockLabel)}>
                    <label className={cx(globalStyles.globalLabel, styles.label)}>
                        {label}
                    </label>
                    
                    <div className={cx(styles.chevronBlock, isOpen && styles.openedChevronBlock)}>
                        <SVG icon={'chevron-down'} size={16} />
                    </div>
                </Flex>

                {isOpen && children}
            </PaddingBlock>
        </>
    );
}

export default ListFilterItemExpander;