let __vocaAppSource = (window.VOCA_APP_CHUNKS || []).join('');
__vocaAppSource = __vocaAppSource
  .replace(
    '    const task2 = DATA.examples.map((item) => {',
    '    const task2 = DATA.examples.filter((item) => item.part === "Part 2").map((item) => {',
  )
  .replace(
    '    const task3 = DATA.examples.map((item) => {',
    '    const task3 = DATA.examples.filter((item) => item.part === "Part 3").map((item) => {',
  )
  .replace(
    '    const task4 = DATA.examples.map((item) => {',
    '    const task4 = DATA.examples.filter((item) => item.part === "Part 4").map((item) => {',
  );
window.VOCA_APP_CHUNKS = undefined;
Promise.resolve(window.VOCA_DATA_READY)
  .then(() => Function(__vocaAppSource)())
  .catch((error) => {
    console.error(error);
    document.body.innerHTML =
      '<main class="shell"><section class="practice"><div class="question-panel"><h2 class="question-prompt">데이터를 불러오지 못했습니다.</h2></div></section></main>';
  });
