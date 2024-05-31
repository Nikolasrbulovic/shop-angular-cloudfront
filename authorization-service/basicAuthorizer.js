"use strict";

const Buffer = require("buffer").Buffer;

module.exports.handler = async (event) => {
  if (!event.authorizationToken) {
    return generatePolicy("user", "Deny", event.methodArn, 401);
  }
  const authHeader = event.authorizationToken;
  const token = authHeader.split(" ")[1];

  const decodedCreds = Buffer.from(token, "base64").toString("utf-8");
  const [username, password] = decodedCreds.split("=");

  if (process.env[username].trim() !== password.trim()) {
    return generatePolicy("user", "Deny", event.methodArn, 403);
  }

  return generatePolicy("user", "Allow", event.methodArn);
};

const generatePolicy = async (principalId, effect, resource, statusCode) => {
  const authResponse = {
    // statusCode: statusCode || 200,
    principalId: principalId,
  };

  if (effect && resource) {
    const policyDocument = {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: effect,
          Resource: resource,
        },
      ],
    };
    authResponse.policyDocument = policyDocument;
  }
  return authResponse;
};
