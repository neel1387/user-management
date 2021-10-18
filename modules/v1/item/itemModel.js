const mongoose = require('mongoose');
const { Schema } = mongoose;
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const schemaEntity = {
	name: {
		type: String,
		default: null
	},
	parentId: {
		type: Schema.ObjectId,
		ref: 'Collection'
	},
};

const ItemSchema = new Schema(schemaEntity, { timestamps: true });

mongoose.model('Item', ItemSchema);
ItemSchema.plugin(aggregatePaginate);

module.exports = exports = mongoose.model('Item', ItemSchema);