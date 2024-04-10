import TabSeatSelection from "../components/BusCard/TabContent/TabSeat/TabSeatSelection";
import AdminPage from "../pages/AdminPage/AdminPage";
import BusOwnerRegistration from "../pages/BusOwnerRegistration/BusOwnerRegistration";
import ForgotPasswordPage from "../pages/ForgotPasswordPage/ForgotPasswordPage";
import HomePage from "../pages/HomePage/HomePage";
import ProfilePage from "../pages/ProfilePage/ProfilePage";
import SignInPage from "../pages/SignInPage/SignInPage";
import SignUpPage from "../pages/SignUpPage/SignUpPage";

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

    //Test
    {
        path: '/test',
        page: TabSeatSelection,
        isShowHeader: false
    }
]
