import { auth } from "./firebaseInitialize";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";

const provider = new GoogleAuthProvider();

// 🔹 Login with Google
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const token = await result.user.getIdToken();
    return { user: result.user, token };
  } catch (error) {
    console.error("Login failed:", error);
    return null;
  }
};

// 🔹 Logout function
export const logout = async () => {
  await signOut(auth);
  console.log("User logged out");
};
