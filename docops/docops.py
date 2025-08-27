import os
import chromadb
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader
from chromadb.utils import embedding_functions

from core.logger import logger

client = chromadb.PersistentClient(path="./chroma_store")
embed_model = embedding_functions.DefaultEmbeddingFunction()

collection = client.get_or_create_collection(
    name="docs",
    embedding_function=embed_model
)

def load_and_index(docs_path="docs"):
    if not os.path.exists(docs_path):
        logger.warning("Docs path does not exist")
        return collection

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000, chunk_overlap=200
    )

    for filename in os.listdir(docs_path):
        if filename.endswith(".pdf"):
            path = os.path.join(docs_path, filename)
            try:
                loader = PyPDFLoader(path)
                load = loader.load()
                chunks = splitter.split_documents(load)

                collection.add(
                    documents=[chunk.page_content for chunk in chunks],
                    metadatas=[chunk.metadata for chunk in chunks],
                    ids=[f"{filename}_{i}" for i in range(len(chunks))]
                )
                logger.info(f"✅ Indexed {len(chunks)} chunks from {filename}")

            except Exception as e:
                logger.error(f"Failed to process {filename}: {e}")

    return collection
