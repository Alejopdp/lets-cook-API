export class ChargeOnePaymentOrderPresenter {
    public present({ paymentIntentId, paymentOrderState }: { paymentIntentId: string; paymentOrderState: string }): any {
        return { paymentIntentId, paymentOrderState };
    }
}
