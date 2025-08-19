from fastapi import APIRouter, UploadFile, File
from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains import LLMChain
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_google_genai import GoogleGenerativeAIEmbeddings # Corrección aquí
from langchain_core.prompts import ChatPromptTemplate
from langchain.document_loaders import PyPDFLoader
from langchain.vectorstores import Chroma
import tempfile
from typing import List
from Question import Question, ExamenResponse

async def generate_exam(file: UploadFile = File(...), questions: int = 5) -> str:
    # Save pdf file to a temporary location
    with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
        temp_file.write(await file.read())
        temp_file_path = temp_file.name
    
    try:
        # Process the PDF to extract questions
        loader = PyPDFLoader(temp_file_path)
        documents = loader.load()

        # Split the documents into manageable chunks
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        texts = text_splitter.split_documents(documents)

        # Embedding the LLM google_genai
        embeddings = GoogleGenAIEmbeddings()
        vector_store = Chroma.from_documents(texts, embeddings)
        
        llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0.1)
        response_schema = [
            {"name": "question", "description": "La pregunta generada."},
            {"name": "choices", "description": "Lista de 4 opciones separadas por coma."},
            {"name": "answer", "description": "La respuesta correcta."}
        ]
        parser = JsonOutputParser()

        prompt_template = ChatPromptTemplate.from_template(
            """Basado en el siguiente texto, genera {num_questions} preguntas de multiple choice con 4 opciones cada una.
            Asegúrate de que las preguntas sean relevantes y educativas.
            Formato de salida: Una lista JSON con objetos que tengan 'question', 'choices' (lista), y 'answer'.

            Texto: {context}

            {format_instructions}
            """
        ).partial(format_instructions=parser.get_format_instructions())

        retriever = vector_store.as_retriever(search_kwargs={"k": min(10, len(texts))})
        relevant_docs = retriever.get_relevant_documents("Generar preguntas de multiple choice con 4 opciones cada una.")

        # Concatenate the relevant documents
        context = "\n\n".join([doc.page_content for doc in relevant_docs])

        # Create the LLM chain
        chain = prompt_template | llm | parser

        # Invoke the chain to generate questions
        response = chain.invoke({
            "context": context,
            "num_questions": questions
        })

        questions = response if isinstance(response, list) else [response]
        return ExamenResponse(questions=[Question(**q) for q in questions])
    finally:
        os.remove(temp_file_path) # Clean up the temporary file
