import React, { useState } from "react";
import firebase from "firebase/app";
import { GeoCollectionReference, GeoFirestore } from "geofirestore";
const firestore = firebase.firestore();
export const AccountContext = React.createContext(null);
export const geofirestore: GeoFirestore = new GeoFirestore(firestore);
export const geocollectionProviders: GeoCollectionReference = geofirestore.collection(
  "providers",
);

const AccountStore = ({ children }) => {
  const [user, setUser] = useState();
  const auth = firebase.auth();

  auth.onAuthStateChanged(async user => {
    if (user) {
      // const { uid, email } = user;
      // let profile, roles, avatarUrl;
      // profile = await getUserProfile(uid);
      // roles = await getUserRoles(uid);
      // avatarUrl = await getUserAvatar(uid, user.photoURL, profile);
      // localStorage.setItem("user", JSON.stringify(user));

      setUser(user);
    } else {
      // localStorage.removeItem("user");
      setUser(null);
    }
  });

  const createProvider = async uid => {
    try {
      return await geocollectionProviders.doc(uid).set({
        profile: {},
        products: [],
        coordinates: new firebase.firestore.GeoPoint(0, 0),
      });
    } catch (err) {
      return err;
    }
  };

  const getProvider = async uid => {
    try {
      return await geocollectionProviders.doc(uid).get();
    } catch (err) {
      return err;
    }
  };

  const signUp = async ({ email, password }) => {
    try {
      const userResponse = await auth.createUserWithEmailAndPassword(
        email,
        password,
      );
      await createProvider(userResponse.user.uid);
      return userResponse;
    } catch (err) {
      return err;
    }
  };

  const signIn = async ({ email, password }) => {
    try {
      const user = await auth.signInWithEmailAndPassword(email, password);
      console.log(user);
      const provider = await getProvider(user.uid);
      console.log(provider);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("provider", JSON.stringify(provider));
      return user;
    } catch (err) {
      return err;
    }
  };

  const signOut = async () => {
    localStorage.removeItem("user");
    localStorage.removeItem("provider");
    try {
      return await auth.signOut();
    } catch (err) {
      setUser(null);
      return err;
    }
  };

  // const verifyPassword = async password => {
  //   var user = auth.currentUser;

  //   try {
  //     await user.reauthenticateAndRetrieveDataWithCredential(
  //       firebase.auth.EmailAuthProvider.credential(
  //         auth.currentUser.email,
  //         password,
  //       ),
  //     );
  //     return "success";
  //   } catch (err) {
  //     return err;
  //   }
  // };

  // const updatePassword = async (oldPassword, newPassword) => {
  //   const user = auth.currentUser;
  //   const verifyOldPassword = await verifyPassword(oldPassword);

  //   if (verifyOldPassword === "success") {
  //     try {
  //       await user.updatePassword(newPassword);
  //       return "success";
  //     } catch (err) {
  //       return err;
  //     }
  //   } else {
  //     return verifyOldPassword;
  //   }
  // };

  // const resetPasswordEmail = async emailAddress => {
  //   try {
  //     await auth.sendPasswordResetEmail(emailAddress);
  //     return "success";
  //   } catch (err) {
  //     this.setState({
  //       errorCode: err.code,
  //       errorMessage: err.message,
  //     });
  //     return err;
  //   }
  // };

  return (
    <AccountContext.Provider
      value={{
        user,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

// class AccountStore extends React.Component {
//   static propTypes = {
//     children: PropTypes.node,
//   };

//   constructor(props) {
//     super(props);
//     console.log(props);

// const db = firebase.firestore();

// const getUserProfile = async uid => {
//   let result = {};

//   await db
//     .collection("profiles")
//     .doc(uid)
//     .get()
//     .then(function(doc) {
//       if (doc.exists) result = doc.data();
//     });

//   return result;
// };

// const getUserRoles = async uid => {
//   let result = [];

//   await db
//     .collection("roles")
//     .doc(uid)
//     .get()
//     .then(function(doc) {
//       if (doc.exists) result = doc.data().value;
//     });

//   return result;
// };

// const getUserAvatar = async (uid, photoUrl, profile) => {
//   let avatarUrl;

//   if (profile.userSetAvatar) {
//     avatarUrl = await getImageUrl(`avatars/${uid}.png`);
//   } else {
//     if (photoUrl) avatarUrl = `${photoUrl}?type=large`;
//     else avatarUrl = false;
//   }

//   if (avatarUrl) avatarUrl = await imgToDataUrl(avatarUrl);

//   return avatarUrl;
// };

// const signInWithSocialMedia = async provider => {
//   try {
//     await auth.signInWithPopup(provider);
//   } catch (err) {
//     if (err.code === "auth/account-exists-with-different-credential") {
//       // const pendingCred = err.credential;
//       // The provider account's email address.
//       // const email = err.email;
//       // const methods = await auth.fetchSignInMethodsForEmail(email);
//       // TODO: condition for users who try to log-in with the same mail from different providers
//     }
//   }
// };

// const updateProfile = async (values = {}) => {
//   const { uid } = this.state;
//   if (!uid) return { error: "User is not logged in" };

//   try {
//     await db
//       .collection("profiles")
//       .doc(uid)
//       .set(values, { merge: true });
//     return { error: false };
//   } catch (err) {
//     return { error: err };
//   }
// };

//   }

//   render() {

//   }
// }

export default AccountStore;
