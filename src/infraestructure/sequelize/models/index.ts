import { Dialect, Op, Sequelize } from "sequelize";
import { logger } from "../../../config/config";
import { credentials } from "../config/config";
import { UserFactory } from "./user";

const operatorsAliases = {
  $eq: Op.eq,
  $ne: Op.ne,
  $gte: Op.gte,
  $gt: Op.gt,
  $lte: Op.lte,
  $lt: Op.lt,
  $not: Op.not,
  $in: Op.in,
  $notIn: Op.notIn,
  $is: Op.is,
  $like: Op.like,
  $notLike: Op.notLike,
  $iLike: Op.iLike,
  $notILike: Op.notILike,
  $regexp: Op.regexp,
  $notRegexp: Op.notRegexp,
  $iRegexp: Op.iRegexp,
  $notIRegexp: Op.notIRegexp,
  $between: Op.between,
  $notBetween: Op.notBetween,
  $overlap: Op.overlap,
  $contains: Op.contains,
  $contained: Op.contained,
  $adjacent: Op.adjacent,
  $strictLeft: Op.strictLeft,
  $strictRight: Op.strictRight,
  $noExtendRight: Op.noExtendRight,
  $noExtendLeft: Op.noExtendLeft,
  $and: Op.and,
  $or: Op.or,
  $any: Op.any,
  $all: Op.all,
  $values: Op.values,
  $col: Op.col,
};

export const db = new Sequelize(credentials.host || "127.0.0.1", credentials.username || "postgres", credentials.password || "Pass1234", {
  host: credentials.host,
  port: 5432,
  dialect: credentials.dialect as Dialect | undefined,
  pool: {
    max: 20,
    min: 0,
    acquire: 60000,
    idle: 10000,
  },
  define: {
    freezeTableName: true,
  },
  timezone: "+02:00",
  operatorsAliases,
  logging: logger.debug.bind(logger),
});

// export const Permission = PermissionFactory(db);
export const User = UserFactory(db);

// Role.belongsToMany(Permission, { through: RolePermission, foreignKey: "roleId" });
// Role.hasMany(User, { foreignKey: "roleId" });
// Role.hasMany(RolePermission, { foreignKey: "roleId" });

export default db;
