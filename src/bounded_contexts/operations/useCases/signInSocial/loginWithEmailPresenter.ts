export class LoginWithEmailPresenter {
    public static present(token: string, email: string): any {
        return {
            email: email,
            token
        };
    }
}
