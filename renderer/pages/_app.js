import { useState } from "react"
import { GeistProvider, CssBaseline, Button } from '@geist-ui/react'

export default ({ Component, ...props }) => {
    const [themeType, setThemeType] = useState('dark')
    const switchThemes = () => {
        setThemeType(lastThemeType => (lastThemeType === 'dark' ? 'light' : 'dark'))
    }
    return (
        <GeistProvider theme={{ type: themeType }} s>
            <CssBaseline />
            <div style={{
                display: "flex",
                width: "100vw",
                padding: "15px"
            }}>
                <Button style={{
                    marginLeft: "auto",
                    marginRight: "30px"
                }} onClick={switchThemes}>Theme</Button>
            </div>
            <Component {...props} />
        </GeistProvider>
    )
}
