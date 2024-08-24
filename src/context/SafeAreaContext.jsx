import React, { useEffect, useState } from 'react';
import { SafeArea as AntSafeArea } from 'antd-mobile'

const SafeArea = ({ children }) => {
    return (
        <>
            <div>
                <AntSafeArea position='top'/>
            </div>
            {children}
            <div>
                <AntSafeArea position='bottom'/>
            </div>
        </>
    );
};

export default SafeArea;