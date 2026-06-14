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
__vocaAppSource = __vocaAppSource
  .replace(
    '      const target = pickTarget(item.english, "choice", item.part);',
    '      const target = storedTarget(item, "choice", item.part);',
  )
  .replace(
    `    const task3 = DATA.examples.filter((item) => item.part === "Part 3").map((item) => {
      const target = pickTarget(item.english, "single", item.part);
      return makeBlankQuestion("task3", item, target, taskInfo.task3.instruction);
    });`,
    `    const task3 = DATA.examples.filter((item) => item.part === "Part 3").flatMap((item) =>
      storedTargetsOnly(item).map((target, targetIndex) =>
        makeBlankQuestion("task3", targetItem(item, targetIndex), target, taskInfo.task3.instruction),
      ),
    );`,
  )
  .replace(
    '  function makeBlankQuestion(task, item, target, instruction) {',
    `  function storedTarget(item, mode, part) {
    return storedTargets(item, mode, part)[0] || pickTarget(item.english, mode, part);
  }

  function storedTargets(item, mode, part) {
    const stored = Array.isArray(item.targets) && item.targets.length ? item.targets : item.target ? [item.target] : [];
    const targets = stored.map((target) => normalizeStoredTarget(item, target)).filter(Boolean);
    return targets.length ? targets : [pickTarget(item.english, mode, part)];
  }

  function storedTargetsOnly(item) {
    const stored = Array.isArray(item.targets) && item.targets.length ? item.targets : item.target ? [item.target] : [];
    return stored.map((target) => normalizeStoredTarget(item, target)).filter(Boolean);
  }

  function normalizeStoredTarget(item, target) {
    if (!target || typeof target.text !== "string") return null;
    if (Number.isFinite(target.start) && Number.isFinite(target.end)) {
      return { text: target.text, start: target.start, end: target.end };
    }
    const index = item.english.toLowerCase().indexOf(target.text.toLowerCase());
    if (index < 0) return null;
    return { text: item.english.slice(index, index + target.text.length), start: index, end: index + target.text.length };
  }

  function targetItem(item, targetIndex) {
    return targetIndex ? { ...item, id: `${item.id}-u${targetIndex + 1}` } : item;
  }

  function makeBlankQuestion(task, item, target, instruction) {`,
  );
window.VOCA_APP_CHUNKS = undefined;
Promise.resolve(window.VOCA_DATA_READY)
  .then(() => {
    window.applyVocaTargets?.();
    Function(__vocaAppSource)();
  })
  .catch((error) => {
    console.error(error);
    document.body.innerHTML =
      '<main class="shell"><section class="practice"><div class="question-panel"><h2 class="question-prompt">데이터를 불러오지 못했습니다.</h2></div></section></main>';
  });
