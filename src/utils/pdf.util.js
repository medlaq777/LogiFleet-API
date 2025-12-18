import PDFDocument from "pdfkit";

class PdfGenerator {
  generateMissionOrder(trip) {
    const doc = new PDFDocument();
    doc
      .fontSize(20)
      .fillColor("#333333")
      .text("LOGI FLEET", 50, 45)
      .fontSize(10)
      .fillColor("#666666")
      .text("Gestion de Flotte & Missions", 50, 65)
      .fontSize(20)
      .fillColor("#000000")
      .text("ORDRE DE MISSION", 0, 45, { align: "right" })
      .fontSize(10)
      .text(`Réf: ${trip._id.toString().slice(-6).toUpperCase()}`, 0, 70, {
        align: "right",
      });

    doc
      .moveTo(50, 90)
      .lineTo(550, 90)
      .strokeColor("#aaaaaa")
      .lineWidth(1)
      .stroke();

    const yStart = 110;
    const boxHeight = 80;
    const colWidth = 240;
    doc
      .rect(50, yStart, colWidth, boxHeight)
      .fillAndStroke("#f9f9f9", "#e0e0e0");
    doc.fillColor("#000000").text("CHAUFFEUR", 50, yStart + 10, {
      width: colWidth,
      align: "center",
    });
    doc
      .fontSize(12)
      .text(
        `${trip.driverId.firstName} ${trip.driverId.lastName}`,
        50,
        yStart + 35,
        { align: "center", width: colWidth }
      )
      .fontSize(10)
      .fillColor("#555555")
      .text(trip.driverId.email, 50, yStart + 55, {
        align: "center",
        width: colWidth,
      });

    doc
      .rect(310, yStart, colWidth, boxHeight)
      .fillAndStroke("#f9f9f9", "#e0e0e0");
    doc.fillColor("#000000").text("VÉHICULE", 310, yStart + 10, {
      width: colWidth,
      align: "center",
    });
    doc
      .fontSize(12)
      .text(
        `${trip.truckId.make} ${trip.truckId.model}`,
        310,
        yStart + 35,
        { align: "center", width: colWidth }
      )
      .fontSize(11)
      .fillColor("#000000")
      .text(trip.truckId.licensePlate, 310, yStart + 55, {
        align: "center",
        width: colWidth,
        characterSpacing: 1,
      });

    if (trip.trailerId) {
      doc
        .fontSize(9)
        .fillColor("#555555")
        .text(`+ Remorque: ${trip.trailerId.licensePlate}`, 310, yStart + 70, {
          align: "center",
          width: colWidth,
        });
    }

    doc.moveDown(8);
    doc.fontSize(14).fillColor("#000000").text("DÉTAILS DU TRAJET", 50, 220);
    doc
      .moveTo(50, 235)
      .lineTo(200, 235)
      .lineWidth(2)
      .strokeColor("#333333")
      .stroke();

    const detailY = 260;

    doc.font("Helvetica-Bold").text("DÉPART", 50, detailY);
    doc
      .font("Helvetica")
      .fontSize(12)
      .text(trip.departureLocation, 50, detailY + 20, { width: 200 })
      .fontSize(10)
      .fillColor("#666666")
      .text(new Date(trip.startDate).toLocaleDateString(), 50, detailY + 40, {
        width: 200,
      });

    const arrowX = 275;
    const arrowY = detailY + 25;

    doc.save();
    doc.strokeColor("#aaaaaa").lineWidth(2);
    doc.moveTo(arrowX - 15, arrowY).lineTo(arrowX + 15, arrowY).stroke();
    doc.moveTo(arrowX + 10, arrowY - 5).lineTo(arrowX + 15, arrowY).lineTo(arrowX + 10, arrowY + 5).stroke();
    doc.restore();

    doc
      .font("Helvetica-Bold")
      .fillColor("#000000")
      .text("ARRIVÉE", 310, detailY);
    doc
      .font("Helvetica")
      .fontSize(12)
      .text(trip.arrivalLocation, 310, detailY + 20, { width: 240 });

    if (trip.notes) {
      doc.fontSize(10).fillColor("#555555")
        .text(`Notes: ${trip.notes}`, 50, detailY + 70, { oblique: true });
    }

    const footerY = 400;
    doc.moveTo(50, footerY).lineTo(550, footerY).lineWidth(1).strokeColor("#aaaaaa").stroke();

    doc.fontSize(14).fillColor("#000000").text("RAPPORT DE FIN DE MISSION", 50, footerY + 20);

    if (trip.status === "Terminé") {
      const startKm = trip.startMileage || trip.truckId.currentMileage - (trip.endMileage - trip.truckId.currentMileage) || 0;
      const displayStart = trip.startMileage || "N/A";
      const displayEnd = trip.endMileage || "N/A";
      const distance = (displayEnd && displayStart !== "N/A") ? (displayEnd - displayStart) : "N/A";

      doc.fontSize(12).font("Helvetica-Bold");

      doc.text("Kilométrage Départ:", 50, footerY + 50);
      doc.font("Helvetica").text(`${displayStart} km`, 200, footerY + 50);

      doc.font("Helvetica-Bold").text("Kilométrage Arrivée:", 50, footerY + 70);
      doc.font("Helvetica").text(`${displayEnd} km`, 200, footerY + 70);

      doc.font("Helvetica-Bold").text("Distance Parcourue:", 50, footerY + 90);
      doc.font("Helvetica").text(`${distance} km`, 200, footerY + 90);

      doc.rect(400, footerY + 40, 120, 50).strokeColor("green").lineWidth(2).stroke();
      doc.fontSize(16).fillColor("green").text("TERMINÉ", 400, footerY + 55, { width: 120, align: "center" });

    } else {
      doc.fontSize(10).fillColor("#333333").font("Helvetica");

      const formY = footerY + 50;
      doc.rect(50, formY, 150, 40).stroke();
      doc.text("Kilométrage Fin:", 60, formY + 5);
      doc.text("....................... km", 60, formY + 25);

      doc.rect(210, formY, 150, 40).stroke();
      doc.text("Carburant Ajouté:", 220, formY + 5);
      doc.text("....................... Litres", 220, formY + 25);

      doc.text("Signature du Chauffeur:", 400, formY + 5);
      doc.rect(400, formY + 20, 150, 60).stroke();
    }
    doc
      .fontSize(8)
      .fillColor("#aaaaaa")
      .text("Généré automatiquement par LogiFleet", 50, 700, { align: "center" });

    return doc;
  }
}

export default new PdfGenerator();
