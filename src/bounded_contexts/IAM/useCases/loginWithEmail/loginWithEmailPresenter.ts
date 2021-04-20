export class LoginWithEmailPresenter {
    public static present(token: string, userInfo: object): any {
        return {
            token,
            userInfo,
        };
    }
}
