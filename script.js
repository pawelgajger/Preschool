// Dodaj klasę 'active' do elementów '.scroll-animate' po przewinięciu do widoku
window.addEventListener('scroll', function () {
	const elements = document.querySelectorAll('.scroll-animate')
	elements.forEach(element => {
		const position = element.getBoundingClientRect().top
		const screenPosition = window.innerHeight / 1.3

		if (position < screenPosition) {
			element.classList.add('active')
		}
	})
})

// Funkcje do pełnoekranowego wyświetlania obrazów i nawigacji w galerii
let currentFolder = []
let currentIndex = 0
let currentFolderName = ''

function openFullscreen(imageUrl, imagesArray = [], index = 0, folderName = '') {
	currentFolder = imagesArray
	currentIndex = index
	currentFolderName = folderName

	const fullscreenView = document.getElementById('fullscreen-view')
	const fullscreenImg = document.getElementById('fullscreen-img')

	if (fullscreenImg && fullscreenView) {
		fullscreenImg.src = imageUrl
		fullscreenView.style.display = 'flex'
		document.body.classList.add('fullscreen-active')
		document.querySelector('footer').style.display = 'none'
	}
}

function closeFullscreen() {
	const fullscreenView = document.getElementById('fullscreen-view')
	if (fullscreenView) {
		fullscreenView.style.display = 'none'
		document.body.classList.remove('fullscreen-active')
		document.querySelector('footer').style.display = 'block'
	}
}

function showNextImage(event) {
	event.stopPropagation()
	currentIndex = (currentIndex + 1) % currentFolder.length
	document.getElementById('fullscreen-img').src = `images/${currentFolderName}/${currentFolder[currentIndex]}`
}

function showPreviousImage(event) {
	event.stopPropagation()
	currentIndex = (currentIndex - 1 + currentFolder.length) % currentFolder.length
	document.getElementById('fullscreen-img').src = `images/${currentFolderName}/${currentFolder[currentIndex]}`
}

// Funkcja do ładowania folderów z pliku JSON do galerii
fetch('gallery.json')
	.then(response => response.json())
	.then(data => {
		const foldersContainer = document.getElementById('folders-container')
		if (foldersContainer) {
			data.folders.forEach(folder => {
				const folderElement = document.createElement('div')
				folderElement.className = 'folder-icon'
				folderElement.innerHTML = `<div class="folder-image">📁</div><p>${folder.name}</p>`
				folderElement.onclick = () => openGallery(folder)
				foldersContainer.appendChild(folderElement)
			})
		}
	})
	.catch(error => console.error('Błąd podczas ładowania galerii:', error))

function openGallery(folder) {
	const galleryView = document.getElementById('gallery-view')
	const galleryContainer = document.getElementById('gallery')
	const folderName = document.getElementById('folder-name')

	if (galleryContainer && galleryView && folderName) {
		folderName.innerText = folder.name
		galleryContainer.innerHTML = ''
		folder.images.forEach((image, index) => {
			const imgElement = document.createElement('img')
			imgElement.src = `images/${folder.name}/${image}`
			imgElement.className = 'gallery-item'
			imgElement.alt = folder.name
			imgElement.onclick = () => openFullscreen(imgElement.src, folder.images, index, folder.name)
			galleryContainer.appendChild(imgElement)
		})
		document.getElementById('folders-container').style.display = 'none'
		galleryView.style.display = 'block'
	}
}

function closeGallery() {
	document.getElementById('gallery-view').style.display = 'none'
	document.getElementById('folders-container').style.display = 'flex'
}

// Wyłączenie kliknięcia prawym przyciskiem myszy
document.addEventListener('contextmenu', e => e.preventDefault())
document.addEventListener('keydown', e => {
	if (e.ctrlKey && ['c', 'x', 'u', 's'].includes(e.key)) e.preventDefault()
})
document.querySelectorAll('img').forEach(img => {
	img.addEventListener('dragstart', e => e.preventDefault())
})

// Funkcja sprawdzająca dostępność pliku
async function checkFileExists(url) {
	try {
		const response = await fetch(url, { method: 'HEAD' })
		return response.ok
	} catch (error) {
		console.error('Błąd podczas sprawdzania pliku:', error)
		return false
	}
}

// Funkcja do sprawdzania i wyświetlania PDF dla Menu
async function checkAndDisplayMenuPDF() {
	const pdfUrl = 'files/menu.pdf' // Ścieżka do pliku PDF dla menu
	const pdfFrame = document.getElementById('pdf-frame')
	const unavailableMessage = document.getElementById('menu-file-unavailable')

	if (!pdfFrame || !unavailableMessage) return

	try {
		const response = await fetch(pdfUrl, { method: 'HEAD' })
		if (response.ok) {
			pdfFrame.src = pdfUrl
			pdfFrame.style.display = 'block'
			unavailableMessage.style.display = 'none'
		} else {
			pdfFrame.style.display = 'none'
			unavailableMessage.style.display = 'block'
		}
	} catch (error) {
		console.error('Błąd podczas sprawdzania pliku PDF menu:', error)
		pdfFrame.style.display = 'none'
		unavailableMessage.style.display = 'block'
	}
}

// Funkcja do sprawdzania i wyświetlania PDF dla Wydarzeń
async function checkAndDisplayEventsPDF() {
	const pdfUrl = 'files/wydarzenia.pdf' // Ścieżka do pliku PDF dla wydarzeń
	const pdfFrame = document.getElementById('pdf-frame')
	const unavailableMessage = document.getElementById('news-file-unavailable')

	if (!pdfFrame || !unavailableMessage) return

	try {
		const response = await fetch(pdfUrl, { method: 'HEAD' })
		if (response.ok) {
			pdfFrame.src = pdfUrl
			pdfFrame.style.display = 'block'
			unavailableMessage.style.display = 'none'
		} else {
			pdfFrame.style.display = 'none'
			unavailableMessage.style.display = 'block'
		}
	} catch (error) {
		console.error('Błąd podczas sprawdzania pliku PDF wydarzeń:', error)
		pdfFrame.style.display = 'none'
		unavailableMessage.style.display = 'block'
	}
}

// Funkcje uruchamiane dla odpowiednich stron
function initializeMenuPage() {
	checkAndDisplayMenuPDF()
}

function initializeEventsPage() {
	checkAndDisplayEventsPDF()
}

// Event listener dla każdej strony
document.addEventListener('DOMContentLoaded', () => {
	if (document.body.classList.contains('menu-page')) {
		initializeMenuPage()
	} else if (document.body.classList.contains('events-page')) {
		initializeEventsPage()
	}
})

document.addEventListener('DOMContentLoaded', () => {
	// Obsługa hamburger menu
	const hamburger = document.querySelector('.hamburger-menu')
	const navbarMenu = document.querySelector('.navbar ul')

	if (hamburger && navbarMenu) {
		hamburger.addEventListener('click', () => {
			navbarMenu.classList.toggle('show')
			hamburger.classList.toggle('active')
		})
	}

	// Obsługa akordeonu dla dropdown w widoku mobilnym
	const accordionItems = document.querySelectorAll('.accordion-item')

	accordionItems.forEach(item => {
		// Znajdź element przycisku toggle wewnątrz bieżącego elementu akordeonu
		const toggle = item.querySelector('.menu-toggle')

		if (toggle) {
			// Dodaj listener do przycisku toggle
			toggle.addEventListener('click', e => {
				e.preventDefault()

				// Zamknij wszystkie inne aktywne dropdowny
				accordionItems.forEach(i => {
					if (i !== item) i.classList.remove('active')
				})

				// Przełącz aktywność klikniętego elementu
				item.classList.toggle('active')
			})
		} else {
			console.warn('Nie znaleziono przycisku toggle dla elementu:', item)
		}
	})
})

document.addEventListener('DOMContentLoaded', () => {
	const iframe = document.getElementById('iframe')
	iframe.addEventListener('load', () => {
		console.log('Iframe loaded successfully')
	})
	iframe.addEventListener('error', () => {
		console.log('Error loading iframe content')
		document.getElementById('menu-file-unavailable').style.display = 'block'
	})
})
