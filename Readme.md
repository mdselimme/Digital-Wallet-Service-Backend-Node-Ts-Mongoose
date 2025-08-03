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

## User Api Description:

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

#### User update api

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
    "message": "Get User Successfully",
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

#### Get Single User

- method: `GET` api endpoint: https://digital-wallet-server.vercel.app/api/v1/user/{ObjectId}
- credentials: true
- Super Admin and Admin can access this route.

#### Response:

```json
{
    "message": "Get User Successfully",
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

#### Role user to admin update

- method: `PATCH` api endpoint: https://digital-wallet-server.vercel.app/api/v1/user/role?email={useremail}
- credentials: true.
- Super Admin Only Access this route

##### schema body design:

- Role Will be Admin

```json
{
    "role": string // Role can be User to Admin (Only Admin Value support this.)
}
```

##### Request:

example: https://digital-wallet-server.vercel.app/api/v1/user/role?email=usufahmed@gmail.com

```json
{
    "role":"Admin"
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
        "role": "Admin",
        "isActive": "Active",
        "isVerified": true,
        "phone": "+8801932770803",
        "userStatus": "Approve",
        "createdAt": "2025-07-31T21:35:20.830Z",
        "updatedAt": "2025-08-01T12:14:15.455Z",
        "walletId": "688be198d8dec19a99b16ab6",
        "address": "Niguary, Gafargaon, Mymensingh"
    }
}
```

#### User Status Change Api

- method: `PATCH` api endpoint: https://digital-wallet-server.vercel.app/api/v1/user/status?email={useremail}
- credentials: true.
- Super Admin And Admin can Access this route

##### schema body design:

```json
{
    "userStatus": string // Value Will be Suspend or Approve
}
```

##### Request:

example: https://digital-wallet-server.vercel.app/api/v1/user/status?email=usufahmed@gmail.com

```json
{
    "userStatus":"Approve"
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
        "role": "Admin",
        "isActive": "Active",
        "isVerified": true,
        "phone": "+8801932770803",
        "userStatus": "Approve",
        "createdAt": "2025-07-31T21:35:20.830Z",
        "updatedAt": "2025-08-01T12:14:15.455Z",
        "walletId": "688be198d8dec19a99b16ab6",
        "address": "Niguary, Gafargaon, Mymensingh"
    }
}
```

#### User Activity Update Api

- method: `PATCH` api endpoint: https://digital-wallet-server.vercel.app/api/v1/user/active?email={useremail}
- credentials: true.
- Super Admin And Admin Can Access this route

##### schema body design:

- Value must be from these (Active | Blocked | Deleted)

```json
{
    "isActive": string //Value must be from these (Active | Blocked | Deleted)
}
```

##### Request:

example: https://digital-wallet-server.vercel.app/api/v1/user/active?email=usufahmed@gmail.com

```json
{
    "isActive":"Blocked"
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
        "role": "Admin",
        "isActive": "Blocked",
        "isVerified": true,
        "phone": "+8801932770803",
        "userStatus": "Approve",
        "createdAt": "2025-07-31T21:35:20.830Z",
        "updatedAt": "2025-08-01T12:14:15.455Z",
        "walletId": "688be198d8dec19a99b16ab6",
        "address": "Niguary, Gafargaon, Mymensingh"
    }
}
```

#### Get All Users

- method: `GET` api endpoint: http://localhost:5000/api/v1/user?limit=5&sort=asc&role=User
- limit : default : 10
- sort : default desc newest first and asc oldest first.
- role: If you want to see role based user then you need to give a query role from these (Admin|User|Agent)
- credentials: true
- Super Admin and Admin can access this route.

#### Response:

```json
{
    "message": "All User Retrieved Successfully.",
    "statusCode": 200,
    "success": true,
    "data": {
        "total": {
            "count": 8
        },
        "users": [
            {
                "_id": "688d3e151f118caa42601a57",
                "name": "Digital Wallet",
                "email": "digitalwallet@gmail.com",
                "role": "Super_Admin",
                "isActive": "Active",
                "isVerified": true,
                "phone": "01737210235",
                "userStatus": "Approve",
                "createdAt": "2025-08-01T22:22:13.442Z",
                "updatedAt": "2025-08-02T11:06:49.161Z",
                "walletId": {
                    "_id": "688d3e151f118caa42601a5d",
                    "balance": 99650
                }
            },
            ....
        ]
    }
}
```

#### Get Single User By id

- method: `GET` api endpoint: http://localhost:5000/api/v1/user/{objectid}
- credentials: true

#### Response:

```json
{
    "message": "Get User Successfully",
    "statusCode": 200,
    "success": true,
    "data": {
        "_id": "688f9d4409c0934c438d0ea7",
        "name": "Abu Bakar",
        "email": "abubakar@gmail.com",
        "role": "Admin",
        "isActive": "Active",
        "isVerified": true,
        "phone": "01700000006",
        "userStatus": "Approve",
        "createdAt": "2025-08-03T17:32:52.327Z",
        "updatedAt": "2025-08-03T17:47:44.859Z",
        "walletId": {
            "_id": "688f9d4409c0934c438d0ead",
            "balance": 50
        },
        "address": "Niguary, Gafargaon, Mymensingh"
    }
}
```

## Auth Api Description:

- User can login with email and password and find accesstoken and refreshtoken.

#### auth login api

- method: `POST` api endpoint: https://digital-wallet-server.vercel.app/api/v1/auth/login

##### schema design:

```json
{
    "email": string,
    "password":string, //Password should be five character long and number format
}
```

##### Request:

```json
{
    "email": "selimakondo58@gmail.com",
    "password":"65421"
}
```

#### Response:

```json
{
    "message": "User logged in Successfully.",
    "statusCode": 200,
    "success": true,
    "data": {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODhkZTRiMjIzZjU5ZmQxOGQ3OTY3YjciLCJ",
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
        "user": {
            "_id": "688de4b223f59fd18d7967b7",
            "name": "Selina Akter",
            "email": "selinaakter@gmail.com",
            "role": "Agent",
            "isActive": "Active",
            "isVerified": true,
            "phone": "01932770808",
            "userStatus": "Approve",
            "createdAt": "2025-08-02T10:13:06.592Z",
            "updatedAt": "2025-08-02T10:45:17.104Z",
            "walletId": "688de4b223f59fd18d7967bd",
            "address": "Niguary, Gafargaon, Mymensingh"
        }
    }
}
```

#### Auth User Reset Password

- method: `POST` api endpoint: https://digital-wallet-server.vercel.app/api/v1/auth/reset-password
- credentials: true

##### schema design:

```json
{
    "oldPassword": string,
    "newPassword":string, //Password should be five character long and number format
}
```

##### Request:

```json
{
    "oldPassword": "12345",
    "newPassword": "54321", //Password should be five character long and number format
}
```

#### Response:

```json
{
    "message": "User password reset successfully.",
    "statusCode": 200,
    "success": true,
    "data": null
}
```

#### Auth Refresh Token find by accesstoken

- method: `POST` api endpoint: https://digital-wallet-server.vercel.app/api/v1/auth/refresh-token
- credentials: true

#### Response:

```json
{
    "message": "Access Token find Successfully.",
    "statusCode": 200,
    "success": true,
    "data": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODhkZTRiMjIzZjU5ZmQxOGQ3OTY3YjciLCJlbWFpbCI6InNlbGluYWFrdGVyQGdtYWlsLmNvbSIsInJvbGUiOiJBZ2VudCIsImlhdCI6MTc1NDE1NTk0MCwiZXhwIjoxNzU0MjQyMzQwfQ.HF2k7aW6T3pPbDTckNwpEbB880YZHvYgmyxvFVQlL_4"
}

```

#### Auth Log out api

- method: `POST` api endpoint: https://digital-wallet-server.vercel.app/api/v1/auth/logout
- credentials: true

#### Response:

```json
{
    "message": "User logged out Successfully.",
    "statusCode": 200,
    "success": true,
    "data": null
}
```

## Transaction Api Description:

1. Add Money Super Admin to Admin, Agent, User;

2. Cash In Agent To User

3. Cash Out User To Agent

4. Send Money User To User

5. B2B Agent To Agent

#### 1. Add Money Super Admin To Other Api

- method: `POST` api endpoint: https://digital-wallet-server.vercel.app/api/v1/transaction/add-money
- credentials: true. (Sender Credentials)
- Super Admin And Admin Only Access this route
- When User Create An Account He has no money in his account than without bonus. That's why he take money from the Super Admin.

##### schema body design:

- Receiver Email must be valid and not super admin user also first time not admin user.
- sender password must be right.
- amount must be greater than 0 and no negative number.
- Transaction fee will be 0

```json
{
    "receiverEmail": string, //email type
    "senderPassword": string,
    "amount": number
}
```

##### Request:

```json
{
    "receiverEmail": "mdmahabub@gamil.com",
    "senderPassword": "54321",
    "amount": 500
}
```

#### Response:

```json
{
    "message": "Add money successful.",
    "statusCode": 200,
    "success": true,
    "data": [
        {
            "send": "688d3e151f118caa42601a57",
            "to": "688de4b223f59fd18d7967b7",
            "amount": 650,
            "commission": 0,
            "fee": 0,
            "type": "ADD_MONEY",
            "_id": "688e51898cc4ba0301c3bfae",
            "createdAt": "2025-08-02T17:57:29.785Z",
            "updatedAt": "2025-08-02T17:57:29.785Z"
        }
    ]
}
```

#### 2. Cash In Agent To User Api

- method: `POST` api endpoint: https://digital-wallet-server.vercel.app/api/v1/transaction/cash-in
- credentials: true. (Sender Credentials)
- Agent Account Can Access this route.
- Agent Account find 0.5% commision per cash in transaction.

##### schema body design:

- Receiver Email must be valid and not super admin user also first time not admin user.
- sender password must be right.
- amount must be greater than 0 and no negative number.
- Transaction fee will be 0

```json
{
    "receiverEmail": string, //email type
    "senderPassword": string,
    "amount": number
}
```

##### Request:

```json
{
    "receiverEmail": "mdmahabub@gamil.com",
    "senderPassword": "54321",
    "amount": 500
}
```

#### Response:

```json
{
    "message": "Cash In Successful.",
    "statusCode": 200,
    "success": true,
    "data": [
        {
            "send": "688de43123f59fd18d7967a8",
            "to": "688de4e123f59fd18d7967c3",
            "amount": 30,
            "commission": 0.15,
            "fee": 0,
            "type": "CASH_IN",
            "_id": "688e52d68cc4ba0301c3bfbd",
            "createdAt": "2025-08-02T18:03:02.555Z",
            "updatedAt": "2025-08-02T18:03:02.555Z"
        }
    ]
}
```

#### 3. Cash Out User To Agent Api

- method: `POST` api endpoint: https://digital-wallet-server.vercel.app/api/v1/transaction/cash-out
- credentials: true. (Sender Credentials)
- User Account Can Access this route.
- User Account Give 1% Fee per cash out transaction
- Agent Account find 0.5% commision per cash out transaction.

##### schema body design:

- Receiver Email must be valid and not super admin user also first time not admin user.
- sender password must be right.
- amount must be greater than 0 and no negative number.

```json
{
    "receiverEmail": string, //email type
    "senderPassword": string,
    "amount": number
}
```

##### Request:

```json
{
    "receiverEmail": "selinaakter@gmail.com",
    "senderPassword": "54321",
    "amount": 5
}
```

#### Response:

```json
{
    "message": "Your b2b transaction successful.",
    "statusCode": 200,
    "success": true,
    "data": [
        {
            "send": "688de43123f59fd18d7967a8",
            "to": "688de4b223f59fd18d7967b7",
            "amount": 5,
            "commission": 0,
            "fee": 0,
            "type": "B2B",
            "_id": "688e54038cc4ba0301c3bfcc",
            "createdAt": "2025-08-02T18:08:03.290Z",
            "updatedAt": "2025-08-02T18:08:03.290Z"
        }
    ]
}
```

#### 4. Send Money User To User

- method: `POST` api endpoint: https://digital-wallet-server.vercel.app/api/v1/transaction/send-money
- credentials: true. (Sender Credentials)
- User Account Can Access this route.
- Sender Account Give 0.3% Fee per send money transaction
- Receiver Account must be User type

##### schema body design:

- Receiver Email must be valid and not super admin user also first time not admin user.
- sender password must be right.
- amount must be greater than 0 and no negative number.

```json
{
    "receiverEmail": string, //email type
    "senderPassword": string,
    "amount": number
}
```

##### Request:

```json
{
    "receiverEmail": "mdmahabub@gmail.com",
    "senderPassword": "54321",
    "amount": 1000
}
```

#### Response:

```json
{
    "message": "Send Money Successful.",
    "statusCode": 200,
    "success": true,
    "data": [
        {
            "send": "688de4e123f59fd18d7967c3",
            "to": "688de3b423f59fd18d79679c",
            "amount": 1000,
            "commission": 0,
            "fee": 3,
            "type": "SEND_MONEY",
            "_id": "688f1914b59f247aee9346bc",
            "createdAt": "2025-08-03T08:08:52.299Z",
            "updatedAt": "2025-08-03T08:08:52.299Z"
        }
    ]
}
```

#### 5. B2B Agent To Agent Transaction

- method: `POST` api endpoint: https://digital-wallet-server.vercel.app/api/v1/transaction/b-to-b
- credentials: true. (Sender Credentials)
- Sender Account must be agent and Access this route.
- Sender Account Give 0 Fee per b2b transaction
- Receiver Account must be Agent type

##### schema body design:

- Receiver Email must be valid and not super admin user also first time not admin user.
- sender password must be right.
- amount must be greater than 0 and no negative number.

```json
{
    "receiverEmail": string, //email type
    "senderPassword": string,
    "amount": number
}
```

##### Request:

```json
{
    "receiverEmail": "selinaakter@gmail.com",
    "senderPassword": "54321",
    "amount": 500
}
```

#### Response:

```json
{
    "message": "Your b2b transaction successful.",
    "statusCode": 200,
    "success": true,
    "data": [
        {
            "send": "688de43123f59fd18d7967a8",
            "to": "688de4b223f59fd18d7967b7",
            "amount": 500,
            "commission": 0,
            "fee": 0,
            "type": "B2B",
            "_id": "688f1a51b59f247aee9346c8",
            "createdAt": "2025-08-03T08:14:09.671Z",
            "updatedAt": "2025-08-03T08:14:09.671Z"
        }
    ]
}
```

#### 6. Get My transaction

- method: `GET` api endpoint: https://digital-wallet-server.vercel.app/api/v1/transaction/get/me?limit=1&sort=asc
- credentials: true. (Sender Credentials)
- limit default 10 sort by new transaction.
- sort (desc or asc) asc give new transaction first desc give old transaction first.

#### Response:

```json
{
    "message": "Transaction Retrieved Successfully.",
    "statusCode": 200,
    "success": true,
    "data": {
        "total": {
            "limit": 1,
            "sort": "asc",
            "count": 7
        },
        "transactions": [
            {
                "_id": "688de4b223f59fd18d7967ba",
                "send": {
                    "_id": "688d3e151f118caa42601a57",
                    "name": "Digital Wallet",
                    "email": "digitalwallet@gmail.com",
                    "role": "Super_Admin",
                    "phone": "01737210235"
                },
                "to": {
                    "_id": "688de4b223f59fd18d7967b7",
                    "name": "Selina Akter",
                    "email": "selinaakter@gmail.com",
                    "role": "Agent",
                    "phone": "01932770808"
                },
                "amount": 50,
                "commission": 0,
                "fee": 0,
                "type": "BONUS",
                "createdAt": "2025-08-02T10:13:06.794Z"
            }
        ]
    }
}
```

#### 7. Get Single Transaction

- method: `GET` api endpoint: https://digital-wallet-server.vercel.app/api/v1/transaction/{objectId}
- credentials: true.
- If User And Agent can Access Their transaction.
- Admin And Super Admin Get All User Transaction.

#### Response:

```json
{
    "message": "Transaction Retrieved Successfully.",
    "statusCode": 200,
    "success": true,
    "data": {
        "_id": "688e52d68cc4ba0301c3bfbd",
        "send": {
            "_id": "688de43123f59fd18d7967a8",
            "name": "Md. Usuf",
            "email": "mdusuf@gmail.com",
            "role": "Agent",
            "phone": "01932770805"
        },
        "to": {
            "_id": "688de4e123f59fd18d7967c3",
            "name": "Mst. Fatema",
            "email": "mstfatema@gmail.com",
            "role": "User",
            "phone": "01932770806"
        },
        "amount": 30,
        "commission": 0.15,
        "fee": 0,
        "type": "CASH_IN",
        "createdAt": "2025-08-02T18:03:02.555Z",
        "updatedAt": "2025-08-02T18:03:02.555Z"
    }
}
```

#### 8. Get All Transaction

- method: `GET` api endpoint: https://digital-wallet-server.vercel.app/api/v1/transaction?limit={number}&sort=asc
- credentials: true.
- default limit: 10. with out list see all transaction.
- Super Admin And Admin Can Access This route.
- sort (desc or asc) asc give new transaction first desc give old transaction first.

#### Response:

```json
{
    "message": "All Transaction Retrieved Successfully.",
    "statusCode": 200,
    "success": true,
    "data": {
        "total": {
            "count": 15
        },
        "transaction": [
            {
                "_id": "688d3e151f118caa42601a5b",
                "send": {
                    "_id": "688d3e151f118caa42601a57",
                    "name": "Digital Wallet",
                    "email": "digitalwallet@gmail.com",
                    "role": "Super_Admin",
                    "phone": "01737210235"
                },
                "to": {
                    "_id": "688d3e151f118caa42601a57",
                    "name": "Digital Wallet",
                    "email": "digitalwallet@gmail.com",
                    "role": "Super_Admin",
                    "phone": "01737210235"
                },
                "amount": 100000,
                "commission": 0,
                "fee": 0,
                "type": "BONUS",
                "createdAt": "2025-08-01T22:22:13.845Z",
                "updatedAt": "2025-08-01T22:22:13.845Z"
            },
            {.....}
        ]
    }
}
```

## Wallet Api Description:

1. Add Money Super Admin

2. Get Single Wallet

3. Get All Wallet

#### 1. Add Money Super Admin

- method: `PATCH` api endpoint: https://digital-wallet-server.vercel.app/api/v1/wallet/add/super
- credentials: true.
- Super Admin Can Access This route.

##### schema body design:

```json
{
    "amount": number;
}
```

##### Request:

- amount must be a positive number and greater than 0.

```json
{
    "amount": 500
}
```

#### Response:

```json
{
    "message": "Add money successfully.",
    "statusCode": 200,
    "success": true,
    "data": {
        "send": "688d3e151f118caa42601a57",
        "to": "688d3e151f118caa42601a57",
        "amount": 500,
        "commission": 0,
        "fee": 0,
        "type": "ADD_MONEY",
        "_id": "688f344b7199b937e99bdc77",
        "createdAt": "2025-08-03T10:04:59.783Z",
        "updatedAt": "2025-08-03T10:04:59.783Z"
    }
}
```

#### 2. Get A Single Wallet by Id

- method: `GET` api endpoint: https://digital-wallet-server.vercel.app/api/v1/wallet/find/{ObjectId}
- credentials: true.
- See every one wallet by id.
- User and admin can see their wallet.
- Super admin and admin can see everyone wallet

##### Request:

example: https://digital-wallet-server.vercel.app/api/v1/wallet/688de36823f59fd18d796796

#### Response:

```json
{
    "message": "Wallet retrieved successfully.",
    "statusCode": 200,
    "success": true,
    "data": {
        "_id": "688de36823f59fd18d796796",
        "user": "688de36723f59fd18d796790",
        "balance": 50,
        "transaction": [
            {
                "_id": "688de36723f59fd18d796793",
                "send": "688d3e151f118caa42601a57",
                "to": "688de36723f59fd18d796790",
                "amount": 50,
                "commission": 0,
                "fee": 0,
                "type": "BONUS",
                "createdAt": "2025-08-02T10:07:35.985Z",
                "updatedAt": "2025-08-02T10:07:35.985Z"
            }
        ],
        "createdAt": "2025-08-02T10:07:36.146Z",
        "updatedAt": "2025-08-02T10:07:36.146Z"
    }
}
```

#### 3. Get My Wallet

- method: `GET` api endpoint: https://digital-wallet-server.vercel.app/api/v1/wallet/me
- credentials: true.

#### Response:

```json
{
    "message": "Wallet retrieved successfully.",
    "statusCode": 200,
    "success": true,
    "data": {
        "_id": "688de36823f59fd18d796796",
        "user": "688de36723f59fd18d796790",
        "balance": 50,
        "transaction": [
            {
                "_id": "688de36723f59fd18d796793",
                "send": "688d3e151f118caa42601a57",
                "to": "688de36723f59fd18d796790",
                "amount": 50,
                "commission": 0,
                "fee": 0,
                "type": "BONUS",
                "createdAt": "2025-08-02T10:07:35.985Z",
                "updatedAt": "2025-08-02T10:07:35.985Z"
            }
        ],
        "createdAt": "2025-08-02T10:07:36.146Z",
        "updatedAt": "2025-08-02T10:07:36.146Z"
    }
}
```

#### 4. Get All Wallet Details

- method: `GET` api endpoint: http://localhost:5000/api/v1/wallet?limit=2&sort=desc
- credentials: true.
- default limit: 10;
- You can sort data by by sort (default desc for newest firstly and asc for old firstly)
- Super Admin And Admin can access this route.

#### Response:

```json
{
    "message": "All Wallet retrieved successfully.",
    "statusCode": 200,
    "success": true,
    "data": {
        "total": {
            "count": 9,
            "limit": 2,
            "sort": "desc"
        },
        "result": [
            {
                "_id": "688f9d4409c0934c438d0ead",
                "user": {
                    "_id": "688f9d4409c0934c438d0ea7",
                    "name": "Abu Bakar",
                    "email": "abubakar@gmail.com",
                    "role": "Admin",
                    "phone": "01700000006"
                },
                "balance": 50,
                "createdAt": "2025-08-03T17:32:52.805Z"
            },
            {
                "_id": "688de51323f59fd18d7967d5",
                "user": {
                    "_id": "688de51223f59fd18d7967cf",
                    "name": "Md Moin",
                    "email": "mdmoin@gmail.com",
                    "role": "Admin",
                    "phone": "01932770807"
                },
                "balance": 50,
                "createdAt": "2025-08-02T10:14:43.111Z"
            }
        ]
    }
}
```

## Error Response

### Response

```json
{
    "success":false,
    "message": "Server Response Problem",
    "data": null
    "statusCode":500,
    "errorSource": [
        {....}
    ], //If source has any problem
    "error": {
        .......
    }, //development mode
    "stack": .... //development mode
}
```
