import SafeArea from "./SafeAreaContext.jsx";
import {AntdProvider} from "./AntdProvider.jsx";
import {AppProvider} from "./AppProvider.jsx";
import {AuthProvider} from "./AuthProvider.jsx";
import { ErrorBoundary } from 'react-error-boundary';
import MessageModalProvider from "@/context/MessageModalProvider.jsx";
import { theme } from "antd";
import {HeaderProvider} from "@/context/HeaderProvider.jsx";
import LayoutBackgroundReload from "@/components/layout/LayoutBackgroundReload.jsx";
import {FooterProvider} from "@/context/FooterProvider.jsx";
const { useToken } = theme;

export const GlobalContext = ({ children }) => {
    const { token } = useToken();

    function ErrorFallback({ error }) {
        const isDevelopment = process.env.NODE_ENV === 'development' || 1 == 1;

        return (
            <div role="alert" style={{paddingTop: '50px', color: token.colorText}}>
                <h2>Something went wrong:</h2>
                <div>
                    <p><strong>Error Message:</strong> {error.message}</p>

                    {isDevelopment && (
                        <div style={{whiteSpace: 'pre-wrap', wordBreak: 'break-all'}}>
                            {error.stack}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <AntdProvider>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
                <AppProvider>
                    <HeaderProvider>
                        <AuthProvider>
                            <FooterProvider>
                                <SafeArea>
                                    <MessageModalProvider>
                                        <LayoutBackgroundReload>
                                            {children}
                                        </LayoutBackgroundReload>
                                    </MessageModalProvider>
                                </SafeArea>
                            </FooterProvider>
                        </AuthProvider>
                    </HeaderProvider>
                </AppProvider>
            </ErrorBoundary>
        </AntdProvider>

    );
};