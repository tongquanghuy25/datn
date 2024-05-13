import TabBookTicket from "../components/BusCard/TabContent/TabBookTicket/TabBookTicket";
import AdminPage from "../pages/AdminPage/AdminPage";
import BusOwnerPage from "../pages/BusOwnerPage/BusOwnerPage";
import BusOwnerRegistration from "../pages/BusOwnerRegistration/BusOwnerRegistration";
import DriverPage from "../pages/DriverPage/DriverPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage/ForgotPasswordPage";
import HomePage from "../pages/HomePage/HomePage";
import ProfilePage from "../pages/ProfilePage/ProfilePage";
import SignInPage from "../pages/SignInPage/SignInPage";
import SignUpPage from "../pages/SignUpPage/SignUpPage";
import TicketAgentPage from "../pages/TicketAgentPage/TicketAgentPage";

export const routes = [
    {
        path: '/',
        page: HomePage,
        isShowHeader: true
    },
    {
        path: '/sign-in',
        page: SignInPage,
        isShowHeader: false
    },
    {
        path: '/sign-up',
        page: SignUpPage,
        isShowHeader: false
    },
    {
        path: '/forgot-password',
        page: ForgotPasswordPage,
        isShowHeader: false
    },
    {
        path: '/profile',
        page: ProfilePage,
        isShowHeader: false
    },
    {
        path: '/bus-owner-registration',
        page: BusOwnerRegistration,
        isShowHeader: false
    },





    //Admin

    {
        path: '/admin',
        page: AdminPage,
        isShowHeader: false
    },

    //BusOwner
    {
        path: '/bus-owner',
        page: BusOwnerPage,
        isShowHeader: false
    },

    //Driver
    {
        path: '/driver',
        page: DriverPage,
        isShowHeader: false
    },

    //Agent
    {
        path: '/agent',
        page: TicketAgentPage,
        isShowHeader: false
    },


    //Test
    {
        path: '/test',
        page: TabBookTicket,
        isShowHeader: false
    }
]
