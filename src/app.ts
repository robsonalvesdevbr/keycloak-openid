import express from "express";
import * as client from "openid-client";

const app = express();
const port = 8000;

const server: URL = new URL("http://localhost:8080/realms/ecommerce");
const clientId: string = "app-payment-client-secret";
const clientSecret: string = "V4ebDlZGTK7jsW9jOKnxWp2z2vpaqkI8";
let clientAuth!: client.ClientAuth | undefined;

(async () => {
	const config: client.Configuration = await client.discovery(
		server,
		clientId,
		clientSecret,
		clientAuth,
		{
			execute: [client.allowInsecureRequests],
		},
	);

	const redirect_uri: string = "http://localhost:8000/"; // URL to redirect to after authorization
	const scope: string = "openid app-payment-scope"; // Scope of the access request

	const code_verifier: string = client.randomPKCECodeVerifier();
	const code_challenge: string =
		await client.calculatePKCECodeChallenge(code_verifier);
	let state!: string;

	const parameters: Record<string, string> = {
		redirect_uri,
		scope,
		code_challenge,
		code_challenge_method: "S256",
	};

	if (!config.serverMetadata().supportsPKCE()) {
		state = client.randomState();
		parameters.state = state;
	}

	const redirectTo: URL = client.buildAuthorizationUrl(config, parameters);
	console.log("redirecting to", redirectTo.href);

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	// let getCurrentUrl!: (...args: any) => URL;

	// const tokens: client.TokenEndpointResponse =
	// 	await client.authorizationCodeGrant(config, getCurrentUrl(), {
	// 		pkceCodeVerifier: code_verifier,
	// 		expectedState: state,
	// 	});

	// console.log("Token Endpoint Response", tokens);
})();

app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.listen(port, () => {
	return console.log(`Express is listening at http://localhost:${port}`);
});
