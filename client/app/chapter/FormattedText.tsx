import React, { isValidElement, ReactNode, useEffect, useState } from "react"

interface FormattedTextProps {
    text: string
}

export default function FormattedText(props: FormattedTextProps) {
    const [nodes, setNodes] = useState<ReactNode[]>([]);

    useEffect(() => {
        if (!props.text)
            return;

        const nodes = formatTextWithNestedTokens(props.text.trim()).filter(node => isValidElement(node));
        for (let i = 0; i < nodes.length; i += 2) {
            nodes[i] = React.cloneElement(nodes[i], {key: i });
            if (i !== nodes.length - 1)
                nodes.splice(i + 1, 0, (
                    <span key={i+1} className="block">&nbsp;</span>
                ));
        }

        setNodes(nodes);
    }, [props.text]);

    const formatTextWithNestedTokens = (text: string): ReactNode[] => {
        if (!text)
            return [];

        let nodes: ReactNode[] = [];
        let matches = text.matchAll(/\{(\/?\w+)[^}]*\}([\s\S]*?)\{\/\1\}/g);
        let l = 0;
        for (const match of matches) {
            // Update R-Index
            let r = match.index;

            const textWithNoNestedTokens = text.slice(l, r).trim();
            nodes = nodes.concat(formatTextWithNoNestedTokens(textWithNoNestedTokens));

            let outerElement: ReactNode = null;
            switch (match[1]) {
                case "it":
                case "wi":
                    outerElement = React.createElement("i");       
                    break
                case "b":
                    outerElement = React.createElement("b");
                    break
                default:
                    outerElement = React.createElement("span");
            }

            const innerElements: ReactNode[] = formatTextWithNestedTokens(match[2]);
            const outerElementWithInnerElements = React.cloneElement(outerElement, {}, null, ...innerElements);
            nodes.push(outerElementWithInnerElements);

            // Update L-Index
            l = match.index + match[0].length;
        }

        if (l < text.length) {
            const textWithNoNestedTokens = text.slice(l, text.length).trim();
            nodes = nodes.concat(formatTextWithNoNestedTokens(textWithNoNestedTokens));
        }
        return nodes;
    }

    const formatTextWithNoNestedTokens = (text: string): ReactNode[] => {
        if (!text.length)
            return [];

        let nodes: ReactNode[] = [];
        let matches = text.matchAll(/{wi}{\/wi}|\{([^}]+)\}/g);
        let l = 0;
        for (const match of matches) {
            // Update R-Index
            let r = match.index;

            // Add the Text w/ No Tokens
            const textWithNoTokens = text.slice(l, r).trim();
            if (textWithNoTokens)
                nodes.push((
                    <span>
                        {textWithNoTokens}
                    </span>
                ));

            // Add the Token
            if (match[1] == "bc") {
                nodes.push((
                    <span>:</span>
                ));
            }
            else if (match[1] == "ldquo") {
                nodes.push((
                    <span>"</span>
                ));
            }
            else if (match[1] == "rdquo") {
                nodes.push((
                    <span>"</span>
                ));
            }
            else if (match[1].startsWith("sx")) {
                const refWord = match[1].split("|").filter(part => !!part.length)[1];
                nodes.push((
                    <span
                        className="text-blue-500 font-bold uppercase"
                    >
                        {refWord}
                    </span>
                ));
            }
            else if (match[1].startsWith("d_link")) {
                const refWord = match[1].split("|").filter(part => !!part.length)[1];
                nodes.push((
                    <span
                        className="text-blue-500 font-bold uppercase"
                    >
                        {refWord}
                    </span>
                ));
            }
            else if (match[1].startsWith("a_link")) {
                const refWord = match[1].split("|").filter(part => !!part.length)[1];
                nodes.push((
                    <span
                        className="text-blue-500 font-bold uppercase"
                    >
                        {refWord}
                    </span>
                ));
            }
            
            // Update L-Index
            l = match.index + match[0].length;
        }

        if (l < text.length) {
            nodes.push((<span>{text.slice(l, text.length).trim()}</span>));
        }
        return nodes;
    }

    
    return (
        <div
            className="flex"
        >
            {nodes}
        </div>
    )
}