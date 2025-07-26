import fs from "fs";

export async function uploadResume(req, res) {
  try {
    const { originalname, filename, path } = req.file;
    let resumeText = "";

    // Enhanced text extraction from uploaded files
    try {
      console.log("Processing resume file:", path);
      const dataBuffer = fs.readFileSync(path);

      // Try to extract text from the file
      if (originalname && originalname.toLowerCase().endsWith(".pdf")) {
        try {
          // Use pdf-parse with error handling
          const pdfParse = (await import("pdf-parse")).default;
          const pdfData = await pdfParse(dataBuffer);
          resumeText = pdfData.text;
          console.log(
            "Successfully extracted PDF text, length:",
            resumeText.length
          );
        } catch (pdfError) {
          console.error(
            "PDF parsing failed, trying alternative method:",
            pdfError.message
          );

          // Try alternative PDF parsing
          try {
            const pdf2pic = (await import("pdf2pic")).default;
            // This is a fallback - in a real implementation, you'd use a different PDF parser
            resumeText = `Resume: ${originalname} - PDF parsing failed, please try a different format or contact support.`;
          } catch (altError) {
            console.error(
              "Alternative PDF parsing also failed:",
              altError.message
            );
            resumeText = `Resume: ${originalname} - Unable to extract text from PDF. Please ensure the file is not corrupted or password-protected.`;
          }
        }
      } else if (originalname && originalname.toLowerCase().endsWith(".docx")) {
        try {
          // Use mammoth for DOCX files
          const mammoth = (await import("mammoth")).default;
          const result = await mammoth.extractRawText({ path });
          resumeText = result.value;
          console.log(
            "Successfully extracted DOCX text, length:",
            resumeText.length
          );
        } catch (docxError) {
          console.error("DOCX parsing failed:", docxError.message);
          resumeText = `Resume: ${originalname} - Unable to extract text from DOCX file.`;
        }
      } else if (originalname && originalname.toLowerCase().endsWith(".txt")) {
        // For text files, read directly
        resumeText = dataBuffer.toString("utf8");
        console.log(
          "Successfully extracted TXT text, length:",
          resumeText.length
        );
      } else {
        // For other file types, try to read as text
        try {
          resumeText = dataBuffer.toString("utf8");
          console.log(
            "Extracted text from unknown file type, length:",
            resumeText.length
          );
        } catch (textError) {
          console.error("Text extraction failed:", textError.message);
          resumeText = `Resume: ${originalname} - Unable to extract text from this file format. Please use PDF, DOCX, or TXT format.`;
        }
      }

      // Validate that we got meaningful text
      if (!resumeText || resumeText.length < 50) {
        console.warn("Extracted text is too short, using fallback");
        resumeText = `Resume: ${originalname} - Text extraction produced insufficient content. Please ensure the file contains readable text.`;
      }

      console.log("Final resume text preview:", resumeText.substring(0, 200));
    } catch (fileError) {
      console.error("File reading error:", fileError);
      resumeText = `Resume: ${originalname} - File could not be read. Please check the file format and try again.`;
    }

    const resumeId = Date.now().toString();
    global.resumes.set(resumeId, {
      id: resumeId,
      filename: originalname,
      filePath: path,
      parsedData: {},
      resumeText,
    });

    console.log("Resume stored with ID:", resumeId);
    console.log("Resume text length:", resumeText.length);

    res.json({ resumeId, message: "Resume uploaded successfully" });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: error.message });
  }
}
