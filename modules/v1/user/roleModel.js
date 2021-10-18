
const mongoose = require('mongoose');
const { Schema } = mongoose;

const schemaEntity = {
  role: {
    type: String,
    enum: ['regular', 'manager', 'globalManager'],
    required: true,
    default: 'regular'
  },
  groupId: {
    type: Schema.ObjectId,
    ref: 'Group'
  },
};

const RoleSchema = new Schema(schemaEntity, { timestamps: true });

mongoose.model('Role', RoleSchema);
module.exports = exports = mongoose.model('Role', RoleSchema);