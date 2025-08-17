const vscode = require("vscode");

function activate(context) {
  // ----------------------------
  // Automatic link formatting
  // ----------------------------
  let disposable = vscode.commands.registerCommand(
    "mdlinks.convertirLinks",
    async function () {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;

      const doc = editor.document;
      const text = doc.getText();
      const workspaceEdit = new vscode.WorkspaceEdit();

      // Plain URL regex
      const urlRegex = /(?<!\!\[[^\]]*\]\()(?<!\[[^\]]*\]\()((https?:\/\/|www\.)?[a-z0-9.-]+\.[a-z]{2,})(\/[^\s\]\)]*)?/gi;


      // Formatted link and image regex
      const formattedLinkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+|www\.[^\s)]+)\)/gi;
      const formattedImageRegex = /!\[([^\]]*)\]\((https?:\/\/[^\s)]+|www\.[^\s)]+)\)/gi;

      // Avoid formatting already formatted links and images
      const formattedRanges = [];
      let match;
      while ((match = formattedLinkRegex.exec(text)) !== null) {
        formattedRanges.push([match.index, match.index + match[0].length]);
      }
      while ((match = formattedImageRegex.exec(text)) !== null) {
        formattedRanges.push([match.index, match.index + match[0].length]);
      }

      function isInFormattedRange(index) {
        return formattedRanges.some(([start, end]) => index >= start && index < end);
      }

      // Find all plain URLs that are not in formatted ranges
      const matches = [];
      while ((match = urlRegex.exec(text)) !== null) {
        if (!isInFormattedRange(match.index)) {
          matches.push(match);
        }
      }

      // Replace plain URLs with formatted Markdown links or images
      for (let i = matches.length - 1; i >= 0; i--) {
        const url = matches[i][0];
        const start = doc.positionAt(matches[i].index);
        const end = doc.positionAt(matches[i].index + url.length);
        const range = new vscode.Range(start, end);

        const isImage = /\.(jpg|jpeg|png|gif|svg|webp)$/i.test(url);

        const label = isImage
          ? url.split("/").pop().split(".")[0]
          : new URL(url.startsWith("http") ? url : `http://${url}`)
              .hostname.replace("www.", "");
        const formattedLabel = label.charAt(0).toUpperCase() + label.slice(1);

        const replacement = isImage
          ? `![${formattedLabel}](${url})`
          : `[${formattedLabel}](${url})`;

        workspaceEdit.replace(doc.uri, range, replacement);
      }

      await vscode.workspace.applyEdit(workspaceEdit);
      vscode.window.showInformationMessage(
        "Links formatted to Markdown."
      );
    }
  );

  // ----------------------------
  // Manual input
  // ----------------------------
  let disposableInput = vscode.commands.registerCommand(
    "mdlinks.convertirLinksConInput",
    async function () {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;

      const doc = editor.document;
      let text = "";
      let selection = null;

      if (!editor.selection.isEmpty) {
        selection = editor.selection;
        text = doc.getText(selection);
      } else {
        text = doc.getText();
      }

      const workspaceEdit = new vscode.WorkspaceEdit();

      // const urlRegex = /(https?:\/\/|www\.)[^\s\]\)]+/gi;
      const urlRegex = /(?<!\!\[[^\]]*\]\()(?<!\[[^\]]*\]\()((https?:\/\/|www\.)?[a-z0-9.-]+\.[a-z]{2,})(\/[^\s\]\)]*)?/gi;
      const formattedLinkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+|www\.[^\s)]+)\)/gi;
      const formattedImageRegex = /!\[([^\]]*)\]\((https?:\/\/[^\s)]+|www\.[^\s)]+)\)/gi;

      const formattedRanges = [];
      let match;
      while ((match = formattedLinkRegex.exec(text)) !== null) {
        formattedRanges.push([match.index, match.index + match[0].length]);
      }
      while ((match = formattedImageRegex.exec(text)) !== null) {
        formattedRanges.push([match.index, match.index + match[0].length]);
      }

      function isInFormattedRange(index) {
        return formattedRanges.some(([start, end]) => index >= start && index < end);
      }

      const matches = [];
      while ((match = urlRegex.exec(text)) !== null) {
        if (!isInFormattedRange(match.index)) {
          matches.push(match);
        }
      }

      for (let i = matches.length - 1; i >= 0; i--) {
        const url = matches[i][0];

        const startOffset = matches[i].index;
        const endOffset = matches[i].index + url.length;

        const start = selection
          ? doc.positionAt(doc.offsetAt(selection.start) + startOffset)
          : doc.positionAt(startOffset);
        const end = selection
          ? doc.positionAt(doc.offsetAt(selection.start) + endOffset)
          : doc.positionAt(endOffset);
        const range = new vscode.Range(start, end);

        const isImage = /\.(jpg|jpeg|png|gif|svg|webp)$/i.test(url);

        const input = await vscode.window.showInputBox({
          prompt: `Enter the text for the ${isImage ? "image" : "link"} "${url}"`,
          value: "",
        });

        if (!input) continue;

        const replacement = isImage ? `![${input}](${url})` : `[${input}](${url})`;

        workspaceEdit.replace(doc.uri, range, replacement);
      }

      await vscode.workspace.applyEdit(workspaceEdit);
      vscode.window.showInformationMessage(
        "Links formatted to Markdown."
      );
    }
  );

  context.subscriptions.push(disposable);
  context.subscriptions.push(disposableInput);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
