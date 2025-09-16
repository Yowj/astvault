import React, { useEffect } from "react";
import { useThemeStore } from "../../store/useThemeStore";

const themes = [
  "light", "dark", "cupcake", "bumblebee", "emerald", "corporate",
  "synthwave", "halloween", "garden", "forest", "lofi", "pastel",
  "fantasy", "wireframe", "black", "luxury", "dracula", "cmyk",
  "autumn", "business", "acid", "lemonade", "night", "coffee", "winter",
];

const ThemeController = () => {
  const { theme, setTheme } = useThemeStore();

  const handleThemeChange = (e) => {
    const selectedTheme = e.target.value;
    setTheme(selectedTheme);
    document.documentElement.setAttribute("data-theme", selectedTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div>
      <div className="dropdown">
        <div tabIndex={0} role="button" className="btn m-1">
          Theme
          <svg
            width="12px"
            height="12px"
            className="inline-block h-2 w-2 fill-current opacity-60"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 2048 2048"
          >
            <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z" />
          </svg>
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content bg-base-300 rounded-box z-10 w-36 p-2 shadow-2xl"
        >
          {themes.map((item) => (
            <li
              key={item}
              className={theme === item ? "bg-primary text-primary-content rounded-md" : ""}
            >
              <input
                type="radio"
                name="theme-dropdown"
                className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                aria-label={item.charAt(0).toUpperCase() + item.slice(1)}
                value={item}
                onChange={handleThemeChange}
                checked={theme === item}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ThemeController;
