type DTOUser = {
    accountName: string
    firstName: string
    lastName: string
    email: string
    password: string
    mobileNo: string
    birthday: string
    picture: string
}

type createUser = DTOUser

export function newUserData(
    {
        accountName,
        firstName,
        lastName,
        email,
        password,
        mobileNo,
        birthday,
        picture
    }: DTOUser
):createUser {
    return {
        accountName,
        firstName,
        lastName,
        email,
        password,
        mobileNo,
        birthday,
        picture
    }
}