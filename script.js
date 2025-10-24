/* Enchanted Emotions — script.js
	 - Shows a modal on load asking "How are you feeling today?"
	 - Updates page theme, creature, quote and button emoji based on emotion
	 - Plays a short magical chime using WebAudio on button click
*/

const EMOTIONS = {
	happy: {
		creatureEmoji: '🦄',
		creatureName: 'Unicorn',
		quotes: [
			'"Joy is a little spell — may it sparkle around you today."',
			'"Laughter is a lantern; carry it gently."',
			'"Your smile weaves light into the room."',
			'"May small wonders find you this hour."',
			'"Share a giggle, and the world lightens."'
		],
		buttonEmoji: '😊'
	},
	sad: {
		creatureEmoji: '🦉',
		creatureName: 'Wise Owl',
		quotes: [
			'"It is okay to be still — soft nights bring new mornings."',
			'"Tears water a quieter strength; hold that kindly."',
			'"Even moons rest — give yourself the same grace."',
			'"A small breath. One step. The rest may follow."',
			'"Let the hush of night mend what the day could not."'
		],
		buttonEmoji: '😔'
	},
	anxious: {
		creatureEmoji: '🔥',
		creatureName: 'Phoenix',
		quotes: [
			'"Breathe like a slow tide. Each small breath is a quiet spell."',
			'"Anchor to a single heartbeat; breathe, then move."',
			'"Tiny steps are still progress — honor them."',
			'"A steady flame outshines a frantic spark."',
			'"Count to four, then four again. Repeat — you are here."'
		],
		buttonEmoji: '😰'
	},
	excited: {
		creatureEmoji: '🐲',
		creatureName: 'Dragon',
		quotes: [
			'"Carry this ember of excitement — let it brighten new doors."',
			'"Let the curiosity lead; surprises will follow."',
			'"Today is a page — write a bold line."',
			'"Sparkles herald new beginnings; step toward them."',
			'"Turn your eagerness into a playful magic."'
		],
		buttonEmoji: '🤩'
	},
	calm: {
		creatureEmoji: '🦅',
		creatureName: 'Forest Hawk',
		quotes: [
			'"Stillness holds gentle power. You are steady and enough."',
			'"One slow breath can hold a whole horizon."',
			'"Beneath quiet waters, currents carry you onward."',
			'"Find the quiet corner of your mind and rest there."',
			'"Soft moments are full of steady magic."'
		],
		buttonEmoji: '😌'
	},
	hopeful: {
		creatureEmoji: '🌟',
		creatureName: 'Star Sprite',
		quotes: [
			'"Hope is a compass — follow its gentle pull."',
			'"Small lights guide large journeys; trust them."',
			'"Tomorrow holds a parcel of possibilities."',
			'"Plant a wish and water it with kind thoughts."',
			'"Keep a lantern for the path you want to take."'
		],
		buttonEmoji: '🌟'
	},
	playful: {
		creatureEmoji: '🧚',
		creatureName: 'Pixie',
		quotes: [
			'"Mirth is a mischievous spell — cast it freely."',
			'"Find the funny, and the day lightens."',
			'"A little mischief can untangle a heavy knot."',
			'"Dance with a leaf and learn its secret joy."',
			'"Play is the apprentice of wonder."'
		],
		buttonEmoji: '🧚'
	},
	tired: {
		creatureEmoji: '🐢',
		creatureName: 'Tortoise',
		quotes: [
			'"Rest is part of the spell — take it without guilt."',
			'"Slow is a valid speed; it carries you well."',
			'"Lay down the armor for a while; softness heals."',
			'"A brief pause rewrites the rest of the story."',
			'"Close your eyes, breathe, return when you are ready."'
		],
		buttonEmoji: '💤'
	},
	angry: {
		creatureEmoji: '🐺',
		creatureName: 'Wolf',
		quotes: [
			'"Anger is a signal — listen, then choose a gentle reply."',
			'"Let the heat pass through; do not forge from it alone."',
			'"Name the fire, and it no longer hides from you."',
			'"Your feelings are true; guide them with kind hands."',
			'"Breathe, step back, then speak the truth you mean to keep."'
		],
		buttonEmoji: '🐺'
	},
	nostalgic: {
		creatureEmoji: '🍂',
		creatureName: 'Autumn Wisp',
		quotes: [
			'"Memories are warm embers — hold them like gifts."',
			'"The past paints with golden light; let it teach gently."',
			'"Carry what serves you and leave what weighs you down."',
			'"Savor the sweet thread; it weaves who you are."',
			'"Old seasons taught you; new ones await."'
		],
		buttonEmoji: '🍂'
	}
};

// Quote manager: per-emotion shuffled queues to avoid repeats until exhausted
class QuoteManager{
	constructor(map){
		this.original = {};
		this.queues = {};
		Object.keys(map).forEach(k => {
			const arr = map[k].quotes ? Array.from(map[k].quotes) : [];
			this.original[k] = arr.slice();
			this.queues[k] = this._shuffle(arr.slice());
		});
		this.last = {};
	}

	_shuffle(arr){
		for(let i = arr.length -1; i>0; i--){
			const j = Math.floor(Math.random()*(i+1));
			[arr[i], arr[j]] = [arr[j], arr[i]];
		}
		return arr;
	}

	next(emotion){
		if(!this.queues[emotion] || this.queues[emotion].length === 0){
			// refill and reshuffle
			this.queues[emotion] = this._shuffle(this.original[emotion].slice());
		}
		if(!this.queues[emotion] || this.queues[emotion].length === 0) return '';
		let candidate = this.queues[emotion].shift();
		// avoid immediate repeat
		if(this.last[emotion] && candidate === this.last[emotion]){
			// if there's another candidate, rotate it
			if(this.queues[emotion].length > 0){
				this.queues[emotion].push(candidate);
				candidate = this.queues[emotion].shift();
			}
		}
		this.last[emotion] = candidate;
		return candidate;
	}
}

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

		// Play varied wizardy chimes using WebAudio
		let audioCtx = null;
		const SOUND_PRESETS = [
			// bright bell arpeggio
			{type:'sine', freqs:[660,880,1320], times:[0,0.12,0.28], dur:1.1},
			// mellow rising chime
			{type:'triangle', freqs:[440,660], times:[0,0.18], dur:1.2},
			// sparkly double-tone
			{type:'sine', freqs:[880,740,990], times:[0,0.06,0.22], dur:0.9},
			// deep resonant bell
			{type:'sawtooth', freqs:[220,330,440], times:[0,0.16,0.36], dur:1.6}
		];

		function playChime(presetIndex = null){
			try{
				if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
				const now = audioCtx.currentTime;
				const preset = presetIndex !== null ? SOUND_PRESETS[presetIndex % SOUND_PRESETS.length] : SOUND_PRESETS[Math.floor(Math.random()*SOUND_PRESETS.length)];
				const master = audioCtx.createGain();
				master.gain.setValueAtTime(0.0001, now);
				master.gain.exponentialRampToValueAtTime(0.2, now + 0.02);
				master.connect(audioCtx.destination);

				preset.freqs.forEach((f, i) => {
					const osc = audioCtx.createOscillator();
					const g = audioCtx.createGain();
					osc.type = preset.type;
					osc.frequency.setValueAtTime(f, now + (preset.times[i] || 0));
					g.gain.setValueAtTime(0.0001, now + (preset.times[i] || 0));
					g.gain.exponentialRampToValueAtTime(0.12, now + (preset.times[i] || 0) + 0.02);
					g.gain.exponentialRampToValueAtTime(0.0001, now + preset.dur);
					osc.connect(g); g.connect(master);
					osc.start(now + (preset.times[i] || 0));
					osc.stop(now + preset.dur + 0.05);
				});

				// master fade out
				master.gain.exponentialRampToValueAtTime(0.0001, now + preset.dur + 0.1);
			}catch(err){
				// no audio available
			}
		}

	// Click behavior: play chime and animate creature
		clickBtn.addEventListener('click', () => {
			// animate creature
			creature.classList.remove('pulse','sparkle');
			void creature.offsetWidth;
			creature.classList.add('pulse','sparkle');

			// change quote (no immediate repeats thanks to QuoteManager)
			const currentEmotion = dockSelect.value || modalSelect.value || 'happy';
			const nextQuote = quoteManager.next(currentEmotion);
			if(nextQuote){
				quote.textContent = nextQuote;
			}

			// play a chime chosen by emotion (map to a preset index for subtle variety)
			const emotionIndex = Object.keys(EMOTIONS).indexOf(currentEmotion);
			const presetIndex = emotionIndex >= 0 ? emotionIndex % SOUND_PRESETS.length : null;
			playChime(presetIndex);

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
		// build quote manager after EMOTIONS is known
		window.quoteManager = new QuoteManager(EMOTIONS);
	// Focus the select in modal so keyboard users can pick quickly
	modal.style.display = 'flex';
	modalSelect.focus();
});

