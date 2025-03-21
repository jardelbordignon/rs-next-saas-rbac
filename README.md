# Next.js Nest.js - SaaS + RBAC

This project contains all the necessary boilerplate to setup a multi-tenant SaaS with
Next.js and Node.js including authentication and RBAC (Role-Based Access Control).

## Features

### Authentication

- [] It should be able to authenticate using email and password;
- [] It should be able to authenticate using Github account;
- [] It should be able to recover password using e-mail;
- [] It should be able to create an account (e-mail, name and password);

### Organizations

- [] It should be able to create a new organization;
- [] It should be able to get organizations to wish the user belongs;
- [] It should be able to update an organization;
- [] It should be able to shutdown an organization;
- [] It should be able to transfer an organization ownership;

### Invites

- [] It should be able to invite a new member (e-mail, role);
- [] It should be able to accept an invite;
- [] It should be able to revoke a pending invite;

### Members

- [] It should be able to get organization members;
- [] It should be able to update a member role;

### Projects

- [] It should be able to get projects within an organization;
- [] It should be able to create a new project (name, url, description);
- [] It should be able to update a project (name, url, description);
- [] It should be able to delete a project;

### Billing

- [] It should be able to get billing details for organization ($20 per project / $10 per member excluding billing role);

### Roles

- Administrator
- Member
- Billing

### Permissions table

|                        | Administrator | Member | Billing | Anonymous |
| ---------------------- | ------------- | ------ | ------- | --------- |
| Update Organization    | ✅            | ❌      | ❌      | ❌        |
| Delete Organization    | ✅            | ❌      | ❌      | ❌        |
| Invite a member        | ✅            | ❌      | ❌      | ❌        |
| Revoke an invite       | ✅            | ❌      | ❌      | ❌        |
| List members           | ✅            | ✅      | ✅      | ❌        |
| Transfer ownership     | ⚠️             | ❌      | ❌      | ❌        |
| Update member role     | ✅            | ❌      | ❌      | ❌        |
| Delete member          | ✅            | ⚠️       | ❌      | ❌        |
| List projects          | ✅            | ✅      | ✅      | ❌        |
| Create a new project   | ✅            | ✅      | ❌      | ❌        |
| Update a project       | ✅            | ⚠️       | ❌      | ❌        |
| Delete a project       | ✅            | ⚠️       | ❌      | ❌        |
| Get billing details    | ✅            | ❌      | ✅      | ❌        |
| Export billing details | ✅            | ❌      | ✅      | ❌        |

✅ = allowed<br/>
❌ = not allowed<br/>
⚠️ = allowed with conditions