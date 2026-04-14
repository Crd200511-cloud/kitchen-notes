const STORAGE_KEY = "kitchen-notes-recipes-v2";
const LEGACY_STORAGE_KEYS = ["kitchen-notes-recipes-v1"];

const sampleRecipes = [
  {
    id: "sample-1",
    title: "番茄炒蛋",
    sourceUrl: "https://www.xiaohongshu.com/",
    notes: "如果番茄偏酸，可以少加一点糖平衡口感。",
    ingredients: ["番茄 2个", "鸡蛋 3个", "盐 少许", "食用油 1勺"],
    steps: [
      {
        title: "准备食材",
        detail: "番茄切块，鸡蛋打散，提前把盐准备好。",
        duration: "5分钟",
        tip: "鸡蛋里先加一点点盐，炒出来更入味。"
      },
      {
        title: "炒鸡蛋",
        detail: "热锅下油，倒入蛋液，快速翻炒到七八成熟后先盛出。",
        duration: "2分钟",
        tip: "不要炒太老，后面还要回锅。"
      },
      {
        title: "炒番茄",
        detail: "锅里放入番茄翻炒，压一压让番茄更快出汁。",
        duration: "3分钟",
        tip: "想汤汁浓一点可以多炒一会儿。"
      },
      {
        title: "合炒收尾",
        detail: "倒回鸡蛋，加盐调味，翻炒均匀后关火盛出。",
        duration: "1分钟",
        tip: "最后再试一下味道。"
      }
    ],
    updatedAt: Date.now() - 1000 * 60 * 60 * 24
  },
  {
    id: "sample-2",
    title: "蒜蓉西兰花",
    sourceUrl: "https://www.douyin.com/",
    notes: "",
    ingredients: ["西兰花 1颗", "蒜末 2勺", "盐 少许", "蚝油 1勺"],
    steps: [
      {
        title: "切洗处理",
        detail: "西兰花掰小朵，清洗干净备用。",
        duration: "5分钟",
        tip: "可以用淡盐水泡一会儿。"
      },
      {
        title: "焯水",
        detail: "锅里烧开水，放少许油和盐，下西兰花焯水 40 秒后捞出。",
        duration: "1分钟",
        tip: "焯水后颜色会更好看。"
      },
      {
        title: "炒香蒜末",
        detail: "热锅下油，放入蒜末，小火炒出香味。",
        duration: "30秒",
        tip: "蒜末不要炒糊。"
      },
      {
        title: "调味出锅",
        detail: "倒入西兰花，加入盐和蚝油快速翻炒均匀后出锅。",
        duration: "2分钟",
        tip: "全程大火快炒，口感更脆。"
      }
    ],
    updatedAt: Date.now() - 1000 * 60 * 60 * 8
  },
  {
    id: "sample-3",
    title: "可乐鸡翅",
    sourceUrl: "",
    notes: "收汁阶段要盯锅，别烧糊。",
    ingredients: ["鸡翅中 8个", "可乐 1听", "生抽 2勺", "姜片 3片"],
    steps: [
      {
        title: "处理鸡翅",
        detail: "鸡翅两面划刀后焯水，捞出沥干。",
        duration: "6分钟",
        tip: "划刀后更容易入味。"
      },
      {
        title: "煎鸡翅",
        detail: "平底锅少油，把鸡翅煎到两面微黄。",
        duration: "5分钟",
        tip: "中火慢煎，不要频繁翻面。"
      },
      {
        title: "焖煮入味",
        detail: "加入姜片、生抽和可乐，盖盖中小火焖煮。",
        duration: "15分钟",
        tip: "可乐大约没过鸡翅一半即可。"
      },
      {
        title: "收汁",
        detail: "开大火把汤汁收浓，裹在鸡翅表面就可以出锅。",
        duration: "3分钟",
        tip: "最后注意别收太干。"
      }
    ],
    updatedAt: Date.now() - 1000 * 60 * 60 * 2
  }
];

const state = {
  recipes: [],
  editingId: null,
  search: ""
};

const elements = {
  form: document.getElementById("recipe-form"),
  recipeName: document.getElementById("recipe-name"),
  recipeSource: document.getElementById("recipe-source"),
  recipeIngredients: document.getElementById("recipe-ingredients"),
  recipeNotes: document.getElementById("recipe-notes"),
  stepsBuilder: document.getElementById("steps-builder"),
  addStep: document.getElementById("add-step"),
  submitButton: document.getElementById("submit-button"),
  resetForm: document.getElementById("reset-form"),
  clearStorage: document.getElementById("clear-storage"),
  seedDemo: document.getElementById("seed-demo"),
  recipeList: document.getElementById("recipe-list"),
  searchInput: document.getElementById("search-input"),
  recipeTotal: document.getElementById("recipe-total"),
  ingredientTotal: document.getElementById("ingredient-total"),
  stepTotal: document.getElementById("step-total"),
  libraryHint: document.getElementById("library-hint"),
  editorTitle: document.getElementById("editor-title"),
  formNote: document.getElementById("form-note"),
  livePreview: document.getElementById("live-preview"),
  template: document.getElementById("recipe-card-template"),
  importMode: document.getElementById("import-mode"),
  importLink: document.getElementById("import-link"),
  importText: document.getElementById("import-text"),
  importContent: document.getElementById("import-content"),
  importWithAi: document.getElementById("import-with-ai"),
  clearImport: document.getElementById("clear-import"),
  importUnresolved: document.getElementById("import-unresolved"),
  importNote: document.getElementById("import-note"),
  parsedTitle: document.getElementById("parsed-title"),
  parsedPlatform: document.getElementById("parsed-platform"),
  parsedIngredientCount: document.getElementById("parsed-ingredient-count"),
  parsedStepCount: document.getElementById("parsed-step-count")
};

const IMPORT_BOILERPLATE_PATTERNS = [
  /复制打开.*?(小红书|抖音)/i,
  /打开.*?(小红书|抖音).*?查看/i,
  /上.*?(小红书|抖音).*?搜索/i,
  /作者[:：]/i,
  /用户[:：]/i,
  /发布于[:：]/i,
  /作品[:：]/i,
  /原声[:：]/i,
  /背景音乐[:：]/i,
  /点赞[:：]?\s*\d+/i,
  /收藏[:：]?\s*\d+/i,
  /评论[:：]?\s*\d+/i,
  /^#.+/,
  /^http/i,
  /^[A-Za-z0-9+/_=-]{10,}$/
];

const APP_CONFIG = window.KITCHEN_NOTES_CONFIG || {};

function getApiBaseUrl() {
  return String(APP_CONFIG.apiBaseUrl || "").trim().replace(/\/$/, "");
}

function getApiUrl(path) {
  const baseUrl = getApiBaseUrl();
  return baseUrl ? `${baseUrl}${path}` : path;
}

function splitLines(text) {
  return String(text || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function createStep(step = {}, index = 0) {
  const detail = typeof step === "string" ? step : step.detail || "";
  const title =
    typeof step === "string"
      ? inferStepTitle(detail, index)
      : step.title || (detail ? inferStepTitle(detail, index) : "");

  return {
    title,
    detail,
    duration: typeof step === "string" ? "" : step.duration || "",
    tip: typeof step === "string" ? "" : step.tip || ""
  };
}

function createRecipe({ title, sourceUrl, ingredientsText, notes, steps, id, updatedAt }) {
  return {
    id: id || `recipe-${Date.now()}`,
    title: String(title || "").trim(),
    sourceUrl: String(sourceUrl || "").trim(),
    notes: String(notes || "").trim(),
    ingredients: splitLines(ingredientsText),
    steps: steps.map((step, index) => createStep(step, index)).filter(hasStepContent),
    updatedAt: updatedAt || Date.now()
  };
}

function normalizeRecipe(recipe = {}) {
  const ingredients = Array.isArray(recipe.ingredients)
    ? recipe.ingredients.map((item) => String(item).trim()).filter(Boolean)
    : [];
  const steps = Array.isArray(recipe.steps)
    ? recipe.steps.map((step, index) => createStep(step, index)).filter(hasStepContent)
    : [];

  return {
    id: recipe.id || `recipe-${Date.now()}`,
    title: String(recipe.title || "").trim(),
    sourceUrl: String(recipe.sourceUrl || "").trim(),
    notes: String(recipe.notes || "").trim(),
    ingredients,
    steps,
    updatedAt: recipe.updatedAt || Date.now()
  };
}

function hasStepContent(step) {
  return [step.title, step.detail, step.duration, step.tip].some((value) =>
    String(value || "").trim()
  );
}

function inferStepTitle(detail, index) {
  const cleaned = String(detail || "").trim();

  if (!cleaned) {
    return `步骤 ${index + 1}`;
  }

  const shortClause = cleaned.split(/[，。,:：]/)[0].trim();

  if (shortClause && shortClause.length <= 12) {
    return shortClause;
  }

  return `步骤 ${index + 1}`;
}

function saveRecipes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.recipes));
}

function loadRecipes() {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    const legacyRaw = LEGACY_STORAGE_KEYS.map((key) => localStorage.getItem(key)).find(Boolean);

    if (legacyRaw) {
      try {
        const parsedLegacy = JSON.parse(legacyRaw);
        state.recipes = Array.isArray(parsedLegacy)
          ? parsedLegacy.map(normalizeRecipe)
          : sampleRecipes.map(normalizeRecipe);
        saveRecipes();
        return;
      } catch (error) {
        state.recipes = sampleRecipes.map(normalizeRecipe);
        saveRecipes();
        return;
      }
    }

    state.recipes = sampleRecipes.map(normalizeRecipe);
    saveRecipes();
    return;
  }

  try {
    const parsed = JSON.parse(raw);
    state.recipes = Array.isArray(parsed)
      ? parsed.map(normalizeRecipe)
      : sampleRecipes.map(normalizeRecipe);
  } catch (error) {
    state.recipes = sampleRecipes.map(normalizeRecipe);
    saveRecipes();
  }
}

function formatDate(timestamp) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(timestamp));
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);

  window.setTimeout(() => {
    toast.remove();
  }, 2600);
}

function updateStats() {
  const totalRecipes = state.recipes.length;
  const totalIngredients = state.recipes.reduce(
    (sum, recipe) => sum + recipe.ingredients.length,
    0
  );
  const totalSteps = state.recipes.reduce((sum, recipe) => sum + recipe.steps.length, 0);

  elements.recipeTotal.textContent = totalRecipes;
  elements.ingredientTotal.textContent = totalIngredients;
  elements.stepTotal.textContent = totalSteps;
  elements.libraryHint.textContent = `共 ${totalRecipes} 道菜`;
}

function detectPlatform(url) {
  const value = String(url || "").toLowerCase();

  if (value.includes("xiaohongshu")) {
    return "小红书";
  }

  if (value.includes("douyin") || value.includes("iesdouyin")) {
    return "抖音";
  }

  return "";
}

function getFilteredRecipes() {
  const query = state.search.trim().toLowerCase();

  if (!query) {
    return state.recipes;
  }

  return state.recipes.filter((recipe) => {
    const stepText = recipe.steps
      .map((step) => [step.title, step.detail, step.duration, step.tip].join(" "))
      .join(" ");

    const haystack = [
      recipe.title,
      recipe.sourceUrl,
      recipe.notes,
      detectPlatform(recipe.sourceUrl),
      recipe.ingredients.join(" "),
      stepText
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(query);
  });
}

function renderEmptyState(message) {
  elements.recipeList.innerHTML = `
    <div class="empty-state">
      <h3>还没有找到匹配的食谱</h3>
      <p>${message}</p>
    </div>
  `;
}

function createTextNode(tag, className, text) {
  const element = document.createElement(tag);

  if (className) {
    element.className = className;
  }

  element.textContent = text;
  return element;
}

function renderRecipes() {
  const recipes = getFilteredRecipes();

  if (!state.recipes.length) {
    renderEmptyState("先从左侧录入第一道菜，或者恢复示例数据看看页面效果。");
    return;
  }

  if (!recipes.length) {
    renderEmptyState("换个关键词试试，或者清空搜索框查看全部内容。");
    return;
  }

  elements.recipeList.innerHTML = "";

  recipes.forEach((recipe) => {
    const fragment = elements.template.content.cloneNode(true);
    const card = fragment.querySelector(".recipe-card");
    const title = fragment.querySelector(".recipe-card__title");
    const meta = fragment.querySelector(".recipe-card__meta");
    const sourceSection = fragment.querySelector('[data-role="source-section"]');
    const source = fragment.querySelector('[data-role="source"]');
    const notesSection = fragment.querySelector('[data-role="notes-section"]');
    const notes = fragment.querySelector('[data-role="notes"]');
    const ingredientList = fragment.querySelector('[data-role="ingredients"]');
    const stepList = fragment.querySelector('[data-role="steps"]');

    title.textContent = recipe.title;
    meta.textContent = `最近更新于 ${formatDate(recipe.updatedAt)}`;
    card.dataset.id = recipe.id;

    if (recipe.sourceUrl) {
      const platform = detectPlatform(recipe.sourceUrl);
      source.textContent = platform ? `${platform} · ${recipe.sourceUrl}` : recipe.sourceUrl;
    } else {
      sourceSection.remove();
    }

    if (recipe.notes) {
      notes.textContent = recipe.notes;
    } else {
      notesSection.remove();
    }

    recipe.ingredients.forEach((ingredient) => {
      ingredientList.appendChild(createTextNode("li", "", ingredient));
    });

    recipe.steps.forEach((step, index) => {
      const item = document.createElement("li");
      const indexBadge = createTextNode("span", "step-list__index", String(index + 1));
      const content = document.createElement("div");
      const titleNode = createTextNode(
        "p",
        "step-list__title",
        step.title || `步骤 ${index + 1}`
      );

      content.appendChild(titleNode);

      if (step.detail) {
        content.appendChild(createTextNode("p", "step-list__detail", step.detail));
      }

      if (step.duration || step.tip) {
        const metaNode = document.createElement("p");
        metaNode.className = "step-list__meta";
        metaNode.textContent = [step.duration && `时长：${step.duration}`, step.tip && `提示：${step.tip}`]
          .filter(Boolean)
          .join(" · ");
        content.appendChild(metaNode);
      }

      item.appendChild(indexBadge);
      item.appendChild(content);
      stepList.appendChild(item);
    });

    elements.recipeList.appendChild(fragment);
  });
}

function getStepDrafts() {
  return Array.from(elements.stepsBuilder.querySelectorAll(".step-editor")).map((card) => ({
    title: card.querySelector('[data-role="title"]').value.trim(),
    detail: card.querySelector('[data-role="detail"]').value.trim(),
    duration: card.querySelector('[data-role="duration"]').value.trim(),
    tip: card.querySelector('[data-role="tip"]').value.trim()
  }));
}

function createStepEditor(step, index) {
  const card = document.createElement("article");
  card.className = "step-editor";

  const header = document.createElement("div");
  header.className = "step-editor__header";

  const label = document.createElement("div");
  label.innerHTML = `
    <p class="step-editor__eyebrow">Step ${index + 1}</p>
    <h4>第 ${index + 1} 步</h4>
  `;

  const actions = document.createElement("div");
  actions.className = "step-editor__actions";
  actions.innerHTML = `
    <button class="chip chip--edit" type="button" data-step-action="up">上移</button>
    <button class="chip chip--edit" type="button" data-step-action="down">下移</button>
    <button class="chip chip--danger" type="button" data-step-action="remove">删除</button>
  `;

  header.appendChild(label);
  header.appendChild(actions);

  const titleField = document.createElement("label");
  titleField.className = "field";
  titleField.innerHTML = `
    <span class="field__label">这一步要做什么</span>
    <input class="field__control" data-role="title" placeholder="比如：炒鸡蛋" />
  `;
  titleField.querySelector('[data-role="title"]').value = step.title || "";

  const detailField = document.createElement("label");
  detailField.className = "field";
  detailField.innerHTML = `
    <span class="field__label">具体动作</span>
    <textarea
      class="field__control field__control--step-detail"
      data-role="detail"
      placeholder="具体写这一步怎么做，比如：热锅下油，倒入蛋液快速翻炒到七八成熟。"
    ></textarea>
  `;
  detailField.querySelector('[data-role="detail"]').value = step.detail || "";

  const metaRow = document.createElement("div");
  metaRow.className = "step-editor__meta";

  const durationField = document.createElement("label");
  durationField.className = "field";
  durationField.innerHTML = `
    <span class="field__label">时长 / 火候</span>
    <input class="field__control" data-role="duration" placeholder="比如：中火 3分钟" />
  `;
  durationField.querySelector('[data-role="duration"]').value = step.duration || "";

  const tipField = document.createElement("label");
  tipField.className = "field";
  tipField.innerHTML = `
    <span class="field__label">小提示</span>
    <input class="field__control" data-role="tip" placeholder="比如：不要炒太老" />
  `;
  tipField.querySelector('[data-role="tip"]').value = step.tip || "";

  metaRow.appendChild(durationField);
  metaRow.appendChild(tipField);

  card.appendChild(header);
  card.appendChild(titleField);
  card.appendChild(detailField);
  card.appendChild(metaRow);
  return card;
}

function renderStepsBuilder(steps = [createStep({}, 0)]) {
  const safeSteps = steps.length ? steps.map((step, index) => createStep(step, index)) : [createStep({}, 0)];
  elements.stepsBuilder.innerHTML = "";
  safeSteps.forEach((step, index) => {
    elements.stepsBuilder.appendChild(createStepEditor(step, index));
  });
}

function renderPreview() {
  const recipe = createRecipe({
    title: elements.recipeName.value,
    sourceUrl: elements.recipeSource.value,
    ingredientsText: elements.recipeIngredients.value,
    notes: elements.recipeNotes.value,
    steps: getStepDrafts()
  });

  const hasContent =
    recipe.title || recipe.sourceUrl || recipe.notes || recipe.ingredients.length || recipe.steps.length;

  if (!hasContent) {
    elements.livePreview.innerHTML = `
      <h3 class="recipe-sheet__title">还没有正在编辑的内容</h3>
      <p class="recipe-sheet__desc">
        在上方输入菜名、材料和步骤卡片，这里会立即显示整理后的效果。
      </p>
    `;
    return;
  }

  const sourceHTML = recipe.sourceUrl
    ? `<p class="recipe-sheet__source">来源：${escapeHTML(recipe.sourceUrl)}</p>`
    : "";

  const notesHTML = recipe.notes
    ? `
      <section class="recipe-sheet__section">
        <p class="recipe-sheet__section-title">备注</p>
        <p class="recipe-sheet__desc">${escapeHTML(recipe.notes)}</p>
      </section>
    `
    : "";

  const ingredientsHTML = recipe.ingredients.length
    ? `
      <ul class="recipe-sheet__ingredients">
        ${recipe.ingredients
          .map((ingredient) => `<li>${escapeHTML(ingredient)}</li>`)
          .join("")}
      </ul>
    `
    : '<p class="recipe-sheet__empty">还没有填写材料。</p>';

  const stepsHTML = recipe.steps.length
    ? `
      <ul class="recipe-sheet__steps">
        ${recipe.steps
          .map(
            (step, index) => `
              <li>
                <span class="recipe-sheet__steps-index">${index + 1}</span>
                <div>
                  <p class="recipe-sheet__step-title">${escapeHTML(step.title || `步骤 ${index + 1}`)}</p>
                  ${
                    step.detail
                      ? `<p class="recipe-sheet__step-detail">${escapeHTML(step.detail)}</p>`
                      : ""
                  }
                  ${
                    step.duration || step.tip
                      ? `<p class="recipe-sheet__step-meta">${[
                          step.duration && `时长：${escapeHTML(step.duration)}`,
                          step.tip && `提示：${escapeHTML(step.tip)}`
                        ]
                          .filter(Boolean)
                          .join(" · ")}</p>`
                      : ""
                  }
                </div>
              </li>
            `
          )
          .join("")}
      </ul>
    `
    : '<p class="recipe-sheet__empty">还没有填写做法。</p>';

  elements.livePreview.innerHTML = `
    <h3 class="recipe-sheet__title">${escapeHTML(recipe.title || "未命名食谱")}</h3>
    <p class="recipe-sheet__desc">你当前正在编辑的内容会显示在这里。</p>
    ${sourceHTML}
    <section class="recipe-sheet__section">
      <p class="recipe-sheet__section-title">材料</p>
      ${ingredientsHTML}
    </section>
    <section class="recipe-sheet__section">
      <p class="recipe-sheet__section-title">做法</p>
      ${stepsHTML}
    </section>
    ${notesHTML}
  `;
}

function escapeHTML(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function resetImportReview() {
  elements.parsedTitle.textContent = "暂未识别";
  elements.parsedPlatform.textContent = "未识别";
  elements.parsedIngredientCount.textContent = "材料 0";
  elements.parsedStepCount.textContent = "步骤 0";
  elements.importUnresolved.value = "";
}

function resetImportFields() {
  elements.importLink.value = "";
  elements.importText.value = "";
  elements.importMode.value = "note";
  resetImportReview();
}

function resetForm({ keepMessage = false } = {}) {
  state.editingId = null;
  elements.form.reset();
  renderStepsBuilder();
  elements.submitButton.textContent = "保存食谱";
  elements.editorTitle.textContent = "新增食谱";

  if (!keepMessage) {
    elements.formNote.textContent = "浏览器会自动保存在本地，你下次打开还能继续看。";
  }

  renderPreview();
}

function fillForm(recipe) {
  state.editingId = recipe.id;
  elements.recipeName.value = recipe.title;
  elements.recipeSource.value = recipe.sourceUrl || "";
  elements.recipeIngredients.value = recipe.ingredients.join("\n");
  elements.recipeNotes.value = recipe.notes || "";
  renderStepsBuilder(recipe.steps);
  elements.submitButton.textContent = "更新食谱";
  elements.editorTitle.textContent = "编辑食谱";
  elements.formNote.textContent = `正在编辑：${recipe.title}`;
  renderPreview();
  document.getElementById("editor").scrollIntoView({ behavior: "smooth", block: "start" });
}

function validateRecipe(recipe) {
  if (!recipe.title) {
    showToast("请先填写菜名");
    return false;
  }

  if (!recipe.ingredients.length) {
    showToast("请至少填写一种材料");
    return false;
  }

  if (!recipe.steps.length) {
    showToast("请至少填写一步做法");
    return false;
  }

  return true;
}

function upsertRecipe(event) {
  event.preventDefault();

  const recipe = createRecipe({
    id: state.editingId,
    title: elements.recipeName.value,
    sourceUrl: elements.recipeSource.value,
    ingredientsText: elements.recipeIngredients.value,
    notes: elements.recipeNotes.value,
    steps: getStepDrafts()
  });

  if (!validateRecipe(recipe)) {
    return;
  }

  if (state.editingId) {
    state.recipes = state.recipes.map((item) =>
      item.id === state.editingId ? recipe : item
    );
    showToast("食谱已更新");
  } else {
    state.recipes = [recipe, ...state.recipes];
    showToast("食谱已保存");
  }

  saveRecipes();
  updateStats();
  renderRecipes();
  resetForm();
}

function deleteRecipe(id) {
  const recipe = state.recipes.find((item) => item.id === id);

  if (!recipe) {
    return;
  }

  if (!window.confirm(`确定删除“${recipe.title}”吗？`)) {
    return;
  }

  state.recipes = state.recipes.filter((item) => item.id !== id);
  saveRecipes();
  updateStats();
  renderRecipes();

  if (state.editingId === id) {
    resetForm();
  }

  showToast("食谱已删除");
}

function handleCardAction(event) {
  const actionButton = event.target.closest("[data-action]");

  if (!actionButton) {
    return;
  }

  const card = actionButton.closest(".recipe-card");
  const recipeId = card?.dataset.id;
  const recipe = state.recipes.find((item) => item.id === recipeId);

  if (!recipe) {
    return;
  }

  if (actionButton.dataset.action === "edit") {
    fillForm(recipe);
    return;
  }

  if (actionButton.dataset.action === "delete") {
    deleteRecipe(recipeId);
  }
}

function clearAllRecipes() {
  if (!state.recipes.length) {
    showToast("现在还没有食谱可清空");
    return;
  }

  if (!window.confirm("确定清空全部食谱吗？这个操作无法撤销。")) {
    return;
  }

  state.recipes = [];
  saveRecipes();
  updateStats();
  renderRecipes();
  resetForm();
  showToast("已清空全部食谱");
}

function seedDemoRecipes() {
  state.recipes = sampleRecipes.map((recipe, index) =>
    normalizeRecipe({
      ...recipe,
      id: `sample-${Date.now()}-${index}`,
      updatedAt: Date.now() - index * 1000 * 60 * 45
    })
  );
  saveRecipes();
  updateStats();
  renderRecipes();
  resetForm({ keepMessage: true });
  elements.formNote.textContent = "示例数据已恢复，你可以直接继续改。";
  showToast("已恢复示例数据");
}

function normalizeHeading(line) {
  return String(line || "").replace(/[：:]/g, "").trim();
}

function stripLinePrefix(line) {
  return String(line || "")
    .replace(/^\s*[-*•·]\s*/, "")
    .replace(/^\s*\d+\s*[\.、)\-]\s*/, "")
    .replace(/^\s*第[\d一二三四五六七八九十百]+步\s*[：:\-]?\s*/, "")
    .trim();
}

function extractSection(lines, startMatchers, stopMatchers) {
  const startIndex = lines.findIndex((line) =>
    startMatchers.some((keyword) => normalizeHeading(line).includes(keyword))
  );

  if (startIndex === -1) {
    return [];
  }

  const result = [];

  for (let index = startIndex + 1; index < lines.length; index += 1) {
    const current = lines[index];
    const normalized = normalizeHeading(current);

    if (stopMatchers.some((keyword) => normalized.includes(keyword)) && result.length) {
      break;
    }

    result.push(current);
  }

  return result;
}

function findFirstUrl(text) {
  const match = String(text || "").match(/https?:\/\/[^\s]+/i);
  return match ? match[0] : "";
}

function parseInlineList(text) {
  return String(text || "")
    .split(/[，,；;、]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function extractInlineSection(lines, label) {
  const targetLine = lines.find((line) => new RegExp(`^${label}[：:]`).test(line));
  return targetLine ? targetLine.replace(new RegExp(`^${label}[：:]\\s*`), "").trim() : "";
}

function looksLikeIngredient(line) {
  const cleaned = stripLinePrefix(line);

  if (!cleaned || cleaned.length > 28) {
    return false;
  }

  if (/(步骤|做法|教程|第.+步|热锅|翻炒|焯水|煮|炸|蒸|烤|搅拌|出锅)/.test(cleaned)) {
    return false;
  }

  if (/(少许|适量|克|g|kg|毫升|ml|勺|汤匙|茶匙|个|颗|根|片|瓣|只|块|盒|把|斤)/i.test(cleaned)) {
    return true;
  }

  return /^[\u4e00-\u9fa5a-zA-Z0-9\s]+$/.test(cleaned) && cleaned.length <= 12;
}

function looksLikeStep(line, mode) {
  const cleaned = stripLinePrefix(line);

  if (!cleaned || cleaned.length < 4) {
    return false;
  }

  if (looksLikeIngredient(cleaned)) {
    return false;
  }

  const actionPattern =
    /(切|洗|焯|泡|腌|拌|炒|煎|炸|煮|炖|蒸|烤|放入|加入|倒入|搅拌|翻炒|收汁|装盘|盛出|备用|小火|中火|大火|开锅|下锅|调味|出锅)/;

  if (actionPattern.test(cleaned)) {
    return true;
  }

  if (mode === "transcript" && cleaned.length >= 10) {
    return true;
  }

  return false;
}

function cleanupImportedText(text, mode) {
  const rawLines = String(text || "")
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return rawLines
    .map((line) =>
      line
        .replace(/https?:\/\/[^\s]+/gi, "")
        .replace(/@[\u4e00-\u9fa5a-zA-Z0-9._-]+/g, "")
        .replace(/\[[^\]]+\]/g, "")
        .replace(/#([^\s#]+)/g, mode === "note" ? "" : "")
        .replace(/[✨🔥🌟🍳🥘🥬🥚🍅😋👍🏻👍❤️❤]/g, "")
        .trim()
    )
    .filter(Boolean)
    .filter((line) => !IMPORT_BOILERPLATE_PATTERNS.some((pattern) => pattern.test(line)));
}

function parseIngredientLines(lines) {
  return lines
    .map(stripLinePrefix)
    .map((line) => line.replace(/[；;。]+$/g, "").trim())
    .filter(Boolean)
    .filter((line) => !/^(食材|材料|配料|用料)$/i.test(normalizeHeading(line)))
    .filter(looksLikeIngredient);
}

function parseStepLines(lines, mode) {
  const cleanedLines = lines.map((line) => line.trim()).filter(Boolean);
  const result = [];

  cleanedLines.forEach((line) => {
    const cleaned = stripLinePrefix(line);

    if (!cleaned) {
      return;
    }

    if (looksLikeStep(cleaned, mode)) {
      result.push({
        title: inferStepTitle(cleaned, result.length),
        detail: cleaned,
        duration: "",
        tip: ""
      });
      return;
    }

    if (result.length) {
      result[result.length - 1].detail = `${result[result.length - 1].detail} ${cleaned}`.trim();
    }
  });

  return result;
}

function extractTitle(lines) {
  const explicit = lines.find((line) => /^(标题|菜名|名称)[：:]/.test(line));

  if (explicit) {
    return explicit.replace(/^(标题|菜名|名称)[：:]\s*/, "").trim();
  }

  const candidate = lines.find((line) => {
    const cleaned = line.trim();
    return (
      cleaned &&
      !cleaned.includes("http") &&
      !/^(食材|材料|配料|用料|做法|步骤|教程|小贴士|备注)[：:]?$/i.test(cleaned) &&
      cleaned.length <= 24 &&
      !looksLikeIngredient(cleaned) &&
      !looksLikeStep(cleaned, "note")
    );
  });

  return candidate ? stripLinePrefix(candidate) : "";
}

function collectLooseIngredients(lines) {
  return lines.filter(looksLikeIngredient).map(stripLinePrefix);
}

function collectLooseSteps(lines, mode) {
  return lines
    .filter((line) =>
      /^\s*(\d+\s*[\.、)\-]|第[\d一二三四五六七八九十百]+步)/.test(line) || looksLikeStep(line, mode)
    )
    .map(stripLinePrefix);
}

function buildUnresolved(lines, recognized) {
  return lines.filter((line) => {
    const cleaned = stripLinePrefix(line);

    if (!cleaned) {
      return false;
    }

    return !recognized.has(cleaned);
  });
}

function parseImportedContent(text, link, mode) {
  const sourceUrl = String(link || "").trim() || findFirstUrl(text);
  const cleanedLines = cleanupImportedText(text, mode);

  const ingredientSection = extractSection(cleanedLines, ["食材", "材料", "配料", "用料"], [
    "做法",
    "步骤",
    "教程",
    "小贴士",
    "备注",
    "总结"
  ]);
  const stepSection = extractSection(cleanedLines, ["做法", "步骤", "教程"], [
    "小贴士",
    "备注",
    "成品",
    "总结"
  ]);

  const inlineIngredients = extractInlineSection(cleanedLines, "食材") || extractInlineSection(cleanedLines, "材料");
  const inlineSteps = extractInlineSection(cleanedLines, "做法") || extractInlineSection(cleanedLines, "步骤");

  const ingredients = parseIngredientLines(ingredientSection);
  const looseIngredients = collectLooseIngredients(cleanedLines);
  const finalIngredients = ingredients.length
    ? ingredients
    : inlineIngredients
      ? parseInlineList(inlineIngredients).filter(looksLikeIngredient)
      : looseIngredients.slice(0, 12);

  const explicitStepLines = collectLooseSteps(cleanedLines, mode);
  const parsedSteps = parseStepLines(
    stepSection.length ? stepSection : explicitStepLines.length ? explicitStepLines : splitLines(inlineSteps),
    mode
  );

  const title = extractTitle(cleanedLines);

  const recognized = new Set();
  if (title) {
    recognized.add(title);
  }
  finalIngredients.forEach((item) => recognized.add(stripLinePrefix(item)));
  parsedSteps.forEach((step) => {
    recognized.add(stripLinePrefix(step.title));
    recognized.add(stripLinePrefix(step.detail));
  });

  const unresolved = buildUnresolved(cleanedLines, recognized)
    .filter((line) => line.length >= 4)
    .slice(0, 12);

  return {
    title,
    sourceUrl,
    platform: detectPlatform(sourceUrl),
    ingredients: Array.from(new Set(finalIngredients)),
    steps: parsedSteps,
    unresolved
  };
}

function updateImportReview(parsed) {
  elements.parsedTitle.textContent = parsed.title || "暂未识别";
  elements.parsedPlatform.textContent = parsed.platform || "未识别";
  elements.parsedIngredientCount.textContent = `材料 ${parsed.ingredients.length}`;
  elements.parsedStepCount.textContent = `步骤 ${parsed.steps.length}`;
  elements.importUnresolved.value = parsed.unresolved.join("\n");
}

function fillRecipeFormFromParsed(parsed, { appendNotes = true } = {}) {
  if (parsed.sourceUrl) {
    elements.recipeSource.value = parsed.sourceUrl;
  }

  if (parsed.title) {
    elements.recipeName.value = parsed.title;
  }

  if (parsed.ingredients?.length) {
    elements.recipeIngredients.value = parsed.ingredients.join("\n");
  }

  if (parsed.steps?.length) {
    renderStepsBuilder(parsed.steps);
  }

  const unresolvedText = Array.isArray(parsed.unresolved) ? parsed.unresolved.join("\n") : "";
  const notesText = [parsed.notes, unresolvedText].filter(Boolean).join("\n");

  if (appendNotes && notesText) {
    const oldNotes = elements.recipeNotes.value.trim();
    elements.recipeNotes.value = oldNotes ? `${oldNotes}\n${notesText}` : notesText;
  }

  renderPreview();
}

function importSharedContent() {
  const link = elements.importLink.value.trim();
  const text = elements.importText.value.trim();
  const mode = elements.importMode.value;

  if (!link && !text) {
    showToast("先粘贴分享文案或链接");
    return;
  }

  const parsed = parseImportedContent(text, link, mode);
  updateImportReview(parsed);

  if (parsed.steps.length) {
    fillRecipeFormFromParsed(parsed);
  } else if (text) {
    renderStepsBuilder([
      {
        title: "",
        detail: text,
        duration: "",
        tip: ""
      }
    ]);
    fillRecipeFormFromParsed({ ...parsed, steps: [] });
  }

  renderPreview();

  if (!parsed.title && !parsed.ingredients.length && !parsed.steps.length) {
    showToast("已带入原文，但当前内容结构不明显，建议你补一下标题和步骤");
    return;
  }

  if (parsed.unresolved.length) {
    showToast("已整理主要内容，未识别部分已放进备注和待确认区");
    return;
  }

  showToast("已把可识别内容整理到表单，请检查后保存");
}

function setAiImportLoading(isLoading) {
  elements.importWithAi.disabled = isLoading;
  elements.importWithAi.textContent = isLoading ? "AI 整理中..." : "AI 智能整理";
  elements.importNote.textContent = isLoading
    ? "正在调用 AI 提取菜名、材料和步骤，通常几秒内会返回。"
    : "规则整理适合快速初筛；接入 API key 后，`AI 智能整理` 会更适合复杂、口语化或格式很乱的原文。";
}

function isServedFromLocalServer() {
  return window.location.protocol === "http:" || window.location.protocol === "https:";
}

function isUsingRemoteApi() {
  return Boolean(getApiBaseUrl());
}

function isSameOriginHostedApp() {
  return isServedFromLocalServer() && !isUsingRemoteApi();
}

async function importWithAi() {
  const rawText = elements.importText.value.trim();
  const sourceUrl = elements.importLink.value.trim();
  const mode = elements.importMode.value;

  if (!rawText && !sourceUrl) {
    showToast("先粘贴分享文案或链接");
    return;
  }

  if (!isServedFromLocalServer()) {
    elements.importNote.textContent =
      "当前页面是本地文件模式打开的。请先运行 `npm start`，然后用浏览器打开 http://127.0.0.1:3000 再使用 AI 智能整理。";
    showToast("请通过 http://127.0.0.1:3000 打开网站后再用 AI");
    return;
  }

  setAiImportLoading(true);

  try {
    const response = await fetch(getApiUrl("/api/parse-recipe"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        rawText,
        sourceUrl,
        mode
      })
    });

    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload?.detail || payload?.error || "AI 解析失败");
    }

    const parsed = {
      title: payload.title || "",
      sourceUrl: payload.sourceUrl || sourceUrl,
      platform: detectPlatform(payload.sourceUrl || sourceUrl),
      ingredients: Array.isArray(payload.ingredients) ? payload.ingredients : [],
      steps: Array.isArray(payload.steps) ? payload.steps : [],
      notes: payload.notes || "",
      unresolved: Array.isArray(payload.unresolved) ? payload.unresolved : []
    };

    updateImportReview(parsed);
    fillRecipeFormFromParsed(parsed);

    if (!parsed.title && !parsed.ingredients.length && !parsed.steps.length) {
      showToast("AI 已返回结果，但没有识别出清晰的食谱结构");
      return;
    }

    showToast("AI 已整理完成，请检查后保存");
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : String(error);
    elements.importNote.textContent = `AI 请求失败：${message}`;

    if (/failed to fetch/i.test(message)) {
      if (isUsingRemoteApi()) {
        showToast("AI 整理失败：请确认 config.js 中的 apiBaseUrl 可访问，且后端服务正在运行");
        return;
      }

      showToast("AI 整理失败：请确认你是从 http://127.0.0.1:3000 打开的，并且 npm start 正在运行");
      return;
    }

    showToast("AI 整理失败，已保留原文。你也可以先用规则整理。");
  } finally {
    setAiImportLoading(false);
  }
}

function handleStepBuilderClick(event) {
  const actionButton = event.target.closest("[data-step-action]");

  if (!actionButton) {
    return;
  }

  const card = actionButton.closest(".step-editor");
  const cards = Array.from(elements.stepsBuilder.querySelectorAll(".step-editor"));
  const index = cards.indexOf(card);
  const steps = getStepDrafts();
  const action = actionButton.dataset.stepAction;

  if (action === "remove") {
    if (steps.length === 1) {
      steps[0] = createStep({}, 0);
    } else {
      steps.splice(index, 1);
    }
  }

  if (action === "up" && index > 0) {
    [steps[index - 1], steps[index]] = [steps[index], steps[index - 1]];
  }

  if (action === "down" && index < steps.length - 1) {
    [steps[index + 1], steps[index]] = [steps[index], steps[index + 1]];
  }

  renderStepsBuilder(steps);
  renderPreview();
}

function addNewStep() {
  const steps = getStepDrafts();
  steps.push(
    createStep(
      {
        title: "",
        detail: "",
        duration: "",
        tip: ""
      },
      steps.length
    )
  );
  renderStepsBuilder(steps);
  renderPreview();
}

function attachEvents() {
  elements.form.addEventListener("submit", upsertRecipe);
  elements.resetForm.addEventListener("click", () => resetForm());
  elements.clearStorage.addEventListener("click", clearAllRecipes);
  elements.seedDemo.addEventListener("click", seedDemoRecipes);
  elements.recipeList.addEventListener("click", handleCardAction);
  elements.searchInput.addEventListener("input", (event) => {
    state.search = event.target.value;
    renderRecipes();
  });
  elements.addStep.addEventListener("click", addNewStep);
  elements.stepsBuilder.addEventListener("click", handleStepBuilderClick);
  elements.stepsBuilder.addEventListener("input", renderPreview);
  elements.importContent.addEventListener("click", importSharedContent);
  elements.importWithAi.addEventListener("click", importWithAi);
  elements.clearImport.addEventListener("click", resetImportFields);

  [
    elements.recipeName,
    elements.recipeSource,
    elements.recipeIngredients,
    elements.recipeNotes
  ].forEach((element) => {
    element.addEventListener("input", renderPreview);
  });
}

function init() {
  loadRecipes();
  renderStepsBuilder();
  attachEvents();
  updateStats();
  renderRecipes();
  resetImportReview();

  if (!isServedFromLocalServer()) {
    elements.importNote.textContent =
      "你当前像是在直接打开本地文件。规则整理还能用，但 AI 智能整理需要先运行 `npm start`，再访问 http://127.0.0.1:3000 。";
  } else if (isUsingRemoteApi()) {
    elements.importNote.textContent =
      `当前已配置线上 API：${getApiBaseUrl()}。AI 智能整理会直接请求这个后端服务。`;
  } else if (isSameOriginHostedApp()) {
    elements.importNote.textContent =
      "当前页面和 AI 接口使用同一个站点地址，不需要额外配置 config.js。";
  }

  renderPreview();
}

init();
