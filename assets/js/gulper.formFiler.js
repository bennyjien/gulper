// formFiler.js: custom form input file
/* EXAMPLE
	formFiler(`.js-form-file`);
	<div class="form-file js-form-file">
		<label class="form-file-heading" for="file-attachment">File</label>
		<div class="form-file-field">
			<input type="file" id="file-attachment" class="input" name="file-attachment" data-multiple-placeholder="{count} files selected" multiple>
			<label for="file-attachment" class="label"><span class="button">Browse files</span> <span class="placeholder">No file selected&hellip;</span> <a href="#" class="remove" title="Remove attachment">&times;</a></label>
		</div>
	</div>
*/

function formFiler(selector) {
	const formFileEl = document.querySelectorAll(selector);

	formFileEl.forEach(element => {
		const fileFieldEl = element.querySelector(`.form-file-field`),
			inputEl = fileFieldEl.querySelector(`.input`),
			labelEl = fileFieldEl.querySelector(`.label`),
			removeEl = fileFieldEl.querySelector(`.remove`),
			placeholderEl = labelEl.querySelector(`.placeholder`),
			labelDefault = placeholderEl.innerHTML;

		function addFile(thisEl, event) {
			let filesEl = thisEl.files,
				fileName = ``,
				fileSize = 0;

			for (let file of filesEl) {
				fileSize += file.size;
			}
			fileSize = Math.round(fileSize/1024/1024 * 100) / 100;

			if (thisEl.files && thisEl.files.length > 1) {
				fileName = `${(thisEl.getAttribute(`data-multiple-placeholder`) || ``).replace(`{count}`, thisEl.files.length)} (${fileSize}MB)`;
			} else if (event.target.value) {
				fileName = `${event.target.value.split(`\\`).pop()} <span class="filesize">(${fileSize}MB)</span>`;
			}

			if (fileName) {
				placeholderEl.innerHTML = fileName;
				labelEl.classList.add(`has-placeholder`);
			} else {
				removeFile(event);
			}
		}

		function removeFile(event) {
			inputEl.value = ``;
			placeholderEl.innerHTML = labelDefault;
			labelEl.classList.remove(`has-placeholder`);
			event.preventDefault();
		}

		inputEl.addEventListener(`change`, function(event) {
			addFile(this, event);
		});

		if (removeEl) {
			removeEl.addEventListener(`click`, function(event) {
				removeFile(event);
			});
		}
	});
}

formFiler.version = `1.0.0`;
