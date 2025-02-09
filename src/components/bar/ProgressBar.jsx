import {Button, Flex, Typography} from "antd";
import {useApp} from "@/context/AppProvider.jsx";
import {useStyles} from "./styles.jsx";
import {cx} from "antd-style";
import {emptyArray} from "@/utils/ListUtils.jsx";
import React from "react";

function ProgressBar({total, current}) {
    const {token} = useApp();
    const {styles} = useStyles();
    
    return (
        <Flex className={cx(styles.progress)} gap={4} align={'center'}>
            {emptyArray(total).map((item, index) => {
                let currentPunchIncrementIndex = index + 1;

                return (
                    <div key={index} className={cx(styles.emptySquare, (currentPunchIncrementIndex <= current) && styles.filledSquare)}>

                    </div>
                )
            })}
        </Flex>
    );
}

export default ProgressBar;