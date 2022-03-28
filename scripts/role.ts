import { Permission } from "../src/bounded_contexts/IAM/domain/permission/Permission";
import { Role } from "../src/bounded_contexts/IAM/domain/role/Role";
import * as uuid from "uuid";

export const adminRole: Role = new Role(
    "Administrador",
    [
        Permission.CREATE_ADMIN_USER,
        Permission.CREATE_PLAN,
        Permission.CREATE_RECIPE,
        Permission.DELETE_PLAN,
        Permission.DELETE_RECIPE,
        Permission.UPDATE_PLAN,
        Permission.UPDATE_RECIPE,
        Permission.VIEW_PLANS,
        Permission.VIEW_RECIPES,
        Permission.CREATE_SHIPPING_ZONE,
        Permission.UPDATE_SHIPPING_ZONE,
        Permission.DELETE_SHIPPING_ZONE,
        Permission.VIEW_SHIPPING_ZONE,
        Permission.CREATE_COUPON,
        Permission.UPDATE_COUPON,
        Permission.DELETE_COUPON,
        Permission.CREATE_CUSTOMER,
        Permission.UPDATE_CUSTOMER,
        Permission.DELETE_CUSTOMER,
        Permission.VIEW_CUSTOMER,
        Permission.CREATE_SUBSCRIPTION,
        Permission.UPDATE_SUBSCRIPTION,
        Permission.DELETE_SUBSCRIPTION,
        Permission.VIEW_SUBSCRIPTION,
        Permission.VIEW_ORDERS,
        Permission.CHARGE_NOW,
        Permission.UPDATE_PAYMENT_ORDER,
        Permission.VIEW_BLOG,
        Permission.EXPORT_SUBSCRIPTIONS,
        Permission.EXPORT_CANCELLATIONS,
        Permission.EXPORT_RECIPE_SELECTION,
        Permission.EXPORT_CUSTOMERS,
        Permission.EXPORT_CUSTOMER_ACTIONS,
        Permission.EXPORT_COUPONS,
    ],
    uuid.v4()
);

export const recetasRole = new Role("Recetas", [
    Permission.VIEW_BLOG,
    Permission.VIEW_CUSTOMER,
    Permission.VIEW_ORDERS,
    Permission.VIEW_PLANS,
    Permission.VIEW_RECIPES,
    Permission.VIEW_SHIPPING_ZONE,
    Permission.VIEW_SUBSCRIPTION,
    Permission.CREATE_RECIPE,
    Permission.UPDATE_RECIPE,
    Permission.DELETE_RECIPE,
]);

export const blogRole = new Role("Blog", [
    Permission.VIEW_BLOG,
    Permission.VIEW_CUSTOMER,
    Permission.VIEW_ORDERS,
    Permission.VIEW_PLANS,
    Permission.VIEW_RECIPES,
    Permission.VIEW_SHIPPING_ZONE,
    Permission.VIEW_SUBSCRIPTION,
]);

export const customerSupportRole = new Role("Atencion al cliente", [
    Permission.VIEW_BLOG,
    Permission.VIEW_CUSTOMER,
    Permission.VIEW_ORDERS,
    Permission.VIEW_PLANS,
    Permission.VIEW_RECIPES,
    Permission.VIEW_SHIPPING_ZONE,
    Permission.VIEW_SUBSCRIPTION,
]);
