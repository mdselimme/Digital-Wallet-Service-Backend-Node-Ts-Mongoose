# Digital Wallet Server Backend.

- server link: [https://digital-wallet-server.vercel.app/]

### Features:

    * In this server user can create an Account with role of User and Agent.
    * Super admin can change their user role or update their account status.
    * General user can cash in from agent, send money to user and cash out from agent and add money from super admin or admin.
    * Agent Can cash in to user and can b2b transaction to another agent also can add money from admin or super admin.

### Technology Description:

    * Runtime: Node,
    * Language: Typescript,
    * Framework: Express,
    * Security: password security use bcrypt, Json Web token for secure route and role based authentication,
    * For schema type check use zod validation
    * Others: cors, cookie-parser, dotenv etc.

## Api Summary For Implement into frontend.

### User Api Description:

    * User can create an account with name, email, password, role (User|Agent) type.
