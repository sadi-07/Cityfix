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

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <h2 className="text-4xl lg:text-5xl font-extrabold text-center text-gradient mb-10">
        Latest Resolved Issues
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {issues.map(issue => (
          <div
            key={issue._id}
            className="bg-gray-100 rounded-lg shadow transition border border-gray-300 hover:scale-103"
          >
            {issue.image && (
              <img
                src={issue.image}
                alt={issue.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
            )}

            <div className="p-5 space-y-2">
              <h3 className="text-xl font-bold">{issue.title}</h3>

              <p className="text-gray-600">
                <strong>Category:</strong> {issue.category}
              </p>

              <p className="text-gray-600">
                <strong>Location:</strong> {issue.location}
              </p>

              <span className="inline-block px-5 py-1 bg-green-200 text-green-700 rounded font-semibold">
                Resolved
              </span>

              <div className="pt-3">
                <Link
                  to={`/issues/${issue._id}`}
                  className="inline-block px-4 py-2 bg-primary hover:bg-secondary text-white rounded w-full text-center text-lg font-bold"
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
