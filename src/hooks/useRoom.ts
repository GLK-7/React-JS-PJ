import { useEffect } from "react";
import { useState } from "react";
import { database } from "../services/firebase";
import { useAuth } from "./useAuth";

type Answers = {
    id: string;
    content: string;
    author: {
        name: string;
        avatar: string;
    }  
}

type FirebaseQuestions = Record<string, {
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    answers: Answers[] | undefined;
    isAnswered: boolean;
    isHighLighted: boolean;
    likes: Record<string, {
        author: string;
        authorId: string;
    }>
}>

type QuestionType = {
    id: string;
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    answers: Answers[] | undefined;
    isAnswered: boolean;
    isHighLighted: boolean;
    likeCount: number;
    likeId: string | undefined;
}

export function useRoom(roomId: string){
    const {user} = useAuth();
    const [questions, setQuestions] = useState<QuestionType[]>([]);
    const [title, setTitle] = useState('');    

    useEffect(() => {
        function sortQ (a: QuestionType, b: QuestionType){
            if (a.likeCount > b.likeCount){
                return -1;
            } else if(a.likeCount < b.likeCount){
                return 1;
            }
            return 0;   
        }
    
        function sortQuestionsByLike (questions: QuestionType[]){
            const sortedQuestions = questions.sort(sortQ)
            return sortedQuestions;
        }
        
        function parseAnswers(answers: Answers[] | undefined) {
            if (answers === undefined)
                return answers;

            
            const parsedAnswers = Object.entries(answers).map(([key, answerValue]) => {
                return {
                    id: key,
                    content: answerValue.content,
                    author: {
                        name: answerValue.author.name,
                        avatar: answerValue.author.avatar,
                    }
                }
            });

            return parsedAnswers;
        }

        const roomRef = database.ref(`rooms/${roomId}`);

        roomRef.on('value', room => {
            const databaseRoom = room.val();
            const firebaseQuestions: FirebaseQuestions = databaseRoom.questions  ?? {};

            const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
                return{
                    id: key,
                    content: value.content,
                    answers: parseAnswers(value.answers),
                    author: value.author,
                    isHighLighted: value.isHighLighted,
                    isAnswered: value.isAnswered,
                    likeCount: Object.values(value.likes ?? {}).length,
                    //Alterado hasLiked para liked para remover o like
                    //hasLiked: Object.values(value.likes ?? {}).some(like => like.authorId === user?.id)//some retorna SE encontrou o objeto ou nao
                    likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0],//some retorna SE encontrou o objeto ou nao
                }
            })

            const sortedQuestions = sortQuestionsByLike(parsedQuestions);
            setTitle(databaseRoom.title);
            setQuestions(sortedQuestions);

            console.log(sortedQuestions);
        })

        return () => {
            roomRef.off('value');
        }
    },[roomId, user?.id]);

    return {questions, title}
}