import { collection, doc, DocumentData, DocumentSnapshot, getDocs, getFirestore, query, QuerySnapshot, setDoc, where } from "firebase/firestore";
import { app, auth } from "./firebase";
import { signInAnonymously } from "firebase/auth";

const db = getFirestore(app)
const colRef = collection(db, "vote");

export interface VoteData {
    date: Date;
    gender: string;
    uidUser: string;
}

export async function getVoteDataForHome() {
    try {
        const votes: VoteData[] = []
        await signInAnonymously(auth).then(async () => {
            console.log("Usuário autenticado anonimamente.")
            const querySnapshot = await getDocs(colRef)

            querySnapshot.forEach((doc) => {
                votes.push({
                    date: doc.data().date as Date,
                    gender: doc.data().gender as string,
                    uidUser: doc.data().uid as string,
                })
            })
        }).catch((error) => {
            console.error("Erro ao autenticar usuário:", error)
        })

        return votes
    } catch (error) {
        console.error("Error getting documents:", error)
    }
}

export async function getVoteData() {
    try {
        const querySnapshot = await getDocs(colRef);
        const votes: VoteData[] = []

        querySnapshot.forEach((doc) => {
            votes.push({
                date: doc.data().date as Date,
                gender: doc.data().gender as string,
                uidUser: doc.data().uid as string,
            })
        });
        return votes
    } catch (error) {
        console.error("Error getting documents:", error);
    }
}

export async function setVoteData(gender: string, uid: string,) {
    await setDoc(doc(db, "vote", `vote-user-${uid}`), {
        gender, uid,
        date: new Date()
    })
}

export async function getUserVoteData(uid: string): Promise<VoteData | null> {
    try {
        const q = query(colRef, where("uid", "==", uid))
        const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q)
        if (!querySnapshot.empty) {
            const doc: DocumentSnapshot<DocumentData> = querySnapshot.docs[0]
            return {
                date: doc?.data()?.date as Date,
                gender: doc?.data()?.gender as string,
                uidUser: doc?.data()?.uid as string,
            } as VoteData
        } else {
            console.log("Nenhum documento encontrado para o uid fornecido.")
            return null
        }
    } catch (error) {
        console.error("Error getting documents:", error)
        return null
    }
}