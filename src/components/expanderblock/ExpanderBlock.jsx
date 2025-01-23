import React from "react";
import { Button, Collapse } from 'antd';

const ExpanderBlock = ({children, title}) => {
    return (
       <>
           <Collapse
               expandIconPosition={'end'}
               defaultActiveKey={['1']}
               items={[
                   {
                       key: '1',
                       label: title,
                       children: children,
                   },
               ]}
           />
       </>
    )
}

export default ExpanderBlock
