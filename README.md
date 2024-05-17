# Как запаблишить новую версию контрактов

1. Создаём `.env` файл в корне фронтового проекта с таким содержанием:
```dotenv
# опционально: дебаг инфо
PACT_BROKER_LOG_LEVEL=debug
PACT_BROKER_LOG_FORMAT=json
PACT_BROKER_HTTP_DEBUG_LOGGING_ENABLED=true
PACT_BROKER_LOG_STREAM=stdout

# инфо с pactflow
PACT_BROKER_BASE_URL=<url-to-pactflow.io>
PACT_BROKER_TOKEN=<write-access-token>

# опционально: камстомная версия контрактов. Если не задана, то используется хэш гита
PACT_BROKER_PUBLISH_VERSION
```

2. Создаем запрос:
```typescript
    import axios from "axios";

    export class FiltersService {
        private apiUrl: string;
    
        constructor(api: string) {
          this.apiUrl = api;
        }
    
        async getFiltersConfig() {
            return await axios.request({
                baseURL: this.apiUrl,
                headers: {Accept: 'application/json'},
                method: 'GET',
                // эндпоинт
                url: '/filters/getFiltersConfig',
            })
        }
    }
```

3. Создаём тест с использованием матчеров.
Если тесты упадут, то контракт не сгенерируется.
Пример теста:
```typescript
// Настройка провайдера и названий "интеграции"
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
          // эндпоинт, стучится на свой мок-сервер
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
                // поля описываются матчерами
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
```

4. Открываем WSL для windows и задаём wsl второй версии по умолчанию. Протестировано на `Ubuntu 22.04 LTS`.
```bash
wsl --set-default-version 2
wsl --shutdown
```

5. Запускаем скрипт:
```bash
node ./publish.pact.js
```
либо через yarn:
```bash
yarn pact:publish
```

6. В консоли должно отобразиться нечто вроде:
```
Pact successfully republished for FrontendWebsiteV3 version c04c5e4
and provider BackendServiceV3 with no content changes.
```