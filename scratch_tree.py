import os

def generate_tree(dir_path, prefix="", f=None):
    ignore_dirs = {'node_modules', '.git', '.venv', 'venv', '__pycache__', 'build', 'dist', '.idea', '.vscode', 'env', 'migrations'}
    try:
        entries = sorted(os.listdir(dir_path))
    except PermissionError:
        return
    
    entries = [e for e in entries if e not in ignore_dirs]
    
    for i, entry in enumerate(entries):
        path = os.path.join(dir_path, entry)
        is_last = i == len(entries) - 1
        connector = "\\-- " if is_last else "|-- "
        f.write(prefix + connector + entry + "\n")
        if os.path.isdir(path):
            extension = "    " if is_last else "|   "
            generate_tree(path, prefix + extension, f)

if __name__ == "__main__":
    with open("project_tree.txt", "w", encoding="utf-8") as f:
        f.write(os.path.basename(os.path.abspath(".")) + "\n")
        generate_tree(".", "", f)
