require("dotenv").config();
const axios = require("axios");
const jwt = require("jsonwebtoken");
const { v4: uuid } = require("uuid");

const sendRequest = async (url, token) => {
	try {
		const initialConfig = { baseURL: "http://localhost/" };
		const config =
			token === undefined
				? { ...initialConfig }
				: {
						...initialConfig,
						headers: {
							Authorization: `Bearer ${token}`,
						},
				  };

		const res = await axios.get(url, config);

		return res.status;
	} catch (error) {
		if (error.response) {
			return error.response.status;
		} else {
			return error.message;
		}
	}
};

const generateToken = () => {
	return jwt.sign(
		{
			userId: uuid(),
		},
		process.env.JWT_SECRET
	);
};

const endpointsPrivate = [
	"/v1/private/fixed/one",
	"/v1/private/fixed/two",
	"/v1/private/fixed/five",
];

const endpointsPublic = [
	"/v1/public/fixed/one",
	"/v1/public/fixed/two",
	"/v1/public/fixed/five",
];

const testRateLimiter = async () => {
	const totalRequests = 400;

	for (let endpoint of endpointsPrivate) {
		const token = generateToken();

		const promises = Array(totalRequests)
			.fill()
			.map(() => sendRequest(endpoint, token));

		const results = await Promise.all(promises);

		const statusCounts = results.reduce(
			(counts, status) => ({ ...counts, [status]: (counts[status] || 0) + 1 }),
			{}
		);

		const successCount = statusCounts[200] || 0;
		const rateLimitedCount = statusCounts[429] || 0;
		const errorCount = totalRequests - successCount - rateLimitedCount;

		console.log(`\n==== Results for ${endpoint} ====`);
		console.log(`Total requests: ${totalRequests}`);
		console.log(
			`Successful requests: ${successCount} (${(
				(successCount / totalRequests) *
				100
			).toFixed(2)}%)`
		);
		console.log(
			`Rate limited requests: ${rateLimitedCount} (${(
				(rateLimitedCount / totalRequests) *
				100
			).toFixed(2)}%)`
		);
		console.log(
			`Errored requests: ${errorCount} (${(
				(errorCount / totalRequests) *
				100
			).toFixed(2)}%)`
		);
		console.log("Status counts:", statusCounts);
	}

	for (let endpoint of endpointsPublic) {
		await sendRequest("/clear-cache");

		const promises = Array(totalRequests)
			.fill()
			.map(() => sendRequest(endpoint));

		const results = await Promise.all(promises);

		const statusCounts = results.reduce(
			(counts, status) => ({ ...counts, [status]: (counts[status] || 0) + 1 }),
			{}
		);

		const successCount = statusCounts[200] || 0;
		const rateLimitedCount = statusCounts[429] || 0;
		const errorCount = totalRequests - successCount - rateLimitedCount;

		console.log(`\n==== Results for ${endpoint} ====`);
		console.log(`Total requests: ${totalRequests}`);
		console.log(
			`Successful requests: ${successCount} (${(
				(successCount / totalRequests) *
				100
			).toFixed(2)}%)`
		);
		console.log(
			`Rate limited requests: ${rateLimitedCount} (${(
				(rateLimitedCount / totalRequests) *
				100
			).toFixed(2)}%)`
		);
		console.log(
			`Errored requests: ${errorCount} (${(
				(errorCount / totalRequests) *
				100
			).toFixed(2)}%)`
		);
		console.log("Status counts:", statusCounts);
	}
};

testRateLimiter();
