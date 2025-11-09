const colorMap = {
	grey: '#706d6b',
	blue: '#3474ec',
	red: '#d02d1d',
	yellow: '#f3aa00',
	green: '#358e3a',
	pink: '#dc2393',
	purple: '#9036e9',
	cyan: '#40b6cd',
	orange: '#e06f00',
};

class OpenTabLink extends HTMLIElement {
	constructor() {
		super();
	}

	connectedCallback() {
		const content = this.textContent;
		const tabTitle = this.dataset.tabtitle;
		const tabId = Number(this.dataset.tabid);
		const windowId = Number(this.dataset.windowid);
		const link = this.wrapInLink(windowId, tabId, content, tabTitle);
		this.textContent = '';
		this.appendChild(link);

		// Add checkbox
		const checkbox = document.createElement('input');
		checkbox.type = 'checkbox';
		checkbox.name = 'completed';
		checkbox.addEventListener('input', (e) => {
			checkbox.parentNode.classList.toggle('completed');
		});

		this.prepend(checkbox);

		this.classList.add('opentab-link');
	}

	wrapInLink(windowId, tabId, href, text) {
		const a = document.createElement('a');
		a.href = href;
		if (text !== '') {
			a.textContent = text;
		} else {
			a.textContent = href;
		}
		a.onclick = (e) => {
			e.preventDefault();
			browser.windows.update(windowId, { focused: true });
			browser.tabs.update(tabId, { active: true });
		};

		return a;
	}
}

// Define the new element
customElements.define('opentab-link', OpenTabLink, { extends: 'li' });
