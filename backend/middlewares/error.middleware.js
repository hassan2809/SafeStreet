import dotenv from "dotenv";
dotenv.config();

export const notFound = (req, res, next) => {
	return res.status(404).json({ success: false, message: "Route not found" });
};

export const errorHandler = (err, req, res, next) => {
	// Default to 500 if not provided
	const statusCode = err.statusCode || 500;
	const message = err.message || "Internal Server Error";

	if (process.env.NODE_ENV !== "production") {
		// Log stack in non-production for debugging
		console.error(err);
	}

	return res.status(statusCode).json({ success: false, message });
};