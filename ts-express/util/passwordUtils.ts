import bcrypt from 'bcrypt';

export async function hashPassword(password: string): Promise<string> {
    const saltRounds = 10;

    const hashedPassword: string = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

console.log(hashPassword('admin1234'))
console.log(hashPassword('admin1234'))