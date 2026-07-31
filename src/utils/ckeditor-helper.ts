const getEmbedUrl = (url: string): string | null => {
  const youtube = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]+)/)
  if (youtube) return `https://www.youtube.com/embed/${youtube[1]}`

  const vimeo = url.match(/vimeo\.com\/(\d+)/)
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`

  return null
}

/**
 * CKEditor MediaEmbed (previewsInData: false) lưu media dạng
 * <oembed url="..."></oembed>, thẻ này không tự render trên trình duyệt.
 * Hàm này thay thế nó bằng iframe thật trước khi đưa vào v-html.
 */
export const renderCkEditorContent = (html: string): string => {
  if (!html) return html

  return html.replace(/<oembed url="([^"]+)"><\/oembed>/g, (match, url) => {
    const embedUrl = getEmbedUrl(url)
    if (!embedUrl) return match

    return `<div class="ck-media-embed" style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden">
      <iframe src="${embedUrl}" style="position:absolute;top:0;left:0;width:100%;height:100%" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div>`
  })
}
