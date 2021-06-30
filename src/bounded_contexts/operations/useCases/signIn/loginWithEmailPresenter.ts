export class LoginWithEmailPresenter {
    public static present(token: string, email: string): any {
        return {
            userInfo: { email },
            token,
        };
    }
}
