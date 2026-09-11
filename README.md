# Inside Objects

Inside Objects is an interactive 3D collection revealing the components inside everyday technology. Rotate, unfold, and explore simplified studies of the Oura Ring 4 and iPhone 16 Pro.

The project is a small, forkable experiment for people who like product design, reverse engineering, and making ordinary objects feel curious again.

## Run locally

Requires Node.js `>=22.13.0`.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. The interactive 3D experience runs in the browser.

## Project structure

- `app/` contains the page, interaction surface, and visual system.
- `lib/object-engine.ts` contains the Three.js scene and camera controls.
- `lib/products.ts` defines the collection, parts, and explanatory copy.
- `public/favicon.svg` contains the project mark.

## Contributing

Fork it, make the collection stranger or more useful, and open a pull request if you want to share the result. New objects, clearer component explanations, and thoughtful interaction improvements are especially welcome.

## Notes

The models are original, illustrative 3D studies, not manufacturer CAD or a complete inventory of every fastener and circuit element. Shapes, positions, and separation are intentionally simplified for exploration.
