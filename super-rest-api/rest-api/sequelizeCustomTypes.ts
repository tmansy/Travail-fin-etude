import { DataTypes, Utils } from 'sequelize';

export function createCustomDataType() {

  // class SOMETYPE extends DataTypes.ABSTRACT {
  //   // Mandatory: complete definition of the new type in the database
  //   toSql() {
  //     return 'INTEGER(11) UNSIGNED ZEROFILL'
  //   }

  //   // Optional: validator function
  //   validate(value:any, options:any) {
  //     return (typeof value === 'number') && (!Number.isNaN(value));
  //   }

  //   // Optional: sanitizer
  //   _sanitize(value:any) {
  //     // Force all numbers to be positive
  //     return value < 0 ? 0 : Math.round(value);
  //   }

  //   // Optional: value stringifier before sending to database
  //   _stringify(value:any) {
  //     return value.toString();
  //   }

  //   // Optional: parser for values received from the database
  //   static parse(value:any) {
  //     return Number.parseInt(value);
  //   }
  // }

  // // Mandatory: set the type key
  // SOMETYPE.prototype.key = SOMETYPE.key = 'SOMETYPE';

  // // Mandatory: add the new type to DataTypes. Optionally wrap it on `Utils.classToInvokable` to
  // // be able to use this datatype directly without having to call `new` on it.
  // DataTypes.SOMETYPE = Utils.classToInvokable(SOMETYPE);

  // // Optional: disable escaping after stringifier. Do this at your own risk, since this opens opportunity for SQL injections.
  // // DataTypes.SOMETYPE.escape = false;

}