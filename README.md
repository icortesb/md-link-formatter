# md-link-formatter

Automatically converts plain URLs into Markdown links or images in VS Code, either automatically or with manual input.

---

## Features

- **Automatic link formatting:** Converts plain URLs in the active document to Markdown format.
  - Example:
    - `google.com` → `[Google.com](http://google.com)`
    - `http://example.com/pic.png` → `![Pic](http://example.com/pic.png)`
- **Format all text or just a selection**: You can format all URLs in the document or only those in the selected text.
- **Manual link formatting:** Prompts you to enter custom text for each URL or image.
- **Smart detection:** Avoids re-formatting URLs that are already in Markdown links or images.
- **Image support:** jpg, jpeg, png, gif, svg, webp.

> Example of automatic conversion:

Original text:

Google.com
https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/React.svg/1200px-React.svg.png


After automatic conversion:

[Google.com](http://google.com)
![1200px-React](https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/React.svg/1200px-React.svg.png)

> Example of manual conversion:

Original text:

google.com
https://github.com/profile

After manual conversion with input:

[Google website](http://google.com)
[GitHub profile](https://github.com/profile)

---

## Requirements

No additional dependencies required.

---

## How to Use

This extension works via keyboard shortcuts:

- `Ctrl + Alt + L` – Automatically formats all plain URLs in the active document into Markdown links or images.
- `Ctrl + Alt + I` – Prompts for custom text for each URL or image in the selection or entire document.

*Works on the current selection if text is selected, or the entire document if no selection is made.*
---

## Known Issues

- URLs without a protocol (e.g., google.com) inside existing Markdown links or images are ignored.
- Does not validate if the URL actually exists or is reachable.

---

## Release Notes

### 1.0.0
- First public release of md-link-formatter.
- Automatic and manual Markdown URL formatting.

## About the Author

This extension was developed by Iván Cortés.  
Connect with me on [LinkedIn](https://www.linkedin.com/in/ivan-cortes-buenard/).
