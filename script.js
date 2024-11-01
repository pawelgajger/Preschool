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

// Po załadowaniu strony dodajemy klasę 'appear' do elementów z klasą 'fade-in-element'
document.addEventListener('DOMContentLoaded', () => {
	const fadeElements = document.querySelectorAll('.fade-in-element')
	fadeElements.forEach(element => {
		element.classList.add('appear')
	})
})

document.addEventListener('DOMContentLoaded', () => {
	const menuItems = document.querySelectorAll('.navbar ul li')
	menuItems.forEach((item, index) => {
		item.style.animationDelay = `${index * 0.2}s` // Automatyczne opóźnienie dla każdego elementu
		item.classList.add('fade-in-element') // Dodaje animację fade-in
	})
})
