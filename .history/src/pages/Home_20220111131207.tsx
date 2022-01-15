import {useHistory} from 'react-router-dom';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg';
import chatImg from '../assets/images/chat.png';

import { Button } from '../Components/Button';


import '../styles/auth.scss';
import { useAuth } from '../hooks/useAuth';
import { FormEvent } from 'react';
import { useState } from 'react';
import { database } from '../services/firebase';

export function Home(){
    const history = useHistory();
    const {user, signInWithGoogle} = useAuth();
    const [roomCode, setRoomCode] = useState('');

    async function handleCreateRoom(){
        if(!user){
           await signInWithGoogle();//await faz com que o restante do codigo so execute apos uma resposta de sucesso da funcao
        }
        history.push('rooms/new');
   
    }

    async function handleJoinRoom(event: FormEvent){
        event.preventDefault();

        if (roomCode.trim() === ''){
            return;
        }

        const roomRef = await database.ref(`rooms/${roomCode}`).get();
        const authorId = roomRef.val().authorId;//Variavel que do admin da sala

        if(!roomRef.exists()){
            alert('Room does not exists.');
            return;
        }

        if(roomRef.val().endedAt){
            alert('Room already closed.');
            return;
        }

        
        if(authorId === user?.id){
            history.push(`admin/rooms/${roomCode}`); // Verificar se o admin esta acessando a sala
            return;
        }
        

        history.push(`/rooms/${roomCode}`);
    }

    return(
        <div id="page-auth">
            <aside>
                <img src={illustrationImg} alt="Ilustracao simbolizando perguntas e respostas" />
                <strong>Crie salas de Q&amp;A ao-vivo</strong>
                <p>Tire as duvidas da sua audiencia em tempo-real</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={chatImg} alt="Letmeask"/>
                    <button onClick={handleCreateRoom} className="create-room">
                        <img src={googleIconImg} alt="Logo do Google" />
                        Crie sua sala com Google
                    </button>
                    <div className="separator">ou entre em uma sala</div>
                    <div>
                        <form onSubmit={handleJoinRoom}>
                            <input 
                                type="text"
                                placeholder="Digite o codigo da sala"
                                onChange={event => setRoomCode(event.target.value)} 
                                value = {roomCode}
                            />
                            <Button type="submit">
                                Entrar na sala
                            </Button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    )
}