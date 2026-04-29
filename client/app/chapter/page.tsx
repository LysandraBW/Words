"use client";
import Button from "@/components/Button";
import { deleteChapter } from "@/services/server/chapter";
import { insertWord, decrementWordNumberInstances as decrementWord, deleteWord, incrementWordNumberInstances as incrementWord } from "@/services/server/word";
import { MinusIcon, PlusIcon, SettingsIcon, TrashIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import UpdateChapter from "./UpdateChapter";
import ShowWords from "@/components/ShowWords";
import LogWord from "./LogWord";
import loadData, { useDataHandlers } from "./loadData";


export default function Page() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const chapterID = searchParams.get("chapterID");
    if (!chapterID)
        return router.push('/home');

    const [data, setData] = useState<Awaited<ReturnType<typeof loadData>>>();
    const handlers = useDataHandlers(setData);
    const [show, setShow] = useState<string>('');


    useEffect(() => {
        const load = async () => {
            try {
                const data = await loadData(Number(chapterID));
                setData(data);
            }
            catch (err) {
                alert(err);
            }
        }
        load();
    }, []);
    

    const onDeleteChapter = async (chapterID: number) => {
        try {
            await deleteChapter(chapterID);
            router.back();
        }
        catch (err) {
            alert(err);
        }
    }


    const onCreateWord = async (word: string, wordDefinition: string) => {
        try {
            const createdWord = await insertWord({word: [word, wordDefinition]});
            handlers.handleWordCreated(createdWord);
        }
        catch (err) {
            alert(err);
        }
    }  


    const onDeleteWord = async (wordID: number) => {
        try {
            const deletedWord = await deleteWord(wordID);
            handlers.handleWordDeleted(deletedWord);
        }
        catch (err) {
            alert(err);
        }
    }


    const onIncrementWord = async (wordID: number) => {
        try {
            const updatedWord = await incrementWord(wordID);
            handlers.handleWordIncremented(updatedWord);
        }
        catch (err) {
            alert(err);
        }
    }


    const onDecrementWord = async (wordID: number) => {
        try {
            const updatedWord = await decrementWord(wordID);
            handlers.handleWordDecremented(updatedWord);
        }
        catch (err) {
            alert(err);
        }
    }    


    if (!data)
        return <>Loading</>;

    
    return (
        <div>
            <div
                className="bg-purple-400"
            >
                <h3>Book and Chapter</h3>
                <button
                    className="bg-red-500"
                    onClick={() => onDeleteChapter(data.chapter.chapter_id)}
                >
                    Delete Chapter
                    <TrashIcon/>
                </button>
                <h3>
                    {data.chapter.book_name} {'>'} ({data.chapter.chapter_number}) {data.chapter.chapter_title}
                </h3>
            </div>
            <ShowWords
                words={data.words}
                decksGraded={data.decksGraded}
            />
            <div
                className="bg-blue-200"
            >
                <h3>Words</h3>
                {data.words.map((word, i) => (
                    <div key={i}>
                        <button
                            onClick={() => onDeleteWord(word.word_id)}
                        >
                            <TrashIcon/>
                        </button>
                        <p>
                            {word.word[0]}, {word.word[1]}
                        </p>
                        <button
                            onClick={() => onDecrementWord(word.word_id)}
                        >
                            <MinusIcon/>
                        </button>
                        {word.word_number_instances}
                        <button
                            onClick={() => onIncrementWord(word.word_id)}
                        >
                            <PlusIcon/>
                        </button>
                    </div>
                ))}
            </div>
            <button
                onClick={() => setShow('Update Chapter')}
                className="bg-pink-600"
            >
                <SettingsIcon/>
            </button>
            {show === 'Update Chapter' &&
                <UpdateChapter
                    chapter={data.chapter}
                    onClose={() => setShow('')}
                    onChapterUpdated={handlers.handleChapterUpdated}
                />
            }
            <Button
                label='Log Word'
                onClick={() => setShow('Log Word')}
                style="blue"
            />
            {show === 'Log Word' &&
                <LogWord
                    onClose={() => setShow('')}
                    onCreateWord={onCreateWord}
                />
            }
        </div>
    )
}