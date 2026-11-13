# Portrait artwork, version 3

Created with the built-in image-generation tool. The identity reference is the existing `public/portrait.png`. These are stylized interpretations of that photograph; likeness still needs the owner's visual judgment.

## Saved project assets

- `public/character/portrait-v3.png` — neutral bust, transparent PNG.
- `public/character/wave-v3.png` — matching open-palm pose, transparent PNG.
- `public/character/peace-v3.png` — matching peace-sign pose, transparent PNG.

The previous artwork is retained. Next.js serves optimized, responsive versions of the new assets. The visible character preloads and decodes its gesture poses before displaying them. CSS keeps each image's intrinsic aspect ratio; the wave hand is clipped into a separate animated layer. All five gestures can be triggered by clicking/tapping the portrait; desktop controls also select wave and peace directly. Escape dismisses the gesture. Idle motion stops offscreen, in a hidden tab, and under reduced motion. Reduced motion retains static pose changes and captions.

## Final prompt set

Neutral portrait (reference: `public/portrait.png`; transparent background enabled):

> Create one premium 3D stylized character portrait for a personal software engineer portfolio, using the provided photo strictly as identity reference. Preserve his actual facial identity: young South Asian man, swept-up black hair, thick dark eyebrows, short neat black beard and mustache, warm medium brown skin, dark eyes. Friendly slight confident smile, wearing a plain black crewneck t-shirt. Front-facing head and upper torso, natural adult proportions, neck and shoulders anatomically normal, no vertical squash, no oversized bobble head. Render like a carefully art directed tactile clay / high quality animated film character with matte surfaces, soft directional studio light. Bust ends at lower chest, both shoulders visible; arms relaxed and hands outside crop. Center subject with 12 percent transparent margin top and sides. Entire background must be genuinely transparent, no circle, no backdrop, no platform, no text, no props, no UI. This replaces a generic clean-shaven white-shirt avatar that did not look like the reference. Deliver a single portrait asset, not a sheet.

Wave (reference: generated neutral portrait; transparent background enabled):

> Edit this portfolio character into a friendly open-palm waving pose, right hand raised beside his face on the viewer's left, five anatomically correct fingers, warm smile. Preserve his exact facial identity, beard, hairstyle, black t-shirt, lighting, rendering style and natural adult proportions. Same front-facing upper torso bust and same head size and registration as reference. Keep top of hair at same vertical point; enough transparent space at the side for entire hand and elbow with nothing clipped. Genuinely transparent background. No text, no circle, no decorations, no extra people. Single isolated portrait asset.

Peace (reference: generated neutral portrait; transparent background enabled):

> Edit this portfolio character into a playful peace-sign pose, right hand raised beside his face on the viewer's left, two fingers raised in V sign, cheerful grin. Preserve his exact facial identity, beard, hairstyle, black t-shirt, lighting, rendering style and natural adult proportions. Same front-facing upper torso bust and same head size and registration as reference. Keep top of hair at same vertical point; enough transparent space at the side for entire hand and elbow with nothing clipped. Genuinely transparent background. No text, no circle, no decorations, no extra people. Single isolated portrait asset.
