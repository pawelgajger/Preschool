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
			console.log(folder)
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

async function fetchDocx() {
	try {
		console.log('Rozpoczynam pobieranie pliku...')
		const response = await fetch('/files/menu.docx')
		if (!response.ok) throw new Error('Nie można wczytać pliku menu.')
		console.log('Plik został pomyślnie pobrany.')

		const arrayBuffer = await response.arrayBuffer()
		console.log('Pobrano dane w formie ArrayBuffer.')

		mammoth
			.convertToHtml({ arrayBuffer: arrayBuffer })
			.then(result => {
				console.log('Konwersja zakończona sukcesem.')
				displayMenu(result.value)
			})
			.catch(error => {
				console.error('Błąd konwersji:', error)
			})
	} catch (error) {
		console.error('Błąd wczytywania pliku:', error)
	}
}
