import { useEffect, useState } from "react"
import { AppRouter } from "./router"
import { GlobalLoadingScreen } from "../components/GlobalLoadingScreen"

export const App = () => {
  const [isGlobalLoadingVisible, setIsGlobalLoadingVisible] = useState(false)

  useEffect(() => {
    const handleApiLoadingStart = () => {
      setIsGlobalLoadingVisible(true)
    }

    const handleApiLoadingEnd = () => {
      setIsGlobalLoadingVisible(false)
    }

    window.addEventListener("api-loading-start", handleApiLoadingStart)
    window.addEventListener("api-loading-end", handleApiLoadingEnd)

    return () => {
      window.removeEventListener("api-loading-start", handleApiLoadingStart)
      window.removeEventListener("api-loading-end", handleApiLoadingEnd)
    }
  }, [])

  return (
    <>
      <AppRouter />
      <GlobalLoadingScreen isVisible={isGlobalLoadingVisible} />
    </>
  )
}
