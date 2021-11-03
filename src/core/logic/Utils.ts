export class Utils {
    public static roundTwoDecimals(n: number): number {
        return Math.round((n + Number.EPSILON) * 100) / 100;
    }
}
