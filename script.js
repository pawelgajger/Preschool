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

// Po załadowaniu strony dodaj klasę 'appear' do elementów z klasą 'fade-in-element'
document.addEventListener('DOMContentLoaded', () => {
	const fadeElements = document.querySelectorAll('.fade-in-element')
	fadeElements.forEach(element => {
		element.classList.add('appear')
	})
})
