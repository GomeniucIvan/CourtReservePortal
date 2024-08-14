import { createRoot } from 'react-dom/client'
import Layout from "./components/layout/Layout.jsx";
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <Layout />
    </BrowserRouter>,
)
