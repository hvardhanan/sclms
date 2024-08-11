import jsPDF from 'jspdf';

const generatePDF = (lights) => {
  const doc = new jsPDF();
  
  doc.setFontSize(16);
  doc.text('Faulty and Fluctuating Lights List', 20, 20);
  
  doc.setFontSize(12);
  const headers = ['ID', 'Date of Fixing', 'Intensity', 'Status', 'Location'];
  let yPosition = 30; // Starting vertical position for text
  
  // Draw table headers
  doc.text(headers.join(' | '), 20, yPosition);
  yPosition += 10; // Move down for the next line
  
  // Draw table data
  lights.forEach((light) => {
    const row = [
      light.id,
      light.dateOfFixing,
      light.intensity,
      light.workingCondition,
      light.location
    ];
    
    // Create text content for each row and add it to the PDF
    row.forEach((item, index) => {
      doc.text(String(item), 20 + index * 40, yPosition); // Adjust xPosition for each column
    });
    
    yPosition += 10; // Move down for the next row
  });

  doc.save('faulty_and_fluctuating_lights.pdf');
};

export default generatePDF;
