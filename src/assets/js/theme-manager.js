(function (window) {
  "use strict";

  const ThemeManager = {
    config: {
      themes: [],
      defaultTheme: "",
      themePath: "assets/css/themes",
      defaultMode: "system",
      storage: {
        theme: "theme",
        mode: "mode",
      },
    },

    init(options = {}) {
      this.config = {
        ...this.config,
        ...options,
      };

      if (!this.config.themes.length) {
        throw new Error("ThemeManager: 'themes' cannot be empty.");
      }

      if (!this.config.defaultTheme) {
        this.config.defaultTheme = this.config.themes[0];
      }

      const theme =
        localStorage.getItem(this.config.storage.theme) ??
        this.config.defaultTheme;

      const mode =
        localStorage.getItem(this.config.storage.mode) ??
        this.config.defaultMode;

      this.setTheme(theme, false);
      this.setMode(mode, false);
    },

    loadTheme(name) {
      if (!this.config.themes.includes(name)) {
        console.warn(
          `ThemeManager: "${name}" is not a registered theme. Falling back to "${this.config.defaultTheme}".`
        );
        name = this.config.defaultTheme;
      }

      document
        .querySelector('link[data-theme-manager]')
        ?.remove();

      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.dataset.themeManager = "true";
      link.href = `${this.config.themePath}/${name}.css`;

      document.head.prepend(link);
    },

    setTheme(name, save = true) {
      this.loadTheme(name);

      if (save) {
        localStorage.setItem(this.config.storage.theme, name);
      }
    },

    getTheme() {
      return (
        localStorage.getItem(this.config.storage.theme) ??
        this.config.defaultTheme
      );
    },

    getThemes() {
      return [...this.config.themes];
    },

    setMode(mode, save = true) {
      if (mode === "system") {
        mode = window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
      }

      document.documentElement.classList.toggle(
        "dark",
        mode === "dark"
      );

      if (save) {
        localStorage.setItem(this.config.storage.mode, mode);
      }
    },

    getMode() {
      return (
        localStorage.getItem(this.config.storage.mode) ??
        this.config.defaultMode
      );
    },

    toggleMode() {
      const dark =
        !document.documentElement.classList.contains("dark");

      this.setMode(dark ? "dark" : "light");
    },
  };

  window.ThemeManager = ThemeManager;
})(window);
