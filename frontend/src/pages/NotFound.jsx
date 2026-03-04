import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import useAuthStore from "../store/authStore";

const NotFound = () => {
  const user = useAuthStore((state) => state.user);
  const homePath = user?.role ? `/${user.role}` : "/login";
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white px-6">
      <div className="max-w-lg text-center">
        <AlertTriangle size={64} className="text-red-500 mx-auto mb-4" />
        <h1 className="text-4xl font-bold sm:text-5xl">404 - Page Not Found</h1>
        <p className="mt-4 text-gray-400 text-lg">
          Oops! The page you’re looking for doesn’t exist. It might have been
          moved or deleted.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row sm:justify-center gap-4">
          <Link
            to={homePath}
            className="rounded-md bg-red-500 px-6 py-3 text-lg font-semibold text-white hover:bg-red-600 transition"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
