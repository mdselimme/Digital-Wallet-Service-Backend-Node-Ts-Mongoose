# Digital Wallet Server Backend.

- server link: [https://digital-wallet-server.vercel.app/]

### Features:

- In this server user can create an Account with role of User and Agent. When A user create an account he will get 50 taka bonus.
- Super admin can change their user role or update their account status.
- Super admin can blocked or delete account of user and agent.
- General user can cash in from agent, send money to user and cash out from agent and add money from super admin or admin.
- Agent Can cash in to user and can b2b transaction to another agent also can add money from admin or super admin.

### Technology Description:

- Runtime: Node,
- Language: Typescript,
- Framework: Express,
- Security: password security use bcrypt, Json Web token for secure route and role based authentication,
- For schema type check use zod validation
- Others: cors, cookie-parser, dotenv etc.

## Api Summary For Implement into frontend.

### User Api Description:

- User can create an account with name, email, password, role (User|Agent) type.

#### user create api

- method: `POST` api endpoint: https://digital-wallet-server.vercel.app/api/v1/user/register

##### schema design:

```json
{
    "name": string,
    "email": string,
    "password":string, //Password should be five character long and number format
    "phone": string, //11 digit bd format
    "role": string //Only role is Agent or User (default user) and optional
}
```

##### Request:

```json
{
    "name": "Md Selim",
    "email": "selimakondo58@gmail.com",
    "password":"65421", //Password should be five character long and number format
    "phone": "01700000000", //11 digit bd format
    "role": "User" //optional Only role is Agent or User (default: User)
}
```

#### Response:

```json
{
    "message": "User Created Successfully.",
    "statusCode": 201,
    "success": true,
    "data": {
        "_id": "688cab104f2d722330f5117d",
        "name": "Md. Selim",
        "email": "selimakondo60@gmail.com",
        "role": "Agent",
        "isActive": "Active",
        "isVerified": "true",
        "phone": "01700000000",
        "userStatus": "Approve",
        "createdAt": "2025-08-01T11:54:56.669Z",
        "updatedAt": "2025-08-01T11:54:57.550Z",
        "walletId": {
            "_id": "688cab114f2d722330f51182",
            "user": "688cab104f2d722330f5117d",
            "balance": 50,
            "transaction": [
                "688cab104f2d722330f51180"
            ],
            "createdAt": "2025-08-01T11:54:57.478Z",
            "updatedAt": "2025-08-01T11:54:57.478Z"
        }
    }
}
```

#### user update api

- method: `PATCH` api endpoint: https://digital-wallet-server.vercel.app/api/v1/user/update/:id
- credentials: true.

##### schema design:

- You can update one or more components.
- first login to user and you will find and accessToken and refreshToken


```json
{
    "name": string,
    "email": string,
    "password":string, //Password should be five character long and number format
    "phone": string, //11 digit bd format
    "address": string //Only role is Agent or User
}
```

##### Request:

```json
{
    "address":"Niguary, Gafargaon, Mymensingh"
}
```

#### Response:

```json
{
    "message": "Update User Successfully",
    "statusCode": 200,
    "success": true,
    "data": {
        "_id": "688be198d8dec19a99b16ab1",
        "name": "Md Usuf",
        "email": "usufahmed@gmail.com",
        "role": "Agent",
        "isActive": "Active",
        "isVerified": "true",
        "phone": "+8801932770803",
        "userStatus": "Pending",
        "createdAt": "2025-07-31T21:35:20.830Z",
        "updatedAt": "2025-08-01T12:14:15.455Z",
        "walletId": "688be198d8dec19a99b16ab6",
        "address": "Niguary, Gafargaon, Mymensingh"
    }
}
```

#### Get Me (self user)

- method: `GET` api endpoint: https://digital-wallet-server.vercel.app/api/v1/user/me
- credentials: true.

#### Response:

```json
{
    "message": "Update User Successfully",
    "statusCode": 200,
    "success": true,
    "data": {
        "_id": "688be198d8dec19a99b16ab1",
        "name": "Md Usuf",
        "email": "usufahmed@gmail.com",
        "role": "Agent",
        "isActive": "Active",
        "isVerified": "true",
        "phone": "+8801932770803",
        "userStatus": "Pending",
        "createdAt": "2025-07-31T21:35:20.830Z",
        "updatedAt": "2025-08-01T12:14:15.455Z",
        "walletId": "688be198d8dec19a99b16ab6",
        "address": "Niguary, Gafargaon, Mymensingh"
    }
}
```
