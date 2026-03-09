export const successResponse = (res, message, data = {}, statusCode = 200) => {
	return res.status(statusCode).json({
		message,
		results: data,
		success: true,
	});
};

export const errorResponse = (res, message = "internal server error", statusCode = 500) => {
	return res.status(statusCode).json({
		message,
		success: false,
	});
};
