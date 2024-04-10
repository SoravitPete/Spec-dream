import { component } from "@prisma/client"

type DTOUser = {
    accountName: string
    firstName: string
    lastName: string
    email: string
    password: string
    spec?: component[]
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
        spec,
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
        spec,
        mobileNo,
        birthday,
        picture
    }
}