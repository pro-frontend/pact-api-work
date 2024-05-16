import {MatchersV3, PactV3} from '@pact-foundation/pact';
import path from "node:path";
import {UserService} from "../api/UserService";
import matchers from "@testing-library/jest-dom/matchers";

const {eachLike, like, string, regex} = MatchersV3;

// Create a 'pact' between the two applications in the integration we are testing
const provider = new PactV3({
	dir: path.resolve(process.cwd(), 'pacts'),
	consumer: 'PactTestConsumer',
	provider: 'PactTestProvider',
});

const usersExample = {
	data: [
		{
			id: 1,
			name: 'John',
			surname: 'Doe',
			isPrivate: true,
			vip: true,
		},
		{
			id: 2,
			name: 'Roland',
			surname: 'Smith',
			isPrivate: true,
			vip: true,
		},
	],
	message: 'findAll'
};
const EXPECTED_BODY = MatchersV3.like(usersExample);

const filtersConfigExample = [{
	type: "singleSelect",
	title: "Отправитель",
	defaultValues: null,
	list: [
		{
			values: [{
				elementId: 'string()',
				value: 'string()',
				name: 'string()'
			}],
			pagination: false,
			count: 50,
			currentPage: null,
			pagesCount: null
		}
	]
}];
const filtersConfigExampleCopy = eachLike({
	type: regex("/singleSelect|infiniteSingleSelect|multiSelect|infiniteMultiSelect|range|date/", "singleSelect"),
	title: string("Отправитель"),
	defaultValues: null,
	list: [
		{
			values: eachLike({
				elementId: string(),
				value: string(),
				name: string()
			}),
			pagination: false,
			count: 50,
			currentPage: null,
			pagesCount: null
		}
	]
});
const FILTERS_CONFIG_BODY = filtersConfigExample;

describe("API Pact test", () => {
	describe('GET /users', () => {
		test('returns an HTTP 200 and a list of users', async () => {
			// Arrange: Setup our expected interactions
			//
			// We use Pact to mock out the backend API
			provider
				.given('I have a list of users')
				.uponReceiving('a request for all users with the builder pattern')
				.withRequest({
					method: 'GET',
					path: '/users',
					headers: {Accept: 'application/json'},
				})
				.willRespondWith({
					status: 200,
					headers: {'Content-Type': 'application/json'},
					body: EXPECTED_BODY,
				});

			return provider.executeTest(async (mockserver) => {
				// Act: test our API client behaves correctly
				//
				// Note we configure the DogService API client dynamically to
				// point to the mock service Pact created for us, instead of
				// the real one
				const userService = new UserService(mockserver.url);
				const response = await userService.getUsers()

				// Assert: check the result
				expect(response.data).toEqual(usersExample);
			});
		});
	});

	describe("getting all filters config", () => {
		test('/filters/getFiltersConfig', async () => {
			// Arrange: Setup our expected interactions
			//
			// We use Pact to mock out the backend API
			provider
				.given('I have a list of filters config')
				.uponReceiving('get all filters config')
				.withRequest({
					method: "GET",
					path: "/filters/getFiltersConfig",
					headers: {Accept: 'application/json'},
				})
				.willRespondWith({
					status: 200,
					headers: {
						'Content-Type': 'application/json',
					},
					body: FILTERS_CONFIG_BODY,
				});

			return provider.executeTest(async (mockserver) => {
				// Act: test our API client behaves correctly
				//
				// Note we configure the DogService API client dynamically to
				// point to the mock service Pact created for us, instead of
				// the real one
				const userService = new UserService(mockserver.url);
				const response = await userService.getFiltersConfig()

				// Assert: check the result
				expect(response.data).toEqual(filtersConfigExample);
			});
		});
	});
});