import { Schema } from 'mongoose';
/* eslint-disable no-invalid-this */
import assert from 'assert';

/**
 * Implement optimistic concurrency control using a schema's version key.
 *
 * @param {mongoose.Schema} schema - A Mongoose schema to be plugged into.
 */
export function versionOCCPlugin(schema: Schema<any>) {
  // Get version key name
  const versionKey: any = schema.get('versionKey');
  assert(versionKey, 'document schema must have a version key');

  // Add pre-save hook to check version
  schema.pre('save', function (next) {
    // Condition the save on the versions matching
    this.$where = {
      ...this.$where,
      [versionKey]: this.get(versionKey),
    };

    // Increment the version atomically
    this.increment();

    // Invoke next hook
    next();
  });
}
