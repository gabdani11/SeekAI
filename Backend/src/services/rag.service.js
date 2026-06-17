import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { MistralAIEmbeddings } from "@langchain/mistralai";
import { Pinecone } from '@pinecone-database/pinecone';

const embeddings = new MistralAIEmbeddings({
  model: "mistral-embed",
  apiKey: process.env.MISTRALAI_API_KEY,
  dimensions: 1024,
});
const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});
const index = pc.Index("seekai");
export async function storeRAGData(data)
{
    const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 100, chunkOverlap: 0 })
    const chunks = await splitter.splitText(data.text)

    const documents = await Promise.all(chunks.map(async (chunk) => {
        const embedding = await embeddings.embedQuery(chunk)
        return {
            text: chunk,
            embedding: embedding
        }
    }))
    
    await index.upsert({
        records: documents.map((doc, i) => ({
            id: `doc-${i}`,
            values: doc.embedding,
            metadata: { text: doc.text }
        }))
    })
    return true
    
}
export async function queryRAGData({query})

{
    const embedding = await embeddings.embedQuery(query)
    const result = await index.query({
        vector: embedding,
        topK: 5,
        includeMetadata: true,
        includeValues: false
    })
    return result.matches.map(match => match.metadata.text)
  
}