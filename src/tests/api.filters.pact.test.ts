import path from "path";
import {
	PactV3,
	MatchersV3,
} from "@pact-foundation/pact";
import {API} from "../../../../pact-workshop-js/consumer/src/api";

const {eachLike, like, string, regex} = MatchersV3;

const provider = new PactV3({
	consumer: "FrontendWebsiteV2",
	provider: "ProductServiceV2",
	dir: path.resolve(process.cwd(), "pacts"),
});

describe("API Pact test", () => {
	describe("getting all filters config", () => {
		test("all filters config exists", async () => {
			// set up Pact interactions
			await provider.addInteraction({
				uponReceiving: "get all filters config",
				withRequest: {
					method: "GET",
					path: "/filters/getFiltersConfig",
				},
				willRespondWith: {
					status: 200,
					headers: {
						"Content-Type": "application/json",
					},
					body: eachLike([{
						type: regex("/singleSelect|infiniteSingleSelect|multiSelect|infiniteMultiSelect|range|date/", "singleSelect"),
						title: string("Отправитель"),
						defaultValues: null,
						list: [
							{
								values: [{
									elementId: string(),
									value: string(),
									name: string()
								}],
								pagination: false,
								count: 50,
								currentPage: null,
								pagesCount: null
							}
						]
					}]),
				},
			});

			await provider.executeTest(async (mockService) => {
				const api = new API(mockService.url);

				// make request to Pact mock server
				const product = await api.getFiltersConfig();

				expect(product).toStrictEqual([
					[{
						type: "singleSelect",
						title: "Отделение",
						defaultValues: null,
						list: [
							{
								values: [{
									elementId: "JBHVBHGVGHVVHVHDBJCN",
									value: "Воронеж",
									name: "Воронеж"
								}],
								pagination: false,
								count: 1,
								currentPage: null,
								pagesCount: null
							}
						]
					}],
				]);
			});
		});
	});
});
