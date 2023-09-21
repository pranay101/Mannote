/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        GOOGLE_ID:process.env.GOOGLE_ID,
        GOOGLE_SECRET: process.env.GOOGLE_SECRET,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    },
    images: {
        domains: ['lh3.googleusercontent.com',"cdn.pixabay.com"],
    },
}

module.exports = nextConfig
