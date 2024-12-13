import bcrypt from 'bcrypt';

export async function createHash(pass:string){
    console.log(pass, "pass")
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(pass, salt);


    return {hashedPassword, salt}

}



export async function checkPassword(password:string, dbpass:string) {
    const isMatch = await bcrypt.compare(password, dbpass);


    return isMatch
}