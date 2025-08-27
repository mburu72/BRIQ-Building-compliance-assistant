# BRIQ - Building Regulations Insight Query

**BRIQ** is an AI assistant that helps users understand and stay compliant with licensing and regulatory requirements in Kenya.

It uses [LangChain](https://www.langchain.com/), [Pydantic AI](https://ai.pydantic.dev/) and [Gemini](https://deepmind.google/discover/blog/google-gemini-ai/) to let users query building construction regulations and standards.

---

## 🚀 Features

- 🧠 AI-powered chat assistant (Pydantic AI + Gemini)
- 📄 Query compliance PDFs
- 🏛️ Local repository of official regulatory documents
- 🔎 RAG-based document retrieval pipeline

---

## 🛠️ Tech Stack

| Layer        | Tech                                         |
|--------------|----------------------------------------------|
| LLM + RAG    | LangChain, Pydantic AI, Gemini Pro, chromadb |
| Backend      | FastAPI                                      |
| Parsing      | LangChain loaders                            |
| Frontend     | NextJS, TailwindCSS                          |

---

## 📦 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/mburu72/BRIQ-Building-compliance-assistant.git
cd 
````

### 2. Set Up Environment

Create a `.env` file:

```bash
cp .env
```

Then add your Gemini API key:

```
GEMINI_API_KEY=your_gemini_key_here
```

### 3. Create a Virtual Environment

```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

### 4. Install Dependencies

```bash
pip install -r requirements.txt
```

### 5. Run the App

```bash
uvicorn main:app --reload
```

---

## 📂 Project Structure

```
BRIQ/
├── agent_service/           # Agent with pydantic-ai. This is where the agent is initialized  
├── core/                    # App settings and shared constants
├── docops/                  #Document operations - PDF parsing, chunking and embedding
├── api/                     # FastAPI endpoints (chat, history etc.)
├── docs/                    # Building Code 2024/legal PDFs (core document base)
├── tests/                   # Tests with pytest and unittest
├── chroma_store             # Stores the embeddings
├── crud/                    # Stores chats in the db
├── models/                  # contains the models used in the project
├── prompt.md                # System prompt for the agent
├── requirements.txt         # Project dependencies
├── README.md                # This file
└── main.py                  # App entry point
```

---
## The live demo can be found [here](https://briq-ke.netlify.app)
## Swagger docs can be found [here](https://briq.duckdns.org/docs)


## 🗂️ Regulatory Documents

All official compliance PDFs are stored under:

```
docs/
```

---

## 👤 Author

Built by [Edward Mburu](https://github.com/mburu72)
