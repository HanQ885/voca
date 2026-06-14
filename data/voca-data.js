window.VOCA_DATA_READY = (async () => {
  const chunks = window.VOCA_COMPRESSED_CHUNKS || [];
  window.VOCA_COMPRESSED_CHUNKS = undefined;
  if (!chunks.length) {
    throw new Error("Vocabulary data chunks are missing.");
  }
  const encoded = chunks.join("");
  const binary = atob(encoded);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  const text = await gunzipText(bytes);
  window.VOCA_DATA = JSON.parse(text);
})();

async function gunzipText(bytes) {
  if ("DecompressionStream" in window) {
    try {
      const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip"));
      return await new Response(stream).text();
    } catch (error) {
      console.warn("Native decompression failed; trying fallback.", error);
    }
  }

  await loadScript("https://cdn.jsdelivr.net/npm/fflate@0.8.2/umd/index.js");
  if (!window.fflate?.gunzipSync) {
    throw new Error("Fallback decompressor did not load.");
  }
  return new TextDecoder().decode(window.fflate.gunzipSync(bytes));
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      existing.addEventListener("load", resolve, { once: true });
      existing.addEventListener("error", reject, { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.crossOrigin = "anonymous";
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}
