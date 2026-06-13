window.VOCA_APP_CHUNKS = window.VOCA_APP_CHUNKS || [];
window.VOCA_APP_CHUNKS.push("replaceAll(\"&\", \"&amp;\")\n      .replaceAll(\"<\", \"&lt;\")\n      .replaceAll(\">\", \"&gt;\")\n      .replaceAll('\"', \"&quot;\")\n      .replaceAll(\"'\", \"&#039;\");\n  }\n\n  function escapeRegex(text) {\n    return text.replace(/[.*+?^${}()|[\\]\\\\]/g, \"\\\\$&\");\n  }\n})();\n");
