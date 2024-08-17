import SafeArea from "./SafeAreaContext.jsx";
import {AntdProvider} from "./AntdProvider.jsx";
import {AppProvider} from "./AppProvider.jsx";

export const GlobalContext = ({ children }) => {
    return (
        <AntdProvider>
            <AppProvider>
                <SafeArea>
                    {children}
                </SafeArea>
            </AppProvider>
        </AntdProvider>
    );
};