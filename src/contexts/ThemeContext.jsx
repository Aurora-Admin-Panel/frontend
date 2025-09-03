import React, { useMemo, useEffect, useState } from "react";
import { useAtom } from "jotai";
import { themeSelectionAtom } from "../atoms/theme";
import { light_theme, dark_theme } from "../utils/themes";

// create context
export const ThemeContext = React.createContext();

const setHtmlDataTheme = (theme) => {
    const html = document.getElementsByTagName('html')[0]
    html.setAttribute('data-theme', theme)
}

export const ThemeProvider = ({ children }) => {
    const [selection, setSelection] = useAtom(themeSelectionAtom)
    const [systemDark, setSystemDark] = useState(() =>
        typeof window !== 'undefined'
            ? window.matchMedia('(prefers-color-scheme: dark)').matches
            : false
    )

    // Determine the actually applied theme
    const appliedTheme = useMemo(() => {
        if (selection === 'auto') {
            return systemDark ? dark_theme : light_theme
        }
        return selection
    }, [selection, systemDark])

    // Apply to <html data-theme>
    useEffect(() => {
        setHtmlDataTheme(appliedTheme)
    }, [appliedTheme])

    // Listen to system preference changes when on 'auto'
    useEffect(() => {
        const mq = window.matchMedia('(prefers-color-scheme: dark)')
        const handler = (e) => setSystemDark(e.matches)
        mq.addEventListener?.('change', handler)
        return () => mq.removeEventListener?.('change', handler)
    }, [])

    const value = useMemo(() => ({
        // Expose the currently applied theme for consumers
        theme: appliedTheme,
        // Setter accepts a theme name or 'auto', persisted via atom
        setTheme: (next) => {
            setSelection(next)
        },
    }), [appliedTheme, setSelection])

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
