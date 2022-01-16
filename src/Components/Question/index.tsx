import {ReactNode, useState} from 'react'
import cx from 'classnames';

import answerImg from '../../assets/images/answer.svg';
import './styles.scss';

type QuestionProps = {
    id: string;
    content: string;
    author:{
        name: string;
        avatar: string;
    }
    children?: ReactNode;
    isAnswered?: boolean;
    isHighLighted?: boolean;
}

export function Question({
    id,
    content,
    author,
    isAnswered = false,
    isHighLighted = false,
    children
}: QuestionProps) {
    
    const [newAnswer, setNewAswer] = useState('');
    const [isAnswerOpen, setIsAnswerOpen] = useState(false);

    async function handleAnswer(questionId: String) {
        
    }

    return(
        //Nesse caso foi usado a biblioteca classnames para a condicional
        <div className={cx(
                'question',
                { answered: isAnswered},
                { highlighted: isHighLighted && !isAnswered},
            )}
        >
            
            <p>{content}</p>

            <footer>
                <div className="user-info">
                    <img src={author.avatar} alt={author.name} />
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
                <form>
                    <textarea
                        placeholder="Qual a sua resposta?"
                        onChange={event => setNewAswer(event.target.value)}
                        value={newAnswer}
                        className='answer-input'
                    />

                    <div className="form-answer-footer">                    
                        <button>
                            Enviar resposta
                        </button>
                    </div>
                </form>
            }
        </div>
    )
}