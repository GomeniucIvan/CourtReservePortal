import { ConfigProvider, theme } from "antd";

export const AntdProvider = ({ children }) => {
    return (
        <ConfigProvider
            theme={{
                algorithm: theme.defaultAlgorithm,
                components: {
                    Button: {
                        contentFontSize: 16,
                        controlHeight: 40,
                        controlHeightLG: 46,
                        borderRadius: 8,
                        paddingXS: 8,
                        marginXS: 8
                    },
                    Input: {
                        borderRadius: 8,
                        controlHeight: 40
                    },
                    Form: {
                        labelFontSize: 14,
                        verticalLabelPadding: '0 0 8px',
                        labelColonMarginInlineStart: 4,
                        colorError: "rgb(255,77,80)",
                        itemMarginBottom: 20,
                        labelRequiredMarkColor: "rgb(255,77,80)",
                        marginXXS: 4,
                        colorBorder: "rgb(217,217,217)"
                    }
                },
            }}
        >
            {children}
        </ConfigProvider>
    );
};