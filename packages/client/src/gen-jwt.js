require("dotenv").config();
const jwt = require("jsonwebtoken");
const { v4: uuid } = require("uuid");

console.log(
	jwt.sign(
		{
			userId: uuid(),
		},
		process.env.JWT_SECRET || "secret"
	)
);
