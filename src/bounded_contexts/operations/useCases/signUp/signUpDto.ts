export interface SignUpDto {
    email: string;
    isEmailVerified: boolean;
    password: string;
    state: string;
    isInCheckout: boolean;
}
