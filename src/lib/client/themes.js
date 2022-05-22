import {get} from "svelte/store";
import {browser} from "$app/env";
import {themeStore} from "../../stores/theme.js";

const SUPPORTED_ACCENTS = [
  "orange", "red", "blue", "green", "pink"
]

const THEME_DEFAULTS = {
  darkMode: true,
  accent: SUPPORTED_ACCENTS[0]
}

function activateTheme() {
  if (browser) {
    const localThemeStore = localStorage.getItem("theme") || ""
    let theme = {}

    try {
      // Needs to be parsed, since local storage can only handle strings
      theme = JSON.parse(localThemeStore)
    } catch (err) {
      theme = THEME_DEFAULTS
    }

    let hasAllKeys = theme && Object.keys(THEME_DEFAULTS).every(key => theme.hasOwnProperty(key))

    themeStore.set(hasAllKeys ? theme : THEME_DEFAULTS)
    const store = get(themeStore)


    const darkMode =  store.darkMode
    const accent =  store.accent

    setDarkMode(darkMode)
    setAccent(accent)
  }
}

function setDarkMode(darkMode) {
  if (browser) {
    const body = document.body

    if (darkMode) {
      body.classList.remove("light-mode")
      body.classList.add("dark-mode")
    } else {
      body.classList.remove("dark-mode")
      body.classList.add("light-mode")
    }
    themeStore.update(current => ({darkMode: darkMode, accent: current.accent}))
  }
}

function setAccent(accent) {
  if (browser) {
    const body = document.body

    const newAccent = SUPPORTED_ACCENTS.includes(accent) ? "accent-" + accent : "accent-" + THEME_DEFAULTS.accent
    const oldAccents = []
    body.classList.forEach(value => {
      if (value.startsWith("accent-")) {
        oldAccents.push(value)
      }
    })

    oldAccents.forEach(value => body.classList.remove(value))
    body.classList.add(newAccent)
    themeStore.update(current => ({darkMode: current.darkMode, accent: accent}))
  }
}

export {setDarkMode, setAccent, activateTheme, THEME_DEFAULTS, SUPPORTED_ACCENTS}