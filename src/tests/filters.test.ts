import path from 'path';
import {
  PactV3,
  MatchersV3,
} from '@pact-foundation/pact';
import { FiltersService } from '../api/FiltersService';

const { eachLike, like, string, number, boolean, nullValue, regex } = MatchersV3;

const provider = new PactV3({
  consumer: 'FrontendWebsiteV3',
  provider: 'BackendServiceV3',
  dir: path.resolve(process.cwd(), 'pacts'),
});

describe('API Pact test', () => {
  describe('getting all filters config', () => {
    test('all filters config exists', async () => {
      // set up Pact interactions
      provider.addInteraction({
        uponReceiving: 'get all filters config',
        withRequest: {
          method: 'GET',
          path: '/filters/getFiltersConfig',
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
          body: eachLike({
            type: regex('/singleSelect|infiniteSingleSelect|multiSelect|infiniteMultiSelect|range|date/', 'singleSelect'),
            title: string('Отделение'),
            defaultValues: nullValue(),
            list: eachLike(
              {
                values: eachLike({
                  elementId: string('JBHVBHGVGHVVHVHDBJCN'),
                  value: string('Воронеж'),
                  name: string('Воронеж'),
                }),
                count: number(1),
                currentPage: number(1),
                pagesCount: number(1),
              },
            ),
          }),
        },
      });

      await provider.executeTest(async (mockService) => {
        const api = new FiltersService(mockService.url);

        // make request to Pact mock server
        const filtersConfig = await api.getFiltersConfig();

        expect(filtersConfig.data).toEqual([
          {
            type: 'singleSelect',
            title: 'Отделение',
            defaultValues: null,
            list: [
              {
                values: [{
                  elementId: 'JBHVBHGVGHVVHVHDBJCN',
                  value: 'Воронеж',
                  name: 'Воронеж',
                }],
                count: 1,
                currentPage: 1,
                pagesCount: 1,
              },
            ],
          },
        ]);
      });
    });
  });
});
