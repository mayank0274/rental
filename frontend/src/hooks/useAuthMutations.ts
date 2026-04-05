import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth-api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useLogin = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.data?.message || "Login successful!");
        queryClient.invalidateQueries({ queryKey: ["me"] });
        router.push("/profile");
      }
    },
    onError: (error: any) => {
      toast.error(error.error?.message || "Login failed");
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.data?.message || "Registration successful!");
        queryClient.invalidateQueries({ queryKey: ["me"] });
        router.push("/profile");
      }
    },
    onError: (error: any) => {
      toast.error(error.error?.message || "Registration failed");
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.data?.message || "Logged out!");
        queryClient.setQueryData(["me"], null);
        router.push("/login");
      }
    },
    onError: (error: any) => {
      toast.error(error.error?.message || "Logout failed");
    },
  });
};
