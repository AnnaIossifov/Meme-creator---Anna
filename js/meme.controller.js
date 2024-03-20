'use strict'

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const galleryImages = document.querySelectorAll('.gallery-item')
const memeData = { txt: 'Example text' }

const fontFamilySelect = document.getElementById('font-family')
const fontSizeInput = document.getElementById('font-size')
const alignLeftBtn = document.getElementById('align-left')
const alignCenterBtn = document.getElementById('align-center')
const alignRightBtn = document.getElementById('align-right')

let isDragging = false
let textX = 0
let textY = 0

let offsetY = 0
let offsetX = 0

let selectedTextColor = ''
let selectedFillColor = '#e0e0e0'
let selectedFontFamily = 'Poppins'
let selectedStrokeColor = '#000000'

let selectedLineIndex = 0

window.addEventListener('load', renderMeme)
document.getElementById('text-input').addEventListener('input', renderMeme)
canvas.addEventListener('click', handleCanvasClick)

const menuBtn = document.querySelector('.mobile-nav-btn')
const sideMenu = document.querySelector('.side-menu')

canvas.addEventListener('click', function (e) {
    const canvasRect = canvas.getBoundingClientRect()
    const mouseX = e.clientX - canvasRect.left
    const mouseY = e.clientY - canvasRect.top
    detectLineClick(mouseX, mouseY)
})

menuBtn.addEventListener('click', function () {
    sideMenu.classList.toggle('active')
})

fontFamilySelect.addEventListener('change', function () {
    const selectedFont = this.value;
    setTextFont(selectedFont)
});

fontSizeInput.addEventListener('change', function () {
    const fontSize = `${this.value}px`
    setTextSize(fontSize)
})

alignLeftBtn.addEventListener('click', function () {
    setTextAlignment('left')
})

alignCenterBtn.addEventListener('click', function () {
    setTextAlignment('center')
})

alignRightBtn.addEventListener('click', function () {
    setTextAlignment('right')
})

// ------------------------------------------------------------------------------------------

function initMemeEditor() {
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')

    if (!canvas || !ctx) {
        console.error('Error: Canvas or context not available')
        return
    }

    loadMemes()
    initEventListeners()

    const galleryImages = document.querySelectorAll('.gallery-item img')
    galleryImages.forEach(img => {
        img.addEventListener('click', function () {
            renderImageToCanvas(img)
            openEditor()
        })
    })
}

galleryImages.forEach(img => {
    img.addEventListener('click', function () {
        renderImageToCanvas(img)
    })
})

// Rendering the meme on the canvas
// function renderMeme() {
//     const canvas = document.getElementById('canvas')
//     const ctx = canvas.getContext('2d')

//     const selectedImageUrl = localStorage.getItem('selectedImageUrl')

//     if (!selectedImageUrl) {
//         console.error('Error: Selected image URL not found')
//         return
//     }

//     const selectedImg = new Image()
//     selectedImg.onload = function () {
//         ctx.clearRect(0, 0, canvas.width, canvas.height)
//         ctx.drawImage(selectedImg, 0, 0, canvas.width, canvas.height)

//         gMeme.lines.forEach((line, index) => {
//            const maxWidth = canvas.width - 20
//             const lineHeight = line.size * 1.2

//             const words = line.txt.split(' ')
//             let currentLine = ''
//             const lines = []

//             words.forEach(word => {
//                 const testLine = currentLine ? `${currentLine} ${word}` : word
//                 const testWidth = ctx.measureText(testLine).width
//                 if (testWidth > maxWidth && currentLine !== '') {
//                     lines.push(currentLine);
//                     currentLine = word;
//                 } else {
//                     currentLine = testLine;
//                 }
//             })
//             lines.push(currentLine)

//             const totalHeight = lines.length * lineHeight;
//             let textY = line.y - totalHeight / 2

//             lines.forEach(text => {
//                 ctx.font = `${line.size}px ${line.fontFamily}`
//                 ctx.fillStyle = line.color
//                 ctx.textAlign = line.alignment || 'center'
//                 const textWidth = ctx.measureText(text).width

//                 // box around text
//                 if (index === selectedLineIndex) {
//                     ctx.strokeStyle = 'green'
//                 } else {
//                     ctx.strokeStyle = '#000000'
//                 }

//                 ctx.lineWidth = 2
//                 ctx.strokeRect(line.x - textWidth / 2 - 10, textY - 30, textWidth + 20, lineHeight)

//                 ctx.fillText(text, line.x, textY)
//                 textY += lineHeight

//                 // green box for selected text
//                 if (index === selectedLineIndex) {
//                     ctx.strokeStyle = 'green'
//                     ctx.strokeRect(line.x - textWidth / 2 - 10, textY - lineHeight, textWidth + 20, lineHeight)
//                 }
//             })
//         })
//         updateTextDimensions()
//     }
//     selectedImg.src = selectedImageUrl
// }

function renderMeme() {
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')



    const selectedImageUrl = localStorage.getItem('selectedImageUrl')
    if (!selectedImageUrl) {
        console.error('Error: Selected image URL not found')
        return
    }

    const selectedImg = new Image()
    selectedImg.onload = function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(selectedImg, 0, 0, canvas.width, canvas.height)

        gMeme.lines.forEach((line, index) => {
            const text = line.txt.trim()

            if (text.length > 0) {
               ctx.font = `${line.size}px Poppins`
                ctx.textAlign = 'center'
                ctx.fillStyle = line.color

                if (index === selectedLineIndex) {
                    ctx.fillStyle = selectedFillColor ? selectedFillColor : fillTextColor
                    ctx.strokeStyle = 'green'
                } else {
                    ctx.fillStyle = line.color
                    ctx.strokeStyle = 'transparent'
                }

                const textWidth = ctx.measureText(text).width
                const textX = line.x
                const textY = line.y

                ctx.fillText(text, textX, textY)

                if (index === selectedLineIndex) {
                    ctx.strokeRect(textX - textWidth / 2 - 10, textY - 30, textWidth + 20, 40)
                }
            }
        })
        updateTextDimensions()
    }
    selectedImg.src = selectedImageUrl
}




function openEditor() {
    console.log('Opening editor...')
    const editorElement = document.getElementById('meme-editor')
    const elGallery = document.querySelector('.gallery-container')
    if (editorElement) {
        editorElement.style.display = 'flex'
    } else {
        console.error('Error: Editor element not found')
    }
    elGallery.style.display = 'none'
}

// Initializing event listeners
function initEventListeners() {
    const galleryItems = document.querySelectorAll('.gallery-item img')
    const fontSizeUpBtn = document.querySelector('.font-size-up')
    const fontSizeDownBtn = document.querySelector('.font-size-down')
    const fontFamilySelect = document.querySelector('#font-family-select')
    const fillColorInput = document.querySelector('#fill-color')
    const strokeColorInput = document.querySelector('#stroke-color')

    fontSizeUpBtn.addEventListener('click', onFontSizeUp)
    fontSizeDownBtn.addEventListener('click', onFontSizeDown)
    fontFamilySelect.addEventListener('change', onSetFontFamily)
    fillColorInput.addEventListener('change', onSelectFillColor)
    strokeColorInput.addEventListener('change', onSelectStrokeColor)

    galleryItems.forEach(function (item) {
        item.addEventListener('click', function () {
            const imageUrl = item.src
            saveSelectedImage(imageUrl);
            console.log("Image clicked! URL: ", imageUrl)
        })
    })
}

function toggleMenu() {
    const sideMenu = document.querySelector('.side-menu')
    const mobileNavBtn = document.getElementById('mobile-nav-btn')
    const body = document.body

    sideMenu.classList.toggle('menu-open')
    body.classList.toggle('menu-open')

    if (sideMenu.classList.contains('menu-open')) {
        mobileNavBtn.textContent = '✕'
    } else {
        mobileNavBtn.textContent = '☰'
    }
}
// ------------------------------------------------------------------------------------

// Function to increase font size
function onFontSizeUp() {
    const fontSizeIncrement = 2
    const line = gMeme.lines[selectedLineIndex]
    line.size += fontSizeIncrement
    renderMeme()
}

// Function to decrease font size
function onFontSizeDown() {
    const fontSizeDecrement = 2
    const line = gMeme.lines[selectedLineIndex]
    line.size = Math.max(line.size - fontSizeDecrement, 10)
    renderMeme()
}

// Function to set font family
function onSetFontFamily() {
    const fillColorInput = document.getElementById('fill-color')
    selectedFillColor = fillColorInput.value

    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = selectedFillColor

    console.log('Selected fill color:', selectedFillColor)
    console.log('Canvas context:', ctx)

    renderMeme()
}

// Function to select fill color
function onSelectFillColor() {
    const fillColorInput = document.getElementById('fill-color')
    selectedFillColor = fillColorInput.value

    console.log('Selected fill color:', selectedFillColor)

    if (selectedLineIndex >= 0 && selectedLineIndex < gMeme.lines.length) {
        gMeme.lines[selectedLineIndex].color = selectedFillColor
    }
    renderMeme()
}

// Function to select stroke color
function onSelectStrokeColor() {
    const strokeColorInput = document.getElementById('stroke-color')
    selectedStrokeColor = strokeColorInput.value
    console.log('Selected stroke color:', selectedStrokeColor)

    if (selectedLineIndex >= 0 && selectedLineIndex < gMeme.lines.length) {
        gMeme.lines[selectedLineIndex].strokeColor = selectedStrokeColor;
    }
    renderMeme()
}

const moveLineUpBtn = document.getElementById('move-line-up')
const moveLineDownBtn = document.getElementById('move-line-down')
moveLineUpBtn.addEventListener('click', changeTextLineUp)
moveLineDownBtn.addEventListener('click', changeTextLineDown)