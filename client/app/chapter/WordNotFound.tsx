interface WordNotFoundProps {
    word: string;
    otherWords: string[];
    onClickWord: (word: string) => void;
}

export default function WordNotFound(props: WordNotFoundProps) {
    return (
        <div>
            <h3>'{props.word}' Not Found</h3>
            <h3>Did You Mean?</h3>
            {props.otherWords.map((otherWord, i) => (
                <div 
                    key={i}
                    onClick={() => props.onClickWord(otherWord)}    
                >
                    {otherWord}
                </div>
            ))}
        </div>
    )
}