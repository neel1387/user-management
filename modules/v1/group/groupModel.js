const mongoose = require('mongoose');
const { Schema } = mongoose;
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const schemaEntity = {
	name: {
		type: String,
		default: null
	},
	collectionIds: [{
		collectionId: {
			type: Schema.ObjectId,
			ref: 'Collection'
		}
	}],
};

const GroupSchema = new Schema(schemaEntity, { timestamps: true });

mongoose.model('Group', GroupSchema);
GroupSchema.plugin(aggregatePaginate);

module.exports = exports = mongoose.model('Group', GroupSchema);