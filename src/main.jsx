import { createRoot } from 'react-dom/client'
import Layout from "./components/layout/Layout.jsx";
import { BrowserRouter } from 'react-router-dom';
import {GlobalContext} from "./context/GlobalContext.jsx";

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <GlobalContext>
            <Layout />
        </GlobalContext>
    </BrowserRouter>,
)
