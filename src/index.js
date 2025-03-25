//importing all the firebase methods here

import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, doc, setDoc, query, where, getDocs } from "firebase/firestore";

//firebase config
const firebaseApp = initializeApp({
  apiKey: "AIzaSyBxFosdZ1UYaNo_QiE8U2Cqsb2YFYBW1G8",
  authDomain: "orion-college.firebaseapp.com",
  projectId: "orion-college",
  storageBucket: "orion-college.firebasestorage.app",
  messagingSenderId: "476621140923",
  appId: "1:476621140923:web:3196abbacb37344e598a9e",
  measurementId: "G-8WSNHW8688"
});

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

//user info check
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    const uid = user.uid;
    //console.log(uid);

    //making query to fetch name
    const q = query(collection(db, "userdata"), where("uid", "==", uid));
    //fetch name
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      
      // doc.data() is never undefined for query doc snapshots
      //display name
      const showName = document.querySelector(".user-name");
      if (showName) {
        if (doc.data().name) {
          showName.innerHTML = "Welcome, " + doc.data().name;
          //console.log(doc.data().name);
        }
        else
          showName.innerHTML = "";
      }

    });

    // ...
  } else {
    console.log("not signed in");
    // User is signed out
    // ...
  }
});


//shit for sign up

const signUpEmailPassword = async () => {
  const SignUpEmail = txtEmail.value;
  const SignUpPassword = txtPassword.value;
  const SignUpUser = txtUser.value;
  const SignUpRole = role.value;

  //actual sign in
  createUserWithEmailAndPassword(auth, SignUpEmail, SignUpPassword)
    .then((userCredential) => {
      // Signed up 
      const user = userCredential.user;
      console.log(user);
      const Userid = user.uid;

      //adding username and data to firestore
      console.log(Userid);
      const userRef = collection(db, "userdata");
      try {
        setDoc(doc(userRef), {
          name: SignUpUser,
          email: SignUpEmail,
          uid: Userid,
          role: SignUpRole
        });
        console.log("Document written");
      } catch (e) {
        console.error("Error adding document: ", e);
      }
      // ...
    })

    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
      // ..
    });

}


//sign up button event listener

const signUpButton = document.querySelector('#btnSignUp');

if (signUpButton) {
  signUpButton.addEventListener('click', () => {

    signUpButton.innerHTML = `<div class="spinner-border text-light spinner-border-sm" role="status">
    <span class="visually-hidden">Loading...</span>
    </div>`;
    signUpButton.disabled = true;

    setTimeout(() => {
      signUpButton.innerHTML = "Sign in";
      signUpButton.disabled = false; // Re-enable button
    }, 5000);

    if (txtConfirmPassword.value != txtPassword.value) {
      alert("Password In Both Feilds Must Be Same");
      return
    }
    signUpEmailPassword();

    window.setTimeout(function () {
      window.location.href = "/success";
    }, 5000);

  });
}

//shit for log in

const logInEmailPassword = async () => {
  const logInEmail = txtLogInEmail.value;
  const logInPassword = txtLogInPassword.value;

  signInWithEmailAndPassword(auth, logInEmail, logInPassword)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      console.log(user);
      console.log("logged in");
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
    });

}

//log in button event listener

const logInButton = document.querySelector('#btnLogIn');
if (logInButton) {
  logInButton.addEventListener('click', () => {

    logInButton.innerHTML = `<div class="spinner-border text-light spinner-border-sm" role="status">
    <span class="visually-hidden">Loading...</span>
    </div>`;
    logInButton.disabled = true;

    setTimeout(() => {
      logInButton.innerHTML = "Log in";
      logInButton.disabled = false; // Re-enable button
    }, 5000);
    console.log("working");

    logInEmailPassword();

    window.setTimeout(function () {
      window.location.href = "/home";
    }, 2000);



  });
}





// const UserCredential = await signInWithEmailAndPassword(auth, SignUpEmail, SignUpPassword);
// console.log(UserCredential.user);







