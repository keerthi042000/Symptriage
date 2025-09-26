// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import OpenAI from "openai";


import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
};

const openai = new OpenAI({
    organization: process.env.NEXT_PUBLIC_OPENAI_ORG,
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signUp = async (user) => {
  const signUpEmail = user.email;
  const signUpPassword = user.password;

  try {
    let userCreditional = await createUserWithEmailAndPassword(
      auth,
      signUpEmail,
      signUpPassword
    );
    const res = userCreditional.user;
    console.log(res);
    localStorage.setItem("email", user.email);
    // alert("user created successfully");
    return await addUser(user);
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode, errorMessage);
    // alert(errorMessage);
    return { code: errorCode, msg: errorMessage };
  }
};

const signIn = async (email, password) => {
  const signInEmail = email;
  const signInPassword = password;
  console.log(email);

  try {
    let userCredential = await signInWithEmailAndPassword(
      auth,
      signInEmail,
      signInPassword
    );
    console.log(userCredential);
    const user = userCredential.user;
    console.log(user);
    localStorage.setItem("email", email);
    // alert("user signed in successfully");
    return { code: "200" };
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode, errorMessage);
    // alert(errorMessage);
    return { code: errorCode, msg: errorMessage };
  }
};

const checkAuthState = async () => {
  try {
    let user = onAuthStateChanged(auth);
    if (user) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.log(e);
    return false;
  }
};

const userSignOut = async () => {
  try {
    await signOut(auth);
    localStorage.removeItem("email");
    localStorage.removeItem("chatMessages");
    // router.push("/");
    return { code: "200" };
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode, errorMessage);
    return { code: errorCode, msg: errorMessage };
  }
};

const addUser = async (user) => {
  try {
    await setDoc(doc(db, "users", user.email), {
      name: user.name,
      email: user.email,
    });
    return { code: "200" };
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode, errorMessage);
    return { code: errorCode, msg: errorMessage };
  }
};

const getUser = async (email) => {
  try {
    console.log(email);
    const docRef = doc(db, "users", email);
    let user = await getDoc(docRef);
    console.log(user.data());
    return { code: "200", user: user.data() };
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode, errorMessage);
    return { code: errorCode, msg: errorMessage };
  }
};

const getMedicine = async (disease) => {
  try {
    let medicines = {};
    // for (let i = 0; i <= 9; i++) {
    //   const key = `${disease}${i}`;
    //   const docRef = doc(db, "medications", key);
    //   let docSnap = await getDoc(docRef);

    //   if (docSnap.exists()) {
    //     // console.log(docSnap.data());

    //     medicines[key] = docSnap.data();
    //   }
    // }

    const docRef = doc(db, "medications", disease);
    let docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Docsnap : ", docSnap)
      medicines = docSnap.data().Medication;
    }

    console.log(medicines);
    return { code: "200", medicines };
  } catch (e) {
    const errorCode = e.code;
    const errorMessage = e.message;
    console.log(errorCode, errorMessage);
    return { code: errorCode, msg: errorMessage };
  }
};

const updateUserHistory = async (email, history) => {
  try {
    await updateDoc(doc(db, "users", email), {
      history,
    });
    return { code: "200" };
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode, errorMessage);
    return { code: errorCode, msg: errorMessage };
  }
};

export {
  signUp,
  signIn,
  userSignOut,
  checkAuthState,
  addUser,
  getUser,
  updateUserHistory,
  getMedicine,
  openai
};
