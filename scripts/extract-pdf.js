const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

const pdfPath = path.join(__dirname, '..', 'docs', 'Projet  de relance du CCCZOO, A court terme -2.pdf');
const outPath = path.join(__dirname, '..', 'docs', 'Projet_de_relance_text.txt');

(async () => {
    try {
        const dataBuffer = fs.readFileSync(pdfPath);
        const data = await pdf(dataBuffer);
        fs.writeFileSync(outPath, data.text, 'utf8');
        console.log('Extracted text saved to', outPath);
    } catch (err) {
        console.error('Error extracting PDF:', err);
        process.exit(1);
    }
})();
