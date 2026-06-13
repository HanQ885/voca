const __vocaAppSource = (window.VOCA_APP_CHUNKS || []).join('');
window.VOCA_APP_CHUNKS = undefined;
Promise.resolve(window.VOCA_DATA_READY)
  .then(() => Function(__vocaAppSource)())
  .catch((error) => {
    console.error(error);
    document.body.innerHTML =
      '<main class="shell"><section class="practice"><div class="question-panel"><h2 class="question-prompt">데이터를 불러오지 못했습니다.</h2></div></section></main>';
  });
