const mongoose = require('mongoose');
const { Schema } = mongoose;
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const schemaEntity = {
	name: {
        type: String,
        default: null
	}
};

const CollectionSchema = new Schema(schemaEntity, { timestamps: true });

mongoose.model('Collection', CollectionSchema);
CollectionSchema.plugin(aggregatePaginate);

module.exports = exports = mongoose.model('Collection', CollectionSchema);