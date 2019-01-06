const { Model } = require('objection')
const timestamps = require('objection-timestamps').timestampPlugin()

class ProjectLink extends timestamps(Model) {
    static get tableName() {
        return 'project_links'
    }

    static get timestamp() {
        return true
    }

    static get relationMappings() {
        const { Project } = require('.')
        return {
            project: {
                relation: Model.BelongsToOneRelation,
                modelClass: Project,
                join: {
                    from: 'project_links.project_id',
                    to: 'projects.id'
                }
            }
        }
    }
}

module.exports = ProjectLink