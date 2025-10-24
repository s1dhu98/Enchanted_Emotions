# Enchanted Emotions

A small magical-themed UI that asks "How are you feeling today?" and conjures a creature, color theme, and a motivational quote based on the selected emotion.

This is a static, beginner-friendly front-end project (HTML, CSS, JS) designed to feel like a wizard's spellbook: parchment backgrounds, sparkles, animated creatures, and a tiny WebAudio chime.

## Files

- `index.html` — Semantic markup, modal prompt on load, emotion selector, creature display, quote, and the "Click Me" button.
- `style.css` — Magical theme: parchment, gradients, glow, sparkles, emotion palettes, responsive styles and keyframe animations.
- `script.js` — Emotion mapping and interactivity: updates theme/creature/quote, plays a short chime, and animates the creature.

## How to run

1. Open `index.html` in your browser (double-click or use your browser's "Open File" option). No build step required.

Optional: run a simple local static server (helpful for some browsers or if you later add audio/image assets):

PowerShell / Command Prompt:

```powershell
# from project folder
python -m http.server 8000
# then open http://localhost:8000 in your browser
```

## Usage

- On page load you'll see a modal asking "How are you feeling today?" — pick an emotion and click "Choose."  
- The page will update with a themed parchment, a magical creature (emoji), a motivational quote, and the "Click Me" button will include the chosen emotion's emoji.  
- Click the button to hear a short chime and see the creature pulse with a sparkle animation.

## Emotions & Mapping

The app currently supports: `happy`, `sad`, `anxious`, `excited`, `calm`.  
Each maps to:

- creature (emoji + name)
- a short motivational quote
- background/color palette and UI accents

You can change or add emotions in `script.js` by editing the `EMOTIONS` object.

## Fonts

Two Google fonts are referenced in `index.html`:

- Cinzel Decorative — for headings and decorative text
- Mystery Quest — for the modal title

These are loaded from Google Fonts; if you need offline usage, replace them with local fonts or webfont files.

## Accessibility & Behaviour Notes

- Keyboard friendly: the modal select can be used with keyboard and Enter will confirm.  
- ARIA labels and focus management added to improve assistive tech behavior.  
- Audio uses the WebAudio API for a synthesized chime (no external audio files). Some browsers require a user gesture before audio is allowed — interacting with the page (Choose / Click) enables audio playback.

## Customization ideas

- Replace emoji with inline SVG illustrations for higher fidelity visuals.  
- Add per-emotion background images or particle systems.  
- Add toggles for ambient music, sound volume control, or an accessibility high-contrast mode.

## License & Credits

This project is intentionally small and free to modify. No external assets (images/sounds) are bundled. Fonts are loaded from Google Fonts and emoji are standard system emoji. Use and adapt as you like.

---

If you want, I can:
- swap emoji for SVG creature illustrations and add subtle motion (floating, wings flapping), or
- add a small README section with development commands and a one-click preview script.
