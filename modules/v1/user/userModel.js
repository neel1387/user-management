const mongoose = require('mongoose');
const { Schema } = mongoose;

const schemaEntity = {
	email: {
        type: String,
	},
	password: {
        type: String,
	},
	roles: [{
		roleId: {
			type: Schema.ObjectId,
			ref: 'Role'
		}
	}],
};

const UserSchema = new Schema(schemaEntity, { timestamps: true });

mongoose.model('User', UserSchema);
module.exports = exports = mongoose.model('User', UserSchema);