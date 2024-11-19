document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('signature-pad');
    const ctx = canvas.getContext('2d');
    let isDrawing = false;

    // Draw signature
    canvas.addEventListener('mousedown', () => (isDrawing = true));
    canvas.addEventListener('mouseup', () => (isDrawing = false));
    canvas.addEventListener('mousemove', (event) => {
        if (!isDrawing) return;
        const rect = canvas.getBoundingClientRect();
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = 'black';
        ctx.lineTo(event.clientX - rect.left, event.clientY - rect.top);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(event.clientX - rect.left, event.clientY - rect.top);
    });

    // Clear signature
    document.getElementById('clear-signature').addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    // Save signed PDF
    document.getElementById('submit-btn').addEventListener('click', async () => {
        const name = document.getElementById('name').value;
        const signatureDataURL = canvas.toDataURL();

        // Load and modify the PDF
        const existingPdfBytes = await fetch('sample.pdf').then((res) => res.arrayBuffer());
        const pdfDoc = await PDFLib.PDFDocument.load(existingPdfBytes);
        const page = pdfDoc.getPages()[0];

        // Embed the signature and name
        const signatureImage = await pdfDoc.embedPng(signatureDataURL);
        page.drawText(name, { x: 50, y: 500, size: 20 });
        page.drawImage(signatureImage, { x: 50, y: 400, width: 200, height: 50 });

        // Save the signed PDF
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'signed-document.pdf';
        link.click();
    });
    emailjs.send('service_qvekojb', 'template_id', {
    name: name,
    signed_pdf: pdfBytes,
});

});
