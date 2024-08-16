import React, { useEffect, useState } from 'react';

const SafeArea = ({ children }) => {
    const [paddingTop, setPaddingTop] = useState(0);
    const [paddingBottom, setPaddingBottom] = useState(0);

    useEffect(() => {
        const handleSafeAreaInsets = () => {
            if (window.safeAreaInsets) {
                setPaddingTop(window.safeAreaInsets.top);
                setPaddingBottom(window.safeAreaInsets.bottom);
            }
        };

        window.addEventListener('safeAreaInsetsLoaded', handleSafeAreaInsets);

        return () => {
            window.removeEventListener('safeAreaInsetsLoaded', handleSafeAreaInsets);
        };
    }, []);

    return (
        <div
            style={{
                paddingTop: `${paddingTop}px`,
                paddingBottom: `${paddingBottom}px`,
                boxSizing: 'border-box',
                minHeight: '100vh',
            }}
        >
            {children}
        </div>
    );
};

export default SafeArea;