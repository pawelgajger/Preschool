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

// Zmienna przechowująca obrazy z bieżącego folderu, indeks bieżącego obrazu i nazwę folderu
let currentFolder = []
let currentIndex = 0
let currentFolderName = ''

// Funkcja do otwierania pełnoekranowego widoku z możliwością nawigacji
function openFullscreen(imageUrl, imagesArray = [], index = 0, folderName = '') {
	currentFolder = imagesArray
	currentIndex = index
	currentFolderName = folderName

	const fullscreenView = document.getElementById('fullscreen-view')
	const fullscreenImg = document.getElementById('fullscreen-img')

	fullscreenImg.src = imageUrl
	fullscreenView.style.display = 'flex'
	document.body.classList.add('fullscreen-active')
	document.querySelector('footer').style.display = 'none' // Ukrycie stopki
}

// Funkcja zamykająca pełnoekranowy widok
function closeFullscreen() {
	const fullscreenView = document.getElementById('fullscreen-view')
	fullscreenView.style.display = 'none'
	document.body.classList.remove('fullscreen-active')
	document.querySelector('footer').style.display = 'block' // Przywrócenie stopki
}

// Funkcje do zmiany zdjęć
function showNextImage(event) {
	event.stopPropagation() // Zatrzymanie eventu, aby nie zamknąć pełnoekranowego widoku
	currentIndex = (currentIndex + 1) % currentFolder.length
	document.getElementById('fullscreen-img').src = `images/${currentFolderName}/${currentFolder[currentIndex]}`
}

function showPreviousImage(event) {
	event.stopPropagation() // Zatrzymanie eventu, aby nie zamknąć pełnoekranowego widoku
	currentIndex = (currentIndex - 1 + currentFolder.length) % currentFolder.length
	document.getElementById('fullscreen-img').src = `images/${currentFolderName}/${currentFolder[currentIndex]}`
}

// Ładowanie folderów z pliku JSON
fetch('gallery.json')
	.then(response => response.json())
	.then(data => {
		const foldersContainer = document.getElementById('folders-container')
		data.folders.forEach(folder => {
			const folderElement = document.createElement('div')
			folderElement.className = 'folder-icon'
			folderElement.innerHTML = `
                <div class="folder-image">📁</div>
                <p>${folder.name}</p>
            `
			folderElement.onclick = () => openGallery(folder)
			foldersContainer.appendChild(folderElement)
		})
	})

function openGallery(folder) {
	const galleryView = document.getElementById('gallery-view')
	const galleryContainer = document.getElementById('gallery')
	const folderName = document.getElementById('folder-name')

	// Ustaw nazwę folderu i wyczyść poprzednie obrazy
	folderName.innerText = folder.name
	galleryContainer.innerHTML = ''

	// Załaduj obrazy z wybranego folderu
	folder.images.forEach((image, index) => {
		const imgElement = document.createElement('img')
		imgElement.src = `images/${folder.name}/${image}`
		imgElement.className = 'gallery-item'
		imgElement.alt = folder.name
		imgElement.onclick = () => openFullscreen(imgElement.src, folder.images, index, folder.name)
		galleryContainer.appendChild(imgElement)
	})

	// Pokaż galerię i ukryj foldery
	document.getElementById('folders-container').style.display = 'none'
	galleryView.style.display = 'block'
}

// Funkcja do powrotu do widoku folderów
function closeGallery() {
	document.getElementById('gallery-view').style.display = 'none'
	document.getElementById('folders-container').style.display = 'flex'
}

// Wyłączenie kliknięcia prawym przyciskiem myszy
document.addEventListener('contextmenu', function (e) {
	e.preventDefault()
})

document.addEventListener('keydown', function (e) {
	// Blokowanie "Ctrl + C", "Ctrl + X", "Ctrl + U" i "Ctrl + S"
	if (e.ctrlKey && (e.key === 'c' || e.key === 'x' || e.key === 'u' || e.key === 's')) {
		e.preventDefault()
	}
})

document.querySelectorAll('img').forEach(img => {
	img.addEventListener('dragstart', function (e) {
		e.preventDefault()
	})
})

// Funkcja sprawdzająca dostępność pliku
async function checkFileExists(url) {
	try {
		const response = await fetch(url, { method: 'HEAD' })
		return response.ok // Zwraca true, jeśli plik istnieje
	} catch (error) {
		console.error('Błąd podczas sprawdzania pliku:', error)
		return false // Zwraca false, jeśli wystąpił błąd
	}
}

// Funkcja do wyświetlania linku lub treści z pliku aktualności
async function fetchAndDisplayNews(newsFileUrl, newsContentDiv, newsUnavailableMessage) {
	if (!newsContentDiv || !newsUnavailableMessage) return

	try {
		const response = await fetch(newsFileUrl, { method: 'GET', cache: 'no-cache' })
		if (!response.ok) {
			newsUnavailableMessage.style.display = 'block'
			newsContentDiv.style.display = 'none'
			return
		}

		const arrayBuffer = await response.arrayBuffer()
		const result = await mammoth.convertToHtml({ arrayBuffer: arrayBuffer })
		newsContentDiv.innerHTML = `<table class="news-table"><tbody>${result.value}</tbody></table>`
		newsUnavailableMessage.style.display = 'none'
	} catch (error) {
		console.error('Błąd podczas wczytywania pliku aktualności:', error)
		newsUnavailableMessage.style.display = 'block'
	}
}

// Funkcja do wyświetlania linku lub treści z pliku menu
async function fetchAndDisplayMenu(menuFileUrl, menuContentDiv, menuUnavailableMessage) {
	if (!menuContentDiv || !menuUnavailableMessage) return

	try {
		const response = await fetch(menuFileUrl, { method: 'GET', cache: 'no-cache' })
		if (!response.ok) {
			menuUnavailableMessage.style.display = 'block'
			menuContentDiv.style.display = 'none'
			return
		}

		const arrayBuffer = await response.arrayBuffer()
		const result = await mammoth.convertToHtml({ arrayBuffer: arrayBuffer })
		menuContentDiv.innerHTML = `<table class="menu-table"><tbody>${result.value}</tbody></table>`
		menuUnavailableMessage.style.display = 'none'
	} catch (error) {
		console.error('Błąd podczas wczytywania pliku menu:', error)
		menuUnavailableMessage.style.display = 'block'
	}
}

// Funkcja do wyświetlania linku do pobrania dokumentów
async function displayDocumentLink(documentFileUrl, documentsContent, documentsUnavailableMessage) {
	if (!documentsContent || !documentsUnavailableMessage) return

	try {
		const fileExists = await checkFileExists(documentFileUrl)
		if (fileExists) {
			documentsContent.style.display = 'block'
			documentsUnavailableMessage.style.display = 'none'
		} else {
			documentsContent.style.display = 'none'
			documentsUnavailableMessage.style.display = 'block'
		}
	} catch (error) {
		console.error('Błąd podczas sprawdzania pliku dokumentów:', error)
		documentsContent.style.display = 'none'
		documentsUnavailableMessage.style.display = 'block'
	}
}

// Funkcja uruchamiana po załadowaniu strony
function initialize() {
	const newsFileUrl = 'files/aktualnosci.docx'
	const menuFileUrl = 'files/menu.docx'
	const documentFileUrl = 'files/dokumenty.docx'

	const newsContentDiv = document.getElementById('news-content')
	const newsUnavailableMessage = document.getElementById('news-file-unavailable')
	fetchAndDisplayNews(newsFileUrl, newsContentDiv, newsUnavailableMessage)

	const menuContentDiv = document.getElementById('menu-content')
	const menuUnavailableMessage = document.getElementById('menu-file-unavailable')
	fetchAndDisplayMenu(menuFileUrl, menuContentDiv, menuUnavailableMessage)

	const documentsContent = document.getElementById('documents-content')
	const documentsUnavailableMessage = document.getElementById('documents-unavailable')
	displayDocumentLink(documentFileUrl, documentsContent, documentsUnavailableMessage)
}

// Wywołanie wszystkich funkcji po załadowaniu strony
window.addEventListener('DOMContentLoaded', initialize)
