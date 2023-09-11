import React, { useState, useMemo } from "react";
import { useEffect } from "react";
import { light_theme, dark_theme } from "../utils/themes";

// create context
export const ThemeContext = React.createContext();

const setHtmlDataTheme = (theme) => {
    const html = document.getElementsByTagName('html')[0]
    html.setAttribute('data-theme', theme)
}

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('')

    useEffect(() => {
        let theme = localStorage.getItem('aurora-theme')
        if (!!!theme) {
            theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? dark_theme : light_theme
        }
        // TODO: check valid theme
        setHtmlDataTheme(theme)
        setTheme(theme)
    }, [])

    const value = useMemo(
        () => ({
            theme,
            setTheme: (_theme) => {
                console.log(_theme)
                if (_theme === 'auto') {
                    _theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? dark_theme : light_theme
                    localStorage.setItem('aurora-theme', '')
                } else {
                    localStorage.setItem('aurora-theme', _theme)
                }
                setHtmlDataTheme(_theme)
                setTheme(_theme)
            }
        }),
        [theme]
    )
    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
