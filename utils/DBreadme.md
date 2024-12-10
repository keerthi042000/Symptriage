This guide provides quick instructions for using the Firebase helper functions. Each function includes parameters, expected usage, and the return structure for success and failure cases.

## signUp(user)

Creates a new user in Firebase Authentication and stores the user’s details in Firestore.

#### Parameters:

• user: An object with the format:

{
name: "User Name",
email: "user@example.com",
password: "password123"
}

#### Returns:

• Success: { code: "200" }
• Failure: { code: errorCode, msg: errorMessage }

## signIn(email, password)

Authenticates a user with Firebase Authentication.

#### Parameters:

• email (string): The user’s email.
• password (string): The user’s password.

#### Returns:

• Success: { code: "200" }
• Failure: { code: errorCode, msg: errorMessage }

## checkAuthState()

Checks the current authentication state of the user.

#### Parameters:

None.

#### Returns:

• Success: true (if the user is authenticated).
• Failure: false (if no user is authenticated or an error occurs).

## userSignOut()

Signs out the currently authenticated user.

#### Parameters:

None.

#### Returns:

• Success: true
• Failure: { code: errorCode, msg: errorMessage }

## addUser(user)

Adds user details to the Firestore database.

#### Parameters:

• user: An object with the format:

{
name: "User Name",
email: "user@example.com"
}

#### Returns:

• Success: { code: "200" }
• Failure: { code: errorCode, msg: errorMessage }

## getUser(email)

Retrieves user details from Firestore.

#### Parameters:

• email (string): The email of the user to retrieve.

#### Returns:

• Success: { code: "200", user: userData }
• Failure: { code: errorCode, msg: errorMessage }

## updateUserHistory(email, history)

Updates the user’s history in Firestore.

#### Parameters:

• email (string): The user’s email.
• history (any): The history data to be updated.

#### Returns:

• Success: { code: "200" }
• Failure: { code: errorCode, msg: errorMessage }
