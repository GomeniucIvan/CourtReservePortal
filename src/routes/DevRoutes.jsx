import DevIcons from "@/pages/dev/DevIcons.jsx";
import DevPaymentProviders from "@/pages/dev/DevPaymentProviders.jsx";
import Dev from "@/pages/dev/Dev.jsx";
import {Typography} from "antd";
import DevTypography from "@/pages/dev/DevTypography.jsx";
import DevColors from "@/pages/dev/DevColors.jsx";
import DevDatePicker from "@/pages/dev/DevDatePicker.jsx";
import DevForm from "@/pages/dev/DevForm.jsx";
import DevModals from "@/pages/dev/DevModals.jsx";
import DevCards from "@/pages/dev/DevCards.jsx";
import DevOther from "@/pages/dev/DevOther.jsx";
import DevAgreements from "@/pages/dev/DevAgreements.jsx";

const {Text} = Typography;

export const DevRouteNames = {
    DEV_ALL: '/dev/all',
    DEV_ICONS: '/dev/icons',
    DEV_PAYMENT_PROVIDERS: '/dev/paymentproviders',
    DEV_TYPOGRAPHY: '/dev/typography',
    DEV_COLORS: '/dev/colors',
    DEV_DATE_PICKER: '/dev/datepicker',
    DEV_FORM: '/dev/form',
    DEV_OTHER: '/dev/other',
    DEV_MODALS: '/dev/modals',
    DEV_AGREEMENTS: '/dev/agreements',
    DEV_CARDS: '/dev/cards',
};

const DevRoutes = [
    {
        path: DevRouteNames.DEV_ALL,
        element: <Dev />,
        title: 'Dev',
        unauthorized: true,
    },
    {
        path: DevRouteNames.DEV_ICONS,
        element: <DevIcons />,
        title: 'Icons',
        unauthorized: true,
    },
    {
        path: DevRouteNames.DEV_PAYMENT_PROVIDERS,
        element: <DevPaymentProviders />,
        title: 'Payment Providers',
        unauthorized: true,
    },
    {
        path: DevRouteNames.DEV_TYPOGRAPHY,
        element: <DevTypography />,
        title: 'Typography',
        unauthorized: true,
    },
    {
        path: DevRouteNames.DEV_COLORS,
        element: <DevColors />,
        title: 'Colors',
        unauthorized: true,
    },
    {
        path: DevRouteNames.DEV_DATE_PICKER,
        element: <DevDatePicker />,
        title: 'Date Picker',
        unauthorized: true,
    },
    {
        path: DevRouteNames.DEV_FORM,
        element: <DevForm />,
        title: 'Form',
        unauthorized: true,
    },
    {
        path: DevRouteNames.DEV_OTHER,
        element: <DevOther />,
        title: 'Other',
        unauthorized: true,
    },
    {
        path: DevRouteNames.DEV_MODALS,
        element: <DevModals />,
        title: 'Modals',
        unauthorized: true,
    },
    {
        path: DevRouteNames.DEV_AGREEMENTS,
        element: <DevAgreements />,
        title: 'Agreements',
        unauthorized: true,
    },
    {
        path: DevRouteNames.DEV_CARDS,
        element: <DevCards />,
        title: 'Cards',
        unauthorized: true,
    }
];

export default DevRoutes;