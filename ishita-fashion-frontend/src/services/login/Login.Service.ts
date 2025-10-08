import { useMutation, UseMutationOptions} from "@tanstack/react-query"
import { post } from "../../helpers/Requests";
import { ILogin } from "@/interfaces/login/Login";

export const useAuthenticate = (options?: UseMutationOptions<any, Error, ILogin, unknown>) => {
    return useMutation({
        mutationFn: async (data: ILogin) => {
            const res = await post("auth/login",data);
            return res;
        },
        ...options
    })
}   


