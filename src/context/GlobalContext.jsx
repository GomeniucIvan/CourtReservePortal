import SafeArea from "./SafeAreaContext.jsx";
import {AntdProvider} from "./AntdProvider.jsx";
import {AppProvider} from "./AppProvider.jsx";
import {AuthProvider} from "./AuthProvider.jsx";
import { ErrorBoundary } from 'react-error-boundary';

export const GlobalContext = ({ children }) => {

    function ErrorFallback({ error }) {
        const isDevelopment = process.env.NODE_ENV === 'development' || 1 == 1;

        return (
            <div role="alert" style={{paddingTop: '50px'}}>
                <h2>Something went wrong:</h2>
                <div style={{maxWidth: '80vw'}}>
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
                    <AuthProvider>
                        <SafeArea>
                            {children}
                        </SafeArea>
                    </AuthProvider>
                </AppProvider>
            </ErrorBoundary>
        </AntdProvider>

    );
};