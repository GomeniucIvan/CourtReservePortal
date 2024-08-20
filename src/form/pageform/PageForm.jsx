import {Form} from "antd";

function PageForm({children, formik}) {
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
            {children}
        </Form>
    )
}

export default PageForm
