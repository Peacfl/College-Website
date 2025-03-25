//please fucking work (admin rights and shit)
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js';
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";



//delete all firebase shit from here if it doesnt work out
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

//delete this shit from home
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


            if (doc.data().role != 'admin') {

                //console.log(doc.data().role);
                window.location.href = "/home";
            }
            else
                console.log("admin logged in");

        }

            // ...
        )
    } else {
        window.location.href = "/home";
        // User is signed out
        // ...
    }
});



