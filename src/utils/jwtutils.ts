import jwt, { JwtPayload } from 'jsonwebtoken';


const JWT_SECRET = 'secret';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'secret';

export const generateTokens = (user:any) => {
    const accessToken = jwt.sign(user, JWT_SECRET, {
        expiresIn: '4h'
    });

    const refreshToken = jwt.sign({ username: user.username, email: user.email, companyId: user.companyId }, REFRESH_SECRET, {
        expiresIn: '7d'
    });

    return { accessToken, refreshToken };
};

// export const storeRefreshToken = async (userId: number, refreshToken: string) => {
//     await db.insert(refreshTokens).values({ user_id: userId, token: refreshToken });
// };



export const verifyRefreshToken = (token: string): JwtPayload => {
    return jwt.verify(token, REFRESH_SECRET) as JwtPayload;
};

export const generateRefreshToken = (user: { username:string; email: any; }) => {
    return jwt.sign({ username: user.username, email: user.email }, REFRESH_SECRET, { expiresIn: '7d' });
};


