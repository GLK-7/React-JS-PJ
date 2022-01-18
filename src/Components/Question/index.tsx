import { FormEvent, ReactNode, useState } from 'react'
import cx from 'classnames';

import answerImg from '../../assets/images/answer.svg';
import { useAuth } from '../../hooks/useAuth';
import { useParams } from 'react-router-dom';
import { database } from '../../services/firebase';
import { Answer } from '../Answer';
import './styles.scss';

type QuestionProps = {
    id: string;
    content: string;
    answers: AnswerProps[] | undefined;
    author:{
        name: string;
        avatar: string;
    }
    children?: ReactNode;
    isAnswered?: boolean;
    isHighLighted?: boolean;
}

// Criado
type AnswerProps = {
    id?: string;
    content: string;
    author:{
        name: string;
        avatar: string;
    }
}

// Criado
type RoomParams = {
    id: string;
}

export function Question({
    id,
    content,
    author,
    answers,
    isAnswered = false,
    isHighLighted = false,
    children
}: QuestionProps) {
    const params = useParams<RoomParams>();
    const roomId = params.id;

    const { user } = useAuth();
    
    const [newAnswer, setNewAswer] = useState('');
    const [isAnswerOpen, setIsAnswerOpen] = useState(false);
    const [isAnswersOpen, setIsAnswersOpen] = useState(false);

    async function handleSendAnswer(event: FormEvent) {
        event.preventDefault();
        
        if (newAnswer.trim() === ''){
            return;
        }

        if (!user){
           throw new Error('You must be logged in')
        }

        const answer: AnswerProps = {
            content: newAnswer,
            author:{
                name:user?.name,
                avatar: user.avatar
            }
        }
            
        await database.ref(`rooms/${roomId}/questions/${id}/answers`).push(answer);
        setNewAswer('');
    }
  
    return(
        // Nesse caso foi usado a biblioteca classnames para a condicional
        <div className={cx(
                'question',
                { answered: isAnswered},
                { highlighted: isHighLighted && !isAnswered},
            )}
        >
            
            <p>{content}</p>

            <footer>
                <div className="user-info">
                    <img title={author.name} src={author.avatar} alt={author.name} />
                    <span>{author.name}</span>
                </div>
                <div>
                    <button
                        type="button"
                        onClick={() => setIsAnswerOpen(!isAnswerOpen)}
                    >
                        <img src={answerImg} alt="Responder" />
                    </button>
                    {children}
                </div>
            </footer>

            <hr />

            { isAnswerOpen &&
                <form onSubmit={handleSendAnswer}>
                    <textarea
                        placeholder="Qual a sua resposta?"
                        onChange={event => setNewAswer(event.target.value)}
                        value={newAnswer}
                        className='answer-input'
                    />

                    <div className="form-answer-footer">                    
                        <button type='submit'>
                            Enviar resposta
                        </button>
                    </div>
                </form>
                
            }
            {answers && <span onClick={() => setIsAnswersOpen(!isAnswersOpen)}>
                
                <span>{isAnswersOpen ? `Ocultar repostas (${answers.length})` : `Ver respostas (${answers.length})`}</span>
            
            </span>}
            
            { isAnswersOpen &&

                <div>
                    <br />
                    {answers && answers.map(answer => (
                        <div className='answerBlock'>
                            <p className='answer'>
                                <Answer
                                    key={answer.id}
                                    content={answer.content}
                                    author={answer.author}
                                />
                            </p>
                        </div>
                    ))}
                </div>
            }
        </div>
    )
}

