# Opensidian for Nextcloud

<img alt="nextcloud-opensidian-editor" src="https://github.com/user-attachments/assets/ec5eeeb1-277c-4795-8881-657c4a1518b8" />
<img alt="nextcloud-opensidian-graph" src="https://github.com/user-attachments/assets/611068bc-aeb4-4579-b9ae-88e8240af68e" />

**Opensidian** turns any Nextcloud folder of Markdown files into a linked knowledge base. Write notes in a full-featured editor, connect them with `[[Wikilinks]]`, visualise your knowledge as an interactive graph, and chat with your notes using any OpenAI-compatible AI - all without leaving Nextcloud.

---

## Features

- **CodeMirror 6 editor** - full-featured Markdown editor with split-pane live preview, syntax highlighting, and auto-save
- **`[[Wikilink]]` syntax** - shortest-path resolution links notes by name; a backlinks panel shows every note that references the current one
- **Force-directed knowledge graph** - press `Ctrl+G` to explore your entire vault as an interactive D3 graph with emoji colour coding per note category
- **AI chat panel** - connect any OpenAI-compatible API (OpenAI, Ollama, LM Studio, local models…); the assistant uses your active note and its linked notes as context
- **Hierarchical file tree** - drag-and-drop, rename, delete, and create notes from `.templates/` folder templates
- **Vault indexing** - all wikilinks and backlinks are indexed in the background on vault open; a progress indicator shows while indexing
- **Light / dark theme** - follows your Nextcloud appearance setting automatically; font size adjustable in Settings
- **No lock-in** - notes are plain `.md` files stored in your Nextcloud files; open them in any editor

---

## Requirements

| Dependency | Version |
|---|---|
| Nextcloud | 25 – 33 |
| PHP | 8.0+ |

---

## Installation

### From source (manual)

1. Clone or download this repository into your Nextcloud `custom_apps/` directory:
   ```bash
   cd /path/to/nextcloud/custom_apps
   git clone https://github.com/markusbegerow/nextcloud-opensidian nextcloud-opensidian
   ```
2. Enable the app:
   ```bash
   php occ app:enable opensidian
   ```
3. Open the **Opensidian** entry in the Nextcloud navigation bar.

---

## Usage

1. Click **Open vault** in Settings → Vault and enter a path relative to your Nextcloud home folder (e.g. `Notes`). The folder will be created if it does not exist.
2. Use the **file tree** on the left to create, rename, and organise notes. If a `.templates/` folder exists in your vault, new notes can be created from templates.
3. Write `[[Note Name]]` anywhere in a note to create a wikilink. Click it to navigate; the **Backlinks** panel on the right shows all notes linking to the current one.
4. Press `Ctrl+G` (or click **Graph**) to open the force-directed graph view. Nodes are coloured by the emoji prefix of the note title - define your colour system in `.configs/colors.md`.
5. Click **Chat** in the right panel and configure your LLM in Settings → AI & LLM (API URL, model, token). The assistant receives your active note and its linked notes as context automatically.
6. Press `Ctrl+S` to save manually; the editor auto-saves as you type.

---

## License

[GPL-3.0](https://www.gnu.org/licenses/gpl-3.0.html) © [Markus Begerow](https://markus-begerow.de/linktree)

---

## 🙋‍♂️ Get Involved

If you encounter any issues or have questions:
- 🐛 [Report bugs](https://github.com/markusbegerow/nextcloud-opensidian/issues)
- 💡 [Request features](https://github.com/markusbegerow/nextcloud-opensidian/issues)
- ⭐ Star the repo if you find it useful!

## ☕ Support the Project

If you like this project, support further development with a repost or coffee:

<a href="https://www.linkedin.com/sharing/share-offsite/?url=https://github.com/MarkusBegerow/nextcloud-opensidian" target="_blank"> <img src="https://img.shields.io/badge/💼-Share%20on%20LinkedIn-blue" /> </a>

[![Buy Me a Coffee](https://img.shields.io/badge/☕-Buy%20me%20a%20coffee-yellow)](https://paypal.me/MarkusBegerow)

## 📬 Contact

- 🧑‍💻 [Markus Begerow](https://linkedin.com/in/markusbegerow)
- 💾 [GitHub](https://github.com/markusbegerow)
- ✉️ [Twitter](https://x.com/markusbegerow)
