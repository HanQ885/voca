(() => {
  let source = (window.VOCA_APP_CHUNKS || []).join("");
  if (!source) return;

  source = replaceBetween(
    source,
    "  const taskInfo = {",
    "  const stopWords = new Set([",
    `  const taskInfo = {
    task1: {
      label: "Task 1",
      instruction: "\\uB2E4\\uC74C \\uC601\\uC5B4 \\uD45C\\uD604\\uC758 \\uB73B\\uC73C\\uB85C \\uAC00\\uC7A5 \\uC54C\\uB9DE\\uC740 \\uAC83\\uC744 \\uACE0\\uB974\\uC2DC\\uC624.",
      choiceCount: 5,
    },
    task2: {
      label: "Task 2",
      instruction: "\\uC6B0\\uB9AC\\uB9D0 \\uD574\\uC11D\\uC744 \\uCC38\\uACE0\\uD558\\uC5EC \\uB2E4\\uC74C \\uBE48\\uCE78\\uC5D0 \\uB4E4\\uC5B4\\uAC08 \\uAC00\\uC7A5 \\uC801\\uC808\\uD55C \\uB2E8\\uC5B4\\uB97C \\uACE0\\uB974\\uC2DC\\uC624.",
      choiceCount: 4,
    },
    task3: {
      label: "Task 3",
      instruction: "\\uC6B0\\uB9AC\\uB9D0 \\uD574\\uC11D\\uC744 \\uCC38\\uACE0\\uD558\\uC5EC \\uB2E4\\uC74C \\uBE48\\uCE78\\uC5D0 \\uB4E4\\uC5B4\\uAC08 \\uAC00\\uC7A5 \\uC801\\uC808\\uD55C \\uB2E8\\uC5B4\\uB97C \\uC4F0\\uC2DC\\uC624. (\\uB2E8, \\uCCA0\\uC790 \\uAC1C\\uC218\\uC5D0 \\uB9DE\\uAC8C \\uC4F8 \\uAC83)",
    },
    task4: {
      label: "Task 4",
      instruction: "\\uB2E4\\uC74C \\uBE48\\uCE78\\uC5D0 \\uB4E4\\uC5B4\\uAC08 \\uD45C\\uD604\\uC744 \\uCC44\\uC6CC \\uC8FC\\uC5B4\\uC9C4 \\uC6B0\\uB9AC\\uB9D0 \\uD574\\uC11D\\uC5D0 \\uB9DE\\uAC8C \\uC601\\uC5B4 \\uBB38\\uC7A5\\uC744 \\uC644\\uC131\\uD558\\uC2DC\\uC624. (\\uB2E8, \\uC5B4\\uBC95\\uC5D0 \\uB9DE\\uAC8C \\uC4F8 \\uAC83)",
    },
  };

`,
  );

  if (!source.includes("questionPanel: document.querySelector")) {
    source = source.replace(
      `    practiceView: document.querySelector("#practiceView"),
    wrongView: document.querySelector("#wrongView"),`,
      `    practiceView: document.querySelector("#practiceView"),
    wrongView: document.querySelector("#wrongView"),
    questionPanel: document.querySelector("#questionPanel"),`,
    );
  }

  if (!source.includes("questionNo: document.querySelector")) {
    const oldElementLookups = [
      `    instruction: document.querySelector("#instruction"),`,
      `    koreanPrompt: document.querySelector("#koreanPrompt"),`,
      `    questionPrompt: document.querySelector("#questionPrompt"),`,
      `    ${"hint" + "Line"}: document.querySelector("#${"hint" + "Line"}"),`,
      `    ${"wrong" + "Badge"}: document.querySelector("#${"wrong" + "Badge"}"),`,
    ].join("\n");
    source = source.replace(
      oldElementLookups,
      `    instruction: document.querySelector("#instruction"),
    koreanPrompt: document.querySelector("#koreanPrompt"),
    questionNo: document.querySelector("#questionNo"),
    questionPrompt: document.querySelector("#questionPrompt"),`,
    );
  }

  source = replaceBetween(
    source,
    "    const task1 = [",
    "    const task2 = DATA.examples.map",
    `    const task1 = DATA.terms.map((item) => ({
      id: \`task1-\${item.id}\`,
      task: "task1",
      part: "Part 1",
      prompt: item.term,
      answer: item.meaning,
      instruction: taskInfo.task1.instruction,
      source: item,
    }));

`,
  );

  source = replaceBetween(
    source,
    "  function renderQuestion() {",
    "  function submitAnswer(value, question, selectedButton) {",
    `  function renderQuestion() {
    const list = currentList();
    const question = currentQuestion();
    hideFeedback();
    els.choiceArea.innerHTML = "";
    els.answerInput.value = "";

    els.questionTotal.textContent = list.length;
    els.questionIndex.textContent = list.length ? state.index + 1 : 0;
    els.taskLabel.textContent = taskInfo[state.task].label;
    els.partLabel.textContent = state.part === "all" ? "\\uC804\\uCCB4" : state.part;
    els.instruction.textContent = taskInfo[state.task].instruction;
    els.questionPanel.className = "question-panel " + state.task;

    els.prevBtn.disabled = state.index <= 0;
    els.nextBtn.disabled = state.index >= list.length - 1;

    if (!question) {
      els.koreanPrompt.classList.add("hidden");
      els.questionNo.classList.add("hidden");
      els.questionPrompt.className = "question-prompt";
      els.questionPrompt.textContent = "\\uD45C\\uC2DC\\uD560 \\uBB38\\uC81C\\uAC00 \\uC5C6\\uC2B5\\uB2C8\\uB2E4.";
      els.choiceArea.classList.add("hidden");
      els.inputArea.classList.add("hidden");
      return;
    }

    const numberText = "(" + (state.index + 1) + ")";
    const numberOnKorean = question.task === "task2" || question.task === "task3";
    els.questionNo.textContent = numberText;
    els.questionNo.classList.toggle("hidden", numberOnKorean);

    if (question.korean) {
      if (numberOnKorean) {
        els.koreanPrompt.innerHTML = '<span class="question-no">' + numberText + '</span> ' + escapeHtml(question.korean);
      } else if (question.task === "task4") {
        els.koreanPrompt.textContent = "(" + question.korean + ")";
      } else {
        els.koreanPrompt.textContent = question.korean;
      }
      els.koreanPrompt.classList.remove("hidden");
    } else {
      els.koreanPrompt.classList.add("hidden");
    }

    els.questionPrompt.className = question.sentence ? "question-prompt sentence" : "question-prompt";
    if (question.promptHtml) {
      els.questionPrompt.innerHTML = question.promptHtml;
    } else {
      els.questionPrompt.textContent = question.prompt;
    }

    if (question.choices) {
      els.choiceArea.classList.remove("hidden");
      els.inputArea.classList.add("hidden");
      renderChoices(question);
    } else {
      els.choiceArea.classList.add("hidden");
      els.inputArea.classList.remove("hidden");
      window.setTimeout(() => els.answerInput.focus(), 0);
    }
  }

  function renderChoices(question) {
    const marks = ["\\u2460", "\\u2461", "\\u2462", "\\u2463", "\\u2464"];
    question.choices.forEach((choice, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "choice";
      button.dataset.answer = choice;
      const mark = marks[index] || String(index + 1) + ".";
      button.innerHTML = '<span class="choice-mark">' + mark + '</span>' + escapeHtml(choice);
      button.addEventListener("click", () => submitAnswer(choice, question, button));
      els.choiceArea.append(button);
    });
  }

`,
  );

  source = source.replace(
    `        const text = button.textContent.replace(/^\\d+\\.\\s*/, "");`,
    `        const text = button.dataset.answer || button.textContent.replace(/^[\\u2460\\u2461\\u2462\\u2463\\u2464]\\s*/, "").replace(/^\\d+\\.\\s*/, "");`,
  );

  source = replaceBetween(
    source,
    "  function renderWrongBadge(question) {",
    "  function showFeedback(kind, message) {",
    "  function renderWrongBadge() {}\n\n",
  );

  source = replaceBetween(
    source,
    "  function spellMask(text) {",
    "  function sameAnswer(value, answer) {",
    `  function spellMask(text) {
    const chars = [...text];
    let revealed = false;
    const masked = chars.map((char) => {
      if (!/[A-Za-z]/.test(char)) return char;
      if (!revealed) {
        revealed = true;
        return char;
      }
      return "_";
    });
    return masked.join(" ").replace(/\\s+([.,!?;:])/g, "$1");
  }

  function expressionMask(text) {
    const visibleFirst = text.match(/[A-Za-z]/)?.[0] || "";
    const letterCount = Math.max(8, text.replace(/[^A-Za-z]/g, "").length - 1);
    return visibleFirst + "_".repeat(letterCount);
  }

`,
  );

  source = source.replace(
    `    const blank = blankSentence(item.english, target, task === "task3" ? spellMask(target.text) : "_____");
    const hint = task === "task4" ? expressionMask(target.text) : "";`,
    `    const replacement =
      task === "task3" ? spellMask(target.text) : task === "task4" ? expressionMask(target.text) : "_____";
    const blank = blankSentence(item.english, target, replacement);
    const hint = "";`,
  );

  window.VOCA_APP_CHUNKS = [source];

  function replaceBetween(text, startMarker, endMarker, replacement) {
    const start = text.indexOf(startMarker);
    const end = text.indexOf(endMarker);
    if (start < 0 || end < 0 || end <= start) return text;
    return text.slice(0, start) + replacement + text.slice(end);
  }
})();
