window.VOCA_DATA_READY = (async () => {
  const chunks = window.VOCA_COMPRESSED_CHUNKS || [];
  window.VOCA_COMPRESSED_CHUNKS = undefined;
  if (!chunks.length) {
    throw new Error("Vocabulary data chunks are missing.");
  }
  if (!("DecompressionStream" in window)) {
    throw new Error("This browser cannot decompress the vocabulary data.");
  }
  const encoded = chunks.join("");
  const binary = atob(encoded);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip"));
  const text = await new Response(stream).text();
  window.VOCA_DATA = JSON.parse(text);
})();
