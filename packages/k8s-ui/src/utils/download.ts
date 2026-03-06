/** Triggers a file download in the browser or desktop webview. */
export function triggerDownload(content: string, mime: string, filename: string): void {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')

  a.href = url
  a.download = filename
  a.style.display = 'none'

  document.body.appendChild(a)
  a.click()

  // Delay cleanup so embedded webviews still have time to consume the blob URL.
  window.setTimeout(() => {
    URL.revokeObjectURL(url)
    a.remove()
  }, 1000)
}
