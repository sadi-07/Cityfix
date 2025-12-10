import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router";

export const useUpvote = (issueId, user) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!user) {
        navigate("/login");
        return;
      }

      return axios.post(`/issues/${issueId}/upvote`, {}, {
        withCredentials: true,
      });
    },

    onSuccess: () => {
      // Refresh issue list & details instantly
      queryClient.invalidateQueries(["issues"]);
      queryClient.invalidateQueries(["issue", issueId]);
    }
  });
};
