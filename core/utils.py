def load_prompt(path_to_prompt: str) -> str:
    with open (path_to_prompt, 'r', encoding='utf-8') as f:
        docs = f.read()
        return docs
