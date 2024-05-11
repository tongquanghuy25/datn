import { useDispatch } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { logoutUser } from "../../services/UserService";
import { resetUser } from '../../redux/slides/userSlide';
import { useNavigate } from "react-router-dom";

export const useHandleLogout = () => {
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logoutUser()
        dispatch(resetUser());
        localStorage.clear();
        queryClient.clear();
        navigate('/sign-in')

    };

    return handleLogout;
};