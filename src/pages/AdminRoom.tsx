//import { useState } from 'react';
import {useHistory, useParams} from 'react-router-dom';

import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';
import { Button } from '../Components/Button';
import { ButtonLogout } from '../Components/ButtonLogout';
import { Question } from '../Components/Question';
import { RoomCode } from '../Components/RoomCode';
import { useRoom } from '../hooks/useRoom';
import chatImg from '../assets/images/chat.png';


import '../styles/room.scss';
import { auth, database } from '../services/firebase';
import { useAuth } from '../hooks/useAuth';

type RoomParams = {
    id: string;
}

export function AdminRoom(){
    //const {user} = useAuth();
    const history = useHistory();
    const params = useParams<RoomParams>();
    //const [newQuestion, setNewQuestion] = useState('');
    const roomId = params.id;
    
    const {title, questions} = useRoom(roomId);
    const {user, setUser} = useAuth();
    
    

    async function handleEndRoom(){
        if(!user?.id)
            return
        database.ref(`rooms/${roomId}`).update({
            endedAt: new Date(),
        })

        history.push('/');
    }

    async function handleDeleteQuestion(questionId: string){
        if(!user?.id)
            return
        if(window.confirm('Tem certeza que deseja excluir esta perguta?')){
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
        }
    }

    async function handleCheckQuestionAsAnswered(questionId: string){
        if(!user?.id)
            return
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered:true,
        })
    }

    /*async function handleHighlightQuestion(questionId: string){
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighLighted:true,
        })
    }*/
    
    async function handleLikeQuestion(questionId:string, likeId:string | undefined) {
        
        if(!user?.id)
            return

        if(likeId){

            await database.ref(`rooms/${roomId}/questions/${questionId}/likes/${likeId}`).remove()
        
        } else{
            await database.ref(`rooms/${roomId}/questions/${questionId}/likes`).push({
                authorId: user?.id,
            })
        }

    }
    async function handleLogout(){
        
        if(window.confirm('Tem certeza que deseja fazer o logout e voltar a página inicial?')){
            await auth.signOut();
            setUser(undefined);
            handleBackHome();
        }
         
    }

    function handleBackHome(){
        history.push('/');
    }
    

    return(
        <div id="page-room">
            <header>
                <div className="content">
                    <img onClick={handleBackHome} src={chatImg} alt="Takeaquestion" />
                    <div>
                        <RoomCode code={roomId}/>
                        {user?.id && (
                            <div className='logedButtons'>
                                <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
                                <ButtonLogout onClick={handleLogout}>Sair</ButtonLogout>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <main className="content">
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
                </div>

                <div className="question-list">
                    {questions.map(question =>{
                        return(
                            <Question 
                                key={question.id}
                                content={question.content}
                                author={question.author}
                                isAnswered={question.isAnswered}
                                isHighLighted={question.isHighLighted}
                            >
                            <div className='footer'>
                                {!question.isAnswered && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => handleCheckQuestionAsAnswered(question.id)}
                                        >
                                            <img src={checkImg} alt="Marcar pergunta como respondida"></img>
                                        </button>
                                        <button
                                            type="button"
                                            //onClick={() => handleHighlightQuestion(question.id)}
                                        >
                                            <img src={answerImg} alt="Responder"></img>
                                        </button>
                                        
                                    </>
                                    
                                )}
                                <button
                                    type="button"
                                    onClick={() => handleDeleteQuestion(question.id)}
                                >
                                    
                                    <img src={deleteImg} alt="Remover pergunta"></img>
                                </button> 
                                
                                <button
                                    className={`like-button ${question.likeId ? 'liked': ''}`}
                                    type="button"
                                    aria-label="Marcar como gostei"
                                    onClick={() => handleLikeQuestion(question.id, question.likeId)}
                                >
                                    {question.likeCount > 0 && <span>{question.likeCount}</span>}
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>

                                </button>
                            </div>
                            
                            </Question>
                        );
                    })}
                </div>
            </main>
        </div>
    )
}