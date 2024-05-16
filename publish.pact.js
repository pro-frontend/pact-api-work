const pact = require('@pact-foundation/pact-node');

const pactBrokerUrl = process.env.PACT_BROKER_BASE_URL.trim();
const pactBrokerToken = process.env.PACT_BROKER_TOKEN.trim();

const gitHash = require('child_process').execSync('git rev-parse --short HEAD').toString().trim();

const opts = {
	pactFilesOrDirs: ['./pacts/'],
	pactBroker: pactBrokerUrl,
	pactBrokerToken: pactBrokerToken,
	tags: ['test'],
	consumerVersion: '0.1.1',
};

console.log('--------------opts: ', opts);

pact.publishPacts(opts).then(() => {
	console.log('Pact contract publish complete!');
	console.log(`Head over to ${pactBrokerUrl}`);
	console.log('to see your published contracts');
}).catch((e) => {
	console.error('Pact contracts publishing failed: ', e);
});