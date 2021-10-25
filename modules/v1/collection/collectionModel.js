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
CollectionSchema.plugin(aggregatePaginate);
mongoose.model('Collection', CollectionSchema);

module.exports = exports = mongoose.model('Collection', CollectionSchema);