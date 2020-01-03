// formSetter.js: mark if input form is filled; show password; and support Pikaday
// TODO: check if pikaday exist to run related function
/* EXAMPLE
	formSetter(`.js-form-input`);
*/

/* global Pikaday */

function formSetter(selector) {
	const formLabelEl = document.querySelectorAll(selector);

	formLabelEl.forEach(element => {
		let inputEl = element.querySelectorAll(`.input`);

		inputEl.forEach(input => {
			input.addEventListener(`focus`, function() {
				this.parentNode.classList.add(`is-filled`);
			});

			input.addEventListener(`blur`, function() {
				var input = this;
				setTimeout(function() {
					if (input.value === ``) input.parentNode.classList.remove(`is-filled`);
				}, 100);
			});

			window.addEventListener(`load`, function() {
				const parent = input.closest(`.form-input-field`);

				if (parent) {
					parent.classList.add(`is-loaded`);
					if (input.value) {
						parent.classList.add(`is-filled`);
					}
				}
			});

			// show password
			const passwordInputEl = element.querySelector(`.form-input-password .input`),
				passwordShowerEl = element.querySelector(`.form-input-password .action`);

			function showPassword() {
				if (passwordInputEl.type === `password`) {
					passwordInputEl.type = `text`;
				} else {
					passwordInputEl.type = `password`;
				}
			}

			if (passwordShowerEl) {
				passwordShowerEl.addEventListener(`click`, function(event) {
					showPassword();
					event.preventDefault();
				});
			}

			// pikaday support
			const inputDateEl = element.querySelector(`.form-input-date`);

			if (inputDateEl) {
				const fieldInputEl = inputDateEl.querySelector(`.input`);
				let dateFormat = fieldInputEl.dataset.dateFormat ? fieldInputEl.dataset.dateFormat : `DD-MM-YYYY`;

				new Pikaday({
					field: fieldInputEl,
					format: dateFormat,
					minDate: new Date()
				});
			}
		});

	});
}

formSetter.version = `1.0.0`;
