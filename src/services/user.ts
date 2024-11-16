import { collection, doc, DocumentData, DocumentSnapshot, getDocs, getFirestore, query, QuerySnapshot, setDoc, where } from "firebase/firestore";
import { app, auth } from "./firebase";
import { fetchSignInMethodsForEmail } from "firebase/auth";

const db = getFirestore(app)
const colRef = collection(db, "revelacao");

export interface UserData { 
    uid: string;
    date?: Date;
    email: string;
    name: string;
    photoURL: string;
    relationship?: string
    typeLink?: string
}

export interface UserGenericData { 
    id: string; 
    [key: string]: any; // Para permitir outros campos dinâmicos 
}

export async function getUserData() {
    try {
        const querySnapshot = await getDocs(colRef);

        querySnapshot.forEach((doc) => {
            console.log(`${doc.id} =>`, doc.data());
        });
    } catch (error) {
        console.error("Error getting documents:", error);
    }
}

export async function setUserData(name: string, email: string, uid: string, photo: string, typeLink: string, relationship: string) {
    await setDoc(doc(db, "revelacao", `user-${uid}`), {
        name, email, uid,
        photoURL: photo,
        typeLink, relationship,
        date: new Date()
    })
}

export async function getUserDataByEmail(email: string): Promise<UserGenericData | null> {
    try {
        // Cria a consulta para selecionar documentos onde o campo 'email' é igual ao email fornecido 
        const q = query(colRef, where("email", "==", email))
        const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q)
        if (!querySnapshot.empty) {
            const doc: DocumentSnapshot<DocumentData> = querySnapshot.docs[0]
            return {
                id: doc.id, 
                ...doc.data()
            } as UserGenericData
        } else {
            console.log("Nenhum documento encontrado para o email fornecido.")
            return null
        }
    } catch (error) {
        console.error("Error getting documents:", error)
        return null
    }
}
