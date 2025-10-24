/* Enchanted Emotions — script.js
	 - Shows a modal on load asking "How are you feeling today?"
	 - Updates page theme, creature, quote and button emoji based on emotion
	 - Plays a short magical chime using WebAudio on button click
*/

const EMOTIONS = {
	happy: {
		creatureEmoji: '🦄',
		creatureName: 'Unicorn',
		quote: '"Joy is a little spell — may it sparkle around you today."',
		buttonEmoji: '😊'
	},
	sad: {
		creatureEmoji: '🦉',
		creatureName: 'Wise Owl',
		quote: '"It is okay to be still — soft nights bring new mornings."',
		buttonEmoji: '😔'
	},
	anxious: {
		creatureEmoji: '🔥',
		creatureName: 'Phoenix',
		quote: '"Breathe like a slow tide. Each small breath is a quiet spell."',
		buttonEmoji: '😰'
	},
	excited: {
		creatureEmoji: '🐲',
		creatureName: 'Dragon',
		quote: '"Carry this ember of excitement — let it brighten new doors."',
		buttonEmoji: '🤩'
	},
	calm: {
		creatureEmoji: '🦅',
		creatureName: 'Forest Hawk',
		quote: '"Stillness holds gentle power. You are steady and enough."',
		buttonEmoji: '😌'
	}
};

// Small helper to safely query elements
const $ = (s) => document.querySelector(s);

document.addEventListener('DOMContentLoaded', () => {
	const modal = $('#moodModal');
	const modalSelect = $('#emotionSelect');
	const confirmBtn = $('#confirmEmotion');
	const dockSelect = $('#emotionSelectDock');
	const clickBtn = $('#clickMe');
	const creature = $('#creature');
	const creatureName = $('#creatureName');
	const quote = $('#quote');

	// Keep selects in sync
	function setSelects(value){
		modalSelect.value = value;
		dockSelect.value = value;
	}

	function updateUI(emotion){
		if(!EMOTIONS[emotion]) return;
		const data = EMOTIONS[emotion];
		// body class for palettes
		document.body.classList.remove(...Object.keys(EMOTIONS));
		document.body.classList.add(emotion);

		// creature
		creature.textContent = data.creatureEmoji;
		creatureName.textContent = data.creatureName;
		quote.textContent = data.quote;

		// button emoji
		clickBtn.textContent = `${data.buttonEmoji} Click Me`;

		// sync selects
		setSelects(emotion);
		// announce change for assistive tech
		clickBtn.setAttribute('aria-label', `${emotion} — ${data.creatureName} — ${data.quote}`);
	}

	// Modal confirm or initial choice
	confirmBtn.addEventListener('click', () => {
		const val = modalSelect.value || 'happy';
		updateUI(val);
		modal.style.display = 'none';
		// focus the click button for quick interaction
		$('#clickMe').focus();
	});

	// Dock select change
	dockSelect.addEventListener('change', (e) => updateUI(e.target.value));

	// Play a short chime using WebAudio API
	let audioCtx = null;
	function playChime(){
		try{
			if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
			const now = audioCtx.currentTime;
			const o = audioCtx.createOscillator();
			const gain = audioCtx.createGain();
			o.type = 'sine';
			// gentle ascending tone
			o.frequency.setValueAtTime(440, now);
			o.frequency.exponentialRampToValueAtTime(880, now + 0.22);
			gain.gain.setValueAtTime(0, now);
			gain.gain.linearRampToValueAtTime(0.15, now + 0.02);
			gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);
			o.connect(gain);
			gain.connect(audioCtx.destination);
			o.start(now);
			o.stop(now + 1.5);
		}catch(err){
			// WebAudio not available — silent fallback
		}
	}

	// Click behavior: play chime and animate creature
	clickBtn.addEventListener('click', () => {
		// small animation
		creature.classList.remove('pulse','sparkle');
		// force reflow then add to restart animation
		void creature.offsetWidth;
		creature.classList.add('pulse','sparkle');

		// play chime
		playChime();

		// subtle additional feedback: lighten quote background briefly
		quote.style.transition = 'box-shadow .35s ease, transform .35s ease';
		quote.style.transform = 'translateY(-6px)';
		quote.style.boxShadow = `0 10px 30px rgba(0,0,0,0.08)`;
		setTimeout(()=>{
			quote.style.transform = '';
			quote.style.boxShadow = '';
		}, 520);
	});

	// close modal when user hits Enter on modal select (nice keyboard UX)
	modalSelect.addEventListener('keydown', (ev)=>{
		if(ev.key === 'Enter') confirmBtn.click();
	});

	// Initialize: show modal and preselect happy
	setSelects('happy');
	updateUI('happy');
	// Focus the select in modal so keyboard users can pick quickly
	modal.style.display = 'flex';
	modalSelect.focus();
});

