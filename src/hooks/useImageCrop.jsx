
import { useState, useEffect} from "react"

export default function useImageCrop(crop_container_ref ) {
    

    const [cropModalOpen, setCropModalOpen] = useState(false)

    const [originalFile, setOriginalFile] = useState(null)
    const [originalUrl, setOriginalUrl] = useState(null)
    
    const [croppedFile, setCroppedFile] = useState(null)

    const activeSource = croppedFile ?? originalFile ?? originalUrl

    const [baseImage, setBaseImage] = useState()
    const [previewImage, setPreviewImage] = useState(null)

    const [imageLoaded, setImageLoaded] = useState(false)
    const [isCropped, setIsCropped] = useState(false)
    const [corsError, setCorsError] = useState(false)

    const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 100, height: 100, containerWidth: 0, containerHeight: 0 })
    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 })

    const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
    const [isDraggingCrop, setIsDraggingCrop] = useState(false)

    const [isResizing, setIsResizing] = useState(false)
    const [resizeHandle, setResizeHandle] = useState(null)



    

    function loadFile(file) {
        setOriginalFile(file)
        setBaseImage(URL.createObjectURL(file))
        setOriginalUrl(null)
        setCroppedFile(null)
    }

    function loadUrl(url) {
        setOriginalUrl(url)
        setBaseImage(url)
        setOriginalFile(null)
        setCroppedFile(null)
    }


    useEffect(() => {
        if (!activeSource) {
            setPreviewImage(null)
            return
        }

        console.log(activeSource)

        // File → object URL
        if (activeSource instanceof File) {
            const url = URL.createObjectURL(activeSource)
            setPreviewImage(url)
            return () => URL.revokeObjectURL(url)
        }

        setPreviewImage(activeSource)
        
    }, [activeSource])

    function clearImage() {
        setOriginalFile(null)
        setOriginalUrl(null)
        setCroppedFile(null)
    }

    useEffect(() => {
        if (!cropModalOpen) return
        if (!crop_container_ref.current) return

        const container = crop_container_ref.current
        const img = new Image()

        img.src = baseImage
        img.onload = () => {
            const maxWidth = container.clientWidth
            const maxHeight = container.clientHeight

            const imgRatio = img.width / img.height
            const containerRatio = maxWidth / maxHeight

            let displayWidth, displayHeight

            if (imgRatio > containerRatio) {
                // Image is wider → limit by width
                displayWidth = Math.min(maxWidth, img.width)
                displayHeight = displayWidth / imgRatio
            } else {
                // Image is taller → limit by height
                displayHeight = Math.min(maxHeight, img.height)
                displayWidth = displayHeight * imgRatio
            }

            container.style.height = `${displayHeight}px`

            setImageDimensions({
                width: img.width,
                height: img.height
            })

            const cropWidth = displayWidth * 0.8
            const cropHeight = displayHeight * 0.8

            setCropArea({
                x: (displayWidth - cropWidth) / 2,
                y: (displayHeight - cropHeight) / 2,
                width: cropWidth,
                height: cropHeight,
                containerWidth: displayWidth,
                containerHeight: displayHeight
            })

            setImageLoaded(true)
        }
    }, [cropModalOpen])


    async function applyCrop() {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d', { alpha: false })
            const img = new Image()

            img.crossOrigin = 'anonymous'
            img.src = baseImage

            img.onload = () => {
                try {
                    // Crop math
                    const scaleX = imageDimensions.width / cropArea.containerWidth
                    const scaleY = imageDimensions.height / cropArea.containerHeight

                    // Coords
                    const cropX = cropArea.x * scaleX
                    const cropY = cropArea.y * scaleY
                    const cropWidth = cropArea.width * scaleX
                    const cropHeight = cropArea.height * scaleY

                    // Fix coords
                    const finalX = Math.max(0, Math.min(Math.floor(cropX), imageDimensions.width - 1))
                    const finalY = Math.max(0, Math.min(Math.floor(cropY), imageDimensions.height - 1))
                    const finalWidth = Math.max(1, Math.min(Math.ceil(cropWidth), imageDimensions.width - finalX))
                    const finalHeight = Math.max(1, Math.min(Math.ceil(cropHeight), imageDimensions.height - finalY))

                    canvas.width = finalWidth
                    canvas.height = finalHeight

                    ctx.imageSmoothingEnabled = true
                    ctx.imageSmoothingQuality = 'high'

                    // Dibujar SOLO la porción recortada en el canvas
                    // drawImage(imagen, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
                    ctx.drawImage(
                        img,
                        finalX,
                        finalY,
                        finalWidth,
                        finalHeight,
                        0,
                        0,
                        finalWidth,
                        finalHeight
                    )

                    // Image creation
                    canvas.toBlob((blob) => {
                        if (!blob) {
                            reject(new Error('Failed to create blob'))
                            return
                        }

                        const croppedFile = new File([blob], `crop-${Math.random().toString(36).slice(2, 8)}.png`, { type: 'image/png' })
                        setCroppedFile(croppedFile)

                        const reader = new FileReader()
                        reader.onloadend = () => {
                            setCropModalOpen(false)
                            setIsCropped(true)
                            resolve()
                        }
                        reader.onerror = reject
                        reader.readAsDataURL(croppedFile)
                    }, 'image/png')
                } catch (error) {

                    reject(error)
                }
            }

            img.onerror = () => {
                setCorsError(true)
                reject(new Error('Failed to load image'))
            }
        })
    }

        function handleCropMouseMove(e) {

        e.preventDefault()
        e.stopPropagation()
        if (!isDraggingCrop && !isResizing) return

        const deltaX = e.clientX - dragStart.x
        const deltaY = e.clientY - dragStart.y

        if (isDraggingCrop) {
            setCropArea(prev => {
                const newX = Math.max(0, Math.min(prev.x + deltaX, prev.containerWidth - prev.width))
                const newY = Math.max(0, Math.min(prev.y + deltaY, prev.containerHeight - prev.height))

                return {
                    ...prev,
                    x: newX,
                    y: newY
                }
            })
        } else if (isResizing) {
            setCropArea(prev => {
                const newArea = { ...prev }
                const minSize = 50
                const maxX = prev.containerWidth
                const maxY = prev.containerHeight

                switch (resizeHandle) {
                    case 'se':
                        newArea.width = Math.max(minSize, Math.min(prev.width + deltaX, maxX - prev.x))
                        newArea.height = Math.max(minSize, Math.min(prev.height + deltaY, maxY - prev.y))
                        break
                    case 'sw':
                        const newWidthSW = Math.max(minSize, prev.width - deltaX)
                        const newXSW = Math.max(0, Math.min(prev.x + deltaX, prev.x + prev.width - minSize))
                        if (newXSW + newWidthSW <= maxX) {
                            newArea.width = newWidthSW
                            newArea.x = newXSW
                        }
                        newArea.height = Math.max(minSize, Math.min(prev.height + deltaY, maxY - prev.y))
                        break
                    case 'ne':
                        newArea.width = Math.max(minSize, Math.min(prev.width + deltaX, maxX - prev.x))
                        const newHeightNE = Math.max(minSize, prev.height - deltaY)
                        const newYNE = Math.max(0, Math.min(prev.y + deltaY, prev.y + prev.height - minSize))
                        if (newYNE + newHeightNE <= maxY) {
                            newArea.height = newHeightNE
                            newArea.y = newYNE
                        }
                        break
                    case 'nw':
                        const newWidthNW = Math.max(minSize, prev.width - deltaX)
                        const newXNW = Math.max(0, Math.min(prev.x + deltaX, prev.x + prev.width - minSize))
                        if (newXNW + newWidthNW <= maxX) {
                            newArea.width = newWidthNW
                            newArea.x = newXNW
                        }
                        const newHeightNW = Math.max(minSize, prev.height - deltaY)
                        const newYNW = Math.max(0, Math.min(prev.y + deltaY, prev.y + prev.height - minSize))
                        if (newYNW + newHeightNW <= maxY) {
                            newArea.height = newHeightNW
                            newArea.y = newYNW
                        }
                        break
                }
                return newArea
            })
        }
        setDragStart({ x: e.clientX, y: e.clientY })
    }


        function handleCropMouseDown(e, handle = null) {
        console.log(e)
        e.preventDefault()
        e.stopPropagation()
        
        if (handle) {
            setIsResizing(true)
            setResizeHandle(handle)
        } else {
            setIsDraggingCrop(true)
        }
        setDragStart({ x: e.clientX, y: e.clientY })
    }



    function handleCropMouseUp() {
        setIsDraggingCrop(false)
        setIsResizing(false)
        setResizeHandle(null)
    }




    function resetToOriginal() {
        setCroppedFile(null)
    }

    return {loadFile, loadUrl,
  activeSource, previewImage, baseImage, setPreviewImage,isCropped,resetToOriginal, corsError, cropModalOpen, setCropModalOpen, imageLoaded, cropArea ,setCropArea, applyCrop, handleCropMouseMove,handleCropMouseDown, handleCropMouseUp, setIsDraggingCrop, clearImage }
}