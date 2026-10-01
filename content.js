// Chrome renders text/plain inside a <pre> tag. Let's make sure we are looking at raw text.
if (document.body && document.body.childNodes.length === 1 && document.body.firstChild.tagName === 'PRE') {
    const rawContent = document.body.innerText;
    const url = window.location.href.toLowerCase();

    let formattedHTML = '';

    // Simple JSON Syntax Highlighter
    function highlightJSON(jsonStr) {
        jsonStr = jsonStr.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return jsonStr.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            let cls = 'number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) cls = 'key';
                else cls = 'string';
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            return `<span class="${cls}">${match}</span>`;
        });
    }

    // Simple YAML Syntax Highlighter
    function highlightYAML(yamlStr) {
        yamlStr = yamlStr.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return yamlStr.replace(/(^\s*[\w-]+:)|(#.*)|(['"].*?['"])/gm, function(match, key, comment, str) {
            if (key) return `<span class="key">${key}</span>`;
            if (comment) return `<span class="comment">${comment}</span>`;
            if (str) return `<span class="string">${str}</span>`;
            return match;
        });
    }

    if (url.includes('.json')) {
        try {
            // Parse and re-stringify to ensure clean indentation
            const parsed = JSON.parse(rawContent);
            const prettyJSON = JSON.stringify(parsed, null, 4);
            formattedHTML = highlightJSON(prettyJSON);
        } catch (e) {
            // Fallback if JSON is malformed
            formattedHTML = highlightJSON(rawContent);
        }
    } else if (url.includes('.yaml') || url.includes('.yml')) {
        formattedHTML = highlightYAML(rawContent);
    }

    // Replace the DOM with our styled version
    if (formattedHTML) {
        document.body.innerHTML = '';
        const container = document.createElement('pre');
        container.innerHTML = formattedHTML;
        document.body.appendChild(container);
    }
}
