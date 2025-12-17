import PdfGenerator from "../../src/utils/pdf.util.js";
import PDFDocument from "pdfkit";

// Mock pdfkit
jest.mock("pdfkit");

describe("PdfGenerator", () => {
    let mockDoc;

    beforeEach(() => {
        // Setup mock instance methods ensuring chaining works where needed
        mockDoc = {
            fontSize: jest.fn().mockReturnThis(),
            text: jest.fn().mockReturnThis(),
            moveDown: jest.fn().mockReturnThis(),
            rect: jest.fn().mockReturnThis(),
            stroke: jest.fn().mockReturnThis(),
            // Add other methods that might be called implicitly or are needed
        };

        // When new PDFDocument() is called, return our mockDoc
        PDFDocument.mockImplementation(() => mockDoc);

        jest.clearAllMocks();
    });

    describe("generateMissionOrder", () => {
        it("generates a PDF document with trip details", () => {
            const trip = {
                _id: "trip123",
                driverId: { firstName: "John", lastName: "Doe" },
                truckId: { make: "Volvo", model: "FH16", licensePlate: "AB-123-CD" },
                trailerId: { licensePlate: "XY-987-ZZ" }, // Case with trailer
                departureLocation: "Paris",
                arrivalLocation: "Lyon",
                startDate: new Date("2023-01-01"),
            };

            const doc = PdfGenerator.generateMissionOrder(trip);

            expect(PDFDocument).toHaveBeenCalled();
            expect(doc).toBe(mockDoc); // Should return the doc instance

            // Verify some calls to ensure content is being written
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
                // No trailerId
                departureLocation: "Paris",
                arrivalLocation: "Lyon",
                startDate: new Date("2023-01-01"),
            };

            PdfGenerator.generateMissionOrder(trip);

            // Verify trailer text is NOT called
            expect(mockDoc.text).not.toHaveBeenCalledWith(expect.stringContaining("Remorque:"), expect.anything(), expect.anything());
        });
    });
});
