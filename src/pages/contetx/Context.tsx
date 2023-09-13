import { collection, onSnapshot } from "firebase/firestore";
import { createContext, useState, useEffect } from "react";
import { db } from "../../config/firebase";
export const AuthContext = createContext([]);
const Context = ({ children }: any) => {
  const [user, setUser] = useState<any>([]);
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "dataFigure"), (snapshot) => {
      const user_info = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setUser(user_info);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};

export default Context;
