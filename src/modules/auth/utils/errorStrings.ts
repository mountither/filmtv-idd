//* used for sign in and register.
export const getAuthErrorString = (code: string): string => {
  switch (code) {
    case "auth/user-not-found":
      return "Account does not exist, please try again.";
    case "auth/email-already-in-use":
      return "Email is already in use, please use another email.";
    case "auth/wrong-password":
      return "Sign in failed, please enter the correct credentials to sign in.";
    case "auth/weak-password":
      return "Sign up failed, please enter a stronger password.";
    case "auth/account-exists-with-different-credential":
      return "Account already exists, please sign in with the proper provider.";
    default:
      return "Failed to process your account, please try again.";
  }
};
