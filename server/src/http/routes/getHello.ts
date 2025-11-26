import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";

export const getHello: FastifyPluginCallbackZod = (app) => {
	app.get("/hello", async () => {
		return "Hello, world!";
	});
};
