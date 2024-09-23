import { newConfig, number, string } from "ts-app-env";

export const env = newConfig({
    PORT: number({ default: 3000 }),
    npm_package_name: string(),
    DRIZZLE_LOCATION: string({ default: `./drizzle` }),
    NODE_ENV: string({ default: `development` })
}, process.env);