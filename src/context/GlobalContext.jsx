import SafeArea from "./SafeAreaContext.jsx";
import {AntdProvider} from "./AntdProvider.jsx";
import {AppProvider} from "./AppProvider.jsx";
import {AuthProvider} from "./AuthProvider.jsx";

export const GlobalContext = ({ children }) => {
    return (
        <AntdProvider>
            <AppProvider>
                <AuthProvider>
                    <SafeArea>
                        {children}
                    </SafeArea>
                </AuthProvider>
            </AppProvider>
        </AntdProvider>
    );
};