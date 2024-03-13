export class UserDto {
    id: number;
    email: string;
    isActivated: boolean;

    constructor(
        user: { id: number; email: string },
        emailInfo: { is_activated: boolean }
    ) {
        this.id = user.id;
        this.email = user.email;
        this.isActivated = emailInfo.is_activated;
    }
}
