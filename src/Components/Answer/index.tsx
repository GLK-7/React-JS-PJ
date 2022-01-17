import './styles.scss';

type AnswerProps = {
    content: string;
    author: {
        name: string;
        avatar: string;
    }
}

export function Answer({
  content,
  author
}: AnswerProps): JSX.Element {
    return (
        <div>
            <p>{ content }</p>
            <footer>
                <div className="user-info">
                    <img src={author.avatar} alt={author.name} />
                    <span>{author.name}</span>
                </div>
            </footer>
        </div>
    )
}