type GlobalLoadingScreenProps = {
  isVisible: boolean
}

export const GlobalLoadingScreen = ({
  isVisible,
}: GlobalLoadingScreenProps) => {
  if (!isVisible) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 px-4">
      <div className="w-full max-w-sm rounded-md border border-border bg-card p-6 text-center shadow-sm">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
        <h2 className="mt-4 text-xl font-semibold">กำลังปลุกระบบ...</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          ระบบอาจใช้เวลาสักครู่ หาก Render กำลังตื่น
        </p>
      </div>
    </div>
  )
}
