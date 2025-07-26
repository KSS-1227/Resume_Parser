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
        console.log("Attempting PDF text extraction...");

        try {
          // Method 1: Use pdf-parse with better error handling
          const pdfParse = (await import("pdf-parse")).default;
          const pdfData = await pdfParse(dataBuffer, {
            // Add options to improve parsing
            normalizeWhitespace: true,
            disableCombineTextItems: false,
          });

          resumeText = pdfData.text;
          console.log(
            "Successfully extracted PDF text using pdf-parse, length:",
            resumeText.length
          );

          // Validate extracted text
          if (!resumeText || resumeText.trim().length < 10) {
            throw new Error("Extracted text is too short or empty");
          }
        } catch (pdfError) {
          console.error("PDF parsing with pdf-parse failed:", pdfError.message);

          // Method 2: Try with different options
          try {
            const pdfParse = (await import("pdf-parse")).default;
            const pdfData = await pdfParse(dataBuffer, {
              normalizeWhitespace: false,
              disableCombineTextItems: true,
            });

            resumeText = pdfData.text;
            console.log(
              "Successfully extracted PDF text with alternative options, length:",
              resumeText.length
            );
          } catch (pdfError2) {
            console.error(
              "Alternative PDF parsing also failed:",
              pdfError2.message
            );

            // Method 3: Try to extract basic text using a different approach
            try {
              // Try to read as text file (some PDFs can be read as text)
              const textContent = dataBuffer.toString("utf8");
              if (textContent.length > 100 && textContent.includes(" ")) {
                resumeText = textContent;
                console.log(
                  "Extracted text using direct buffer reading, length:",
                  resumeText.length
                );
              } else {
                throw new Error("Direct buffer reading failed");
              }
            } catch (bufferError) {
              console.error("All PDF parsing methods failed");

              // Provide helpful error message
              resumeText = `Resume: ${originalname}

PDF parsing failed. This could be due to:
1. Password-protected PDF
2. Scanned PDF (image-based)
3. Corrupted PDF file
4. PDF with special formatting

Please try:
- Converting to DOCX format
- Saving as plain text
- Using a different PDF file
- Ensuring the PDF is not password-protected

For now, please provide a manual description of your skills and experience.`;
            }
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
