import logging
import os
from fastapi import APIRouter, UploadFile, File
from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains import LLMChain
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_google_genai import GoogleGenerativeAIEmbeddings # Corrección aquí
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain.document_loaders import PyPDFLoader
from langchain.vectorstores import Chroma
import tempfile
from dotenv import load_dotenv
import json
from typing import List
from Question import Question, ExamenResponse

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
load_dotenv()

async def generate_exam(file: UploadFile = File(...), num_questions: int = 5) -> ExamenResponse:
    logger.info(f"Valor de 'num_questions' recibido: {num_questions}")
    logger.info("Iniciando la generación del examen.")
    # Save pdf file to a temporary location
    with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
        temp_file.write(await file.read())
        temp_file_path = temp_file.name
    logger.info(f"Archivo temporal guardado en: {temp_file_path}")
    
    try:
        # Process the PDF to extract questions
        loader = PyPDFLoader(temp_file_path)
        documents = loader.load()
        logger.info(f"Documentos cargados: {len(documents)} páginas.")

        # Split the documents into manageable chunks
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        texts = text_splitter.split_documents(documents)
        logger.info(f"Texto dividido en {len(texts)} chunks.")

        # Embedding the LLM google_genai
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            logger.error("GOOGLE_API_KEY no está configurada en el entorno.")
            raise RuntimeError("Falta GOOGLE_API_KEY para generar embeddings con Google Generative AI.")
        try:
            embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
            logger.info("Embeddings de Google Generative AI inicializados.")
        except Exception as e:
            logger.exception("Error inicializando embeddings de Google Generative AI.")
            raise
        try:
            vector_store = Chroma.from_documents(texts, embeddings)
            logger.info("Vector store Chroma creado con %d documentos.", len(texts))
        except Exception as e:
            logger.exception("Error creando el vector store Chroma.")
            raise
        
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
        logger.info("Prompt template creado.")

        retriever = vector_store.as_retriever(search_kwargs={"k": min(10, len(texts))})
        relevant_docs = retriever.get_relevant_documents("Generar preguntas de multiple choice con 4 opciones cada una.")
        logger.info(f"Documentos relevantes obtenidos: {len(relevant_docs)}.")

        # Concatenate the relevant documents
        context = "\n\n".join([doc.page_content for doc in relevant_docs])
        logger.info("Contexto para el LLM preparado.")

        # Create the LLM chain
        chain = prompt_template | llm | parser
        logger.info("Cadena LLM creada.")

        # Invoke the chain to generate questions
        try:
            logger.info("Invocando cadena LLM con %d preguntas objetivo y contexto de %d caracteres.", num_questions, len(context))
            response = chain.invoke({
                "context": context,
                "num_questions": num_questions
            })
            logger.info("Respuesta del LLM recibida.")
        except Exception:
            logger.exception("Fallo al invocar la cadena del LLM.")
            raise

        # Normalizar y validar la salida
        try:
            if isinstance(response, dict) and "questions" in response:
                items = response["questions"]
            elif isinstance(response, list):
                items = response
            else:
                items = [response]
            normalized = []
            for idx, q in enumerate(items):
                if isinstance(q, str):
                    try:
                        q = json.loads(q)
                    except Exception:
                        logger.warning("Elemento %d devuelto como string no es JSON parseable. Se ignorará.", idx)
                        continue
                if not isinstance(q, dict):
                    logger.warning("Elemento %d con tipo inesperado: %s. Se ignorará.", idx, type(q))
                    continue
                question_text = q.get("question") or q.get("pregunta") or ""
                choices_val = q.get("choices") or q.get("opciones") or []
                if isinstance(choices_val, list):
                    choices_str = ", ".join(map(str, choices_val))
                else:
                    choices_str = str(choices_val)
                answer_text = q.get("answer") or q.get("respuesta") or ""
                normalized.append(Question(question=question_text, choices=choices_str, answer=answer_text))
            logger.info("Se generaron %d preguntas normalizadas.", len(normalized))
            return ExamenResponse(questions=normalized)
        except Exception:
            logger.exception("Error normalizando la respuesta del LLM.")
            raise
    finally:
        os.remove(temp_file_path) # Clean up the temporary file
