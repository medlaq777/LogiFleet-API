import PdfGenerator from "../../src/utils/pdf.util.js";
import PDFDocument from "pdfkit";


jest.mock("pdfkit");

describe("PdfGenerator", () => {
    let mockDoc;

    beforeEach(() => {

        mockDoc = {
            fontSize: jest.fn().mockReturnThis(),
            text: jest.fn().mockReturnThis(),
            moveDown: jest.fn().mockReturnThis(),
            rect: jest.fn().mockReturnThis(),
            stroke: jest.fn().mockReturnThis(),

        };


        PDFDocument.mockImplementation(() => mockDoc);

        jest.clearAllMocks();
    });

    describe("generateMissionOrder", () => {
        it("generates a PDF document with trip details", () => {
            const trip = {
                _id: "trip123",
                driverId: { firstName: "John", lastName: "Doe" },
                truckId: { make: "Volvo", model: "FH16", licensePlate: "AB-123-CD" },
                trailerId: { licensePlate: "XY-987-ZZ" },
                departureLocation: "Paris",
                arrivalLocation: "Lyon",
                startDate: new Date("2023-01-01"),
            };

            const doc = PdfGenerator.generateMissionOrder(trip);

            expect(PDFDocument).toHaveBeenCalled();
            expect(doc).toBe(mockDoc);


            expect(mockDoc.fontSize).toHaveBeenCalledWith(20);
            expect(mockDoc.text).toHaveBeenCalledWith(expect.stringContaining("ORDRE DE MISSION"), expect.anything());
            expect(mockDoc.text).toHaveBeenCalledWith(expect.stringContaining(trip._id));
            expect(mockDoc.text).toHaveBeenCalledWith(expect.stringContaining("John Doe"), expect.anything(), expect.anything());
            expect(mockDoc.text).toHaveBeenCalledWith(expect.stringContaining("Volvo"), expect.anything(), expect.anything());
            expect(mockDoc.text).toHaveBeenCalledWith(expect.stringContaining("XY-987-ZZ"), expect.anything(), expect.anything());
            expect(mockDoc.text).toHaveBeenCalledWith(expect.stringContaining("Paris"));
            expect(mockDoc.text).toHaveBeenCalledWith(expect.stringContaining("Lyon"));
        });

        it("generates a PDF document without trailer if not present", () => {
            const trip = {
                _id: "trip123",
                driverId: { firstName: "John", lastName: "Doe" },
                truckId: { make: "Volvo", model: "FH16", licensePlate: "AB-123-CD" },

                departureLocation: "Paris",
                arrivalLocation: "Lyon",
                startDate: new Date("2023-01-01"),
            };

            PdfGenerator.generateMissionOrder(trip);


            expect(mockDoc.text).not.toHaveBeenCalledWith(expect.stringContaining("Remorque:"), expect.anything(), expect.anything());
        });
    });
});
