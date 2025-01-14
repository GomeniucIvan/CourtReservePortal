import {Flex, Form} from "antd";
import {useApp} from "@/context/AppProvider.jsx";

function PageForm({children, formik}) {
    const {token } = useApp();
    
    return (
        <Form
            layout={'vertical'}
            autoComplete="off"
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    formik.handleSubmit();
                }
            }}
            initialValues={{ layout: 'vertical' }}
        >
            <Flex vertical={true} gap={token.padding}>
                {children}
            </Flex>
        </Form>
    )
}

export default PageForm
