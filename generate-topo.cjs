const fs = require('fs');

const width = 1200;
const height = 1200;
const cx = width / 2;
const cy = height / 2;

function generateSVG(color, filename) {
    let paths = [];

    // Generate 30 concentric rings, spaced widely
    for (let i = 1; i <= 30; i++) {
        const radius = i * 25; // Large spacing
        let path = `M `;
        const points = 120;
        
        for (let j = 0; j <= points; j++) {
            const angle = (j / points) * Math.PI * 2;
            
            // Smoother, larger wave offsets
            const wave = Math.sin(angle * 5 + i * 0.4) * 8 + 
                         Math.cos(angle * 3 - i * 0.3) * 6 +
                         Math.sin(angle * 8 + i) * 3;
                         
            const r = radius + wave;
            
            const x = cx + Math.cos(angle) * r;
            const y = cy + Math.sin(angle) * r;
            
            if (j === 0) {
                path += `${x.toFixed(2)} ${y.toFixed(2)} `;
            } else {
                path += `L ${x.toFixed(2)} ${y.toFixed(2)} `;
            }
        }
        
        // Close path
        path += `Z`;
        // Use the passed color, stroke-width a bit thicker since it's large
        paths.push(`<path d="${path}" fill="none" stroke="${color}" stroke-width="2.5" />`);
    }

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
        <g>
            ${paths.join('\n            ')}
        </g>
    </svg>`;

    fs.writeFileSync(`public/cdn/${filename}`, svg);
    console.log(`Successfully generated ${filename}`);
}

generateSVG('#2563EB', 'topography-blue.svg');
generateSVG('#FFFFFF', 'topography-white.svg');
