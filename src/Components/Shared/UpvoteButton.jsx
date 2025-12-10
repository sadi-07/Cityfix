import { ThumbsUp } from "lucide-react";
import { useUpvote } from "../hooks/useUpvote";

const UpvoteButton = ({ issue, user }) => {
    const upvoteMutation = useUpvote(issue._id, user);

    const handleUpvote = () => {
        upvoteMutation.mutate();
    };

    return (
        <button
            onClick={handleUpvote}
            className="flex items-center gap-2 px-3 py-1 bg-blue-100 rounded-lg hover:bg-blue-200"
            disabled={upvoteMutation.isLoading}
        >
            <ThumbsUp size={18} />
            <span>{issue.upvoteCount}</span>
        </button>
    );
};

export default UpvoteButton;
