const STORAGE_KEY = "recipe-notes";

function splitLines(text) {
  return text
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

Page({
  data: {
    form: {
      title: "",
      ingredientsText: "",
      stepsText: ""
    },
    editingId: null,
    recipes: []
  },

  onLoad() {
    this.loadRecipes();
  },

  loadRecipes() {
    const recipes = wx.getStorageSync(STORAGE_KEY) || [];
    this.setData({ recipes });
  },

  updateStorage(recipes) {
    wx.setStorageSync(STORAGE_KEY, recipes);
    this.setData({ recipes });
  },

  handleTitleInput(event) {
    this.setData({
      "form.title": event.detail.value
    });
  },

  handleIngredientsInput(event) {
    this.setData({
      "form.ingredientsText": event.detail.value
    });
  },

  handleStepsInput(event) {
    this.setData({
      "form.stepsText": event.detail.value
    });
  },

  submitRecipe() {
    const { form, recipes, editingId } = this.data;
    const title = form.title.trim();
    const ingredients = splitLines(form.ingredientsText);
    const steps = splitLines(form.stepsText);

    if (!title) {
      wx.showToast({
        title: "请先填写菜名",
        icon: "none"
      });
      return;
    }

    if (!ingredients.length) {
      wx.showToast({
        title: "请至少填写一种材料",
        icon: "none"
      });
      return;
    }

    if (!steps.length) {
      wx.showToast({
        title: "请至少填写一步做法",
        icon: "none"
      });
      return;
    }

    const recipe = {
      id: editingId || Date.now(),
      title,
      ingredients,
      steps,
      updatedAt: Date.now()
    };

    let nextRecipes = [];

    if (editingId) {
      nextRecipes = recipes.map((item) => (item.id === editingId ? recipe : item));
    } else {
      nextRecipes = [recipe, ...recipes];
    }

    this.updateStorage(nextRecipes);
    this.resetForm();

    wx.showToast({
      title: editingId ? "已更新食谱" : "已保存食谱",
      icon: "success"
    });
  },

  startEdit(event) {
    const { id } = event.currentTarget.dataset;
    const recipe = this.data.recipes.find((item) => item.id === id);

    if (!recipe) {
      return;
    }

    this.setData({
      editingId: recipe.id,
      "form.title": recipe.title,
      "form.ingredientsText": recipe.ingredients.join("\n"),
      "form.stepsText": recipe.steps.join("\n")
    });

    wx.pageScrollTo({
      scrollTop: 0,
      duration: 250
    });
  },

  deleteRecipe(event) {
    const { id } = event.currentTarget.dataset;
    const recipe = this.data.recipes.find((item) => item.id === id);

    if (!recipe) {
      return;
    }

    wx.showModal({
      title: "删除食谱",
      content: `确定删除“${recipe.title}”吗？`,
      success: (result) => {
        if (!result.confirm) {
          return;
        }

        const nextRecipes = this.data.recipes.filter((item) => item.id !== id);
        this.updateStorage(nextRecipes);

        if (this.data.editingId === id) {
          this.resetForm();
        }

        wx.showToast({
          title: "已删除",
          icon: "success"
        });
      }
    });
  },

  resetForm() {
    this.setData({
      editingId: null,
      form: {
        title: "",
        ingredientsText: "",
        stepsText: ""
      }
    });
  }
});
