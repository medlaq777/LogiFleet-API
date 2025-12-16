import "dotenv/config";
import bcrypt from "bcryptjs";

const testPassword = async () => {
    const password = "password123";
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("Original password:", password);
    console.log("Hashed password:", hashedPassword);

    const isMatch = await bcrypt.compare(password, hashedPassword);
    console.log("Password match test:", isMatch);

    // Test with wrong password
    const wrongMatch = await bcrypt.compare("wrongpassword", hashedPassword);
    console.log("Wrong password test:", wrongMatch);
};

testPassword();
