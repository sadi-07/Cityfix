import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import axios from "axios";

const backend = "https://city-fix-server-one.vercel.app";

const LatestResolved = () => {
  const { data: issues = [], isLoading } = useQuery({
    queryKey: ["latestResolved"],
    queryFn: async () => {
      const res = await axios.get(`${backend}/issues/resolved/latest`);
      return res.data;
    },
  });

  if (isLoading) {
    return <p className="text-center py-10">Loading latest resolved issues...</p>;
  }

  if (!issues.length) {
    return (
      <p className="text-center py-10 text-gray-500">
        No resolved issues yet.
      </p>
    );
  }

  
  const latestIssues = [...issues]
    .filter((i) => i.status === "Closed")
    .sort((a, b) => new Date(b.resolvedAt || b.updatedAt || b.createdAt) - new Date(a.resolvedAt || a.updatedAt || a.createdAt))
    .slice(0, 6); 

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <h2 className="text-4xl lg:text-5xl font-extrabold text-center mb-10  text-gradient">
        Latest Resolved Issues
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {latestIssues.map((issue) => (
          <div
            key={issue._id}
            className="bg-gray-100 rounded-lg shadow hover:shadow-lg border border-primary/30 transition"
          >
            {issue.image && (
              <img
                src={issue.image}
                alt={issue.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
            )}

            <div className="p-5 space-y-2">
              <h3 className="text-2xl font-bold line-clamp-1">
                {issue.title}
              </h3>

              <p className="text-base text-gray-600">
                <strong>Category:</strong> {issue.category}
              </p>

              <p className="text-base text-gray-600">
                <strong>Location:</strong> {issue.location}
              </p>

              <span className="inline-block px-3 py-1 font-semibold bg-green-300 text-green-700 rounded">
                Resolved
              </span>

              <div className="pt-3">
                <Link
                  to={`/issues/${issue._id}`}
                  className="inline-block px-4 py-2 bg-gradient text-white font-semibold rounded"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LatestResolved;
