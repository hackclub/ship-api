const algoliasearch = require('algoliasearch')
const client = algoliasearch(process.env.ALGOLIA_APPLICATION_ID, process.env.ALGOLIA_ADMIN_API_KEY)

exports.projectIndex = client.initIndex('projects')
exports.topicIndex = client.initIndex('topics')
exports.userIndex = client.initIndex('users')