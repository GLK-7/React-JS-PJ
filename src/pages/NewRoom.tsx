import {Link, useHistory} from 'react-router-dom';
import {FormEvent} from 'react';

import illustrationImg from '../assets/images/illustration.svg';
import chatImg from '../assets/images/chat.png';
//import googleIconImg from '../assets/images/google-icon.svg';

import { Button } from '../Components/Button';

import '../styles/auth.scss';

import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';
import { database } from '../services/firebase';

export function NewRoom(){
    const { user } = useAuth();
    const history = useHistory();
    const[newRoom, setNewRoom] = useState('');

    async function handleCreateRoom(event: FormEvent){
        event.preventDefault();

        if(newRoom.trim() === ''){
            return;    
        }

        const roomRef = database.ref('rooms');

        const firebaseRoom = await roomRef.push({
            title: newRoom,
            authorId: user?.id,
        })

        history.push(`/admin/rooms/${firebaseRoom.key}`)
    }

    return(
        <div id="page-auth">
            <aside>
                <img src={illustrationImg} alt="Ilustracao simbolizando perguntas e respostas" />
                <strong>Crie salas de Q&amp;A</strong>
                <p>Tire as duvidas com seus professores e interaja com seus colegas</p>
            </aside>
            <main>

                <div className="main-content">
                    <img src={chatImg} alt="Letmeask"/>
                    <h2>Criar uma nova sala</h2>
                    <div>
                        <form onSubmit={handleCreateRoom}>
                            <input 
                                type="text"
                                placeholder="Nome da sala"
                                onChange={event => setNewRoom(event.target.value)}
                                value={newRoom}
                            />
                            <Button type="submit">
                                Criar sala
                            </Button>
                        </form>
                        <p>
                            Quer entrar em uma sala existente? <Link to="/">clique aqui</Link>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    )
}
