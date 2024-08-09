import { getFirestore } from "firebase/firestore";
import firebaseApp from '../../utils/firebaseConfig.js';

const db = getFirestore(firebaseApp);
export default db;