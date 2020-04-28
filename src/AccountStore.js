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

  auth.onAuthStateChanged(async (user) => {
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

  const createProvider = async (uid) => {
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

  const getProvider = async (uid) => {
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
      const provider = await getProvider(user.uid);
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

export default AccountStore;
