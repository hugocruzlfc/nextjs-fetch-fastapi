import { API_ROUTES } from "@/lib/constants";
import { useMutation } from "@tanstack/react-query";
import ky from "ky";

export default function useLoginRegister() {
  const mutation = useMutation({
    mutationFn: async ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => {
      const response = await ky.post(API_ROUTES.AUTH, {
        json: {
          username,
          password,
        },
      });

      return response.json();
    },
    onMutate: async () => {
      // toast.success(`Post ${data.isBookmarkedByUser ? "un" : ""}bookmarked`);
    },
    onError(error) {
      console.error(error);
      // toast.error("Something went wrong. Please try again.");
    },
  });

  return mutation;
}
