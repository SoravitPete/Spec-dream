type DTOThread= {
    title: string
    context: string
    userId?: string
}

type createUser = DTOThread

export function newThreadData(
    {
        title,
        context,
        userId
    }: DTOThread
):createUser {
    return {
        title,
        context,
        userId
    }
}