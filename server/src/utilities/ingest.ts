import 'dotenv/config';
import * as lancedb from '@lancedb/lancedb';
import vectors from 'wink-embeddings-sg-100d';

// Data
const data = vectors.words.map((word, i) => ({
    id: i,
    word: word,
    vector: vectors.vectors[word]?.slice(0, 100)
}));

// Database
const db = await lancedb.connect("./src/embeddings");
const table = await db.createTable("Embeddings", data);
console.log(`'${table.name}' Created`);
db.close();