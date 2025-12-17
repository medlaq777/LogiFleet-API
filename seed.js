import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import db from "./src/config/db.js";
import User from "./src/models/user.model.js";
import Truck from "./src/models/trucks.model.js";
import Trailer from "./src/models/trailer.model.js";
import Tire from "./src/models/tire.model.js";
import Trip from "./src/models/trip.model.js";
import MaintenanceRule from "./src/models/maintenanceRule.model.js";
import Alert from "./src/models/alert.model.js";

const seedDatabase = async () => {
  try {
    console.log("🚀 Starting database seeding...");
    await db.connect();

    // Clear existing data
    console.log("🧹 Clearing existing data...");
    await User.deleteMany({});
    await Truck.deleteMany({});
    await Trailer.deleteMany({});
    await Tire.deleteMany({});
    await Trip.deleteMany({});
    await MaintenanceRule.deleteMany({});
    await Alert.deleteMany({});

    // Seed Users
    console.log("👥 Seeding users...");
    const hashedPassword = await bcrypt.hash("password123", 12);

    const users = await User.insertMany([
      // Admins
      {
        firstName: "Admin",
        lastName: "User",
        email: "admin@logifleet.com",
        password: hashedPassword,
        role: "Admin",
      },
      // Drivers
      {
        firstName: "John",
        lastName: "Driver",
        email: "john@logifleet.com",
        password: hashedPassword,
        role: "Driver",
      },
      {
        firstName: "Maria",
        lastName: "Garcia",
        email: "maria@logifleet.com",
        password: hashedPassword,
        role: "Driver",
      },
      {
        firstName: "adam",
        lastName: "Hassan",
        email: "ahmed@logifleet.com",
        password: hashedPassword,
        role: "Driver",
      },
      {
        firstName: "Sophie",
        lastName: "Martin",
        email: "sophie@logifleet.com",
        password: hashedPassword,
        role: "Driver",
      },
      {
        firstName: "Carlos",
        lastName: "Rodriguez",
        email: "carlos@logifleet.com",
        password: hashedPassword,
        role: "Driver",
      },
      {
        firstName: "Johny",
        lastName: "Driver",
        email: "Johny@logifleet.com",
        password: hashedPassword,
        role: "Driver",
      },
      {
        firstName: "Martin",
        lastName: "Gonzalo",
        email: "Martin10@logifleet.com",
        password: hashedPassword,
        role: "Driver",
      },
      {
        firstName: "Ahmed",
        lastName: "Hassan",
        email: "Ahmed13@logifleet.com",
        password: hashedPassword,
        role: "Driver",
      },
      {
        firstName: "Mehdi",
        lastName: "saadi",
        email: "Mehdi@logifleet.com",
        password: hashedPassword,
        role: "Driver",
      },
      {
        firstName: "Amin",
        lastName: "Rodriguez",
        email: "Amin@logifleet.com",
        password: hashedPassword,
        role: "Driver",
      },
    ]);
    console.log(`✅ Created ${users.length} users`);

    const drivers = users.filter((u) => u.role === "Driver");
    const admins = users.filter((u) => u.role === "Admin");

    // Seed Trucks
    console.log("🚛 Seeding trucks...");
    const trucks = await Truck.insertMany([
      {
        licensePlate: "AA-123-BB",
        make: "Volvo",
        model: "FH16",
        year: 2022,
        capacity: 250,
        currentMileage: 45000,
        fuelLevel: 85,
        status: "Disponible",
      },
      {
        licensePlate: "CC-456-DD",
        make: "Mercedes",
        model: "Actros",
        year: 2021,
        capacity: 260,
        currentMileage: 67000,
        fuelLevel: 60,
        status: "Disponible",
      },
      {
        licensePlate: "EE-789-FF",
        make: "Scania",
        model: "R500",
        year: 2023,
        capacity: 240,
        currentMileage: 12000,
        fuelLevel: 95,
        status: "Disponible",
      },
      {
        licensePlate: "GG-101-HH",
        make: "MAN",
        model: "TGX",
        year: 2020,
        capacity: 255,
        currentMileage: 89000,
        fuelLevel: 40,
        status: "En service",
      },
      {
        licensePlate: "II-202-JJ",
        make: "DAF",
        model: "XF",
        year: 2022,
        capacity: 265,
        currentMileage: 34000,
        fuelLevel: 75,
        status: "Disponible",
      },
      {
        licensePlate: "KK-303-LL",
        make: "Iveco",
        model: "Stralis",
        year: 2021,
        capacity: 245,
        currentMileage: 56000,
        fuelLevel: 50,
        status: "Disponible",
      },
      {
        licensePlate: "MM-404-NN",
        make: "Renault",
        model: "T High",
        year: 2023,
        capacity: 250,
        currentMileage: 8000,
        fuelLevel: 90,
        status: "Disponible",
      },
      {
        licensePlate: "OO-505-PP",
        make: "Volvo",
        model: "FH",
        year: 2019,
        capacity: 240,
        currentMileage: 125000,
        fuelLevel: 30,
        status: "En Maintenance",
      },
      {
        licensePlate: "QQ-606-RR",
        make: "Mercedes",
        model: "Arocs",
        year: 2022,
        capacity: 270,
        currentMileage: 41000,
        fuelLevel: 70,
        status: "Disponible",
      },
      {
        licensePlate: "SS-707-TT",
        make: "Scania",
        model: "G410",
        year: 2021,
        capacity: 255,
        currentMileage: 72000,
        fuelLevel: 55,
        status: "Disponible",
      },
    ]);
    console.log(`✅ Created ${trucks.length} trucks`);

    // Seed Trailers
    console.log("🔗 Seeding trailers...");
    const trailers = await Trailer.insertMany([
      {
        licensePlate: "TR-101-XX",
        make: "Schmitz",
        model: "Cargobull",
        year: 2022,
        capacity: 33000,
        status: "Disponible",
      },
      {
        licensePlate: "TR-202-YY",
        make: "Krone",
        model: "Cool Liner",
        year: 2021,
        capacity: 30000,
        status: "Disponible",
      },
      {
        licensePlate: "TR-303-ZZ",
        make: "Schwarzmüller",
        model: "Standard",
        year: 2023,
        capacity: 33000,
        status: "Disponible",
      },
      {
        licensePlate: "TR-404-AA",
        make: "Fruehauf",
        model: "Mega",
        year: 2020,
        capacity: 32000,
        status: "Attachée",
      },
      {
        licensePlate: "TR-505-BB",
        make: "Kögel",
        model: "Cargo",
        year: 2022,
        capacity: 31000,
        status: "Disponible",
      },
      {
        licensePlate: "TR-606-CC",
        make: "Schmitz",
        model: "S.KO",
        year: 2021,
        capacity: 33000,
        status: "Disponible",
      },
      {
        licensePlate: "TR-707-DD",
        make: "Krone",
        model: "Profi Liner",
        year: 2023,
        capacity: 33000,
        status: "Disponible",
      },
      {
        licensePlate: "TR-808-EE",
        make: "Schwarzmüller",
        model: "Tipper",
        year: 2019,
        capacity: 28000,
        status: "Maintenance",
      },
      {
        licensePlate: "TR-909-FF",
        make: "Fruehauf",
        model: "Box",
        year: 2022,
        capacity: 30500,
        status: "Disponible",
      },
      {
        licensePlate: "TR-010-GG",
        make: "Kögel",
        model: "Port",
        year: 2021,
        capacity: 32500,
        status: "Disponible",
      },
    ]);
    console.log(`✅ Created ${trailers.length} trailers`);

    // Seed Tires
    console.log("🍩 Seeding tires...");
    const tires = await Tire.insertMany([
      {
        serialNumber: "TIRE-001",
        brand: "Michelin",
        type: "XZE",
        currentMileageOnTire: 150,
        expectedLife: 800,
      },
      {
        serialNumber: "TIRE-002",
        brand: "Bridgestone",
        type: "R249",
        currentMileageOnTire: 450,
        expectedLife: 750,
      },
      {
        serialNumber: "TIRE-003",
        brand: "Continental",
        type: "HDR",
        currentMileageOnTire: 620,
        expectedLife: 700,
      },
      {
        serialNumber: "TIRE-004",
        brand: "Goodyear",
        type: "KMAX",
        currentMileageOnTire: 80,
        expectedLife: 850,
      },
      {
        serialNumber: "TIRE-005",
        brand: "Pirelli",
        type: "FH01",
        currentMileageOnTire: 380,
        expectedLife: 750,
      },
      {
        serialNumber: "TIRE-006",
        brand: "Michelin",
        type: "X Multi",
        currentMileageOnTire: 520,
        expectedLife: 800,
      },
      {
        serialNumber: "TIRE-007",
        brand: "Bridgestone",
        type: "M788",
        currentMileageOnTire: 710,
        expectedLife: 750,
      },
      {
        serialNumber: "TIRE-008",
        brand: "Continental",
        type: "HSR",
        currentMileageOnTire: 120,
        expectedLife: 700,
      },
      {
        serialNumber: "TIRE-009",
        brand: "Goodyear",
        type: "FUELMAX",
        currentMileageOnTire: 290,
        expectedLife: 850,
      },
      {
        serialNumber: "TIRE-010",
        brand: "Pirelli",
        type: "TH88",
        currentMileageOnTire: 670,
        expectedLife: 750,
      },
    ]);
    console.log(`✅ Created ${tires.length} tires`);

    // Seed Trips
    console.log("🛣️ Seeding trips...");
    const trips = await Trip.insertMany([
      {
        adminId: admins[0]._id,
        driverId: drivers[0]._id,
        truckId: trucks[0]._id,
        trailerId: trailers[0]._id,
        departureLocation: "Casablanca",
        arrivalLocation: "Marrakech",
        startDate: new Date("2025-10-15"),
        status: "Terminé",
        startMileage: 45000,
        endMileage: 45280,
        fuelVolumeAdded: 150,
        notes: "Livraison de marchandises",
      },
      {
        adminId: admins[0]._id,
        driverId: drivers[1]._id,
        truckId: trucks[1]._id,
        trailerId: trailers[1]._id,
        departureLocation: "Rabat",
        arrivalLocation: "Tanger",
        startDate: new Date("2025-11-20"),
        status: "En cours",
        startMileage: 67000,
        notes: "Transport de matériel",
      },
      {
        adminId: admins[0]._id,
        driverId: drivers[2]._id,
        truckId: trucks[2]._id,
        trailerId: trailers[2]._id,
        departureLocation: "Fès",
        arrivalLocation: "Agadir",
        startDate: new Date("2025-12-05"),
        status: "À faire",
        notes: "Livraison urgente",
      },
      {
        adminId: admins[0]._id,
        driverId: drivers[3]._id,
        truckId: trucks[4]._id,
        trailerId: trailers[4]._id,
        departureLocation: "Meknès",
        arrivalLocation: "Essaouira",
        startDate: new Date("2025-10-18"),
        status: "Terminé",
        startMileage: 34000,
        endMileage: 34450,
        fuelVolumeAdded: 200,
      },
      {
        adminId: admins[0]._id,
        driverId: drivers[4]._id,
        truckId: trucks[5]._id,
        trailerId: trailers[5]._id,
        departureLocation: "Oujda",
        arrivalLocation: "Laâyoune",
        startDate: new Date("2025-12-25"),
        status: "À faire",
        notes: "Longue distance",
      },
      {
        adminId: admins[0]._id,
        driverId: drivers[0]._id,
        truckId: trucks[6]._id,
        trailerId: trailers[6]._id,
        departureLocation: "Tétouan",
        arrivalLocation: "Dakhla",
        startDate: new Date("2025-11-22"),
        status: "En cours",
        startMileage: 8000,
      },
      {
        adminId: admins[0]._id,
        driverId: drivers[1]._id,
        truckId: trucks[8]._id,
        trailerId: trailers[8]._id,
        departureLocation: "Kenitra",
        arrivalLocation: "Safi",
        startDate: new Date("2026-01-05"),
        status: "À faire",
      },
      {
        adminId: admins[0]._id,
        driverId: drivers[2]._id,
        truckId: trucks[9]._id,
        trailerId: trailers[9]._id,
        departureLocation: "Beni Mellal",
        arrivalLocation: "Nador",
        startDate: new Date("2025-09-12"),
        status: "Terminé",
        startMileage: 72000,
        endMileage: 72380,
        fuelVolumeAdded: 180,
      },
      {
        adminId: admins[0]._id,
        driverId: drivers[3]._id,
        truckId: trucks[0]._id,
        trailerId: trailers[0]._id,
        departureLocation: "El Jadida",
        arrivalLocation: "Ouarzazate",
        startDate: new Date("2025-12-10"),
        status: "À faire",
        notes: "Route montagneuse",
      },
      {
        adminId: admins[0]._id,
        driverId: drivers[4]._id,
        truckId: trucks[1]._id,
        trailerId: trailers[1]._id,
        departureLocation: "Khouribga",
        arrivalLocation: "Taroudant",
        startDate: new Date("2025-11-30"),
        status: "En cours",
        startMileage: 67280,
      },
    ]);
    console.log(`✅ Created ${trips.length} trips`);

    // Seed Maintenance Rules
    console.log("🔧 Seeding maintenance rules...");
    const maintenanceRules = await MaintenanceRule.insertMany([
      { type: "Vidange", intervalKm: 10000 },
      { type: "Pneus", intervalKm: 20000 },
      { type: "Révision Technique", intervalKm: 15000 },
    ]);
    console.log(`✅ Created ${maintenanceRules.length} maintenance rules`);

    // Seed Alerts
    console.log("🚨 Seeding alerts...");
    const alerts = await Alert.insertMany([
      {
        truckId: trucks[7]._id,
        type: "Oil",
        message: "Maintenance Vidange required (Interval: 10000km).",
        cost: 200,
        createdAt: new Date("2025-11-10"),
      },
      {
        truckId: trucks[1]._id,
        type: "Pneus",
        message: "Maintenance Pneus required (Interval: 20000km).",
        cost: 600,
        createdAt: new Date("2025-11-12"),
      },
      {
        truckId: trucks[3]._id,
        type: "Inspection",
        message: "Maintenance Révision Technique required (Interval: 15000km).",
        cost: 150,
        createdAt: new Date("2025-11-15"),
      },
      {
        truckId: trucks[9]._id,
        type: "Maintenance",
        message: "Maintenance check required.",
        cost: 100,
        createdAt: new Date("2025-11-18"),
      },
      {
        truckId: trucks[7]._id,
        type: "Maintenance",
        message: "Low fuel level: 30%",
        cost: 0,
        createdAt: new Date("2025-11-20"),
      },
    ]);
    console.log(`✅ Created ${alerts.length} alerts`);

    console.log("\n✨ Database seeding completed successfully!");
    console.log("\n📊 Summary:");
    console.log(
      `   - Users: ${users.length} (${admins.length} Admins, ${drivers.length} Drivers)`
    );
    console.log(`   - Trucks: ${trucks.length}`);
    console.log(`   - Trailers: ${trailers.length}`);
    console.log(`   - Tires: ${tires.length}`);
    console.log(`   - Trips: ${trips.length}`);
    console.log(`   - Maintenance Rules: ${maintenanceRules.length}`);
    console.log(`   - Alerts: ${alerts.length}`);
    console.log("\n🔑 Login credentials:");
    console.log("   Admin: admin@logifleet.com / password123");
    console.log("   Driver: john@logifleet.com / password123");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
