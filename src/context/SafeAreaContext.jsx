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


// import React, { useEffect } from 'react';
// import { SafeAreaView, StyleSheet } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { WebView } from 'react-native-webview';
//
// const MyWebView = () => {
//     const insets = useSafeAreaInsets();
//
//     const injectedJS = `
//     window.safeAreaInsets = {
//       top: ${insets.top},
//       bottom: ${insets.bottom},
//     };
//     window.dispatchEvent(new Event('safeAreaInsetsLoaded'));
//   `;
//
//     return (
//         <SafeAreaView style={styles.container}>
//             <WebView
//                 source={{ uri: 'https://your-web-app-url.com' }}
//                 injectedJavaScript={injectedJS}
//             />
//         </SafeAreaView>
//     );
// };
//
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//     },
// });
//
// export default MyWebView;