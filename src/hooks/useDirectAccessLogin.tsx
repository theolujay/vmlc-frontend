import { useAuth } from "@/contexts/AuthProvider";
import { AuthService } from "@/services/auth.service";
import { UserMgtService } from "@/services/UserMgt.service";
import { AuthLoginResponse, DirectAccessLoginResponse } from "@/types/auth";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function useDirectAccessLogin() {
  const { dispatch } = useAuth();
  const router = useRouter();

  const { isPending, mutate } = useMutation({
    mutationFn: async (passcode: string): Promise<AuthLoginResponse> => {
      // 1. Perform direct access login
      const loginData: DirectAccessLoginResponse = await AuthService.directAccessLogin(passcode);
      
      // 2. Store temporary session to allow authenticated profile fetch
      // The axios client uses localStorage "session" to get the token
      localStorage.setItem('session', JSON.stringify({
        access: loginData.access,
        refresh: loginData.refresh
      }));

      try {
        // 3. Fetch full profile
        const profileData = await UserMgtService.getOwnAccountDetails();
        
        // 4. Construct complete AuthLoginResponse
        const fullResponse: AuthLoginResponse = {
          access: loginData.access,
          refresh: loginData.refresh,
          profile: profileData.profile
        };

        return fullResponse;
      } catch (error) {
        // If profile fetch fails, we still have the tokens, 
        // but the app expects a profile.
        console.error("Failed to fetch profile after direct login", error);
        throw error;
      }
    },
    onSuccess: (value: AuthLoginResponse) => {
      dispatch({ type: 'loginSuccess', payload: value });
      toast.success("Direct access login successful");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: AxiosError<any>) => {
      localStorage.removeItem('session');
      const errorMessage = error?.response?.data?.detail || "Invalid or expired passcode";
      toast.error(errorMessage);
      router.push('/login');
    }
  });

  return { login: mutate, isPending };
}
