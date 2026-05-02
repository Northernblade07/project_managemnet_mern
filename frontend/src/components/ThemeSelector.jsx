import React, { useState, useRef, useEffect } from "react";
import { useThemeStore } from "../store/useThemeStore";
import { PaletteIcon } from "lucide-react";
import { THEMES } from "../constants";

const ThemeSelector = () => {
  const { theme, setTheme } = useThemeStore();
  const [open, setOpen] = useState(false);
  const ref = useRef();

  // close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      {/* BUTTON */}
      <button
        className="btn btn-ghost btn-circle"
        onClick={() => setOpen(!open)}
      >
        <PaletteIcon className="size-5" />
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute right-0 mt-2 p-2 shadow-2xl bg-base-200 backdrop-blur-xl rounded-2xl w-56 border border-base-content/10 max-h-80 overflow-y-auto z-50">
          <div className="space-y-1">
            {THEMES.map((themeOption) => (
              <button
                key={themeOption.name}
                onClick={() => {
                  setTheme(themeOption.name);
                  setOpen(false); // close after select
                }}
                className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-colors ${
                  theme === themeOption.name
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-base-content/5"
                }`}
              >
                <PaletteIcon className="size-4 text-primary" />
                <span className="text-sm font-medium">
                  {themeOption.label}
                </span>

                {themeOption.colors.map((color, i) => (
                  <span
                    key={i}
                    className="size-2 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSelector;