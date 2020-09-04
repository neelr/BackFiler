import { useState } from "react"
import { GeistProvider, CssBaseline } from '@geist-ui/react'

export default ({ Component, props }) => {
    const [themeType, setThemeType] = useState('dark')
    const switchThemes = () => {
        setThemeType(lastThemeType => (lastThemeType === 'dark' ? 'light' : 'dark'))
    }
    return (
        <GeistProvider theme={{ type: themeType }}>
            <CssBaseline />
            <Component {...props} />
        </GeistProvider>
    )
}
