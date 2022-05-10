// Схема Устройства openHAB.
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = mongoose.SchemaTypes.ObjectId;

const ItemSchema = new Schema({
  _id: ObjectId,
  user: { type: ObjectId, ref: 'User' }, // id from user
  name: String, // Item name
  type: String, // Item type (Group, Switch, Number, etc)
  label: String, // Item label Ru ("Dinner lights")
  groupNames: [String], // An array of Strings of Group typed Items this Item belongs to Rooms
  state: String, // Current Item status
  prev_state: String, // Previous status value
  last_update: Date, // Date/time of last Item status update
  last_change: Date, // Date/time of last Item change
  link: String, // URL to API this device
});

ItemSchema.index({ user: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Item', ItemSchema);
