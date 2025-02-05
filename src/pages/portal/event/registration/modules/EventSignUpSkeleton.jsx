import React from "react";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import {Flex, Skeleton} from "antd";
import {emptyArray} from "@/utils/ListUtils.jsx";
import {randomNumber} from "@/utils/NumberUtils.jsx";

function EventSignUpSkeleton({isFetching}) {
    return (
        <>
            {isFetching &&
                <PaddingBlock topBottom={true}>
                    <Flex vertical={true} gap={16}>
                        <Flex vertical={true} gap={4}>
                            <Skeleton.Button active={true} block
                                             style={{height: `60px`, width: `${randomNumber(45, 75)}%`}}/>
                            <Skeleton.Button active={true} block
                                             style={{height: `40px`, width: `${randomNumber(45, 75)}%`}}/>
                        </Flex>

                        <Flex vertical={true} gap={4}>
                            {emptyArray(6).map((item, index) => (
                                <div key={index}>
                                    <Skeleton.Button active={true} block
                                                     style={{height: `50px`, width: `${randomNumber(45, 75)}%`}}/>
                                </div>
                            ))}
                        </Flex>

                        <Skeleton.Button active={true} block style={{height: `120px`}}/>
                    </Flex>
                </PaddingBlock>
            }
        </>
    )
}

export default EventSignUpSkeleton
