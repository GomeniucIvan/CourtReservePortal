import { createRoot } from 'react-dom/client'
import Layout from "./components/layout/Layout.jsx";
import { BrowserRouter } from 'react-router-dom';
import {GlobalContext} from "./context/GlobalContext.jsx";
import './config/i18n.jsx';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <GlobalContext>
            <Layout />
        </GlobalContext>
    </BrowserRouter>,
)
