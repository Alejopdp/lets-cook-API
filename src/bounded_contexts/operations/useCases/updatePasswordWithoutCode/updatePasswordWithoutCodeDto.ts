export interface UpdatePasswordWithoutCodeDto {
    email: string;
    newPassword: string;
    emailOfRequester: string;
}
