export interface UserEntity {
    id?: string;
    email: string;
    pwdHash: string;
    accountType: string;
    jwtCookie?: string
}


// https://nuidzruvvg.cfolks.pl/hh/user/register
export interface CreateUserReq {
    email: string;
    pwdHash: string;
    accountType: string;
}

export interface CreateUserResponse {
    message: string;
    userId?: string;
}

export interface UserLogin {
    email: string;
    pwdHash: string;
}

export interface UserLoginResponse {
    message: string;
    userId?: string;
    userEmail?: string;


}




// https://nuidzruvvg.cfolks.pl/hh/user/logout
export interface UserLogout {
    userId: string;
}

export interface UserLogoutResponse {
    message: string
}

