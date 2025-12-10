import PDFDocument from "pdfkit";

class PdfGenerator {
  generateMissionOrder(trip) {
    const doc = new PDFDocument();
    ///////////////////////
    doc.fontSize(20).text("LOGFLEET - ORDRE DE MISSION", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Référence Trajet: ${trip._id}`);
    doc.text(`Date d'émission: ${new Date().toLocaleDateString()}`);
    doc.moveDown();
    //////////////////////
    doc.rect(50, 150, 500, 100).stroke();
    doc.text(
      `Chauffeur: ${trip.driverId.firstName} ${trip.driverId.lastName}`,
      60,
      160
    );
    doc.text(
      `Camion: ${trip.truckId.make} ${trip.truckId.model} (${trip.truckId.licensePlate})`,
      60,
      180
    );
    if (trip.trailerId) {
      doc.text(`Remorque: ${trip.trailerId.licensePlate}`, 60, 200);
    }
    /////////////////////
    doc.moveDown(5);
    doc.fontSize(14).text("Détails du Trajet", { underline: true });
    doc.fontSize(12).text(`Départ: ${trip.departureLocation}`);
    doc.text(`Arrivée: ${trip.arrivalLocation}`);
    doc.text(`Date prévue: ${new Date(trip.startDate).toLocaleDateString()}`);
    doc.moveDown();
    doc.text(
      "Instructions: Veuillez remplir le kilométrage et le carburant à la fin du trajet.",
      { oblique: true }
    );
    return doc;
  }
}

export default new PdfGenerator();
