import { Entity } from "../../../../core/domain/Entity";
import { CustomerId } from "./CustomerId";
import { UserPassword } from "../../../IAM/domain/user/UserPassword";
import { Address } from "../address/Address";
import { Billing } from "../billing/Billing";
import { PaymentMethod } from "./paymentMethod/PaymentMethod";
import { PaymentMethodId } from "./paymentMethod/PaymentMethodId";
import { PersonalInfo } from "./personalInfo/PersonalInfo";
import { Locale } from "../locale/Locale";
import { IPreferredDeliveryTime } from "./preferredDeliveryTime/IPreferredDeliveryTime";
import { Subscription } from "../subscription/Subscription";
import { Order } from "../order/Order";
import { Wallet } from "./wallet/Wallet";
import { UniqueEntityID } from "../../../../core/domain/UniqueEntityID";
import { DateOfCharge } from "./wallet/DateOfCharge";
import { WalletPaymentMehtod } from "./paymentMethod/WalletPaymentMethod";
import { CreateWalletLog } from "./wallet/WalletMovementLog/CreateWalletLog";
import { WalletMovementLogType } from "./wallet/WalletMovementLog/WalletMovementLogTypeEnum";
import { ChargeWalletLog } from "./wallet/WalletMovementLog/ChargeWalletLog";
import { DisableWalletLog } from "./wallet/WalletMovementLog/DisableWalletLog";
import { EnableWalletLog } from "./wallet/WalletMovementLog/EnableWalletLog";
import { PaySaturdayJobWithWalletLog } from "./wallet/WalletMovementLog/PaySaturdayJobWithWalletLog";
import { PurchasePlanWithWalletLog } from "./wallet/WalletMovementLog/PurchasPlanWithWalletLog";
import { SelectWalletAsDefaultLog } from "./wallet/WalletMovementLog/SelectWalletAsDefaultLog";
import { WalletMovementLog } from "./wallet/WalletMovementLog/WalletMovementLog";
import { RefundWalletLog } from "./wallet/WalletMovementLog/RefundWalletLog";
import { PaymentRejectedWalletLog } from "./wallet/WalletMovementLog/PaymentRejectedWalletLog";
import { WalletPaymentMethodUpdatedLog } from "./wallet/WalletMovementLog/WalletPaymentMethodUpdatedLog";

export class Customer extends Entity<Customer> {
    private _email: string;
    private _isEmailVerified: boolean;
    private _stripeId: string;
    private _paymentMethods: PaymentMethod[];
    private _shippingAddress?: Address;
    private _billingAddress?: Billing;
    private _password?: UserPassword;
    private _state?: string;
    private _codeToRecoverPassword?: string;
    private _personalInfo?: PersonalInfo;
    private _receivedOrdersQuantity: number;
    private _friendCode?: string;
    private _createdAt: Date;
    private _shopifyReceivedOrdersQuantity: number | undefined;
    private _firstOrderDate: Date | undefined;
    private _wallet: Wallet | undefined;

    protected constructor(
        email: string,
        isEmailVerified: boolean,
        stripeId: string,
        paymentMethods: PaymentMethod[],
        receivedOrdersQuantity: number,
        createdAt: Date,
        shippingAddress?: Address,
        billingAddress?: Billing,
        password?: UserPassword,
        state?: string,
        codeToRecoverPassword?: string,
        personalInfo?: PersonalInfo,
        id?: CustomerId,
        friendCode?: string,
        shopifyReceivedOrdersQuantity?: number,
        firstOrderDate?: Date,
        wallet?: Wallet
    ) {
        super(id);
        this._email = email;
        this._isEmailVerified = isEmailVerified;
        this._stripeId = stripeId;
        this._paymentMethods = paymentMethods;
        this._receivedOrdersQuantity = receivedOrdersQuantity;
        this._shippingAddress = shippingAddress;
        this._billingAddress = billingAddress;
        this._password = password;
        this._state = state;
        this._codeToRecoverPassword = codeToRecoverPassword;
        this._personalInfo = personalInfo;
        this._friendCode = friendCode;
        this._createdAt = createdAt;
        this._shopifyReceivedOrdersQuantity = shopifyReceivedOrdersQuantity;
        this._firstOrderDate = firstOrderDate;
        this._wallet = wallet;
    }

    public static create(
        email: string,
        isEmailVerified: boolean,
        stripeId: string,
        paymentMethods: PaymentMethod[],
        receivedOrdersQuantity: number,
        createdAt: Date,
        shippingAddress?: Address,
        billingAddress?: Billing,
        password?: UserPassword,
        state?: string,
        codeToRecoverPassword?: string,
        personalInfo?: PersonalInfo,
        id?: CustomerId,
        friendCode?: string,
        shopifyReceivedOrdersQuantity?: number,
        firstOrderDate?: Date,
        wallet?: Wallet
    ): Customer {
        return new Customer(
            email,
            isEmailVerified,
            stripeId,
            paymentMethods,
            receivedOrdersQuantity,
            createdAt,
            shippingAddress,
            billingAddress,
            password,
            state,
            codeToRecoverPassword,
            personalInfo,
            id,
            friendCode,
            shopifyReceivedOrdersQuantity,
            firstOrderDate,
            wallet
        );
    }

    public addWalletMovementLog(logType: WalletMovementLogType, amount: number, description?: string): void {
        switch (logType) {
            case WalletMovementLogType.CREATE_WALLET:
                this.wallet?.addWalletMovementLog(new CreateWalletLog(this.id, new Date()));
                break;
            case WalletMovementLogType.CHARGE_WALLET:
                this.wallet?.addWalletMovementLog(new ChargeWalletLog(this.id, new Date(), amount));
                break;
            case WalletMovementLogType.DISABLE_WALLET:
                this.wallet?.addWalletMovementLog(new DisableWalletLog(this.id, new Date()));
                break;
            case WalletMovementLogType.ENABLE_WALLET:
                this.wallet?.addWalletMovementLog(new EnableWalletLog(this.id, new Date()));
                break;
            case WalletMovementLogType.PAY_SATURDAY_JOB_WITH_WALLET:
                this.wallet?.addWalletMovementLog(new PaySaturdayJobWithWalletLog(this.id, new Date(), amount));
                break;
            case WalletMovementLogType.PURCHASE_PLAN_WITH_WALLET:
                this.wallet?.addWalletMovementLog(new PurchasePlanWithWalletLog(this.id, new Date(), amount));
                break;
            case WalletMovementLogType.SELECT_WALLET_AS_DEFAULT:
                this.wallet?.addWalletMovementLog(new SelectWalletAsDefaultLog(this.id, new Date()));
                break;
            case WalletMovementLogType.REFUND_WALLET:
                this.wallet?.addWalletMovementLog(new RefundWalletLog(this.id, new Date(), amount));
                break;
            case WalletMovementLogType.PAYMENT_REJECTED:
                this.wallet?.addWalletMovementLog(new PaymentRejectedWalletLog(this.id, new Date(), amount));
                break;
            case WalletMovementLogType.PAYMENT_METHOD_UPDATED:
                this.wallet?.addWalletMovementLog(new WalletPaymentMethodUpdatedLog(this.id, new Date(), 0, description))
            default:
                break;
        }
    }

    public createWallet(amountToCharge: number, paymentMethodForCharging: string, datesOfCharge: DateOfCharge[]): void {
        if (this.wallet) throw new Error("Ya tienes una billetera creada");
        if (!paymentMethodForCharging) throw new Error("Tienes que ingresar un método de pago para cargar la billetera");
        const paymentMethod: PaymentMethod | undefined = this.paymentMethods.find((method) => method.id.toString() === paymentMethodForCharging);

        if (!paymentMethod) throw new Error("El método de pago ingresado para cargar la billetera no existe");

        this.wallet = new Wallet(0, amountToCharge, paymentMethodForCharging, true, datesOfCharge, [new CreateWalletLog(this.id, new Date())], new UniqueEntityID());
        this.addPaymentMethod(new WalletPaymentMehtod(false))
    }

    public chargeMoneyToWallet(amountToCharge: number): void {
        if (!this.wallet) throw new Error("No se puede cargar dinero a la billetera porque no existe");
        this.wallet.chargeMoney(amountToCharge);
        this.addWalletMovementLog(WalletMovementLogType.CHARGE_WALLET, amountToCharge)
    }

    public updateWallet(amountToCharge: number, paymentMethodForCharging: string, isEnabled: boolean, datesOfCharge: DateOfCharge[]): void {
        if (!this.wallet) throw new Error("No se puede actualizar la billetera porque no existe");
        if (!this.wallet?.isEnabled && !isEnabled) throw new Error("Tienes que habilitar la billetera para poder actualizarla");
        const paymentMethod: PaymentMethod | undefined = this.paymentMethods.find((method) => method.id.toString() === paymentMethodForCharging);
        if (!paymentMethod) throw new Error("El método de pago ingresado para cargar la billetera no existe");

        this.wallet.updateAmountToCharge(amountToCharge);
        this.wallet.updateDatesOfCharge(datesOfCharge);
        if (this.wallet.paymentMethodForCharging !== paymentMethodForCharging) this.addWalletMovementLog(WalletMovementLogType.PAYMENT_METHOD_UPDATED, 0, paymentMethod.last4Numbers)
        this.wallet.paymentMethodForCharging = paymentMethodForCharging;
        if (this.wallet.isEnabled !== isEnabled) this.addWalletMovementLog(isEnabled ? WalletMovementLogType.ENABLE_WALLET : WalletMovementLogType.DISABLE_WALLET, 0)
        this.wallet.isEnabled = isEnabled

    }

    public getPresentedWalletMovements(locale: Locale): any[] {
        if (!this.wallet) return []


        return this.wallet.walletMovements.map((log: WalletMovementLog) => ({
            type: log.type,
            title: log.getTitle(locale),
            description: log.description,
            createdAt: log.createdAt,
            amount: log.amount
        })).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    public refundMoneyToWallet(amountToRefund: number): void {
        if (!this.wallet) throw new Error("No se puede reembolsar dinero a la billetera porque no existe");
        this.wallet.refundMoney(amountToRefund);
        this.addWalletMovementLog(WalletMovementLogType.REFUND_WALLET, amountToRefund)
    }

    public buyWithWallet(amountToPay: number): void {
        if (!this.wallet) throw new Error("No se puede comprar con la billetera porque no existe");
        this.wallet.buy(amountToPay);
        this.addWalletMovementLog(WalletMovementLogType.PURCHASE_PLAN_WITH_WALLET, amountToPay)
    }

    public payBillingJobWithWallet(amountToPay: number): boolean {
        let succeeded = false
        if (!this.wallet) return succeeded;

        succeeded = this.wallet.payBillingJob(amountToPay);
        if (succeeded) this.addWalletMovementLog(WalletMovementLogType.PAY_SATURDAY_JOB_WITH_WALLET, amountToPay);

        return succeeded;
    }

    public getPaymentMethodForChargingTheWallet(): PaymentMethod {
        if (!this.wallet) throw new Error("No se puede cargar dinero a la billetera porque no existe");

        const paymentMethod = this.paymentMethods.find((method) => method.id.toString() === this.wallet?.paymentMethodForCharging);
        if (!paymentMethod) throw new Error("No hay un método de pago para cargar la billetera");

        return paymentMethod;
    }

    public createFriendCode(codeNumber: number): void {
        this.friendCode = `LETSCOOK${codeNumber}`;
    }

    public changePassword(newPassword: UserPassword): void {
        this.password = newPassword;
    }

    public addPaymentMethod(newPaymentMethod: PaymentMethod): void {
        if (!this.hasAtLeastOnePaymentMethod() || this.hasNoDefaultPaymentMethod()) newPaymentMethod.isDefault = true;

        this.paymentMethods = [...this.paymentMethods, newPaymentMethod];
    }

    public addPaymentMethodAndSetItAsDefault(newPaymentMethod: PaymentMethod): void {
        newPaymentMethod.isDefault = true;
        this.paymentMethods.forEach((paymentMethod) => (paymentMethod.isDefault = false));
        this.paymentMethods = [...this.paymentMethods, newPaymentMethod];
    }
    public getDefaultPaymentMethod(): PaymentMethod | undefined {
        return this.paymentMethods.find((method) => method.isDefault);
    }

    public setDefaultPaymentMethod(paymentMethodId: PaymentMethodId): void {
        for (let method of this.paymentMethods) {
            if (method.id.equals(paymentMethodId)) {
                method.isDefault = true;
            } else {
                method.isDefault = false;
            }
        }
    }

    public hasPaymentMethodByStripeId(stripePaymentMethodId: string): boolean {
        return this.paymentMethods.some((method) => method.stripeId === stripePaymentMethodId);
    }

    public hasAtLeastOnePaymentMethod(): boolean {
        return this.paymentMethods.length > 0;
    }

    public hasNoDefaultPaymentMethod(): boolean {
        return this.paymentMethods.every((method) => !method.isDefault);
    }

    public hasDifferentLatAndLngAddress(lat: number, lng: number): boolean {
        return this.shippingAddress?.latitude !== lat || this.shippingAddress?.longitude !== lng;
    }

    public getDefaultPaymentMethodCardLabel(locale: Locale): string {
        const defaultMethod: PaymentMethod = this.getDefaultPaymentMethod()!;

        return defaultMethod.getCardLabel(locale);
    }

    public getDefaultPaymentMethodExpirationDateLabel(locale: Locale): string {
        const defaultMethod: PaymentMethod = this.getDefaultPaymentMethod()!;

        return defaultMethod.getExpirationDate(locale);
    }

    public getPaymentMethodStripeId(paymentMethodId: PaymentMethodId): string {
        const paymentMethod: PaymentMethod | undefined = this.paymentMethods.find((method) => method.id.equals(paymentMethodId));

        return paymentMethod?.stripeId || "";
    }

    public getFullNameOrEmail(): string {
        if (!!!this.getPersonalInfo().fullName) return this.email;

        return this.getPersonalInfo().fullName!;
    }

    public getPersonalInfo(): {
        name?: string;
        lastName?: string;
        fullName?: string;
        phone1?: string;
        phone2?: string;
        birthDate?: Date;
        preferredLanguage?: string;
    } {
        return {
            name: this.personalInfo?.name,
            lastName: this.personalInfo?.lastName,
            fullName:
                !!!this.personalInfo?.name && !!!this.personalInfo?.lastName
                    ? ""
                    : `${this.personalInfo?.name || ""} ${this.personalInfo?.lastName || ""}`,
            phone1: this.personalInfo?.phone1,
            phone2: this.personalInfo?.phone2,
            birthDate: this.personalInfo?.birthDate,
            preferredLanguage: this.personalInfo?.preferredLanguage,
        };
    }

    public changePersonalInfo(
        name: string,
        lastName: string,
        phone1: string,
        phone2: string,
        birthDate: Date,
        preferredLanguage: string
    ): void {
        if (!this.personalInfo) {
            const personalInfo: PersonalInfo = new PersonalInfo(name, lastName, phone1, phone2, birthDate, preferredLanguage);
            this.personalInfo = personalInfo;
        } else {
            this.personalInfo?.changeInfo(name, lastName, phone1, phone2, birthDate, preferredLanguage);
        }
    }

    public changeBillingAddress(
        lat: number,
        long: number,
        addressName: string,
        customerName: string,
        details: string,
        identification: string,
        city: string,
        province: string,
        country: string,
        postalCode: string
    ): void {
        if (!this.billingAddress) {
            const billingAddress: Billing = new Billing(lat, long, addressName, customerName, details, city, province, postalCode, country, identification);
            this.billingAddress = billingAddress;
        } else {
            this.billingAddress?.changeInfoBilling(lat, long, addressName, customerName, details, identification);
        }
    }

    public countOneReceivedOrder(): void {
        this.receivedOrdersQuantity = this.receivedOrdersQuantity + 1;
    }

    public getShippingAddress(locale: Locale = Locale.es): {
        addressName?: string;
        addressDetails?: string;
        preferredShippingHour: string;
        latitude?: number;
        longitude?: number;
        city: string;
        country: string;
        postalCode: string;
        province: string;
    } {
        return {
            addressDetails: this.shippingAddress?.details,
            addressName: this.shippingAddress?.name,
            preferredShippingHour: this.shippingAddress?.deliveryTime?.value() || "",
            latitude: this.shippingAddress?.latitude,
            longitude: this.shippingAddress?.longitude,
            city: this.shippingAddress?.city ?? "",
            province: this.shippingAddress?.province ?? "",
            country: this.shippingAddress?.country ?? "",
            postalCode: this.shippingAddress?.postalCode ?? "",
        };
    }

    public getBillingData(): {
        addressName?: string;
        details?: string;
        customerName?: string;
        identification?: string;
        latitude?: number;
        longitude?: number;
        city: string;
        country: string;
        postalCode: string;
        province: string;

    } {
        return {
            addressName: this.billingAddress?.addressName,
            details: this.billingAddress?.details,
            customerName: this.billingAddress?.customerName,
            identification: this.billingAddress?.identification,
            latitude: this.billingAddress?.latitude,
            longitude: this.billingAddress?.longitude,
            city: this.billingAddress?.city ?? "",
            province: this.billingAddress?.province ?? "",
            country: this.billingAddress?.country ?? "",
            postalCode: this.billingAddress?.postalCode ?? "",
        };
    }

    public changeShippingAddress(
        lat: number,
        long: number,
        name: string,
        fullName: string,
        details: string,
        city: string,
        province: string,
        country: string,
        postalCode: string,
        deliveryTime?: IPreferredDeliveryTime
    ): void {
        if (!this.shippingAddress) {
            const shippingAddress: Address = new Address(lat, long, name, fullName, details, city, province, country, postalCode, deliveryTime);
            this.shippingAddress = shippingAddress;
        } else {
            this.shippingAddress?.changeInfoShipping(lat, long, name, fullName, details, city, province, country, postalCode, deliveryTime);
        }
    }

    public changePaymentMethod(
        paymentId: string,
        brand: string,
        last4Numbers: string,
        exp_month: number,
        exp_year: number,
        cvc: string,
        stripeId: string,
        isDefault: boolean
    ): void {
        if (paymentId === "wallet" && !this.wallet) throw new Error("No se puede agregar la billetera porque no existe")
        const filterPaymentById = this.paymentMethods.filter((payment: PaymentMethod) => payment.id.value === paymentId);
        if (filterPaymentById.length === 0) throw new Error("El método de pago seleccionado no existe");
        if (filterPaymentById.length > 0) {
            if (isDefault) {
                for (let paymentMethod of this.paymentMethods) {
                    if (paymentMethod.id.equals(new PaymentMethodId(paymentId))) {
                        paymentMethod.isDefault = true;
                    } else {
                        paymentMethod.isDefault = false;
                    }
                }
            }
        } else {
            if (isDefault) {
                if (this.paymentMethods.length > 0) {
                    const filterPaymentsByDiferentId = this.paymentMethods.filter(
                        (payment: PaymentMethod) => payment.id.value !== paymentId
                    );
                    filterPaymentsByDiferentId.map((payments: PaymentMethod) => (payments.isDefault = false));
                }
            }
            const paymentMethod: PaymentMethod = new PaymentMethod(brand, last4Numbers, exp_month, exp_year, cvc, isDefault, stripeId);
            this.paymentMethods = [...this.paymentMethods, paymentMethod];
        }
    }

    // En este momento a todos los clientes le pone "active". La idea es que si tiene 1 o mas suscripciones vigentes es "Activa".
    // Si tuvo una suscripcion pero ahora no tiene es "Plan Cancelado". Dentro de los planes cancelados, si solo recibió 1 vez es "Cazaofertas".
    // Si no tiene ninguna suscripción activa y nunca recibió es "Prospecto" ==> NI CANCELADA

    public getCustomerStatus(
        allCustomerSubscriptions: Subscription[],
        pastOrders: Order[]
    ): "Activo" | "Plan cancelado" | "Cazaofertas" | "Prospecto" {
        const subscriptionOrderMap: { [subscriptionId: string]: Order[] } = {};

        for (let order of pastOrders) {
            if (Array.isArray(subscriptionOrderMap[order.subscriptionId.toString()]))
                subscriptionOrderMap[order.subscriptionId.toString()] = [...subscriptionOrderMap[order.subscriptionId.toString()], order];
            else subscriptionOrderMap[order.subscriptionId.toString()] = [order];
        }

        if (allCustomerSubscriptions.length === 0) return "Prospecto";
        if (allCustomerSubscriptions.some((sub) => sub.isActive())) return "Activo";

        if (pastOrders.length === 0) return "Prospecto";

        for (let sub of allCustomerSubscriptions) {
            if (subscriptionOrderMap[sub.id.toString()]?.filter((order) => order.isBilled()).length > 1) return "Plan cancelado";
        }

        return "Cazaofertas";
    }

    /**
     * Getter email
     * @return {string}
     */
    public get email(): string {
        return this._email;
    }

    /**
     * Getter isEmailVerified
     * @return {boolean}
     */
    public get isEmailVerified(): boolean {
        return this._isEmailVerified;
    }

    /**
     * Getter password
     * @return {UserPassword}
     */
    public get password(): UserPassword | undefined {
        return this._password;
    }

    /**
     * Getter state
     * @return {string}
     */
    public get state(): string | undefined {
        return this._state;
    }

    /**
     * Getter state
     * @return {string}
     */
    public get codeToRecoverPassword(): string | undefined {
        return this._codeToRecoverPassword;
    }

    /**
     * Getter receivedOrdersQuantity
     * @return {number}
     */
    public get receivedOrdersQuantity(): number {
        return this._receivedOrdersQuantity;
    }

    /**
     * Getter shippingAddress
     * @return {Address | undefined}
     */
    public get shippingAddress(): Address | undefined {
        return this._shippingAddress;
    }

    /**
     * Getter billingAddress
     * @return {Address | undefined}
     */
    public get billingAddress(): Billing | undefined {
        return this._billingAddress;
    }

    /**
     * Getter stripeId
     * @return {string}
     */
    public get stripeId(): string {
        return this._stripeId;
    }

    /**
     * Getter paymentMethods
     * @return {PaymentMethod[]}
     */
    public get paymentMethods(): PaymentMethod[] {
        return this._paymentMethods;
    }

    /**
     * Getter personalInfo
     * @return {PersonalInfo}
     */
    public get personalInfo(): PersonalInfo | undefined {
        return this._personalInfo;
    }

    /**
     * Getter friendCode
     * @return {string | undefined}
     */
    public get friendCode(): string | undefined {
        return this._friendCode;
    }

    /**
     * Getter createdAt
     * @return {Date}
     */
    public get createdAt(): Date {
        return this._createdAt;
    }


    /**
     * Getter wallet
     * @return {Wallet | undefined}
     */
    public get wallet(): Wallet | undefined {
        return this._wallet;
    }

    /**
     * Setter wallet
     * @param {Wallet | undefined} value
     */
    public set wallet(value: Wallet | undefined) {
        this._wallet = value;
    }


    /**
     * Setter email
     * @param {string} value
     */
    public set email(value: string) {
        this._email = value;
    }

    /**
     * Setter isEmailVerified
     * @param {boolean} value
     */
    public set isEmailVerified(value: boolean) {
        this._isEmailVerified = value;
    }

    /**
     * Setter password
     * @param {UserPassword} value
     */
    public set password(value: UserPassword | undefined) {
        this._password = value;
    }

    /**
     * Setter state
     * @param {string} value
     */
    public set state(value: string | undefined) {
        this._state = value;
    }

    /**
     * Setter state
     * @param {string} value
     */
    public set codeToRecoverPassword(value: string | undefined) {
        this._codeToRecoverPassword = value;
    }

    /**
     * Setter receivedOrdersQuantity
     * @param {number} value
     */
    public set receivedOrdersQuantity(value: number) {
        this._receivedOrdersQuantity = value;
    }

    /**
     * Setter shippingAddress
     * @param {Address | undefined} value
     */
    public set shippingAddress(value: Address | undefined) {
        this._shippingAddress = value;
    }

    /**
     * Setter billingAddress
     * @param {Address | undefined} value
     */
    public set billingAddress(value: Billing | undefined) {
        this._billingAddress = value;
    }

    /**
     * Setter stripeId
     * @param {string} value
     */
    public set stripeId(value: string) {
        this._stripeId = value;
    }

    /**
     * Setter paymentMethods
     * @param {PaymentMethod[]} value
     */
    public set paymentMethods(value: PaymentMethod[]) {
        this._paymentMethods = value;
    }

    /**
     * Setter personalInfo
     * @param {PersonalInfo} value
     */
    public set personalInfo(value: PersonalInfo | undefined) {
        this._personalInfo = value;
    }

    /**
     * Setter friendCode
     * @param {string | undefined} value
     */
    public set friendCode(value: string | undefined) {
        this._friendCode = value;
    }

    /**
     * Setter createdAt
     * @param {Date} value
     */
    public set createdAt(value: Date) {
        this._createdAt = value;
    }

    /**
     * Getter shopifyReceivedOrdersQuantity
     * @return {number | undefined}
     */
    public get shopifyReceivedOrdersQuantity(): number | undefined {
        return this._shopifyReceivedOrdersQuantity;
    }

    /**
     * Getter firstOrderDate
     * @return {Date | undefined }
     */
    public get firstOrderDate(): Date | undefined {
        return this._firstOrderDate;
    }

    /**
     * Setter shopifyReceivedOrdersQuantity
     * @param {number | undefined} value
     */
    public set shopifyReceivedOrdersQuantity(value: number | undefined) {
        this._shopifyReceivedOrdersQuantity = value;
    }

    /**
     * Setter firstOrderDate
     * @param {Date | undefined} value
     */
    public set firstOrderDate(value: Date | undefined) {
        this._firstOrderDate = value;
    }
}
