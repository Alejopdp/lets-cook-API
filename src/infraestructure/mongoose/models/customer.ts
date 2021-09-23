import mongoose from "mongoose";
import * as uuid from "uuid";

const AddressSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: uuid.v4,
    },

    latitude: {
        type: Number,
        required: true,
    },

    longitude: {
        type: Number,
        required: true,
    },

    addressName: {
        type: String,
        required: true,
    },

    addressDetails: {
        type: String,
    },

    addressFullName: {
        type: String,
    },

    deliveryTime: {
        type: String,
    },
});

const BillingSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: uuid.v4,
    },

    latitude: {
        type: Number,
        required: true,
    },

    longitude: {
        type: Number,
        required: true,
    },

    addressName: {
        type: String,
        required: true,
    },

    addressDetails: {
        type: String,
    },

    customerName: {
        type: String,
        required: true,
    },

    identification: {
        type: String,
        required: true,
    },
});

const PersonalInfoSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: uuid.v4,
    },

    name: {
        type: String,
        required: true,
    },

    lastName: {
        type: String,
        required: true,
    },

    phone1: {
        type: String,
    },

    phone2: {
        type: String,
    },

    birthDate: {
        type: String,
    },

    preferredLanguage: {
        type: String,
    },
});

const PaymentMethodSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: uuid.v4,
    },

    brand: {
        type: String,
        required: true,
    },

    last4Numbers: {
        type: String,
        required: true,
    },

    exp_month: {
        type: Number,
        required: true,
    },

    exp_year: {
        type: Number,
        required: true,
    },

    cvc: {
        type: String,
    },

    stripeId: {
        type: String,
        required: true,
    },

    isDefault: {
        type: Boolean,
        required: true,
    },
});

const CustomerSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: uuid.v4,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        isEmailVerified: {
            type: Boolean,
            required: true,
        },
        stripeId: {
            type: String,
            required: true,
        },
        password: {
            type: String,
        },
        state: {
            type: String,
            required: true,
        },
        receivedOrdersQuantity: {
            type: Number,
            required: true,
            default: 0,
        },
        personalInfo: {
            type: PersonalInfoSchema,
        },
        shippingAddress: {
            type: AddressSchema,
        },
        billingAddress: {
            type: BillingSchema,
        },
        codeToRecoverPassword: {
            type: String,
        },
        paymentMethods: {
            type: [PaymentMethodSchema],
            required: true,
            default: [],
        },
        deletionFlag: {
            type: Boolean,
            default: false,
        },
    },
    { collection: "Customer", timestamps: true }
);

export const Customer = mongoose.model("Customer", CustomerSchema);
