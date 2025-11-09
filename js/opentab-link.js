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

class OpenTabLink extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
		const shadow = this.attachShadow({ mode: 'open' });

		const li = document.createElement('li');
		const content = this.textContent;
		const tabTitle = this.dataset.tabtitle;
		const tabId = Number(this.dataset.tabid);
		const windowId = Number(this.dataset.windowid);
		const link = this.wrapInLink(windowId, tabId, content, tabTitle);
		this.textContent = '';
		// const div = document.createElement('label');
		li.appendChild(link);
		// div.classList.add('linkContainer');
		// div.appendChild(link);

		// Add checkbox
		const checkbox = document.createElement('input');
		checkbox.type = 'checkbox';
		checkbox.name = 'completed';
		checkbox.addEventListener('input', (e) => {
			checkbox.parentNode.classList.toggle('completed');
		});

		li.prepend(this.getGroupPill(this.dataset));
		li.prepend(checkbox);
		const styleTag = this.createStyles();
		shadow.prepend(styleTag);

		this.classList.add('opentab-link');
		shadow.appendChild(li);
	}

	createStyles() {
		const style = document.createElement('style');
		style.textContent = `
			input[type='checkbox'] {
				margin-right: 10px;
				position: relative;
				top: 2px;
			}
			.linkContainer {
				display: flex;
				align-items: flex-start;
			}
			li {
				align-items: flex-start;
				margin-top: 0.5em;
				display: list-item;
			}
			opentab-link.completed li {
				text-decoration: line-through;
			}
			a,
			a:visited {
				color: blue;
				color: #0366d6;
				text-decoration: none;
			}
			a:hover,
			a:focus {
				text-decoration: underline;
			}
			li:first-child {
				margin-top: 0;
			}
			.groupPill {
				margin: 2px 0;
				margin-right: 10px;
				color: white;
				font-size: 12px;
				padding: 2px 6px;
				border-radius: 4px;
			}
		`;
		return style;
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

	getGroupPill(dataset) {
		const { group: groupTitle, groupcolor } = dataset;
		if (groupTitle === 'undefined') {
			return '';
		}
		const span = document.createElement('span');
		span.classList.add('groupPill', groupcolor);
		span.style.background = colorMap.hasOwnProperty(groupcolor) ? colorMap[groupcolor] : groupcolor;
		span.textContent = groupTitle;
		return span;
	}
}

// Define the new element
customElements.define('opentab-link', OpenTabLink);
