const pact = require('@pact-foundation/pact-node');
const execSync = require('child_process').execSync;

// Получение переменных окружения с проверкой на их наличие
const pactBrokerUrl = process.env.PACT_BROKER_BASE_URL;
const pactBrokerToken = process.env.PACT_BROKER_TOKEN;
const publishVersion = process.env.PACT_BROKER_PUBLISH_VERSION;

if (!pactBrokerUrl || !pactBrokerToken) {
	console.error('Ошибка: Необходимо задать PACT_BROKER_BASE_URL и PACT_BROKER_TOKEN как переменные окружения.');
	process.exit(1); // Завершаем выполнение с ошибкой
}

// Получение хэша последнего коммита из Git для использования как версии потребителя
const gitHash = execSync('git rev-parse --short HEAD').toString().trim();

const opts = {
	pactFilesOrDirs: ['./pacts/'],
	pactBroker: pactBrokerUrl.trim(),
	pactBrokerToken: pactBrokerToken.trim(),
	tags: ['test'],
	consumerVersion: publishVersion,
};

console.log('--------------opts: ', opts);

pact.publishPacts(opts).then(() => {
	console.log('Pact contract publish complete!');
	console.log(`Head over to ${pactBrokerUrl}`);
	console.log('to see your published contracts');
}).catch((e) => {
	console.error('Pact contracts publishing failed: ', e);
});
